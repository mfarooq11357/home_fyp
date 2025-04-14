"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  // Function to determine if a link is active based on the current pathname.
  const isActive = (path) => location.pathname === path;

  // Common nav link class name with hover effect and active underline
  const navLinkClass =
    "relative font-medium border-b-2 border-transparent hover:border-[#2D50A1] active:border-[#2D50A1] transition-colors duration-200";

  return (
    <nav className="bg-white shadow-sm px-4 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10">
            {/* Replace this src with your logo image path */}
            <img
              src="https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png"
              alt="SE Society Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-[#2D51A0]">SE Society</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-8 mr-8">
            <Link to="/" className={`${navLinkClass} ${isActive("/") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"}`}>
              Home
            </Link>
            <Link to="/about" className={`${navLinkClass} ${isActive("/about") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"}`}>
              About us
            </Link>
            <Link to="/contact" className={`${navLinkClass} ${isActive("/contact") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"}`}>
              Contact us
            </Link>
          </div>

          {/* Desktop Button */}
          <div>
            <Link to="/signup">
              <Button 
                className="px-8 py-2 rounded-md bg-[#3b5998] text-white transition-colors duration-200 hover:bg-[#2D50A1] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-offset-2 font-medium">
                Sign up
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden text-gray-800 focus:outline-none" aria-label="Toggle menu">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out transform ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-gray-800 focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col space-y-4 mt-8">
            <Link
              to="/"
              className={`${navLinkClass} ${isActive("/") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"} text-lg`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${navLinkClass} ${isActive("/about") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"} text-lg`}
              onClick={toggleMenu}
            >
              About us
            </Link>
            <Link
              to="/contact"
              className={`${navLinkClass} ${isActive("/contact") && "border-b-2 border-[#2D50A1] text-[#2D50A1]"} text-lg`}
              onClick={toggleMenu}
            >
              Contact us
            </Link>
            <div className="pt-4">
              <Link to="/signup" onClick={toggleMenu}>
                <Button 
                  className="w-full py-2 rounded-md bg-[#3b5998] text-white transition-colors duration-200 hover:bg-[#2D50A1] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-offset-2 font-medium">
                  Sign up
                </Button>
              </Link>
            </div>
            <div className="pt-2">
              <Link to="/login" onClick={toggleMenu}>
                <Button
                  variant="outline"
                  className="w-full py-2 rounded-md border border-[#3b5998] text-[#3b5998] transition-colors duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#3b5998] focus:ring-offset-2 font-medium"
                >
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}