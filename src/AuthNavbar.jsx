"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "./redux/authSlice";

const AuthNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState();
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const dispatch = useDispatch();

  // Toggle handlers
  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMobileDropdown = () => setShowMobileDropdown(!showMobileDropdown);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isOtpVerified");
    localStorage.removeItem("user"); // Remove user details from storage
    dispatch(logout());
  };

  // Load user details from localStorage (assuming they were saved after login)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Hide dropdown if click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;
  const navLinkClass =
    "relative font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors duration-200";

  // Fallback default image and name if no user details exist
  const userName = user?.firstName || "User Name";
  const userImage =
    user?.picture ; // Change default URL if needed

  return (
    <nav className="bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10">
            <img
              src="https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png"
              alt="SE Society Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold text-[#2D51A0]">SE Society</span>
        </Link>

        <div className="hidden md:flex items-center">
          <div className="flex space-x-8 mr-8">
          <Link
              to="/feed"
              className={`${navLinkClass} ${
                isActive("/feed") &&
                "border-b-2 border-blue-600 text-blue-600"
              }`}
            >
              Feed
            </Link>
            <Link
              to="/alumni"
              className={`${navLinkClass} ${
                isActive("/alumni") &&
                "border-b-2 border-blue-600 text-blue-600"
              }`}
            >
              Alumni
            </Link>
            <Link
              to="/allusers"
              className={`${navLinkClass} ${
                isActive("/allusers") &&
                "border-b-2 border-blue-600 text-blue-600"
              }`}
            >
              Users
            </Link>
            <Link
              to="/events"
              className={`${navLinkClass} ${
                isActive("/events") &&
                "border-b-2 border-blue-600 text-blue-600"
              }`}
            >
              Events
            </Link>
            <Link
              to="/chat"
              className={`${navLinkClass} ${
                isActive("/chat") &&
                "border-b-2 border-blue-600 text-blue-600"
              }`}
            >
              Chats
            </Link>
          </div>

          <div className="mr-6">
            <Link
              to="/notifications"
              className="relative p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-6 w-6 text-gray-700" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                  {notificationCount}
                </span>
              )}
            </Link>
          </div>

          <div className="relative">
            <button
              ref={profileRef}
              onClick={toggleDropdown}
              className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-colors"
            >
              <span className="font-medium text-gray-800">{userName}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={userImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>

            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <Link
                  to="/Profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <Link
                  to="/request-certificate"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Certificate
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

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

          <div className="flex items-center gap-3 mt-8 mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={userImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-gray-800">{userName}</p>
              {/* Replace with dynamic email if you store it */}
              {/* <p className="text-sm text-gray-500">{user?.officialEmail || "user@example.com"}</p> */}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
          <Link
              to="/feed"
              className={`${navLinkClass} ${
                isActive("/feed") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg`}
              onClick={toggleMenu}
            >
              Feed
            </Link>
            <Link
              to="/alumni"
              className={`${navLinkClass} ${
                isActive("/alumni") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg`}
              onClick={toggleMenu}
            >
              Alumni
            </Link>
            <Link
              to="/allusers"
              className={`${navLinkClass} ${
                isActive("/allusers") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg`}
              onClick={toggleMenu}
            >
              Users
            </Link>
            <Link
              to="/events"
              className={`${navLinkClass} ${
                isActive("/events") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg`}
              onClick={toggleMenu}
            >
              Events
            </Link>
            <Link
              to="/chat"
              className={`${navLinkClass} ${
                isActive("/chat") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg`}
              onClick={toggleMenu}
            >
              Chats
            </Link>

            <Link
              to="/notifications"
              className={`${navLinkClass} ${
                isActive("/notifications") &&
                "border-b-2 border-blue-600 text-blue-600"
              } text-lg flex items-center`}
              onClick={toggleMenu}
            >
              Notifications
              {notificationCount > 0 && (
                <span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
                  {notificationCount}
                </span>
              )}
            </Link>

            <div className="pt-2">
              <button
                onClick={toggleMobileDropdown}
                className="flex items-center justify-between w-full text-lg font-medium"
              >
                <span>Settings</span>
                {showMobileDropdown ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {showMobileDropdown && (
                <div className="pl-4 mt-2 space-y-3">
                  <Link
                    to="/Profile"
                    className="flex items-center text-gray-700"
                    onClick={toggleMenu}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <Link
                    to="/request-certificate"
                    className="flex items-center text-gray-700"
                    onClick={toggleMenu}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Request Certificate
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full text-left text-red-600"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;































// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Link, useLocation } from "react-router-dom"
// import { Menu, X, Bell, Settings, LogOut, ChevronDown, ChevronUp ,FileText} from "lucide-react"

// const AuthNavbar = () => {
//   const [isOpen, setIsOpen] = useState(false)
//   const [showDropdown, setShowDropdown] = useState(false)
//   const [showMobileDropdown, setShowMobileDropdown] = useState(false)
//   const [notificationCount, setNotificationCount] = useState(3)
//   const dropdownRef = useRef(null)
//   const profileRef = useRef(null)
//   const location = useLocation()

//   const toggleMenu = () => setIsOpen(!isOpen)
//   const toggleDropdown = () => setShowDropdown(!showDropdown)
//   const toggleMobileDropdown = () => setShowMobileDropdown(!showMobileDropdown)

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         profileRef.current &&
//         !profileRef.current.contains(event.target)
//       ) {
//         setShowDropdown(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => document.removeEventListener("mousedown", handleClickOutside)
//   }, [])

//   // Function to determine if a link is active based on the current pathname
//   const isActive = (path) => location.pathname === path

//   // Common nav link class name with hover effect and active underline
//   const navLinkClass =
//     "relative font-medium border-b-2 border-transparent hover:border-blue-600 transition-colors duration-200"

//   return (
//     <nav className="bg-white shadow-sm px-4 py-3 sticky top-0 z-50">
//       <div className="mx-auto flex max-w-7xl items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2">
//           <div className="w-10 h-10">
//             <img
//               src="https://i.ibb.co/Z4Br5t0/image-removebg-preview-1.png"
//               alt="SE Society Logo"
//               className="w-full h-full object-contain"
//             />
//           </div>
//           <span className="text-xl font-bold text-[#2D51A0]">SE Society</span>
//         </Link>

//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center">
//           <div className="flex space-x-8 mr-8">
//             <Link
//               to="/alumni"
//               className={`${navLinkClass} ${isActive("/alumni") && "border-b-2 border-blue-600 text-blue-600"}`}
//             >
//               Alumni
//             </Link>
//             <Link
//               to="/allusers"
//               className={`${navLinkClass} ${isActive("/allusers") && "border-b-2 border-blue-600 text-blue-600"}`}
//             >
//               Users
//             </Link>
//             <Link
//               to="/events"
//               className={`${navLinkClass} ${isActive("/events") && "border-b-2 border-blue-600 text-blue-600"}`}
//             >
//               Events
//             </Link>
//             <Link
//               to="/chat"
//               className={`${navLinkClass} ${isActive("/") && "border-b-2 border-blue-600 text-blue-600"}`}
//             >
//               Chats
//             </Link>
//           </div>

//           {/* Notification Bell */}
//           <div className="mr-6">
//             <Link to="/notifications" className="relative p-1 rounded-full hover:bg-gray-100 transition-colors">
//               <Bell className="h-6 w-6 text-gray-700" />
//               {notificationCount > 0 && (
//                 <span className="absolute top-0 right-0 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
//                   {notificationCount}
//                 </span>
//               )}
//             </Link>
//           </div>

//           {/* User Profile with Dropdown */}
//           <div className="relative">
//             <button
//               ref={profileRef}
//               onClick={toggleDropdown}
//               className="flex items-center gap-2 hover:bg-gray-100 p-1 rounded-full transition-colors"
//             >
//               <span className="font-medium text-gray-800">Subhan Ali</span>
//               <div className="w-10 h-10 rounded-full overflow-hidden">
//                 <img
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20239210-emBk3bp67nIGSz6rzAxd7MQ9skkbfh.png"
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             </button>

//             {/* Desktop Dropdown Menu */}
//             {showDropdown && (
//               <div
//                 ref={dropdownRef}
//                 className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
//               >
//                 {/* <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                   Profile
//                 </Link> */}
//                 <Link to="/Profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                   <Settings className="h-4 w-4 mr-2" />
//                   Settings
//                 </Link>
//                 <Link
//                   to="/request-certificate"
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                 >
//                   <FileText className="h-4 w-4 mr-2" />
//                   Request Certificate
//                 </Link>
//                 <div className="border-t border-gray-100 my-1"></div>
//                 <button className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
//                   <LogOut className="h-4 w-4 mr-2" />
//                   Sign out
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Mobile Menu Button */}
//         <button onClick={toggleMenu} className="md:hidden text-gray-800 focus:outline-none" aria-label="Toggle menu">
//           {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//         </button>

//         {/* Mobile Menu */}
//         <div
//           className={`fixed inset-y-0 right-0 z-50 w-64 bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out transform ${
//             isOpen ? "translate-x-0" : "translate-x-full"
//           } md:hidden`}
//         >
//           <button
//             onClick={toggleMenu}
//             className="absolute top-4 right-4 text-gray-800 focus:outline-none"
//             aria-label="Close menu"
//           >
//             <X className="h-6 w-6" />
//           </button>

//           {/* Mobile User Profile */}
//           <div className="flex items-center gap-3 mt-8 mb-6 pb-4 border-b border-gray-200">
//             <div className="w-12 h-12 rounded-full overflow-hidden">
//               <img
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%20239210-emBk3bp67nIGSz6rzAxd7MQ9skkbfh.png"
//                 alt="Profile"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <div>
//               <p className="font-medium text-gray-800">Subhan Ali</p>
//               <p className="text-sm text-gray-500">Subhanali@uog.edu.pk</p>
//             </div>
//           </div>

//           <div className="flex flex-col space-y-4">
//             <Link
//               to="/alumni"
//               className={`${navLinkClass} ${isActive("/alumni") && "border-b-2 border-blue-600 text-blue-600"} text-lg`}
//               onClick={toggleMenu}
//             >
//               Alumni
//             </Link>
//             <Link
//               to="/allusers"
//               className={`${navLinkClass} ${isActive("/allusers") && "border-b-2 border-blue-600 text-blue-600"} text-lg`}
//               onClick={toggleMenu}
//             >
//               Users
//             </Link>
//             <Link
//               to="/events"
//               className={`${navLinkClass} ${isActive("/events") && "border-b-2 border-blue-600 text-blue-600"} text-lg`}
//               onClick={toggleMenu}
//             >
//               Events
//             </Link>
//             <Link
//               to="/chat"
//               className={`${navLinkClass} ${isActive("/chat") && "border-b-2 border-blue-600 text-blue-600"} text-lg`}
//               onClick={toggleMenu}
//             >
//               Chats
//             </Link>

//             <Link
//               to="/notifications"
//               className={`${navLinkClass} ${isActive("/notifications") && "border-b-2 border-blue-600 text-blue-600"} text-lg flex items-center`}
//               onClick={toggleMenu}
//             >
//               Notifications
//               {notificationCount > 0 && (
//                 <span className="ml-2 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-xs">
//                   {notificationCount}
//                 </span>
//               )}
//             </Link>

//             {/* Mobile Settings Dropdown */}
//             <div className="pt-2">
//               <button
//                 onClick={toggleMobileDropdown}
//                 className="flex items-center justify-between w-full text-lg font-medium"
//               >
//                 <span>Settings</span>
//                 {showMobileDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
//               </button>

//               {showMobileDropdown && (
//                 <div className="pl-4 mt-2 space-y-3">
//                   {/* <Link to="/profile" className="block text-gray-700" onClick={toggleMenu}>
//                     Profile
//                   </Link> */}
//                   <Link to="/Profile" className="flex items-center text-gray-700" onClick={toggleMenu}>
//                     <Settings className="h-4 w-4 mr-2" />
//                     Settings
//                   </Link>
//                   <Link to="/request-certificate" className="flex items-center text-gray-700" onClick={toggleMenu}>
//                     <FileText className="h-4 w-4 mr-2" />
//                     Request Certificate
//                   </Link>
//                   <button className="flex items-center w-full text-left text-red-600">
//                     <LogOut className="h-4 w-4 mr-2" />
//                     Sign out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   )
// }

// export default AuthNavbar
