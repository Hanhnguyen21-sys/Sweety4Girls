import { useState } from "react";
function About() {
  const CONTACT_URL = `${import.meta.env.VITE_API_URL}/contact`;

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    try {
      setContactLoading(true);
      setContactSuccess("");
      setContactError("");

      const res = await fetch(CONTACT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message.");
      }

      setContactSuccess("Message sent successfully!");
      setContactForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setContactError(error.message);
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-cream text-dark">
      {/* HEADER */}
      <section className="bg-[#EADAD4] px-6 py-16 text-center text-dark">
        <h1 className="text-4xl font-bold tracking-widest md:text-5xl">
          About Shop
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.3em] opacity-90">
          Handmade with love
        </p>
      </section>

      {/* ABOUT CONTENT */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-bold text-accent">Hi there 👋 </h2>

        <div className="mt-8 space-y-6 text-lg leading-8 text-neutral">
          <p>
            SWEETYGIRLS is a handmade crochet shop created with love, patience,
            and creativity. We offer crochet flower bouquets, cute accessories,
            cozy decorations, and meaningful gifts for special moments.
          </p>

          <p>
            Since 2026, our crochet shop has been a sweet pink space full of
            cute, soft, and girly handmade items. Every piece is made with care,
            warm colors, and a happy vibe. We focus on every designs, lovely
            details, and cozy products that make you smile. From flowers, small
            keychains to clothes and bags, everything is crafted by hand with
            love.
          </p>

          <p>
            Our shop follows the quote: “Best quality–Warmsupport–Wholehearted
            service.” This is how we work and how we care for every customer.
          </p>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="bg-white px-6 py-16">
        <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] shadow-lg md:grid-cols-2">
          {/* IMAGE */}
          <div className="h-[500px] bg-soft md:h-[620px]">
            <img
              src="/images/pink.JPG"
              alt="Crochet flowers"
              className="h-full w-full object-cover object-center"
            />
          </div>

          {/* CONTACT INFO */}

          <div className="flex flex-col justify-center bg-cream p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.3em] text-accent">
              Contact Us
            </p>

            <h2 className="mt-4 text-3xl font-bold text-dark">
              Have a question?
            </h2>

            <form onSubmit={handleContactSubmit} className="mt-10">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.25em] text-neutral">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="mt-2 w-full border border-neutral bg-white px-4 py-3 outline-none focus:border-accent"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-[0.25em] text-neutral">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="mt-2 w-full border border-neutral bg-white px-4 py-3 outline-none focus:border-accent"
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-[0.25em] text-neutral">
                  Message *
                </label>

                <textarea
                  name="message"
                  rows="5"
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="mt-2 w-full border border-neutral bg-white px-4 py-3 outline-none focus:border-accent"
                  required
                />
              </div>

              {contactSuccess && (
                <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {contactSuccess}
                </p>
              )}

              {contactError && (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {contactError}
                </p>
              )}

              <button
                type="submit"
                disabled={contactLoading}
                className="mt-5 w-full rounded-full bg-[#EADAD4] py-4 text-sm font-semibold uppercase tracking-[0.25em] text-dark transition hover:bg-accent hover:text-white disabled:opacity-50"
              >
                {contactLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
