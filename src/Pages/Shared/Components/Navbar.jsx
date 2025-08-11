import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../../../assets/images/Logo.png";
import { FaSignOutAlt } from "react-icons/fa";
import { AiFillSun, AiFillMoon } from "react-icons/ai";
import useAuth from "../../../hooks/useAuth";
import "./Navbar.css";
import "../../../index.css";

const Navbar = () => {
  const { user, logout, loading } = useAuth();
  const [showSetting, setShowSetting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("mytheme"); // Start with "mytheme" as default
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle scroll for navbar background & shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Load saved theme from localStorage or set default
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
      setTheme(savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "mytheme");
      setTheme("mytheme");
    }
  }, []);

  // Toggle between 'mytheme' (light) and 'dark'
  const toggleTheme = () => {
    if (theme === "mytheme") {
      document.documentElement.setAttribute("data-theme", "dark");
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "mytheme");
      setTheme("mytheme");
      localStorage.setItem("theme", "mytheme");
    }
  };

  // Close dropdown if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSetting(false);
      }
    }
    if (showSetting) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSetting]);

  // Close dropdown on ESC key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setShowSetting(false);
      }
    }
    if (showSetting) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSetting]);

  // Keyboard accessibility for profile toggle
  const handleProfileKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setShowSetting((prev) => !prev);
    }
  };

  // Navigation links, active class applied dynamically
  const navLinkClass = ({ isActive }) =>
    "menu-item " + (isActive ? "active" : "");

  const links = user ? (
    <>
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/queries" className={navLinkClass}>
        Queries
      </NavLink>
      <NavLink to="/Recommendation-for-me" className={navLinkClass}>
        Recommendations For Me
      </NavLink>
      <NavLink to="/my-Queries" className={navLinkClass}>
        My Queries
      </NavLink>
      <NavLink to="/my-recommendations" className={navLinkClass}>
        My Recommendations
      </NavLink>
    </>
  ) : (
    <>
      <NavLink to="/" className={navLinkClass} end>
        Home
      </NavLink>
      <NavLink to="/queries" className={navLinkClass}>
        Queries
      </NavLink>
    </>
  );

  const handleLogout = () => {
    logout()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        // Handle error if needed
      });
  };

  return (
    <nav
      className={`fixed z-10 top-0 left-0 right-0 transition-all duration-300 ${
        isScrolled ? "bg-base-100 shadow-md backdrop-blur-sm" : "bg-transparent"
      } px-4 md:px-8 flex items-center justify-between`}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Left Side: Logo + Title */}
      <div className="flex items-center gap-4 relative w-full lg:w-auto">
        {/* Mobile Dropdown */}
        <div className="dropdown lg:hidden">
          <label
            tabIndex={0}
            className="btn btn-ghost p-0"
            aria-label="Open menu"
          >
            <img
              className="w-12 h-12 object-cover rounded-2xl"
              src={logo}
              alt="Logo"
            />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow text-base-content"
            role="menu"
          >
            {React.Children.map(links, (child) =>
              React.cloneElement(child, { role: "menuitem" })
            )}
          </ul>
        </div>

        {/* Logo & Title (large devices only) */}
        <Link to="/" className="hidden lg:flex items-center space-x-2">
          <img
            className="w-14 h-14 object-cover rounded-2xl"
            src={logo}
            alt="Logo"
          />
          <div className="text-xl py-2 font-semibold flex flex-col items-center">
            <span className="text-base-content">Recommand</span>
            <span className="text-primary">Product</span>
          </div>
        </Link>

        {/* Centered Title (mobile only) */}
        <div className="lg:hidden ml-12 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-sm xs:text-base sm:text-lg font-semibold">
          <span className="text-base-content block leading-4">Recommand</span>
          <span className="text-primary block leading-4">Product</span>
        </div>
      </div>

      {/* Center Menu (for large screens only) */}
      <div className="hidden lg:flex flex-1 justify-center overflow-x-auto max-w-full">
        <ul
          className="menu menu-horizontal gap-4 flex-nowrap whitespace-nowrap px-1 text-lg gap-2 text-base-content"
          role="menubar"
        >
          {React.Children.map(links, (child) =>
            React.cloneElement(child, { role: "menuitem" })
          )}
        </ul>
      </div>

      {/* Right Side: Theme + Profile/Auth */}
      <div className="flex items-center gap-2 min-h-[56px]">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark/Light Theme"
          aria-pressed={theme !== "mytheme"}
          title="Toggle Dark/Light Theme"
          className="text-3xl text-yellow-500 dark:text-gray-300 focus:outline-none transition-colors duration-300"
        >
          {theme === "mytheme" ? (
            <AiFillSun color="orange" />
          ) : (
            <AiFillMoon color="#2B4D58" />
          )}
        </button>

        {/* Profile or Auth Links */}
        {loading ? (
          <div className="flex justify-center items-center w-full">
            <span className="loading loading-dots loading-lg"></span>
          </div>
        ) : user ? (
          <div
            className="relative flex items-center gap-1 cursor-pointer select-none"
            ref={dropdownRef}
          >
            {user?.photoURL ? (
              <img
                onClick={() => setShowSetting((prev) => !prev)}
                onKeyDown={handleProfileKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={showSetting}
                src={user.photoURL}
                alt="Profile"
                className="w-12 rounded-full border border-gray-300"
              />
            ) : (
              <div
                onClick={() => setShowSetting((prev) => !prev)}
                onKeyDown={handleProfileKeyDown}
                tabIndex={0}
                role="button"
                aria-haspopup="true"
                aria-expanded={showSetting}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-neutral text-neutral-content flex items-center justify-center border border-gray-300 font-bold"
              >
                U
              </div>
            )}

            {showSetting && (
              <div
                className="absolute right-0 top-16 bg-base-100 text-base-content shadow-md rounded p-4 z-50 w-56 border"
                role="menu"
              >
                <p className="font-bold truncate" role="menuitem">
                  {user?.displayName || "No Name"}
                </p>
                <p className="truncate" role="menuitem">
                  {user?.email}
                </p>

                <Link
                  to="/my-profile"
                  className="btn btn-sm btn-info mt-2 w-full flex items-center gap-2 justify-center"
                  role="menuitem"
                >
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-warning btn-sm mt-3 w-full flex items-center gap-2 justify-center"
                  role="menuitem"
                >
                  Logout <FaSignOutAlt />
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className="btn btn-warning hidden md:flex"
              aria-label="Logout"
            >
              Logout <FaSignOutAlt />
            </button>
          </div>
        ) : (
          <>
            <Link
              className="btn btn-outline btn-accent"
              to="/auth/signIn"
              aria-label="Login"
            >
              Login
            </Link>
            <Link
              className="btn btn-primary"
              to="/auth/signUp"
              aria-label="Signup"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
