import { LogOut, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();

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
        <Link to="/">
          <li className="hover:text-white transition">Home</li>
        </Link>

        <Link to="/about">
          <li className="hover:text-white transition">About</li>
        </Link>

        <Link to="/products">
          <li className="hover:text-white transition">Products</li>
        </Link>

        <Link to="/admin/orders">
          <li className="hover:text-white transition">Orders</li>
        </Link>
      </ul>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 hover:text-white transition"
      >
        <User className="h-6 w-6" />
        <LogOut className="h-5 w-5" />
      </button>
    </nav>
  );
}

export default AdminNavbar;
