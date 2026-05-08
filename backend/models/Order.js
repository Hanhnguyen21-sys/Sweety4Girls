import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },

    name: String,
    image: String,
    quantity: Number,
    price: Number,
    selectedColor: String,
    customNote: String
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      unique: true
    },

    guestId: String,

    customer: {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      phone: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      }
    },

    items: {
      type: [orderItemSchema],
      required: true
    },

    subtotal: {
      type: Number,
      required: true
    },

    shippingFee: {
      type: Number,
      default: 0
    },

    totalPrice: {
      type: Number,
      required: true
    },

    // Order status and order note
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "making",
        "shipped",
        "completed",
        "cancelled"
      ],
      default: "pending"
    },

    note: String,
    cancelledAt: Date,
    cancelReason: {
  type: String,
  enum: [
    "Payment Overdue",
    "Customer Request",
    "Admin Cancelled"
  ]
},
    // payment status and payment note
    paymentMethod: {
      type: String,
      enum: ["cash", "transfer"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },
    paymentDueDate:{
      type: Date,

    },
    paidAt: Date,
  paymentNote: String,
  
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);