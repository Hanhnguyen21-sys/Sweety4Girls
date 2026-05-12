import { Link } from "react-router-dom";
import { Image, Mail, Heart } from "lucide-react";
import { FaTiktok, FaInstagram } from "react-icons/fa";
function Footer() {
  return (
    <footer className="mt-20 bg-[#EADAD4] text-dark">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-14 md:grid-cols-3">
        {/* BRAND */}
        <div>
          {/* <h2 className="text-3xl font-bold tracking-widest text-accent">
            SWEETYGIRLSHANDMADES
          </h2> */}
          <img
            src="/images/logo.png"
            alt="SWEETYGIRLSHANDMADES"
            className="h-20 w-auto object-contain"
          />

          <p className="mt-5 leading-7 text-neutral">
            Handmade crochet flowers, bouquets, bags, and gifts crafted with
            love and care.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-accent"
            >
              <FaInstagram size={22} />
            </a>

            <a
              href="https://www.tiktok.com/@sweetygirls.handmade4"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-accent"
            >
              <FaTiktok size={22} />
            </a>

            <a
              href="mailto:sweety4girls.hm@gmail.com"
              className="transition hover:text-accent"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-bold text-dark">Quick Links</h3>

          <ul className="mt-5 space-y-3 text-neutral">
            <li>
              <Link to="/" className="transition hover:text-accent">
                Home
              </Link>
            </li>

            <li>
              <Link to="/products" className="transition hover:text-accent">
                Products
              </Link>
            </li>

            <li>
              <Link to="/about" className="transition hover:text-accent">
                About
              </Link>
            </li>

            <li>
              <Link to="/track-order" className="transition hover:text-accent">
                Track Order
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-bold text-dark">Contact</h3>

          <div className="mt-5 space-y-4 text-neutral">
            <p> 📧 sweety4girls.hm@gmail.com</p>

            <p> 📍 San Jose, California</p>

            <p> 📷 Instagram: sweetygirls.handmade4</p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-[#d8c0b6] px-6 py-5 text-center text-sm text-neutral">
        <p className="flex items-center justify-center gap-2">
          Made with <Heart size={16} className="fill-accent text-accent" />
          by SWEETYGIRLSHANDMADE © 2026
        </p>
      </div>
    </footer>
  );
}

export default Footer;
