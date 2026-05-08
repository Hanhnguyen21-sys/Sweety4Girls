import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { useState } from "react";

function FeaturedProductsSlider({ products }) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= products.length ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev === 0 ? Math.max(products.length - visibleCount, 0) : prev - 1,
    );
  };

  const visibleProducts = products.slice(startIndex, startIndex + visibleCount);

  return (
    <section className="bg-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative mb-10">
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-16 bg-neutral"></div>

            <h2 className="text-center text-2xl font-bold uppercase tracking-widest text-accent">
              Featured Products
            </h2>

            <div className="h-[1px] w-16 bg-neutral"></div>
          </div>

          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 gap-3 md:flex">
            <button
              onClick={prevSlide}
              className="rounded-full border border-primary bg-white p-2 text-accent hover:bg-soft"
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={nextSlide}
              className="rounded-full border border-primary bg-white p-2 text-accent hover:bg-soft"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProductsSlider;
