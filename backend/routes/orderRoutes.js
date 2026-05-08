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


//=== ADMIN ROUTES BELOW (not implemented in frontend yet) ===//

// ADMIN: Get all orders + search by orderCode
// ADMIN: Get all orders + search
router.get("/", protectAdmin, async (req, res) => {
  try {
    const { search } = req.query;

    let query = {};

    if (search) {
      query = {
        $or: [
          {
            orderCode: {
              $regex: search,
              $options: "i",
            },
          },
          {
            "customer.name": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "customer.email": {
              $regex: search,
              $options: "i",
            },
          },
          {
            "customer.phone": {
              $regex: search,
              $options: "i",
            },
          },
        ],
      };
    }

    const orders = await Order.find(query).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
});

// ADMIN: Get one order by id
router.get("/:id", protectAdmin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
});

// ADMIN: Update payment status
router.put("/:id/payment", protectAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];

    if (!allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.paymentStatus = paymentStatus;

    if (paymentStatus === "paid") {
      order.paidAt = new Date();
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message,
    });
  }
});

// ADMIN: Update order status
// ADMIN: Update order status
router.put("/:id/status", protectAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "making",
      "shipped",
      "completed",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const wasAlreadyCancelled = order.status === "cancelled";

    order.status = status;

    if (status === "cancelled" && !wasAlreadyCancelled) {
      order.cancelledAt = new Date();

      // restore stock only one time
      await restoreOrderStock(order);
    }

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
});





export default router;