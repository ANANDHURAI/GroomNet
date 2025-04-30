import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [navbarTransparent, setNavbarTransparent] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  useEffect(() => {
    const updateNavbarColor = () => {
      if (window.scrollY > 300) {
        setNavbarTransparent(false);
      } else {
        setNavbarTransparent(true);
      }
    };
    window.addEventListener("scroll", updateNavbarColor);
    return () => window.removeEventListener("scroll", updateNavbarColor);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        navbarTransparent ? "bg-transparent" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center py-4">
        <Link
          to="/index"
          className="text-lg font-bold text-gray-800 hover:text-gray-600"
        >
          home
        </Link>

        <button
          onClick={toggleNavbar}
          className="text-gray-700 focus:outline-none md:hidden"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } md:flex md:items-center space-x-6`}
        >
          <Link to="/index" className="text-gray-700 hover:text-gray-500">
            About
          </Link>
          <a
            href="https://demos.creative-tim.com/paper-kit-react/#/documentation?ref=pkr-examples-navbar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-gray-500"
          >
            How it Works
          </a>
          <a
            href="https://twitter.com/CreativeTim?ref=creativetim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-400"
          >
            Benifets
          </a>
          <a
            href="https://www.facebook.com/CreativeTim?ref=creativetim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-blue-600"
          >
            Linked In
          </a>
          <a
            href="https://www.instagram.com/CreativeTimOfficial?ref=creativetim"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 hover:text-pink-500"
          >
            Instagram
          </a>
          
          <a
            href="https://www.creative-tim.com/product/paper-kit-pro-react?ref=pkr-examples-navbar"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600"
          >
            Upgrade to Pro
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
