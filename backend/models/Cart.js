import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    name: String,
    image: String,

    quantity: {
      type: Number,
      required: true,
      min: 1
    },

    price: {
      type: Number,
      required: true
    },

    selectedColor: String,
    customNote: String
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true
    },

    items: {
      type: [cartItemSchema],
      default: []
    },

    subtotal: {
      type: Number,
      default: 0
    },

    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);