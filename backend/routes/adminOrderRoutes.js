// routes/adminOrderRoutes.js
import express from "express";
import Order from "../models/orderModel.js";
import { protectAdmin } from "../middleware/adminAuthMiddleware.js";
import { restoreOrderStock } from "../utils/restoreOrderStock.js";

const router = express.Router();

router.use(protectAdmin);


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