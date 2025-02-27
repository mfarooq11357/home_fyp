

import { useState } from "react";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-zinc-900 px-4 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          My Society
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden space-x-6 md:flex">
          <Link to="/" className="text-white hover:text-gray-300">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-gray-300">
            About
          </Link>
          <Link to="/contact" className="text-white hover:text-gray-300">
            Contact
          </Link>
          {/* <Link to="/signup" className="text-white hover:text-gray-300">
            Register
          </Link> */}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden space-x-2 md:flex">
        <Link to="/signup">
                <Button variant="outline" className="px-8 py-2 rounded-full bg-lime-500 text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8 py-2 rounded-full bg-lime-500 text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Login
                </Button>
              </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-64 bg-zinc-800 p-6 transition-transform duration-300 ease-in-out transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 text-white focus:outline-none"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex flex-col space-y-4 mt-8">
            <Link to="/" className="text-lg font-semibold text-white" onClick={toggleMenu}>
              Home
            </Link>
            <Link to="/about" className="text-lg font-semibold text-white" onClick={toggleMenu}>
              About
            </Link>
            <Link to="/contact" className="text-lg font-semibold text-white" onClick={toggleMenu}>
              Contact
            </Link>
            {/* <Link to="/signup" className="text-lg font-semibold text-white" onClick={toggleMenu}>
              Register
            </Link> */}
            <div className="flex flex-col space-y-2">
              <Link to="/signup">
                <Button variant="outline" className="px-8 py-2 rounded-full bg-lime-500 text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                  Register
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="px-8 py-2 rounded-full bg-lime-500 text-white hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
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
