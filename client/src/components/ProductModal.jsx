import { useEffect, useState } from "react";
import { X } from "lucide-react";

const ADMIN_PRODUCT_URL = `${import.meta.env.VITE_API_URL}/admin/products`;

const emptyForm = {
  name: "",
  category: "",
  price: "",
  discountPrice: "",
  description: "",
  size: "",
  color: "",
  materials: "",
  care: "",
  stock: "",
  status: "available",
};

function ProductModal({ editingProduct, onClose, onSuccess }) {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    setImageFiles([]);

    if (editingProduct) {
      setForm({
        name: editingProduct.name || "",
        category: editingProduct.category || "",
        price: editingProduct.price || "",
        discountPrice: editingProduct.discountPrice || "",
        description: editingProduct.description || "",
        size: editingProduct.details?.size || "",
        color: editingProduct.details?.color || "",
        materials: editingProduct.details?.materials || "",
        care: editingProduct.details?.care || "",
        stock: editingProduct.stock || "",
        status: editingProduct.status || "available",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingProduct]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      // BASIC INFO
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      if (form.discountPrice) {
        formData.append("discountPrice", form.discountPrice);
      }
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      formData.append("status", form.status);

      // DETAILS
      formData.append("size", form.size);
      formData.append("color", form.color);
      formData.append("materials", form.materials);
      formData.append("care", form.care);

      // IMAGES
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      const url = editingProduct
        ? `${ADMIN_PRODUCT_URL}/${editingProduct._id}`
        : ADMIN_PRODUCT_URL;

      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      await onSuccess();
      onClose();
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark">
            {editingProduct ? "Edit Product" : "Add Product"}
          </h2>

          <button onClick={onClose} className="rounded-full p-2 hover:bg-soft">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product name"
            className="rounded-xl border px-4 py-3"
            required
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="rounded-xl border px-4 py-3"
            required
          >
            <option value="">Select category</option>
            <option value="Bouquet">Bouquet</option>
            <option value="Bag">Bag</option>
            <option value="Decor">Decor</option>
          </select>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-xl border px-4 py-3"
              required
            />

            <input
              name="discountPrice"
              type="number"
              value={form.discountPrice}
              onChange={handleChange}
              placeholder="Discount price"
              className="rounded-xl border px-4 py-3"
            />
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="rounded-xl border px-4 py-3"
          />

          {imageFiles.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageFiles.map((file, index) => {
                const previewUrl = URL.createObjectURL(file);

                return (
                  <img
                    key={index}
                    src={previewUrl}
                    alt="Preview"
                    className="h-24 w-24 rounded-xl object-cover"
                  />
                );
              })}
            </div>
          )}
          {editingProduct?.images?.length > 0 && imageFiles.length === 0 && (
            <div className="flex flex-wrap gap-3">
              {editingProduct.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="Current"
                  className="h-24 w-24 rounded-xl object-cover"
                />
              ))}
            </div>
          )}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="3"
            className="rounded-xl border px-4 py-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="size"
              value={form.size}
              onChange={handleChange}
              placeholder="Size"
              className="rounded-xl border px-4 py-3"
            />

            <input
              name="color"
              value={form.color}
              onChange={handleChange}
              placeholder="Color"
              className="rounded-xl border px-4 py-3"
            />

            <input
              name="materials"
              value={form.materials}
              onChange={handleChange}
              placeholder="Materials"
              className="rounded-xl border px-4 py-3"
            />

            <input
              name="care"
              value={form.care}
              onChange={handleChange}
              placeholder="Care instructions"
              className="rounded-xl border px-4 py-3"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="rounded-xl border px-4 py-3"
              required
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border px-4 py-3"
            >
              <option value="available">Available</option>
              <option value="sold_out">Sold Out</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : editingProduct
                ? "Update Product"
                : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProductModal;
