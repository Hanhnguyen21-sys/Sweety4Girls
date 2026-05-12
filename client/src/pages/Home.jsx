// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FeaturedProductsSlider from "../components/FeaturedProductsSlider";
import { getProducts } from "../api/products";

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const data = await getProducts();

        // TODO: FEATURED PRODUCTS CHANGE LATER
        setFeaturedProducts(data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load featured products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="min-h-screen bg-cream text-dark">
      <section className="bg-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-2 md:py-14">
          <div className="flex flex-col items-center text-center">
            <p className="mb-3 text-sm font-semibold text-accent">
              Handmade Crochet Gifts
            </p>

            <h1 className="text-4xl font-bold leading-tight text-dark md:text-5xl">
              Cute crochet flowers for every special moment
            </h1>

            <p className="mt-4 max-w-md text-neutral">
              Discover handmade bouquets, flower pots, and custom gifts made
              with love.
            </p>

            <Link
              to="/products"
              className="mt-6 rounded-full bg-accent px-6 py-3 text-white hover:bg-neutral"
            >
              Shop Now
            </Link>
          </div>

          <div className="flex justify-center">
            <img
              src="/images/pink.JPG"
              alt="Crochet flowers"
              className="h-72 w-72 rounded-3xl object-cover md:h-80 md:w-80"
            />
          </div>
        </div>
      </section>

      {!loading && <FeaturedProductsSlider products={featuredProducts} />}
    </main>
  );
}

export default Home;
