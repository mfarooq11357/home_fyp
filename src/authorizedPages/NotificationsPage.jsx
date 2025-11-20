"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const NotificationsPage = () => {
  const [requests, setRequests] = useState([])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found. Please log in as admin.")
          return
        }

        const response = await fetch(
          "https://ses-management-system-nu.vercel.app/event-registration-requests/requests",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        const data = await response.json()
        if (response.ok) {
          setRequests(data.requests || [])
        } else {
          console.error("Failed to fetch requests:", data.error)
        }
      } catch (error) {
        console.error("Error fetching registration requests:", error)
      }
    }
    fetchRequests()
  }, [])

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://ses-management-system-nu.vercel.app/event-registration-requests/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "accepted" }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId))
        toast.success("Request accepted successfully.")
      } else {
        toast.error(data.error || "Failed to accept request.")
      }
    } catch (error) {
      console.error("Error accepting request:", error)
      toast.error("An error occurred while accepting the request.")
    }
  }

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(
        `https://ses-management-system-nu.vercel.app/event-registration-requests/requests/${requestId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      )
      const data = await response.json()
      if (response.ok) {
        setRequests(requests.filter((req) => req._id !== requestId))
        toast.success("Request rejected successfully.")
      } else {
        toast.error(data.error || "Failed to reject request.")
      }
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("An error occurred while rejecting the request.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ToastContainer />
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6 text-blue-600" />
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {requests.length > 0 ? (
            requests.map((request) => (
              <div
                key={request._id}
                className="p-4 sm:p-6 flex gap-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  <img
                    src={
                      request.userId.picture ||
                      "https://www.gravatar.com/avatar/?d=mp"
                    }
                    alt={`${request.userId.firstName} ${request.userId.lastName}`}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700">
                    <span className="font-semibold">
                      {request.userId.firstName} {request.userId.lastName}
                    </span>{" "}
                    (Roll No: {request.userId.rollNo}) has requested to register
                    for the event{" "}
                    <span className="font-semibold">{request.eventId.name}</span>.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleAccept(request._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No pending requests
              </h3>
              <p className="text-gray-500">
                There are no registration requests to review at this time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage

























// "use client"

// import { useState } from "react"
// import { Bell, Check, Calendar, User, MessageCircle, Info, X } from "lucide-react"

// const NotificationsPage = () => {
//   // Sample notifications data
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       type: "event",
//       title: "Tech Fest 2024",
//       message: "New event has been scheduled for next week. Don't miss out!",
//       time: "2 hours ago",
//       read: false,
//     },
//     {
//       id: 2,
//       type: "message",
//       title: "New message from Ali Hassan",
//       message: "Hey, I wanted to ask about the upcoming project deadline...",
//       time: "Yesterday",
//       read: false,
//     },
//     {
//       id: 3,
//       type: "user",
//       title: "Profile update",
//       message: "Your profile has been successfully updated.",
//       time: "2 days ago",
//       read: true,
//     },
//     {
//       id: 4,
//       type: "info",
//       title: "System maintenance",
//       message: "The system will be under maintenance on Sunday from 2 AM to 4 AM.",
//       time: "3 days ago",
//       read: true,
//     },
//     {
//       id: 5,
//       type: "event",
//       title: "Kheil Tamasha",
//       message: "You have been invited to participate in the Kheil Tamasha event.",
//       time: "1 week ago",
//       read: true,
//     },
//   ])

//   // Mark a notification as read
//   const markAsRead = (id) => {
//     setNotifications(
//       notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
//     )
//   }

//   // Mark all notifications as read
//   const markAllAsRead = () => {
//     setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
//   }

//   // Delete a notification
//   const deleteNotification = (id) => {
//     setNotifications(notifications.filter((notification) => notification.id !== id))
//   }

//   // Get icon based on notification type
//   const getIcon = (type) => {
//     switch (type) {
//       case "event":
//         return <Calendar className="h-6 w-6 text-blue-600" />
//       case "message":
//         return <MessageCircle className="h-6 w-6 text-green-600" />
//       case "user":
//         return <User className="h-6 w-6 text-purple-600" />
//       case "info":
//         return <Info className="h-6 w-6 text-yellow-600" />
//       default:
//         return <Bell className="h-6 w-6 text-gray-600" />
//     }
//   }

//   // Count unread notifications
//   const unreadCount = notifications.filter((notification) => !notification.read).length

//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-gray-200">
//           <div className="flex items-center gap-2">
//             <Bell className="h-6 w-6 text-blue-600" />
//             <h1 className="text-2xl font-bold">Notifications</h1>
//             {unreadCount > 0 && (
//               <span className="bg-red-500 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">
//                 {unreadCount} new
//               </span>
//             )}
//           </div>
//           <button
//             onClick={markAllAsRead}
//             className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//           >
//             <Check className="h-4 w-4 mr-1" />
//             Mark all as read
//           </button>
//         </div>

//         {/* Notifications List */}
//         <div className="divide-y divide-gray-100">
//           {notifications.length > 0 ? (
//             notifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`p-4 sm:p-6 flex gap-4 ${
//                   !notification.read ? "bg-blue-50" : "bg-white"
//                 } hover:bg-gray-50 transition-colors`}
//               >
//                 <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
//                 <div className="flex-grow">
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-semibold text-gray-900">{notification.title}</h3>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-gray-500">{notification.time}</span>
//                       {!notification.read && (
//                         <button
//                           onClick={() => markAsRead(notification.id)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="Mark as read"
//                         >
//                           <Check className="h-4 w-4" />
//                         </button>
//                       )}
//                       <button
//                         onClick={() => deleteNotification(notification.id)}
//                         className="text-gray-400 hover:text-red-500"
//                         title="Delete notification"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                   <p className="text-gray-600 mt-1">{notification.message}</p>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="p-8 text-center">
//               <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                 <Bell className="h-8 w-8 text-gray-400" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No notifications</h3>
//               <p className="text-gray-500">You're all caught up! Check back later for new notifications.</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Mobile Action Bar */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-center md:hidden">
//         <button
//           onClick={markAllAsRead}
//           className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium flex items-center"
//           disabled={unreadCount === 0}
//         >
//           <Check className="h-4 w-4 mr-2" />
//           Mark all as read
//         </button>
//       </div>
//     </div>
//   )
// }

// export default NotificationsPage

