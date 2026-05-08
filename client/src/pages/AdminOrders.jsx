import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavBar";
const API_URL = "http://localhost:5000/api/orders";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const fetchOrders = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await fetch("http://localhost:5001/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch orders");
    }

    return data;
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchOrders();
    }, 400);

    return () => clearTimeout(delaySearch);
  }, [search]);

  const updatePayment = async (orderId, paymentStatus) => {
    try {
      const res = await fetch(`${API_URL}/${orderId}/payment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus }),
      });

      const updatedOrder = await res.json();

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? updatedOrder : order)),
      );
    } catch (error) {
      console.error("Failed to update payment:", error);
    }
  };

  const updateStatus = async (orderId, status) => {
    const token = localStorage.getItem("adminToken");

    const res = await fetch(
      `http://localhost:5001/api/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update order");
    }

    return data;
  };
  const openOrderDetail = async (orderId) => {
    try {
      setDetailLoading(true);
      setShowModal(true);

      const res = await fetch(`${API_URL}/${orderId}`);
      const data = await res.json();

      setSelectedOrder(data);
    } catch (error) {
      console.error("Failed to fetch order detail:", error);
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-cream px-4 py-8 text-dark">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Orders</h1>
              <p className="text-neutral">
                View orders, search order codes, update payment, and manage
                status.
              </p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search order code, customer, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 rounded-xl border border-neutral/30 bg-white px-4 py-2 outline-none"
              />

              <button
                onClick={fetchOrders}
                className="rounded-xl bg-accent px-5 py-2 font-semibold text-white hover:opacity-90"
              >
                Search
              </button>
            </div>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-white shadow">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-soft text-dark">
                  <tr>
                    <th className="p-4">Order Code</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-t">
                      <td className="p-4 font-semibold">{order.orderCode}</td>

                      <td className="p-4">
                        <p className="font-medium">{order.customer?.name}</p>
                        <p className="text-sm text-neutral">
                          {order.customer?.email}
                        </p>
                      </td>

                      <td className="p-4">${order.totalPrice?.toFixed(2)}</td>

                      <td className="p-4">
                        <select
                          value={order.paymentStatus}
                          onChange={(e) =>
                            updatePayment(order._id, e.target.value)
                          }
                          className="rounded-lg border px-3 py-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="rounded-lg border px-3 py-2"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="making">Making</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4 text-sm text-neutral">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openOrderDetail(order._id)}
                            className="rounded-lg bg-neutral px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
                          >
                            View
                          </button>

                          <button
                            onClick={() => updateStatus(order._id, "cancelled")}
                            disabled={order.status === "cancelled"}
                            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white
                                ${
                                  order.status === "cancelled"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-red-500 hover:opacity-90"
                                }
                            `}
                          >
                            {order.status === "cancelled"
                              ? "Cancelled"
                              : "Cancel"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Order Details</h2>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                  className="rounded-lg bg-gray-200 px-3 py-1 font-bold"
                >
                  X
                </button>
              </div>

              {detailLoading ? (
                <p>Loading order details...</p>
              ) : selectedOrder ? (
                <div className="space-y-6">
                  <section>
                    <h3 className="mb-2 text-lg font-semibold">Order Info</h3>
                    <p>
                      <strong>Order Code:</strong> {selectedOrder.orderCode}
                    </p>
                    <p>
                      <strong>Status:</strong> {selectedOrder.status}
                    </p>
                    <p>
                      <strong>Payment:</strong> {selectedOrder.paymentStatus}
                    </p>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {selectedOrder.paymentMethod}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 text-lg font-semibold">
                      Customer Info
                    </h3>
                    <p>
                      <strong>Name:</strong> {selectedOrder.customer?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customer?.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedOrder.customer?.phone}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedOrder.customer?.address}
                    </p>
                  </section>

                  <section>
                    <h3 className="mb-2 text-lg font-semibold">Items</h3>

                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-4 rounded-xl border p-3"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-20 w-20 rounded-lg object-cover"
                            />
                          )}

                          <div>
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-neutral">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-neutral">
                              Price: ${item.price?.toFixed(2)}
                            </p>
                            <p className="text-sm text-neutral">
                              Color: {item.selectedColor || "N/A"}
                            </p>
                            <p className="text-sm text-neutral">
                              Custom Note: {item.customNote || "None"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="rounded-xl bg-cream p-4">
                    <h3 className="mb-2 text-lg font-semibold">
                      Payment Summary
                    </h3>
                    <p>
                      <strong>Subtotal:</strong> $
                      {selectedOrder.subtotal?.toFixed(2)}
                    </p>
                    <p>
                      <strong>Shipping:</strong> $
                      {selectedOrder.shippingFee?.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold">
                      Total: ${selectedOrder.totalPrice?.toFixed(2)}
                    </p>
                  </section>

                  {selectedOrder.note && (
                    <section>
                      <h3 className="mb-2 text-lg font-semibold">Order Note</h3>
                      <p className="rounded-xl bg-gray-100 p-3">
                        {selectedOrder.note}
                      </p>
                    </section>
                  )}
                </div>
              ) : (
                <p>No order selected.</p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default AdminOrders;
