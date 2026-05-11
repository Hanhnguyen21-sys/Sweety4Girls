import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const imageUrl = Array.isArray(product.images)
    ? product.images[0]
    : product.images;

  const optimizedImage = imageUrl?.includes("/upload/")
    ? imageUrl.replace("/upload/", "/upload/f_auto,q_auto,w_600/")
    : imageUrl;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition md:hover:shadow-xl">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-white">
          <img
            src={optimizedImage}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="600"
            height="450"
            className="h-full w-full object-cover object-center transition-transform duration-300 md:group-hover:scale-110"
          />
        </div>

        <div className="p-4 pb-0">
          <p className="text-sm text-neutral">{product.category}</p>
          <h3 className="text-lg font-bold text-dark">{product.name}</h3>
          <p className="mt-2 font-semibold text-accent">${product.price}</p>
        </div>
      </Link>

      <div className="p-4">
        <button
          onClick={() => addToCart(product, 1)}
          className="w-full rounded-xl bg-accent py-2 font-semibold text-white transition hover:bg-neutral"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
