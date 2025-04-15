import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Save, X, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from "../components/Loader";
import crypto from 'crypto-js';

const ProfileEditPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const fileInputRef = useRef(null);

  // Cloudinary credentials (replace with your actual API key and secret)
  const cloudName = 'diane1tak'; // From your screenshot
  const apiKey = '595487194871695'; // Replace with your Cloudinary API key
  const apiSecret = 'mxA23kc58ZihQbGwPuM5mNicdFo'; // Replace with your Cloudinary API secret
  const uploadPreset = 'sesmanagement';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:3000/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          reset(data.user);
        } else {
          toast.error('Failed to fetch user data');
          navigate('/Profile');
        }
      } catch (error) {
        toast.error('An error occurred while fetching user data');
        navigate('/Profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [navigate, reset]);

  // Function to generate the signature for signed uploads
  const generateSignature = (paramsToSign, apiSecret) => {
    const sortedParams = Object.keys(paramsToSign).sort().reduce((acc, key) => {
      acc[key] = paramsToSign[key];
      return acc;
    }, {});
    const paramString = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&');
    const signature = crypto.SHA1(paramString + apiSecret).toString();
    return signature;
  };

  // Updated handleFileChange to include signature for signed preset
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Generate timestamp and signature
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = {
      timestamp,
      upload_preset: uploadPreset,
    };
    const signature = generateSignature(paramsToSign, apiSecret);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setUser(prev => ({ ...prev, picture: data.secure_url }));
        setValue("picture", data.secure_url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error(`Failed to upload image: ${data.error?.message || 'Unknown error'}`);
        console.error('Cloudinary response:', data);
      }
    } catch (error) {
      toast.error('An error occurred during image upload');
      console.error('Upload error:', error);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        toast.success('Profile updated successfully');
        navigate('/Profile');
      } else {
        const result = await response.json();
        toast.error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred while updating profile');
      console.error('Update error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
        <div className="w-full lg:w-3/5 lg:pr-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Profile</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group cursor-pointer"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <img
                src={user.picture || "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"}
                alt="Profile"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-medium">Change Photo</span>
              </div>
              <input 
                type="file" 
                accept="image/*"
                ref={fileInputRef} 
                onChange={handleFileChange}
                style={{ display: 'none' }} 
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user.officialEmail}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Official Email
              </p>
              <p className="font-medium text-gray-800">{user.officialEmail}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mt-2">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Role
              </p>
              <p className="font-medium text-gray-800">{user.role}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="firstName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("firstName", { required: "First name is required" })}
              />
              {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="lastName" className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("lastName", { required: "Last name is required" })}
              />
              {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="personalEmail" className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Personal Email
              </label>
              <input
                id="personalEmail"
                type="email"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("personalEmail")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="contactNumber" className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Tel #
              </label>
              <input
                id="contactNumber"
                type="tel"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("contactNumber", { required: "Contact number is required" })}
              />
              {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber.message}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="address" className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </label>
              <input
                id="address"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("address")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="jobStatus" className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Status
              </label>
              <input
                id="jobStatus"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("jobStatus")}
              />
            </div>

            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <label htmlFor="locationCountry" className="text-gray-500 text-sm flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Country
              </label>
              <input
                id="locationCountry"
                type="text"
                className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
                {...register("locationCountry")}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => navigate('/Profile')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
          <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Upcoming Events
          </h1>
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Tech fest</h2>
                <p className="text-blue-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tuesday, 20 March 2025
                </p>
              </div>
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src="https://i.ibb.co/1YSzM2hL/image-7.png"
                  alt="Tech fest event"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Tech Event
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">Kheil Tamasha</h2>
                <p className="text-blue-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Tuesday, 20 March 2025
                </p>
              </div>
              <div className="relative h-48 sm:h-56 w-full overflow-hidden">
                <img
                  src="https://i.ibb.co/Zs0rtgG/image-7-1.png"
                  alt="Kheil Tamasha event"
                  className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Games
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditPage;

















// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { Save, X, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
// import Loader from "../components/Loader";

// const ProfileEditPage = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const { register, handleSubmit, formState: { errors }, reset } = useForm();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const fetchUserData = async () => {
//       try {
//         const response = await fetch('http://localhost:3000/user/profile', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });
//         if (response.ok) {
//           const data = await response.json();
//           setUser(data.user);
//           reset(data.user);
//         } else {
//           toast.error('Failed to fetch user data');
//           navigate('/Profile');
//         }
//       } catch (error) {
//         toast.error('An error occurred while fetching user data');
//         navigate('/Profile');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, [navigate, reset]);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3000/user/profile', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify(data),
//       });
//       if (response.ok) {
//         toast.success('Profile updated successfully');
//         navigate('/Profile');
//       } else {
//         const result = await response.json();
//         toast.error(result.error || 'Failed to update profile');
//       }
//     } catch (error) {
//       toast.error('An error occurred while updating profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     );
//   }

//   if (!user) return null;

//   return (
//     <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
//       <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
//         {/* Profile Edit Section */}
//         <div className="w-full lg:w-3/5 lg:pr-8">
//           <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Profile</h1>

//           <div className="flex flex-wrap items-center gap-4 mb-8">
//             <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group">
//               <img
//                 src={user.picture || "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"}
//                 alt="Profile picture"
//                 className="object-cover w-full h-full"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
//                 <span className="text-white text-xs font-medium">Change Photo</span>
//               </div>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
//               <p className="text-gray-500 flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 {user.officialEmail}
//               </p>
//             </div>
//           </div>

//           {/* Read-only Fields */}
//           <div className="mb-6">
//             <div className="bg-gray-50 p-3 rounded-lg">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Official Email
//               </p>
//               <p className="font-medium text-gray-800">{user.officialEmail}</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg mt-2">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Role
//               </p>
//               <p className="font-medium text-gray-800">{user.role}</p>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="firstName" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("firstName", { required: "First name is required" })}
//               />
//               {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>}
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="lastName" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("lastName", { required: "Last name is required" })}
//               />
//               {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>}
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="personalEmail" className="text-gray-500 text-sm flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Personal Email
//               </label>
//               <input
//                 id="personalEmail"
//                 type="email"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("personalEmail")}
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="contactNumber" className="text-gray-500 text-sm flex items-center">
//                 <Phone className="w-4 h-4 mr-1" />
//                 Tel #
//               </label>
//               <input
//                 id="contactNumber"
//                 type="tel"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("contactNumber", { required: "Contact number is required" })}
//               />
//               {errors.contactNumber && <p className="mt-1 text-xs text-red-500">{errors.contactNumber.message}</p>}
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="address" className="text-gray-500 text-sm flex items-center">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 Address
//               </label>
//               <input
//                 id="address"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("address")}
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="jobStatus" className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Job Status
//               </label>
//               <input
//                 id="jobStatus"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("jobStatus")}
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="locationCountry" className="text-gray-500 text-sm flex items-center">
//                 <Flag className="w-4 h-4 mr-1" />
//                 Country
//               </label>
//               <input
//                 id="locationCountry"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("locationCountry")}
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="picture" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Picture URL
//               </label>
//               <input
//                 id="picture"
//                 type="text"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//                 {...register("picture")}
//               />
//             </div>

//             {/* <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="bio" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Bio
//               </label>
//               <textarea
//                 id="bio"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1 resize-y"
//                 rows="3"
//                 {...register("bio")}
//               ></textarea>
//             </div> */}

//             {/* Form Buttons */}
//             <div className="md:col-span-2 flex justify-end gap-4 mt-4">
//               <button
//                 type="button"
//                 onClick={() => navigate('/Profile')}
//                 className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
//               >
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Divider */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Upcoming Events Section */}
//         <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
//           <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center">
//             <Calendar className="mr-2 text-blue-600" />
//             Upcoming Events
//           </h1>
//           <div className="space-y-6">
//             <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
//               <div className="p-6 bg-white">
//                 <h2 className="text-2xl font-bold text-gray-800">Tech fest</h2>
//                 <p className="text-blue-600 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Tuesday, 20 March 2025
//                 </p>
//               </div>
//               <div className="relative h-48 sm:h-56 w-full overflow-hidden">
//                 <img
//                   src="https://i.ibb.co/1YSzM2hL/image-7.png"
//                   alt="Tech fest event"
//                   className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
//                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   Tech Event
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
//               <div className="p-6 bg-white">
//                 <h2 className="text-2xl font-bold text-gray-800">Kheil Tamasha</h2>
//                 <p className="text-blue-600 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Tuesday, 20 March 2025
//                 </p>
//               </div>
//               <div className="relative h-48 sm:h-56 w-full overflow-hidden">
//                 <img
//                   src="https://i.ibb.co/Zs0rtgG/image-7-1.png"
//                   alt="Kheil Tamasha event"
//                   className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
//                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   Games
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileEditPage;
















// import { Save, X, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react"

// const ProfileEditPage = () => {
//   return (
//     <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
//       <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
//         {/* Profile Section - 3/5 width on large screens */}
//         <div className="w-full lg:w-3/5 lg:pr-8">
//           <h1 className="text-4xl font-bold mb-6 text-gray-800">Edit Profile</h1>

//           <div className="flex flex-wrap items-center gap-4 mb-8">
//             <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group">
//               <img
//                 src="https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"
//                 alt="Profile picture"
//                 className="object-cover w-full h-full"
//               />
//               <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
//                 <span className="text-white text-xs font-medium">Change Photo</span>
//               </div>
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Subhan Ali</h2>
//               <p className="text-gray-500 flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Subhanali@uog.edu.pk
//               </p>
//             </div>
//           </div>

//           <form className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="firstName" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 defaultValue="Subhan Ali"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="lastName" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 defaultValue="Ali Raza"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="gender" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Gender
//               </label>
//               <input
//                 id="gender"
//                 type="text"
//                 defaultValue="21012298-001@uog.edu.pk"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="country" className="text-gray-500 text-sm flex items-center">
//                 <Flag className="w-4 h-4 mr-1" />
//                 Country
//               </label>
//               <input
//                 id="country"
//                 type="text"
//                 defaultValue="21012298-001"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="jobStatus" className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Job Status
//               </label>
//               <input
//                 id="jobStatus"
//                 type="text"
//                 defaultValue="Male"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="rollNo" className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Roll No
//               </label>
//               <input
//                 id="rollNo"
//                 type="text"
//                 defaultValue="Pakistan"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="role" className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Role
//               </label>
//               <input
//                 id="role"
//                 type="text"
//                 defaultValue="Role"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="email" className="text-gray-500 text-sm flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 defaultValue="Job status"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="address" className="text-gray-500 text-sm flex items-center">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 Address
//               </label>
//               <input
//                 id="address"
//                 type="text"
//                 defaultValue="ABC street, Gujrat, Pakistan"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <label htmlFor="tel" className="text-gray-500 text-sm flex items-center">
//                 <Phone className="w-4 h-4 mr-1" />
//                 Tel #
//               </label>
//               <input
//                 id="tel"
//                 type="tel"
//                 defaultValue="+92 310 1234567"
//                 className="w-full bg-transparent font-medium text-gray-800 focus:outline-none mt-1"
//               />
//             </div>

//             {/* Form Buttons */}
//             <div className="md:col-span-2 flex justify-end gap-4 mt-4">
//               <button
//                 type="button"
//                 className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
//               >
//                 <Save className="w-4 h-4" />
//                 Save Changes
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Divider - Using the provided image URL */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Upcoming Events Section - 2/5 width on large screens */}
//         <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
//           <h1 className="text-4xl font-bold mb-6 text-gray-800 flex items-center">
//             <Calendar className="mr-2 text-blue-600" />
//             Upcoming Events
//           </h1>

//           <div className="space-y-6">
//             <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
//               <div className="p-6 bg-white">
//                 <h2 className="text-2xl font-bold text-gray-800">Tech fest</h2>
//                 <p className="text-blue-600 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Tuesday, 20 March 2025
//                 </p>
//               </div>
//               <div className="relative h-48 sm:h-56 w-full overflow-hidden">
//                 <img
//                   src="https://i.ibb.co/1YSzM2hL/image-7.png"
//                   alt="Tech fest event"
//                   className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
//                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   Tech Event
//                 </div>
//               </div>
//             </div>

//             <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
//               <div className="p-6 bg-white">
//                 <h2 className="text-2xl font-bold text-gray-800">Kheil Tamasha</h2>
//                 <p className="text-blue-600 flex items-center">
//                   <Calendar className="w-4 h-4 mr-1" />
//                   Tuesday, 20 March 2025
//                 </p>
//               </div>
//               <div className="relative h-48 sm:h-56 w-full overflow-hidden">
//                 <img
//                   src="https://i.ibb.co/Zs0rtgG/image-7-1.png"
//                   alt="Kheil Tamasha event"
//                   className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
//                 <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   Games
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ProfileEditPage
