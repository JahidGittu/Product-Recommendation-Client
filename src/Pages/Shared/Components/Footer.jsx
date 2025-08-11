import React, { useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

const Footer = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://product-recommendation-server-topaz.vercel.app/subscribe",
        { email }
      );
      setMessage(res.data.message || "Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      setMessage("Failed to subscribe. Please try again later.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputFocus = () => {
    if (!email && user?.email) {
      setEmail(user.email);
    }
  };

  return (
    <footer className="bg-[#003566] text-white py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-0">
        {/* Left: Logo + Slogan */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <img
            src="https://i.ibb.co/0yzpyhSQ/WebLogo.png"
            alt="Website Logo"
            className="w-16 h-16"
          />
          <span className="font-extrabold text-2xl leading-tight tracking-wide text-[#1E90FF]">
            Buy Best Alternatives <br /> and be Happy!
          </span>
        </div>

        {/* Middle: Links and copyright */}
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start space-y-4">
          <nav className="space-x-6 mb-2">
            <Link
              to="/about-us"
              className="text-white hover:text-[#87CEFA] transition-colors duration-300 font-semibold"
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className="text-white hover:text-[#87CEFA] transition-colors duration-300 font-semibold"
            >
              Contact Us
            </Link>
          </nav>
          <p className="text-sm text-[#a0c4ff]">
            &copy; {new Date().getFullYear()} ACME Industries Ltd. All rights
            reserved.
          </p>
        </div>

        {/* Right: Newsletter subscription */}
        <div className="flex flex-col items-center space-y-4 w-full max-w-sm">
          <h3 className="text-xl font-semibold text-[#1E90FF]">
            Subscribe to Our Newsletter
          </h3>
          <div className="flex w-full relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleInputFocus}
              className="w-full p-3 rounded-md border-2 border-[#1E90FF] focus:outline-none focus:ring-2 focus:ring-[#1E90FF] text-black"
              disabled={loading}
            />
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="absolute right-1 top-1 bottom-1 bg-[#1E90FF] hover:bg-[#0064c8] text-white px-4 rounded-md flex items-center justify-center transition"
              aria-label="Subscribe"
            >
              {loading ? (
                <FaSpinner className="animate-spin text-lg" />
              ) : (
                <CiLocationArrow1 size={24} />
              )}
            </button>
          </div>
          {message && (
            <p
              className={`mt-2 text-sm ${
                message.toLowerCase().includes("failed")
                  ? "text-red-400"
                  : "text-green-400"
              } font-medium text-center`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
