import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "sweetygirls/products",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      )
      .end(fileBuffer);
  });
};

export const createProduct = async (req, res) => {
  try {
    const imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      }
    }

    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice
        ? Number(req.body.discountPrice)
        : undefined,
      stock: Number(req.body.stock),
      images: imageUrls,
      details: {
        size: req.body.size,
        color: req.body.color,
        materials: req.body.materials,
        care: req.body.care,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      price: Number(req.body.price),
      discountPrice: req.body.discountPrice
        ? Number(req.body.discountPrice)
        : undefined,
      stock: Number(req.body.stock),
      details: {
        size: req.body.size,
        color: req.body.color,
        materials: req.body.materials,
        care: req.body.care,
      },
    };

    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.buffer);
        imageUrls.push(imageUrl);
      }

      updateData.images = imageUrls;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};