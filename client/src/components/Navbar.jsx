import { User, ShoppingCart, X, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function Navbar() {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-8 py-5 bg-accent text-soft">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wider">SWEETY4GIRLS</div>

      {/* Desktop menu */}
      <ul className="hidden md:flex gap-10 text-base md:text-lg font-semibold uppercase">
        <Link to="/">
          <li className="cursor-pointer hover:text-white transition">Home</li>
        </Link>
        <Link to="/about">
          <li className="cursor-pointer hover:text-white transition">About</li>
        </Link>
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
      <div className="flex items-center gap-4">
        <Link to="/cart" className="relative">
          <ShoppingCart className="h-6 w-6 cursor-pointer transition hover:text-white" />
          {cartCount > 0 && (
            <span className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-soft text-xs font-bold text-accent">
              {cartCount}
            </span>
          )}
        </Link>

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-accent px-8 py-4 flex flex-col gap-4 text-soft font-semibold uppercase md:hidden">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <Link to="/track-order" onClick={() => setMenuOpen(false)}>
            Track Order
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
