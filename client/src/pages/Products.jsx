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
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-6 py-12 animate-fadeIn">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-12 text-center animate-fadeUp">
          <h1 className="text-4xl font-bold uppercase tracking-widest text-accent md:text-5xl">
            Our Products
          </h1>

          <p className="mt-4 text-lg text-neutral opacity-90">
            Handmade crochet items crafted with love
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mb-6 rounded-xl bg-red-50 p-4 text-center text-red-600 shadow-sm">
            {error}
          </p>
        )}

        {/* SEARCH + FILTER */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between animate-fadeUpSlow">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              rounded-2xl border border-primary bg-white
              px-5 py-3
              outline-none
              transition-all duration-300
              focus:border-accent
              focus:ring-2 focus:ring-[#EADAD4]
              hover:shadow-md
            "
          />

          {/* FILTER BUTTONS */}
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  rounded-full px-6 py-2
                  font-semibold
                  transition-all duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  ${
                    selectedCategory === category
                      ? "bg-accent text-white shadow-lg"
                      : "bg-white text-dark hover:bg-soft"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <div
              key={product._id}
              className="animate-fadeUp"
              style={{
                animationDelay: `${index * 0.08}s`,
                animationFillMode: "both",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {filteredProducts.length === 0 && (
          <div className="mt-20 text-center animate-fadeIn">
            <p className="text-xl text-neutral">No products found 💔</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Products;
