import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-[500px] bg-black ">
      <div className="bg-gray-100 p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
              required
            />
          </div>
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
              required
            />
          </div>
          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-gray-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-lime-500"
              required
            />
          </div>
       
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-lime-500 text-white font-semibold rounded-md hover:bg-lime-600"
          >
            Login
          </button>
        </form>
        {/* Additional Links */}

        <div className="text-center mt-2">
          <Link to="/signup" className="text-sm text-red-500 hover:underline">
            Don't have an account? Click here
          </Link>
        </div>
      </div>
    </div>
  );
}
