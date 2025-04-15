"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Loader from "../components/Loader"

const AllUsersPage = () => {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState("all") // "all", "society member", "student"
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const usersPerPage = 8

  // Fetch users data from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        let url = `http://localhost:3000/user/searchByRole?page=${currentPage}&limit=${usersPerPage}`
        if (filter !== "all") {
          url += `&role=${encodeURIComponent(filter)}`
        }
        if (searchQuery) {
          url += `&name=${encodeURIComponent(searchQuery)}&rollNo=${encodeURIComponent(searchQuery)}`
        }
        const response = await fetch(url)
        const data = await response.json()
        setUsers(data.users || [])
        setTotalPages(data.totalPages || 1)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [currentPage, filter, searchQuery])

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  // Handle navigation to PublicProfilePage with user data
  const handleViewProfile = (user) => {
    navigate(`/PublicProfile`, { state: { user } })
  }

  // Render fixed number of rows (8), showing "No users found" if empty
  const renderRows = () => {
    const rows = []
    if (users.length === 0) {
      rows.push(
        <tr key={0} className="border-b hover:bg-gray-50">
          <td colSpan={5} className="p-4 text-center text-gray-600">
            No users found
          </td>
        </tr>
      )
      for (let i = 1; i < usersPerPage; i++) {
        rows.push(
          <tr key={i} className="border-b hover:bg-gray-50">
            <td className="p-4"></td>
            <td className="p-4"></td>
            <td className="p-4 hidden md:table-cell"></td>
            <td className="p-4 hidden md:table-cell"></td>
            <td className="p-4"></td>
          </tr>
        )
      }
    } else {
      for (let i = 0; i < usersPerPage; i++) {
        const user = users[i]
        rows.push(
          <tr key={i} className="border-b hover:bg-gray-50">
            <td className="p-4 font-medium">{user ? `${user.firstName} ${user.lastName}` : ""}</td>
            <td className="p-4 text-gray-600">{user ? user.rollNo : ""}</td>
            <td className="p-4 text-gray-600 hidden md:table-cell">{user ? user.officialEmail : ""}</td>
            <td className="p-4 text-gray-600 hidden md:table-cell">{user ? user.role : ""}</td>
            <td className="p-4">
              {user && (
                <button
                  onClick={() => handleViewProfile(user)}
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs transition-all transform hover:scale-105"
                >
                  <Eye size={12} className="inline mr-1" />
                  View
                </button>
              )}
            </td>
          </tr>
        )
      }
    }
    return rows
  }

  // Events data (static for now)
  const events = [
    {
      id: 1,
      title: "Tech fest",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/1YSzM2hL/image-7.png",
    },
    {
      id: 2,
      title: "Kheil Tamasha",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
    },
  ]

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <Loader />
        </div>
      )}
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Users Section - Increased width */}
          <div className="w-full lg:w-4/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-4xl font-bold mb-4 md:mb-0">Society Members</h1>
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
                Add new
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name or roll no"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-md ${
                    filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("society member")}
                  className={`px-4 py-2 rounded-md ${
                    filter === "society member" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Society Members
                </button>
                <button
                  onClick={() => handleFilterChange("student")}
                  className={`px-4 py-2 rounded-md ${
                    filter === "student" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Students
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-4 text-left font-medium text-gray-600">Name</th>
                      <th className="p-4 text-left font-medium text-gray-600">Roll No</th>
                      <th className="p-4 text-left font-medium text-gray-600 hidden md:table-cell">Email</th>
                      <th className="p-4 text-left font-medium text-gray-600 hidden md:table-cell">Role</th>
                      <th className="p-4 text-left font-medium text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>{renderRows()}</tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Divider - Hidden on mobile */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full">
              <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
            </div>
          </div>

          {/* Upcoming Events Section - Decreased width */}
          <div className="w-full lg:w-1/5 mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold mb-6">Upcoming Events:</h1>

            <div className="space-y-6">
              {events.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
                    <p className="text-blue-600 text-sm">{event.date}</p>
                  </div>
                  <div className="relative h-40 w-full overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AllUsersPage









// "use client"

// import { useState } from "react"
// import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"

// const AllUsersPage = () => {
//   const [currentPage, setCurrentPage] = useState(1)
//   const [filter, setFilter] = useState("all") // "all", "society", "students"
//   const usersPerPage = 8

//   // Sample users data
//   const allUsers = [
//     {
//       id: 1,
//       name: "Muhammad Farooq",
//       rollNo: "21011598-019",
//       email: "mfarooq@gmail.com",
//       role: "Student",
//       type: "student",
//     },
//     { id: 2, name: "Ayesha Khan", rollNo: "21011598-020", email: "akhan@gmail.com", role: "Student", type: "student" },
//     {
//       id: 3,
//       name: "Ali Hassan",
//       rollNo: "21011598-021",
//       email: "ahassan@gmail.com",
//       role: "Society Member",
//       type: "society",
//     },
//     {
//       id: 4,
//       name: "Fatima Zahra",
//       rollNo: "21011598-022",
//       email: "fzahra@gmail.com",
//       role: "Student",
//       type: "student",
//     },
//     {
//       id: 5,
//       name: "Usman Ali",
//       rollNo: "21011598-023",
//       email: "uali@gmail.com",
//       role: "Society Member",
//       type: "society",
//     },
//     { id: 6, name: "Sana Malik", rollNo: "21011598-024", email: "smalik@gmail.com", role: "Student", type: "student" },
//     {
//       id: 7,
//       name: "Imran Ahmed",
//       rollNo: "21011598-025",
//       email: "iahmed@gmail.com",
//       role: "Society Member",
//       type: "society",
//     },
//     { id: 8, name: "Zainab Bibi", rollNo: "21011598-026", email: "zbibi@gmail.com", role: "Student", type: "student" },
//     {
//       id: 9,
//       name: "Kamran Khan",
//       rollNo: "21011598-027",
//       email: "kkhan@gmail.com",
//       role: "Society Member",
//       type: "society",
//     },
//     {
//       id: 10,
//       name: "Nadia Jamil",
//       rollNo: "21011598-028",
//       email: "njamil@gmail.com",
//       role: "Student",
//       type: "student",
//     },
//     {
//       id: 11,
//       name: "Bilal Mahmood",
//       rollNo: "21011598-029",
//       email: "bmahmood@gmail.com",
//       role: "Society Member",
//       type: "society",
//     },
//     {
//       id: 12,
//       name: "Saima Nawaz",
//       rollNo: "21011598-030",
//       email: "snawaz@gmail.com",
//       role: "Student",
//       type: "student",
//     },
//   ]

//   // Filter users based on selected filter
//   const filteredUsers = filter === "all" ? allUsers : allUsers.filter((user) => user.type === filter)

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage
//   const indexOfFirstUser = indexOfLastUser - usersPerPage
//   const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
//   const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

//   // Reset to first page when filter changes
//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter)
//     setCurrentPage(1)
//   }

//   // Events data
//   const events = [
//     {
//       id: 1,
//       title: "Tech fest",
//       date: "Tuesday, 20 March 2025",
//       image: "https://i.ibb.co/1YSzM2hL/image-7.png",
//     },
//     {
//       id: 2,
//       title: "Kheil Tamasha",
//       date: "Tuesday, 20 March 2025",
//       image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
//     },
//   ]

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Users Section - Increased width */}
//         <div className="w-full lg:w-4/5">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//             <h1 className="text-4xl font-bold mb-4 md:mb-0">Society Members</h1>
//             <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md transition-all flex items-center gap-2 shadow-md hover:shadow-lg">
//               Add new
//             </button>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 mb-6">
//             <div className="relative flex-1">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => handleFilterChange("all")}
//                 className={`px-4 py-2 rounded-md ${
//                   filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => handleFilterChange("society")}
//                 className={`px-4 py-2 rounded-md ${
//                   filter === "society" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Society Members
//               </button>
//               <button
//                 onClick={() => handleFilterChange("student")}
//                 className={`px-4 py-2 rounded-md ${
//                   filter === "student" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}
//               >
//                 Students
//               </button>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50 border-b">
//                   <tr>
//                     <th className="p-4 text-left font-medium text-gray-600">Name</th>
//                     <th className="p-4 text-left font-medium text-gray-600">Roll No</th>
//                     <th className="p-4 text-left font-medium text-gray-600 hidden md:table-cell">Email</th>
//                     <th className="p-4 text-left font-medium text-gray-600 hidden md:table-cell">Role</th>
//                     <th className="p-4 text-left font-medium text-gray-600">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentUsers.map((user) => (
//                     <tr key={user.id} className="border-b hover:bg-gray-50">
//                       <td className="p-4 font-medium">{user.name}</td>
//                       <td className="p-4 text-gray-600">{user.rollNo}</td>
//                       <td className="p-4 text-gray-600 hidden md:table-cell">{user.email}</td>
//                       <td className="p-4 text-gray-600 hidden md:table-cell">{user.role}</td>
//                       <td className="p-4">
//                         <button className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded text-xs transition-all transform hover:scale-105">
//                           <Eye size={12} className="inline mr-1" />
//                           View
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           <div className="flex justify-center items-center gap-2">
//             <button
//               onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//               disabled={currentPage === 1}
//               className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
//             >
//               <ChevronLeft size={16} />
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <button
//                 key={page}
//                 onClick={() => setCurrentPage(page)}
//                 className={`w-8 h-8 rounded-md ${
//                   currentPage === page
//                     ? "bg-blue-600 text-white"
//                     : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
//                 }`}
//               >
//                 {page}
//               </button>
//             ))}
//             <button
//               onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 rounded-md border border-gray-300 disabled:opacity-50"
//             >
//               <ChevronRight size={16} />
//             </button>
//           </div>
//         </div>

//         {/* Divider - Hidden on mobile */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Upcoming Events Section - Decreased width */}
//         <div className="w-full lg:w-1/5 mt-8 lg:mt-0">
//           <h1 className="text-2xl font-bold mb-6">Upcoming Events:</h1>

//           <div className="space-y-6">
//             {events.map((event) => (
//               <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="p-4">
//                   <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
//                   <p className="text-blue-600 text-sm">{event.date}</p>
//                 </div>
//                 <div className="relative h-40 w-full overflow-hidden">
//                   <img
//                     src={event.image || "/placeholder.svg"}
//                     alt={event.title}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default AllUsersPage
