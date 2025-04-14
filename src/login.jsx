import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Image Section - Top on mobile, Right on desktop */}
      <div className="w-full md:hidden">
        <div className=" p-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-2 text-center">SES Management System</h1>
          <p className="text-center text-gray-700 mb-4 max-w-md text-sm">
            Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
          </p>
          <img
            src="https://i.ibb.co/v45C18ZG/bg1.png"
            alt="SES Management System"
            className="max-w-full h-auto w-[300px]"
          />
        </div>
      </div>

      {/* Left side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#2D50A1] mb-2">Login</h1>
            <p className="text-gray-600">Welcome back — let's get organized.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your email"
                  {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message || "Invalid email format"}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full pl-10 pr-10 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                  placeholder="Enter your password"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2D50A1] focus:ring-[#2D50A1] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div> */}
              <div className="text-sm">
                <a href="#" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a]">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Sign In
            </button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/signup" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
                  Sign up here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image (visible only on desktop) */}
      <div className="hidden md:block md:w-1/2 bg-white relative">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <h1 className="text-4xl font-bold mb-4 text-center">SES Management System</h1>
          <p className="text-center text-gray-700 mb-8 max-w-md">
            Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
          </p>
          <img
            src="https://i.ibb.co/v45C18ZG/bg1.png"
            alt="SES Management System"
            className="max-w-full h-auto w-[500px]"
          />
        </div>
      </div>
    </div>
  );
}