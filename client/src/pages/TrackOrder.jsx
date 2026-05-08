import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
function TrackOrder() {
  const [form, setForm] = useState({
    orderCode: "",
    email: "",
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [order, setOrder] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    try {
      const res = await axios.post(`${API_URL}/orders/track`, {
        orderCode: form.orderCode,
        email: form.email,
      });

      setOrder(res.data);
      setShowModal(true);
    } catch (error) {
      setError(error.response?.data?.message || "Could not find your order.");
    }
  };
  const confirmCancelOrder = async () => {
    try {
      const res = await axios.put(`${API_URL}/orders/${order._id}/cancel`);

      setOrder(res.data);

      setShowCancelConfirm(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order.");
    }
  };

  return (
    <main className="min-h-screen bg-cream px-4 py-12 text-dark">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow">
        <h1 className="text-3xl font-bold">Track Your Order</h1>

        <form onSubmit={handleTrackOrder} className="mt-6 space-y-4">
          <input
            type="text"
            name="orderCode"
            value={form.orderCode}
            onChange={handleChange}
            placeholder="Order Code"
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-accent px-4 py-3 font-semibold text-white"
          >
            Track Order
          </button>
        </form>

        {showModal && order && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-dark">
                  Order Information
                </h2>

                <button
                  onClick={() => setShowModal(false)}
                  className="text-xl font-bold text-neutral"
                >
                  ×
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm text-neutral">
                <p>
                  <strong>Order Code:</strong> {order.orderCode}
                </p>

                <p>
                  <strong>Customer:</strong> {order.customer.name}
                </p>

                <p>
                  <strong>Email:</strong> {order.customer.email}
                </p>

                <p>
                  <strong>Phone:</strong> {order.customer.phone}
                </p>

                <p>
                  <strong>Order Status:</strong> {order.status}
                </p>

                <p>
                  <strong>Payment Status:</strong> {order.paymentStatus}
                </p>
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-dark">Items</h3>

                <div className="mt-3 space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-3"
                    >
                      <p className="font-medium text-dark">{item.name}</p>
                      <p className="text-sm text-neutral">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm text-neutral">
                        Price: ${item.price}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                {order.status === "pending" ? (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full rounded-xl bg-red-500 px-4 py-3 font-semibold text-white hover:opacity-90"
                  >
                    Cancel Order
                  </button>
                ) : order.status === "cancelled" ? (
                  <p className="rounded-xl bg-red-50 p-3 text-center font-semibold text-red-600">
                    This order has been cancelled.
                  </p>
                ) : (
                  <p className="rounded-xl bg-gray-100 p-3 text-center text-sm text-neutral">
                    This order can no longer be cancelled because it is already{" "}
                    <strong>{order.status}</strong>.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-red-600">{error}</p>
        )}

        {order && (
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="text-xl font-bold">Order {order.orderCode}</h2>

            <p className="mt-2">
              Payment: <strong>{order.paymentStatus}</strong>
            </p>

            <p>
              Status: <strong>{order.status}</strong>
            </p>

            <p>
              Total: <strong>${order.totalPrice}</strong>
            </p>

            <p>
              Payment Due:{" "}
              <strong>
                {new Date(order.paymentDueDate).toLocaleDateString()}
              </strong>
            </p>
          </div>
        )}
      </div>
      {showCancelConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-dark">Cancel Order?</h2>

            <p className="mt-3 text-neutral">
              Are you sure you want to cancel this order?
            </p>

            <p className="mt-2 text-sm text-neutral">
              This action cannot be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="rounded-xl border px-5 py-2 font-semibold text-dark"
              >
                Keep Order
              </button>

              <button
                onClick={confirmCancelOrder}
                className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white hover:opacity-90"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default TrackOrder;
