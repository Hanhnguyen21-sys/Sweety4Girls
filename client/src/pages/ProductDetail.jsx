import { useParams } from "react-router-dom";
import { Minus, Plus, Star, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  const decreaseQty = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQty = () => {
    setQuantity((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream p-10 text-center text-2xl">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-cream p-10 text-center text-2xl">
        Product not found
      </div>
    );
  }
  const reviewCount = product.reviews || 0;
  const rating = reviewCount > 0 ? product.rating || 0 : 0;

  const detailItems = [
    { label: "Size", value: product.details?.size },
    { label: "Color", value: product.details?.color },
    { label: "Materials", value: product.details?.materials },
    { label: "Care", value: product.details?.care },
  ].filter((item) => item.value && item.value.trim() !== "");
  return (
    <section className="min-h-screen bg-cream px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* BACK BUTTON */}
        <button
          onClick={() => window.history.back()}
          className="
        mb-8 inline-flex items-center gap-2
        rounded-full border border-accent
        px-5 py-3
        text-sm font-semibold text-accent
        transition-all duration-300
        hover:-translate-y-1
        hover:bg-accent
        hover:text-white
        hover:shadow-lg
      "
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </button>
        <div className="mx-auto grid max-w-5xl items-start gap-10 md:grid-cols-2">
          {/* Image */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-md">
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {product.category}
            </p>

            <h1 className="mt-2 text-3xl font-bold text-dark">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={index < Math.round(rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <p className="text-sm text-neutral">
                {rating} ({reviewCount} reviews)
              </p>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-center gap-3">
              {product.discountPrice ? (
                <>
                  <p className="text-2xl font-bold text-accent">
                    ${product.discountPrice}
                  </p>

                  <p className="text-lg text-neutral line-through">
                    ${product.price}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-accent">
                  ${product.price}
                </p>
              )}
            </div>

            {/* Stock */}
            <p className="mt-3 text-sm text-neutral">
              Stock:{" "}
              <span className="font-semibold text-dark">{product.stock}</span>
            </p>

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-neutral">
              {product.description}
            </p>

            {/* Quantity */}
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-dark">Quantity</p>

              <div className="flex w-32 items-center justify-between rounded-xl border border-primary bg-white px-4 py-2">
                <button onClick={decreaseQty}>
                  <Minus size={16} />
                </button>

                <span className="font-semibold">{quantity}</span>

                <button onClick={increaseQty}>
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock <= 0}
              className="mt-6 w-fit rounded-full bg-accent px-8 py-3 text-sm font-bold text-white transition hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock > 0 ? "Add to Cart" : "Sold Out"}
            </button>

            {/* Details */}
            {detailItems.length > 0 && (
              <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-lg font-bold text-dark">
                  Product Details
                </h2>

                <div className="space-y-2 text-sm text-neutral">
                  {detailItems.map((item) => (
                    <p key={item.label}>
                      <span className="font-semibold text-dark">
                        {item.label}:
                      </span>{" "}
                      {item.value}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDetail;
