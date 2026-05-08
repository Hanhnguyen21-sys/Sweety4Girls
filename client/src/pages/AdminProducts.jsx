import { useEffect, useState } from "react";
import { Plus, Pencil, X } from "lucide-react";
import { getProducts } from "../api/products";
import ProductModal from "../components/ProductModal";
import AdminNavbar from "../components/AdminNavbar";
const ADMIN_PRODUCT_URL = `${import.meta.env.VITE_API_URL}/admin/products`;

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = ["All", "Bouquet", "Bag", "Decor"];

  const token = localStorage.getItem("adminToken");

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === "All" || product.category === selectedCategory;

    return matchSearch && matchCategory;
  });

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async () => {
    const res = await fetch(`${ADMIN_PRODUCT_URL}/${deleteProductId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      setProducts((prev) =>
        prev.filter((product) => product._id !== deleteProductId),
      );
      setDeleteProductId(null);
    }
  };

  if (loading) {
    return (
      <section className="min-h-screen bg-cream px-6 py-12">
        <p className="text-center text-neutral">Loading products...</p>
      </section>
    );
  }

  return (
    <>
      <AdminNavbar />
      <section className="min-h-screen bg-cream px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold uppercase tracking-widest text-accent">
              Manage Products
            </h1>

            <p className="mt-3 text-neutral">
              Add, edit, and delete shop products
            </p>
          </div>

          {error && (
            <p className="mb-6 rounded-xl bg-red-50 p-3 text-center text-red-600">
              {error}
            </p>
          )}

          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="rounded-xl border border-primary bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />

            <div className="flex flex-wrap justify-center gap-3 md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2 font-semibold transition ${
                    selectedCategory === category
                      ? "bg-accent text-white"
                      : "bg-white text-dark hover:bg-soft"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* ADD PRODUCT CARD */}
            <button
              onClick={handleAddProduct}
              className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-accent bg-white text-accent transition hover:bg-soft"
            >
              <Plus size={50} />
              <p className="mt-4 font-semibold">Add Product</p>
            </button>

            {/* PRODUCT CARDS */}
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-md"
              >
                <div className="absolute right-3 top-3 z-10 flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="rounded-full bg-white p-2 text-dark shadow hover:bg-soft"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => setDeleteProductId(product._id)}
                    className="rounded-full bg-white p-2 text-red-500 shadow hover:bg-red-50"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="aspect-[4/5] overflow-hidden bg-soft">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="p-4">
                  <p className="text-sm text-neutral">{product.category}</p>

                  <h3 className="mt-1 font-bold text-dark">{product.name}</h3>

                  <div className="mt-2 flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <p className="font-semibold text-accent">
                          ${product.discountPrice}
                        </p>
                        <p className="text-sm text-neutral line-through">
                          ${product.price}
                        </p>
                      </>
                    ) : (
                      <p className="font-semibold text-accent">
                        ${product.price}
                      </p>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-neutral">
                    Stock: {product.stock}
                  </p>

                  <p className="text-sm text-neutral">
                    Status: {product.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <ProductModal
            editingProduct={editingProduct}
            onClose={() => setShowModal(false)}
            onSuccess={fetchProducts}
          />
        )}

        {deleteProductId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
              <h2 className="text-xl font-bold text-dark">Delete Product?</h2>

              <p className="mt-3 text-sm text-neutral">
                Are you sure you want to delete this product? This action cannot
                be undone.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setDeleteProductId(null)}
                  className="flex-1 rounded-full border border-primary px-4 py-2 font-semibold text-dark hover:bg-soft"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 rounded-full bg-red-500 px-4 py-2 font-semibold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default AdminProducts;
