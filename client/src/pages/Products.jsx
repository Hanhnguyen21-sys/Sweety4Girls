import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../api/products";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = ["All", "Bouquet", "Bag", "Decor"];

  useEffect(() => {
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

  if (loading) {
    return (
      <section className="min-h-screen bg-cream px-6 py-12">
        <p className="text-center text-neutral">Loading products...</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-accent">
            Our Products
          </h1>

          <p className="mt-3 text-neutral">
            Handmade crochet items crafted with love
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
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
