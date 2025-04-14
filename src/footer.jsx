import React from "react";
import { FaWhatsapp } from "react-icons/fa";  // Use react-icons for WhatsApp icon
import { Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Society Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
            <div className="w-10 h-10">
            {/* Replace this src with your logo image path */}
            <img
              src="https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png"
              alt="My Society Logo"
              className="w-full h-full object-contain"
            />
          </div>
              <h3 className="text-lg md:text-xl font-bold text-blue-700">MY SOCIETY</h3>
            </div>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Organize better. Connect deeper.
              <br />
              Grow stronger.
            </p>
          </div>

          {/* Useful Links Column */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold">USEFUL LINKS</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-gray-600 hover:text-blue-700 text-xs sm:text-sm md:text-base">
                Home
              </a>
              <a href="/about" className="text-gray-600 hover:text-blue-700 text-xs sm:text-sm md:text-base">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-blue-700 text-xs sm:text-sm md:text-base">
                Contact
              </a>
              <a href="/events" className="text-gray-600 hover:text-blue-700 text-xs sm:text-sm md:text-base">
                Events
              </a>
            </nav>
          </div>

          {/* Contact Us Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">CONTACT US</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="bg-[#25D366] p-1.5 rounded-full">
                <FaWhatsapp size={16} color="#FFFFFF" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm md:text-base">+92 123 3456789</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#0088CC] p-1.5 rounded-full">
                  <Phone size={16} className="text-white" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm md:text-base">+92 123 3456789</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#EA4335] p-1.5 rounded-full">
                  <Mail size={16} className="text-white" />
                </div>
                <span className="text-gray-600 text-xs sm:text-sm md:text-base">example.uog.edu.pk</span>
              </div>
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3">
            <h3 className="text-base md:text-lg font-bold">OUR NEWSLETTER</h3>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">Stay Updated!</p>
            <p className="text-gray-600 text-xs sm:text-sm md:text-base">
              Subscribe to our newsletter and get the latest updates on events, alumni news, and more!
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              />
              <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md text-xs sm:text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-gray-500 text-xs sm:text-sm">Developed by Muhammad Farooq</p>
        </div>
      </div>
    </footer>
  );
}
