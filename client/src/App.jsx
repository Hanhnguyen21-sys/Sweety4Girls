import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
// import About from "./pages/About";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import TrackOrder from "./pages/TrackOrder";
import AdminOrders from "./pages/AdminOrders";
import AdminLogin from "./pages/AdminLogin";
import AdminNavbar from "./components/AdminNavbar";
import AdminProducts from "./pages/AdminProducts";
function App() {
  const location = useLocation();

  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path="/about" element={<About />} /> */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/track-order" element={<TrackOrder />} />

        {/* ADMIN */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Routes>
    </>
  );
}

export default App;
