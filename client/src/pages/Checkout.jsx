import { useState } from "react";
import { useCart } from "../context/CartContext";
import { checkoutOrder } from "../api/orders";
import { useNavigate } from "react-router-dom";
function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [successOrder, setSuccessOrder] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });

  const subtotal = cartItems.reduce((total, item) => {
    const price = item.discountPrice || item.price;
    return total + price * item.quantity;
  }, 0);

  const shipping = cartItems.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    try {
      const guestId = localStorage.getItem("guestId") || crypto.randomUUID();

      localStorage.setItem("guestId", guestId);

      const orderData = {
        guestId,

        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        },

        items: cartItems,

        shippingFee: shipping,

        paymentMethod,

        note: form.note,
      };

      const data = await checkoutOrder(orderData);

      setSuccessOrder(data.order);
      clearCart();
      setForm({
        name: "",
        email: "",
        phone: "",
        address: "",
        note: "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <section className="min-h-screen bg-cream px-6 py-12">
      <form
        onSubmit={handlePlaceOrder}
        className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]"
      >
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-dark">Checkout</h1>

          <div className="mt-8 grid gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              required
              className="rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Shipping address"
              rows="4"
              required
              className="rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />

            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Order note, custom request, or color preference"
              rows="3"
              className="rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-dark">Payment Method</h2>

            <div className="grid gap-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary bg-cream p-4">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-semibold text-dark">Cash</span>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-primary bg-cream p-4">
                <input
                  type="radio"
                  name="payment"
                  value="transfer"
                  checked={paymentMethod === "transfer"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="font-semibold text-dark">Zelle/Venmo</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={cartItems.length === 0}
            className="mt-8 w-full rounded-xl bg-accent py-3 font-bold text-white transition hover:bg-neutral disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place Order
          </button>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-2xl font-bold text-dark">Order Summary</h2>

          {cartItems.length === 0 ? (
            <p className="text-neutral">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const price = item.discountPrice || item.price;

                return (
                  <div key={item._id} className="flex gap-4">
                    <img
                      src={item.images?.[0] || item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold text-dark">{item.name}</h3>
                      <p className="text-sm text-neutral">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-semibold text-dark">
                      ${(price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 space-y-3 border-t border-primary/30 pt-5 text-neutral">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shipping.toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-xl font-bold text-dark">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>

      {successOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-dark">
              Order Placed Successfully!
            </h2>

            <p className="mt-3 text-neutral">
              Thank you for your order. Please save your order code.
            </p>

            <div className="mt-5 rounded-xl bg-cream p-4">
              <p className="text-sm text-neutral">Your Order Code</p>
              <p className="text-2xl font-bold tracking-widest text-accent">
                {successOrder.orderCode}
              </p>
            </div>

            {successOrder.paymentMethod === "transfer" && (
              <div className="mt-5 rounded-xl border border-primary bg-soft p-4">
                <h3 className="font-bold text-dark">Transfer Payment</h3>

                <p className="mt-2 text-sm text-neutral">
                  Please send payment to:
                </p>

                <p className="font-semibold text-dark">
                  Zelle: your-email@example.com
                </p>

                <p className="font-semibold text-dark">
                  Venmo: @your-venmo-name
                </p>

                <p className="mt-3 text-sm text-neutral">
                  Please include this order code in your payment note:
                </p>

                <p className="font-bold text-accent">
                  {successOrder.orderCode}
                </p>

                {successOrder.paymentDueDate && (
                  <p className="mt-3 text-sm text-neutral">
                    Payment must be completed before:{" "}
                    <span className="font-bold text-accent">
                      {new Date(
                        successOrder.paymentDueDate,
                      ).toLocaleDateString()}
                    </span>
                  </p>
                )}

                <p className="mt-2 text-sm text-neutral">
                  If payment is not received within 7 days, the order may be
                  cancelled.
                </p>
              </div>
            )}

            {successOrder.paymentMethod === "cash" && (
              <div className="mt-5 rounded-xl border border-primary bg-soft p-4">
                <h3 className="font-bold text-dark">Cash Payment</h3>

                <p className="mt-2 text-sm text-neutral">
                  Please prepare cash when you pick up or receive your order.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setSuccessOrder(null);
                navigate("/products");
              }}
              className="mt-6 w-full rounded-xl bg-accent py-3 font-bold text-white transition hover:bg-neutral"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default Checkout;
