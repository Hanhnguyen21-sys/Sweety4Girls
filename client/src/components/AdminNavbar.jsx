import { LogOut, User, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-accent text-soft">
      <Link to="/admin/orders" className="text-2xl font-bold tracking-wider">
        SWEETYGIRLS
      </Link>

      <ul className="hidden md:flex gap-10 text-base md:text-lg font-semibold uppercase">
        <Link to="/admin/orders">
          <li className="hover:text-white transition">Orders</li>
        </Link>

        <Link to="/admin/products">
          <li className="hover:text-white transition">Products</li>
        </Link>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-white transition"
        >
          <li>View Store</li>
          <ExternalLink size={14} />
        </a>
      </ul>

      <div className="flex items-center gap-4">
        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-soft" />
          <span className="block w-6 h-0.5 bg-soft" />
          <span className="block w-6 h-0.5 bg-soft" />
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 hover:text-white transition"
        >
          <User className="h-6 w-6" />
          <LogOut className="h-5 w-5" />
        </button>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-0 right-0 z-50 bg-accent px-8 py-4 flex flex-col gap-4 text-soft font-semibold uppercase md:hidden">
          <Link to="/admin/orders" onClick={() => setMenuOpen(false)}>
            Orders
          </Link>
          <Link to="/admin/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1"
            onClick={() => setMenuOpen(false)}
          >
            View Store <ExternalLink size={14} />
          </a>
        </div>
      )}
    </nav>
  );
}

export default AdminNavbar;
