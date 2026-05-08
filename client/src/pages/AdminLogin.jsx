import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminInfo", JSON.stringify(data));

      navigate("/admin/orders");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <section className="w-full max-w-md rounded-3xl bg-white px-8 py-10 shadow-lg border border-soft">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-wide text-accent">
            SWEETYGIRLS
          </h1>

          <p className="mt-2 text-sm uppercase tracking-[0.25em] text-neutral">
            Admin Panel
          </p>

          <h2 className="mt-8 text-2xl font-bold text-dark">
            Welcome, các mom!
          </h2>

          <p className="mt-2 text-sm text-neutral">Chúc buôn may bán đắt! 😄</p>
        </div>

        {error && (
          <p className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-8">
          <div>
            <label className="block text-sm font-semibold text-dark">
              Email
            </label>

            <input
              type="email"
              placeholder="admin@example.com"
              className="mt-2 w-full border-b-2 border-soft bg-transparent px-1 py-3 text-dark outline-none focus:border-accent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-semibold text-dark">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="mt-2 w-full border-b-2 border-soft bg-transparent px-1 py-3 text-dark outline-none focus:border-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-full bg-accent py-3 font-bold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral">
          Admin access only
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
