import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  discountPrice: Number,

  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },

  images: [String],

  description: String,

  details: {
    size: String,
    color: String,
    materials: String,
    care: String,
  },

  stock: {
    type: Number,
    default: 10,
    min: 0,
  },

  status: {
    type: String,
    enum: ["available", "sold_out", "hidden"],
    default: "available",
  },
});

export default mongoose.model("Product", productSchema);