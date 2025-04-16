// pages/LoginPage.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    // Redirect to profile if already authenticated.
    if (isAuthenticated) {
      navigate('/Profile', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const loginData = {
        officialEmail: data.email,
        password: data.password,
      };
      const response = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        // Store user details so that the AuthNavbar (or others) can access properties like user.image
        localStorage.setItem('user', JSON.stringify(result.user));
        if (result.isOtpVerified) {
          localStorage.setItem('isOtpVerified', 'true');
          dispatch(login({ token: result.token, isOtpVerified: true }));
          toast.success('Login successful');
          navigate('/Profile', { replace: true });
        } else {
          await sendOtp(result.token);
          setOtpSent(true);
          toast.success('OTP sent to your email');
        }
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred during login');
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
        dispatch(login({ token, isOtpVerified: true }));
        toast.success('OTP verified successfully');
        navigate('/Profile', { replace: true });
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

        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#2D50A1] mb-2">Login</h1>
              <p className="text-gray-600">Welcome back — let's get organized.</p>
            </div>

            {!otpSent ? (
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
                      className={`w-full pl-10 pr-4 py-3 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
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
                      className={`w-full pl-10 pr-10 py-3 border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
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
                  <div className="text-sm">
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
                    <Link to="/signup" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-[#2D50A1] text-center">Verify OTP</h2>
                <p className="text-gray-600 text-center">Enter the 6-digit OTP sent to your email</p>
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
                  className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Verify OTP
                </button>
              </div>
            )}
          </div>
        </div>

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
    </>
  );
}






























// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
// import Loader from "../components/Loader";

// export default function LoginPage() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const loginData = {
//         officialEmail: data.email,
//         password: data.password,
//       };
//       const response = await fetch('http://localhost:3000/user/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginData),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         localStorage.setItem('token', result.token);
//         if (result.isOtpVerified) {
//           toast.success('Login successful');
//           navigate('/Profile');
//         } else {
//           await sendOtp(result.token);
//           setOtpSent(true);
//           toast.success('OTP sent to your email');
//         }
//       } else {
//         toast.error(result.error || 'Login failed');
//       }
//     } catch (error) {
//       toast.error('An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendOtp = async (token) => {
//     try {
//       const response = await fetch('http://localhost:3000/user/send-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error('Failed to send OTP');
//     } catch (error) {
//       toast.error('Failed to send OTP');
//       throw error;
//     }
//   };

//   const handleOtpChange = (index, value) => {
//     if (/^\d?$/.test(value)) {
//       const newOtpValues = [...otpValues];
//       newOtpValues[index] = value;
//       setOtpValues(newOtpValues);
//       if (value && index < 5) {
//         document.getElementById(`otp-${index + 1}`).focus();
//       }
//     }
//   };

//   const verifyOtp = async () => {
//     setLoading(true);
//     const otp = otpValues.join('');
//     if (otp.length !== 6) {
//       toast.error('Please enter a 6-digit OTP');
//       setLoading(false);
//       return;
//     }
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3000/user/verify-otp', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ otp }),
//       });
//       const result = await response.json();
//       if (response.ok) {
//         localStorage.setItem('isOtpVerified', 'true');
//         toast.success('OTP verified successfully');
//         navigate('/Profile');
//       } else {
//         toast.error(result.error || 'Invalid OTP');
//       }
//     } catch (error) {
//       toast.error('An error occurred during OTP verification');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {loading && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <Loader />
//         </div>
//       )}
//       <div className="flex flex-col min-h-screen md:flex-row">
//         {/* Image Section - Top on mobile, Right on desktop */}
//         <div className="w-full md:hidden">
//           <div className="p-8 flex flex-col items-center justify-center">
//             <h1 className="text-3xl font-bold mb-2 text-center">SES Management System</h1>
//             <p className="text-center text-gray-700 mb-4 max-w-md text-sm">
//               Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
//             </p>
//             <img
//               src="https://i.ibb.co/v45C18ZG/bg1.png"
//               alt="SES Management System"
//               className="max-w-full h-auto w-[300px]"
//             />
//           </div>
//         </div>

//         {/* Left side - Login Form */}
//         <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
//           <div className="w-full max-w-md">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold text-[#2D50A1] mb-2">Login</h1>
//               <p className="text-gray-600">Welcome back — let's get organized.</p>
//             </div>

//             {!otpSent ? (
//               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//                 <div className="space-y-2">
//                   <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                     Email
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail size={18} className="text-gray-500" />
//                     </div>
//                     <input
//                       id="email"
//                       type="email"
//                       className={`w-full pl-10 pr-4 py-3 border ${
//                         errors.email ? "border-red-500" : "border-gray-300"
//                       } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                       placeholder="Enter your email"
//                       {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
//                     />
//                     {errors.email && (
//                       <p className="mt-1 text-xs text-red-500">{errors.email.message || "Invalid email format"}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <div className="relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock size={18} className="text-gray-500" />
//                     </div>
//                     <input
//                       id="password"
//                       type={showPassword ? "text" : "password"}
//                       className={`w-full pl-10 pr-10 py-3 border ${
//                         errors.password ? "border-red-500" : "border-gray-300"
//                       } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                       placeholder="Enter your password"
//                       {...register("password", { required: "Password is required" })}
//                     />
//                     <button
//                       type="button"
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                       onClick={() => setShowPassword(!showPassword)}
//                     >
//                       {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                     </button>
//                     {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="text-sm">
//                     {/* <a href="#" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a]">
//                       Forgot password?
//                     </a> */}
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
//                 >
//                   Sign In
//                 </button>

//                 <div className="text-center mt-4">
//                   <p className="text-sm text-gray-600">
//                     Don't have an account?{" "}
//                     <Link to="/signup" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
//                       Sign up here
//                     </Link>
//                   </p>
//                 </div>
//               </form>
//             ) : (
//               <div className="space-y-6">
//                 <h2 className="text-3xl font-bold text-[#2D50A1] text-center">Verify OTP</h2>
//                 <p className="text-gray-600 text-center">Enter the 6-digit OTP sent to your email</p>
//                 <div className="flex justify-center gap-2">
//                   {otpValues.map((value, index) => (
//                     <input
//                       key={index}
//                       id={`otp-${index}`}
//                       type="text"
//                       maxLength="1"
//                       value={value}
//                       onChange={(e) => handleOtpChange(index, e.target.value)}
//                       className="w-12 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200"
//                     />
//                   ))}
//                 </div>
//                 <button
//                   onClick={verifyOtp}
//                   className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
//                 >
//                   Verify OTP
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right side - Image (visible only on desktop) */}
//         <div className="hidden md:block md:w-1/2 bg-white relative">
//           <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
//             <h1 className="text-4xl font-bold mb-4 text-center">SES Management System</h1>
//             <p className="text-center text-gray-700 mb-8 max-w-md">
//               Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications
//             </p>
//             <img
//               src="https://i.ibb.co/v45C18ZG/bg1.png"
//               alt="SES Management System"
//               className="max-w-full h-auto w-[500px]"
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// export default function LoginPage() {
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
//       {/* Image Section - Top on mobile, Right on desktop */}
//       <div className="w-full md:hidden">
//         <div className=" p-8 flex flex-col items-center justify-center">
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

//       {/* Left side - Login Form */}
//       <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
//         <div className="w-full max-w-md">
//           <div className="text-center mb-8">
//             <h1 className="text-3xl font-bold text-[#2D50A1] mb-2">Login</h1>
//             <p className="text-gray-600">Welcome back — let's get organized.</p>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div className="space-y-2">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail size={18} className="text-gray-500" />
//                 </div>
//                 <input
//                   id="email"
//                   type="email"
//                   className={`w-full pl-10 pr-4 py-3 border ${
//                     errors.email ? "border-red-500" : "border-gray-300"
//                   } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                   placeholder="Enter your email"
//                   {...register("email", { required: "Email is required", pattern: /^\S+@\S+$/i })}
//                 />
//                 {errors.email && (
//                   <p className="mt-1 text-xs text-red-500">{errors.email.message || "Invalid email format"}</p>
//                 )}
//               </div>
//             </div>

//             <div className="space-y-2">
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock size={18} className="text-gray-500" />
//                 </div>
//                 <input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   className={`w-full pl-10 pr-10 py-3 border ${
//                     errors.password ? "border-red-500" : "border-gray-300"
//                   } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:border-transparent transition-all duration-200`}
//                   placeholder="Enter your password"
//                   {...register("password", { required: "Password is required" })}
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                 </button>
//                 {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               {/* <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-[#2D50A1] focus:ring-[#2D50A1] border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div> */}
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a]">
//                   Forgot password?
//                 </a>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-[#2D50A1] text-white py-3 rounded-md hover:bg-[#1e3a7a] focus:outline-none focus:ring-2 focus:ring-[#2D50A1] focus:ring-opacity-50 transform hover:scale-[1.02] transition-all duration-200 shadow-md hover:shadow-lg"
//             >
//               Sign In
//             </button>

//             <div className="text-center mt-4">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{" "}
//                 <a href="/signup" className="font-medium text-[#2D50A1] hover:text-[#1e3a7a] hover:underline">
//                   Sign up here
//                 </a>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Right side - Image (visible only on desktop) */}
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
//     </div>
//   );
// }