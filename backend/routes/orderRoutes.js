import express from "express";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

const router = express.Router();

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
  try {
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
      const product = await Product.findById(item._id || item.productId);

      if (!product || product.status !== "available") {
        return res.status(400).json({
          message: `${item.name} is no longer available`,
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          message: `Not enough stock for ${product.name}`,
        });
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

    const totalPrice = subtotal + shippingFee;

    const paymentDueDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    const order = await Order.create({
      orderCode: generateOrderCode(),
      guestId,
      customer,
      items: orderItems,
      subtotal,
      shippingFee,
      totalPrice,
      status: "pending",
      note,
      paymentMethod,
      paymentStatus: "pending",
      paymentDueDate,
    });

    for (const item of orderItems) {
      const product = await Product.findById(item.productId);

      product.stock -= item.quantity;

      if (product.stock <= 0) {
        product.stock = 0;
        product.status = "sold_out";
      }

      await product.save();
    }

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({
      message: "Checkout failed",
      error: error.message,
    });
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

    order.status = "cancelled";
    order.cancelledAt = new Date();

    await restoreOrderStock(order);
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
});







export default router;