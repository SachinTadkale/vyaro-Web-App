import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const linkClass = (id: string) =>
    `relative cursor-pointer transition duration-300 ${
      active === id ? "text-farmGreen font-semibold" : "text-gray-700"
    }`;

  const underline = (id: string) =>
    active === id ? (
      <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-farmGreen"></span>
    ) : null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 h-16 flex items-center">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center w-full">

        {/* Logo */}
        <a href="#home" className="text-2xl font-bold text-farmGreen">
          FarmZY
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 font-medium ml-10">

          <li>
            <a href="#home" className={linkClass("home")}>
              Home
              {underline("home")}
            </a>
          </li>

          <li>
            <a href="#features" className={linkClass("features")}>
              Features
              {underline("features")}
            </a>
          </li>

          <li>
            <a href="#about" className={linkClass("about")}>
              About
              {underline("about")}
            </a>
          </li>

          <li>
            <a href="#contact" className={linkClass("contact")}>
              Contact
              {underline("contact")}
            </a>
          </li>

        </ul>

        {/* Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {/* <Link
            to="/login"
            className="px-4 py-2 border border-farmGreen text-farmGreen rounded-lg hover:bg-farmGreen hover:text-white transition"
          >
            Login
          </Link> */}

          <a
            href="#download"
            className="px-4 py-2 bg-farmGreen text-white rounded-lg hover:bg-farmDark transition"
          >
            Download App
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div
          className="md:hidden text-xl text-farmGreen cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-farmBg px-6 pb-4 space-y-4">
          <a href="#home" className="block">Home</a>
          <a href="#about" className="block">About</a>
          <a href="#features" className="block">Features</a>
          <a href="#contact" className="block">Contact</a>

          <Link
            to="/login"
            className="block border border-farmGreen text-farmGreen px-4 py-2 rounded-lg text-center"
          >
            Login
          </Link>

          <a
            href="#download"
            className="block bg-farmGreen text-white px-4 py-2 rounded-lg text-center"
          >
            Download App
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;