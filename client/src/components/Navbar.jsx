import { User, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
function Navbar() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-accent text-soft">
      {/* Logo */}
      <div className="text-2xl md:text-2xl font-bold tracking-wider">
        SWEETY4GIRLS
      </div>

      {/* Menu */}
      <ul className="hidden md:flex gap-10 text-base md:text-lg font-semibold uppercase">
        <Link to="/">
          <li className="cursor-pointer hover:text-white transition">Home</li>
        </Link>

        {/* <Link to="/about">
          <li className="cursor-pointer hover:text-white transition">About</li>
        </Link> */}

        <Link to="/products">
          <li className="cursor-pointer hover:text-white transition">
            Products
          </li>
        </Link>
        <Link to="/track-order">
          <li className="cursor-pointer hover:text-white transition">
            Track Order
          </li>
        </Link>
      </ul>

      {/* Icons */}
      <div className="flex gap-6">
        {/* <User className="w-6 h-6 cursor-pointer hover:text-white transition" /> */}
        <Link to="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 cursor-pointer transition hover:text-white" />

          {cartCount > 0 && (
            <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-soft text-xs font-bold text-accent">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
