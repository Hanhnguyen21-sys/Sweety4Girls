import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
      {/* Click here -> Product Detail */}
      <Link to={`/products/${product._id}`}>
        <div className="aspect-[4/3] w-full overflow-hidden rounded-t-2xl bg-white">
          <img
            src={product.images}
            alt={product.name}
            className="
              h-full 
              w-full 
              object-cover 
              object-center
              transition-transform 
              duration-500 
              group-hover:scale-125
            "
          />
        </div>

        <div className="p-4 pb-0">
          <p className="text-sm text-neutral">{product.category}</p>

          <h3 className="text-lg font-bold text-dark">{product.name}</h3>

          <p className="mt-2 font-semibold text-accent">${product.price}</p>
        </div>
      </Link>

      {/* Click here -> Add to Cart only */}
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
