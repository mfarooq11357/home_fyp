"use client"

import { useLocation, useNavigate } from "react-router-dom"
import { MessageCircle, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react"

const PublicProfilePage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const user = location.state?.user

  if (!user) {
    return <p>User not found</p>
  }

  const handleChatClick = () => {
    navigate(`/chat`, { state: { selectedUser: user } })
  }

  return (
    <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
        {/* Profile Section - 3/5 width on large screens */}
        <div className="w-full lg:w-3/5 lg:pr-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">My Profile</h1>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
              <img
                src={user.picture || "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"}
                alt="Profile picture"
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500 flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                {user.officialEmail}
              </p>
            </div>
            <button
              onClick={handleChatClick}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                First Name
              </p>
              <p className="font-medium text-gray-800">{user.firstName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover那么，p-4 hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Last Name
              </p>
              <p className="font-medium text-gray-800">{user.lastName}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Gender
              </p>
              <p className="font-medium text-gray-800">{user.gender || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Flag className="w-4 h-4 mr-1" />
                Country
              </p>
              <p className="font-medium text-gray-800">{user.locationCountry || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Job Status
              </p>
              <p className="font-medium text-gray-800">{user.jobStatus || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <User className="w-4 h-4 mr-1" />
                Roll No
              </p>
              <p className="font-medium text-gray-800">{user.rollNo}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                Role
              </p>
              <p className="font-medium text-gray-800">{user.role}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Mail className="w-4 h-4 mr-1" />
                Email
              </p>
              <p className="font-medium text-gray-800">{user.officialEmail}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Address
              </p>
              <p className="font-medium text-gray-800">{user.address || "N/A"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
              <p className="text-gray-500 text-sm flex items-center">
                <Phone className="w-4 h-4 mr-1" />
                Tel #
              </p>
              <p className="font-medium text-gray-800">{user.contactNumber || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Divider - Using the provided image URL */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Upcoming Events Section - 2/5 width on large screens */}
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
  )
}

export default PublicProfilePage


















// import { MessageCircle, Calendar, MapPin, Phone, Mail, User, Briefcase, Flag } from "lucide-react"

// const PublicProfilePage = () => {
//   return (
//     <div className="container mx-auto pt-12 py-6 px-4 min-h-screen">
//       <div className="flex flex-col lg:flex-row gap-8 relative bg-white p-6">
//         {/* Profile Section - 3/5 width on large screens */}
//         <div className="w-full lg:w-3/5 lg:pr-8">
//           <h1 className="text-4xl font-bold mb-6 text-gray-800">My Profile</h1>

//           <div className="flex flex-wrap items-center gap-4 mb-8">
//             <div className="relative h-24 w-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
//               <img
//                 src="https://i.ibb.co/ksKn2gWQ/Ellipse-1.png"
//                 alt="Profile picture"
//                 className="object-cover w-full h-full"
//               />
//             </div>
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800">Subhan Ali</h2>
//               <p className="text-gray-500 flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Subhanali@uog.edu.pk
//               </p>
//             </div>
//             <button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
//               <MessageCircle className="w-5 h-5" />
//               <span className="font-medium">Chat</span>
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 First Name
//               </p>
//               <p className="font-medium text-gray-800">Subhan Ali</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Last Name
//               </p>
//               <p className="font-medium text-gray-800">Ali Raza</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Gender
//               </p>
//               <p className="font-medium text-gray-800">21012298-001@uog.edu.pk</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Flag className="w-4 h-4 mr-1" />
//                 Country
//               </p>
//               <p className="font-medium text-gray-800">21012298-001</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Job Status
//               </p>
//               <p className="font-medium text-gray-800">Male</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <User className="w-4 h-4 mr-1" />
//                 Roll No
//               </p>
//               <p className="font-medium text-gray-800">Pakistan</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Briefcase className="w-4 h-4 mr-1" />
//                 Role
//               </p>
//               <p className="font-medium text-gray-800">Role</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Mail className="w-4 h-4 mr-1" />
//                 Email
//               </p>
//               <p className="font-medium text-gray-800">Job status</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <MapPin className="w-4 h-4 mr-1" />
//                 Address
//               </p>
//               <p className="font-medium text-gray-800">ABC street, Gujrat, Pakistan</p>
//             </div>
//             <div className="bg-gray-50 p-3 rounded-lg hover:shadow-md transition-all">
//               <p className="text-gray-500 text-sm flex items-center">
//                 <Phone className="w-4 h-4 mr-1" />
//                 Tel #
//               </p>
//               <p className="font-medium text-gray-800">+92 310 1234567</p>
//             </div>
//           </div>
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

// export default PublicProfilePage
