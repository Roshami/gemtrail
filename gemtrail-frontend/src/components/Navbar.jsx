import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClass = ({ isActive }) =>
    `block py-2 md:py-0 transition ${
      isActive
        ? "text-green-600 font-semibold"
        : "text-gray-700 hover:text-green-600"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                G
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-green-700">
              GemTrail
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">

            <NavLink to="/home" className={navLinkClass}>
              Home
            </NavLink>

            <NavLink to="/places" className={navLinkClass}>
              Places
            </NavLink>

            <NavLink to="/itinerary" className={navLinkClass}>
              My Plan
            </NavLink>

            <NavLink to="/admin/login" className={navLinkClass}>
              Admin
            </NavLink>

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            <span className="text-2xl">
              {isOpen ? "✕" : "☰"}
            </span>
          </button>

        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-2">

            <NavLink
              to="/home"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/places"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Places
            </NavLink>

            <NavLink
              to="/itinerary"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              My Plan
            </NavLink>

            <NavLink
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className={navLinkClass}
            >
              Admin
            </NavLink>

          </div>
        )}

      </div>
    </nav>
  );
}

export default Navbar;