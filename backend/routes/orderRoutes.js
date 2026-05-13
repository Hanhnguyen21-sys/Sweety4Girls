import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const router = express.Router();


const allowedTransitions = {
  pending: ["accepted", "cancelled"],
  accepted: ["making", "cancelled"],
  making: ["shipped"],
  shipped: ["completed"],
  completed: [],
  cancelled: [],
};
function generateOrderCode() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}
async function restoreOrderStock(order) {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);

    if (product) {
      product.stock += item.quantity;

      if (product.stock > 0 && product.status === "sold_out") {
        product.status = "available";
      }

      await product.save();
    }
  }
}
// CHECKOUT: Takes current cart and converts to order
router.post("/checkout", async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      guestId,
      customer,
      items,
      shippingFee = 0,
      paymentMethod,
      note,
    } = req.body;
    if (!items || items.length === 0) {
  return res.status(400).json({ message: "Cart is empty" });
}

  if (
    !customer?.name ||
    !customer?.email ||
    !customer?.phone ||
    !customer?.address
  ) {
    return res.status(400).json({
      message: "Customer information is required",
    });
  }
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(
        item._id || item.productId
      ).session(session);

      if (!product || product.status !== "available") {
        throw new Error(`${item.name} is no longer available`);
      }

      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: product._id,
          status: "available",
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        {
          new: true,
          session,
        }
      );

      if (!updatedProduct) {
        throw new Error(`Not enough stock for ${product.name}`);
      }

      if (updatedProduct.stock === 0) {
        updatedProduct.status = "sold_out";
        await updatedProduct.save({ session });
      }

      const finalPrice = product.discountPrice || product.price;
      subtotal += finalPrice * item.quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        image: product.images?.[0],
        quantity: item.quantity,
        price: finalPrice,
        selectedColor: item.selectedColor,
        customNote: item.customNote,
      });
    }

    const order = await Order.create(
      [
        {
          orderCode: generateOrderCode(),
          guestId,
          customer,
          items: orderItems,
          subtotal,
          shippingFee,
          totalPrice: subtotal + shippingFee,
          status: "pending",
          note,
          paymentMethod,
          paymentStatus: "pending",
          paymentDueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      message: "Order placed successfully",
      order: order[0],
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(400).json({
      message: "Checkout failed",
      error: error.message,
    });
  } finally {
    session.endSession();
  }
});

// GET order by orderCode + email
router.post("/track", async (req, res) => {
  try {
    const { orderCode, email } = req.body;

    const order = await Order.findOne({
      orderCode,
      "customer.email": email,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found. Please check your order code and email.",
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to track order",
    });
  }
});


//=====Customer routes below (no auth required) =====//
// CANCEL order only if pending
router.put("/:orderId/cancel", async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }
    if (!order.stockRestored) {
      await restoreOrderStock(order);

      order.stockRestored = true;
    }
    order.status = "cancelled";
    order.cancelledAt = new Date();

    
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }

  // avoid invalid changing state

  router.put("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    
    const currentStatus = order.status;

    const allowed = allowedTransitions[currentStatus];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot change order from '${currentStatus}' to '${status}'`,
      });
    }

    order.status = status;

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});
});







export default router;