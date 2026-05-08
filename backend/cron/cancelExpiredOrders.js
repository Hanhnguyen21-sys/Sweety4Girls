import cron from "node-cron";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Checking expired unpaid orders...");

  try {
    const expiredOrders = await Order.find({
      paymentMethod: "transfer",

      paymentStatus: "pending",

      status: "pending",

      paymentDueDate: {
        $lt: new Date()
      }
    });

    console.log(
      `Found ${expiredOrders.length} expired orders`
    );

    for (const order of expiredOrders) {
      // Cancel order
      order.status = "cancelled";
      order.cancelledAt = new Date();
      order.cancelReason = "Payment Overdue";
      await order.save();

      console.log(
        `Cancelled order ${order.orderCode}`
      );

      // Restore stock
      for (const item of order.items) {
        const product = await Product.findById(
          item.productId
        );

        if (product) {
          product.stock += item.quantity;

          // Change back to available
          if (
            product.stock > 0 &&
            product.status === "sold_out"
          ) {
            product.status = "available";
          }

          await product.save();

          console.log(
            `Restocked ${product.name}`
          );
        }
      }
    }
  } catch (error) {
    console.log(
      "Cron job failed:",
      error.message
    );
  }
});