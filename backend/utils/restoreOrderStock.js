import Product from "../models/productModel.js";

export const restoreOrderStock = async (order) => {
  for (const item of order.items) {
    if (!item.productId) continue;

    const product = await Product.findById(item.productId);

    if (product) {
      product.stock += item.quantity;

      if (product.stock > 0 && product.status === "sold_out") {
        product.status = "available";
      }

      await product.save();
    }
  }
};