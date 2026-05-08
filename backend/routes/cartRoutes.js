import express from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = express.Router();

function calculateSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

// GET cart for a guest
// GET cart by guestId
router.get("/:guestId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      guestId: req.params.guestId,
      status: "active"
    });

    if (!cart) {
      return res.json({
        guestId: req.params.guestId,
        items: [],
        subtotal: 0,
        status: "active"
      });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Failed to get cart" });
  }
});

// POST add item to cart
router.post("/add", async (req, res) => {
  try {
    const { guestId, productId, quantity, selectedColor, customNote } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.status !== "available") 
        return res.status(404).json({ message: "Product is not available" });
    if (quantity > product.stock)
        return res.status(400).json({ message: "Out of stock" });

    let cart = await Cart.findOne({ guestId, status: "active" });
    if (!cart) {
      cart = new Cart({ guestId, items: [], subtotal: 0 });
    }
    //find if the same product with the same color already exists in the cart
    const existingItem = cart.items.find((item) => {
      return (
        item.productId.toString() === productId &&
        item.selectedColor === selectedColor &&
        item.customNote === customNote
      );
    });
    if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
            return res.status(400).json({ message: "Out of stock" });
        }
        existingItem.quantity = newQuantity;
    } 
    else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        image: product.images[0] || "",
        quantity,
        price: product.price,
        selectedColor,
        customNote
      });
    }
    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json({
      message: "Failed to add item to cart",
      error: error.message
    });
  }
});

// UPDATE item quantity
router.put("/:guestId/item/:itemId", async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({
      guestId: req.params.guestId,
      status: "active"
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const product = await Product.findById(item.productId);

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Not enough stock" });
    }

    item.quantity = quantity;

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update cart item",
      error: error.message
    });
  }
});

// DELETE item from cart
router.delete("/:guestId/item/:itemId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      guestId: req.params.guestId,
      status: "active"
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => {
      return item._id.toString() !== req.params.itemId;
    });

    cart.subtotal = calculateSubtotal(cart.items);
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      message: "Failed to remove cart item",
      error: error.message
    });
  }
});

//clear cart
router.delete("/:guestId/clear", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      guestId: req.params.guestId,
      status: "active"
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.subtotal = 0;

    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({
      message: "Failed to clear cart",
      error: error.message
    });
  }
});
export default router;