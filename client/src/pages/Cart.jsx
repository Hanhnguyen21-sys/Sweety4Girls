import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  const shipping = cartItems.length > 0 ? 10 : 0;

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  if (cartItems.length === 0) {
    return (
      <section className="min-h-screen bg-cream px-6 py-12 animate-fadeIn">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-32 text-center">
          <div className="mb-8 text-8xl animate-bounce">🛒</div>

          <h1 className="text-4xl font-bold text-dark">Your cart is empty</h1>

          <p className="mt-4 max-w-md text-lg text-neutral opacity-90">
            Looks like you have not added any handmade treasures yet.
          </p>

          <Link
            to="/products"
            className="
            mt-10 rounded-full
            bg-accent px-8 py-4
            font-semibold text-white
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-neutral
            hover:shadow-xl
          "
          >
            Start Shopping
          </Link>
        </div>
      </section>
    );
  }
  return (
    <section className="min-h-screen bg-cream px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-4xl font-bold text-dark">
          Your Shopping Cart
        </h1>
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-accent px-5 py-3 font-semibold text-accent transition hover:bg-accent hover:text-white"
        >
          <ArrowLeft size={18} />
          Continue Shopping
        </Link>
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left: Cart Items */}
          <div>
            <div className="rounded-2xl border border-primary/40 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-xl">
              {cartItems.map((item, index) => (
                <div key={item._id}>
                  <div className="grid gap-5 md:grid-cols-[120px_1fr_auto_auto] md:items-center">
                    <img
                      src={item.image || item.images?.[0]}
                      alt={item.name}
                      className="h-28 w-28 rounded-xl object-cover"
                    />

                    <div>
                      <h2 className="text-xl font-bold text-dark">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-neutral">
                        Category: {item.category}
                      </p>
                    </div>

                    <div className="flex w-32 items-center justify-between rounded-xl border border-primary bg-cream">
                      <button
                        onClick={() => decreaseQty(item._id)}
                        className="px-3 py-2 text-dark hover:text-accent"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold text-dark">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item._id)}
                        className="px-3 py-2 text-dark hover:text-accent"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                      <p className="text-lg font-bold text-dark">
                        ${item.price * item.quantity}
                      </p>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="rounded-lg border border-accent px-3 py-2 text-accent transition hover:bg-accent hover:text-white"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {index !== cartItems.length - 1 && (
                    <div className="my-6 h-[1px] bg-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/40 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold text-dark">
                Order Summary
              </h2>

              <div className="space-y-4 text-neutral">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-dark">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-dark">
                    ${shipping.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-dark">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="h-[1px] bg-primary/30" />

                <div className="flex justify-between text-xl font-bold text-dark">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/checkout">
                <button
                  className="
  mt-8 w-full rounded-xl
  bg-accent py-3
  font-bold text-white
  transition-all duration-300
  hover:-translate-y-1
  hover:bg-neutral
  hover:shadow-xl
  active:scale-95
"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>

            <div className="rounded-2xl border border-primary/40 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-dark">
                Apply Promo Code
              </h2>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter code"
                  className="w-full rounded-xl border border-primary bg-cream px-4 py-3 outline-none focus:ring-2 focus:ring-accent"
                />

                <button
                  className="rounded-xl bg-accent px-5 font-semibold text-white transition-all duration-300
  hover:-translate-y-1
  hover:bg-neutral
  hover:shadow-xl
  active:scale-95"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Cart;
