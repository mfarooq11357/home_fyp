import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, BadgeIcon } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const signupData = {
        firstName: data.firstName,
        lastName: data.lastName,
        officialEmail: data.email,
        contactNumber: data.contactNo,
        gender: data.gender,
        password: data.password,
      };
      const response = await fetch('http://localhost:3000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        if (result.isOtpVerified) {
          toast.success('Signup successful');
          navigate('/Profile');
        } else {
          await sendOtp(result.token);
          setOtpSent(true);
          toast.success('OTP sent to your email');
        }
      } else {
        toast.error(result.error || 'Signup failed');
      }
    } catch (error) {
      toast.error('An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/user/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to send OTP');
    } catch (error) {
      toast.error('Failed to send OTP');
      throw error;
    }
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ otp }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('isOtpVerified', 'true');
        toast.success('OTP verified successfully');
        navigate('/Profile');
      } else {
        toast.error(result.error || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('An error occurred during OTP verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="flex flex-col min-h-screen md:flex-row">
        {/* Left side - Image and Title (hidden on mobile) */}
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

        {/* Image Section - Top on mobile */}
        <div className="w-full md:hidden">
          <div className="p-8 flex flex-col items-center justify-center">
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

        {/* Right side - Registration Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
          <div className="w-full bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[#2D50A1] mb-2">Registration Form</h1>
              <p className="text-gray-600 text-sm">Fill in the form carefully for registration</p>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.firstName ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="First name"
                        {...register("firstName", { required: "First name is required" })}
                      />
                      {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.lastName ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="Last name"
                        {...register("lastName", { required: "Last name is required" })}
                      />
                      {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="Email address"
                        {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">{errors.email.message || "Invalid email format"}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
                      Roll No
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BadgeIcon size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="rollNo"
                        type="text"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.rollNo ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="Roll number"
                        {...register("rollNo", { required: "Roll number is required" })}
                      />
                      {errors.rollNo && <p className="mt-1 text-xs text-red-500">{errors.rollNo.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-500" />
                      </div>
                      <select
                        id="gender"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.gender ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200 bg-white`}
                        {...register("gender", { required: "Gender is required" })}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Briefcase size={16} className="text-gray-500" />
                      </div>
                      <select
                        id="role"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.role ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200 bg-white`}
                        {...register("role", { required: "Role is required" })}
                      >
                        <option value="">Select role</option>
                        <option value="user">Student</option>
                        <option value="manager">Alumni</option>
                      </select>
                      {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                      Contact No
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="contactNo"
                        type="tel"
                        className={`w-full pl-10 pr-4 py-2 border ${
                          errors.contactNo ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="Contact number"
                        {...register("contactNo", { required: "Contact number is required" })}
                      />
                      {errors.contactNo && <p className="mt-1 text-xs text-red-500">{errors.contactNo.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-500" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className={`w-full pl-10 pr-10 py-2 border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
                        placeholder="Create password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                        })}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                      {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center mt-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 text-[#2D50A1] focus:ring-[#2D50A1] border-gray-300 rounded"
                    {...register("terms", { required: "You must agree to the terms and conditions" })}
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-[#2D50A1] hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

                <button
                  type="submit"
                  className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                >
                  Submit
                </button>

                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#2D50A1] text-center">Verify OTP</h2>
                <p className="text-gray-600 text-sm text-center">Enter the 6-digit OTP sent to your email</p>
                <div className="flex justify-center gap-2">
                  {otpValues.map((value, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200"
                    />
                  ))}
                </div>
                <button
                  onClick={verifyOtp}
                  className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg mt-4"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SignupPage;

















// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff, Mail, Lock, User, Phone, Briefcase, BadgeIcon } from 'lucide-react';
// import { Link } from "react-router-dom";

// function SignupPage() {
//   const [showPassword, setShowPassword] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = (data) => {
//     console.log(data);
//     // Handle form submission
//   };

//   return (
//     <div className="flex flex-col min-h-screen md:flex-row">
//       {/* Left side - Image and Title (hidden on mobile) */}
//       <div className="hidden md:block md:w-1/2 bg-white relative">
//         <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
//           <h1 className="text-4xl font-bold mb-4 text-center">SES Management System</h1>
//           <p className="text-center text-gray-700 mb-8 max-w-md">
//             Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
//           </p>
//           <img
//             src="https://i.ibb.co/v45C18ZG/bg1.png"
//             alt="SES Management System"
//             className="max-w-full h-auto w-[500px]"
//           />
//         </div>
//       </div>

//       {/* Image Section - Top on mobile */}
//       <div className="w-full md:hidden">
//         <div className="p-8 flex flex-col items-center justify-center">
//           <h1 className="text-3xl font-bold mb-2 text-center">SES Management System</h1>
//           <p className="text-center text-gray-700 mb-4 max-w-md text-sm">
//             Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
//           </p>
//           <img
//             src="https://i.ibb.co/v45C18ZG/bg1.png"
//             alt="SES Management System"
//             className="max-w-full h-auto w-[300px]"
//           />
//         </div>
//       </div>

//       {/* Right side - Registration Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
//         <div className="w-full bg-white rounded-lg shadow-md p-6 md:p-8">
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-bold text-[#2D50A1] mb-2">Registration Form</h1>
//             <p className="text-gray-600 text-sm">Fill in the form carefully for registration</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                   First Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="firstName"
//                     type="text"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.firstName ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="First name"
//                     {...register("firstName", { required: "First name is required" })}
//                   />
//                   {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
//                   Last Name
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="lastName"
//                     type="text"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.lastName ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="Last name"
//                     {...register("lastName", { required: "Last name is required" })}
//                   />
//                   {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="email"
//                     type="email"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.email ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="Email address"
//                     {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
//                   />
//                   {errors.email && (
//                     <p className="mt-1 text-xs text-red-500">{errors.email.message || "Invalid email format"}</p>
//                   )}
//                 </div>
//               </div>


//                             <div className="space-y-2">
//                 <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700">
//                   Roll No
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <BadgeIcon size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="rollNo"
//                     type="text"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.rollNo ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="Roll number"
//                     {...register("rollNo", { required: "Roll number is required" })}
//                   />
//                   {errors.rollNo && <p className="mt-1 text-xs text-red-500">{errors.rollNo.message}</p>}
//                 </div>
//               </div>

//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
//                   Gender
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User size={16} className="text-gray-500" />
//                   </div>
//                   <select
//                     id="gender"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.gender ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200 bg-white`}
//                     {...register("gender", { required: "Gender is required" })}
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </select>
//                   {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender.message}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                   Role
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Briefcase size={16} className="text-gray-500" />
//                   </div>
//                   <select
//                     id="role"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.role ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200 bg-white`}
//                     {...register("role", { required: "Role is required" })}
//                   >
//                     <option value="">Select role</option>
//                     {/* <option value="admin">Admin</option> */}
//                     <option value="user">Student</option>
//                     <option value="manager">Alumni</option>
//                   </select>
//                   {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div className="space-y-2">
//                 <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
//                   Contact No
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Phone size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="contactNo"
//                     type="tel"
//                     className={`w-full pl-10 pr-4 py-2 border ${
//                       errors.contactNo ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="Contact number"
//                     {...register("contactNo", { required: "Contact number is required" })}
//                   />
//                   {errors.contactNo && <p className="mt-1 text-xs text-red-500">{errors.contactNo.message}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock size={16} className="text-gray-500" />
//                   </div>
//                   <input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     className={`w-full pl-10 pr-10 py-2 border ${
//                       errors.password ? "border-red-500" : "border-gray-300"
//                     } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                     placeholder="Create password"
//                     {...register("password", {
//                       required: "Password is required",
//                       minLength: {
//                         value: 8,
//                         message: "Password must be at least 8 characters",
//                       },
//                     })}
//                   />
//                   <button
//                     type="button"
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
//                   </button>
//                   {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
//                 </div>
//               </div>
//             </div>

//             <div className="flex items-center mt-4">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 className="h-4 w-4 text-[#2D50A1] focus:ring-[#2D50A1] border-gray-300 rounded"
//                 {...register("terms", { required: "You must agree to the terms and conditions" })}
//               />
//               <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
//                 I agree to the{" "}
//                 <a href="#" className="text-[#2D50A1] hover:underline">
//                   Terms and Conditions
//                 </a>
//               </label>
//             </div>
//             {errors.terms && <p className="mt-1 text-xs text-red-500">{errors.terms.message}</p>}

//             <button
//               type="submit"
//               className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg mt-4"
//             >
//               Submit
//             </button>

//             <div className="text-center mt-4">
//               <p className="text-sm text-gray-600">
//                 Already have an account?{" "}
//                 <Link to="/login" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
//                   Sign in here
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SignupPage;
