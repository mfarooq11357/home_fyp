"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { id } = useParams()

  // Fetch event details and upcoming events from backend
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        // Fetch event details
        const eventResponse = await fetch(`http://localhost:3000/events/${id}`)
        const eventData = await eventResponse.json()
        setEvent(eventData.event)

        // Fetch upcoming events (limited to 2 for sidebar)
        const upcomingResponse = await fetch("http://localhost:3000/events?page=1&limit=2")
        const upcomingData = await upcomingResponse.json()
        setUpcomingEvents(upcomingData.events || [])
      } catch (error) {
        console.error("Error fetching event details:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetails()
  }, [id])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    )
  }

  if (!event) {
    return <p>Event not found</p>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        {/* Event Details Section */}
        <div className="w-full lg:w-5/6">
          <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl mb-6">
            <img src={event.picture || "/placeholder.svg"} alt={event.name} className="w-full h-full object-cover" />
          </div>

          <h1 className="text-4xl font-bold text-blue-600 mb-4">{event.name}</h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{event.smallDescription}</p>
            <p className="text-gray-700">{event.detailedDescription}</p>
          </div>

          <div className="space-y-4 mb-8">
            <div>
              <p className="text-gray-500 font-medium">Venue:</p>
              <p className="text-xl font-bold">{event.location}</p>
            </div>

            <div>
              <p className="text-gray-500 font-medium">Date & Time:</p>
              <p className="text-xl font-bold">{new Date(event.dateTime).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-gray-500 font-medium">Ticket price:</p>
              <p className="text-xl font-bold text-blue-600">{event.registrationFee} Rs Only</p>
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-all font-medium text-lg">
            Buy Now
          </button>
        </div>

        {/* Divider - Hidden on mobile */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="w-full lg:w-1/6 mt-8 lg:mt-0">
          <h1 className="text-2xl font-bold mb-6">Upcoming Events:</h1>

          <div className="space-y-6">
            {upcomingEvents.map((upcomingEvent) => (
              <div key={upcomingEvent._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4">
                  <h2 className="text-xl font-bold text-gray-800">{upcomingEvent.name}</h2>
                  <p className="text-blue-600 text-sm">{new Date(upcomingEvent.dateTime).toLocaleString()}</p>
                </div>
                <div className="relative h-40 w-full overflow-hidden">
                  <img
                    src={upcomingEvent.picture || "/placeholder.svg"}
                    alt={upcomingEvent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsPage





// "use client"

// const EventDetailsPage = () => {
//   // Sample event data
//   const event = {
//     id: 1,
//     title: "Tech Fest 2024",
//     description: "Join us for a day of innovation and learning with industry experts.",
//     longDescription:
//       "Join us for a day of innovation and learning with industry experts. Join us for a day of innovation and learning with industry experts.",
//     venue: "Main Auditorium, Building ABC",
//     date: "Tuesday, 20 March 2025",
//     ticketPrice: "500 Rs Only",
//     image: "https://i.ibb.co/1YSzM2hL/image-7.png",
//   }

//   // Upcoming events data
//   const upcomingEvents = [
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
//         {/* Event Details Section */}
//         <div className="w-full lg:w-3/5">
//           <div className="relative h-64 md:h-80 w-full overflow-hidden rounded-xl mb-6">
//             <img src={event.image || "/placeholder.svg"} alt={event.title} className="w-full h-full object-cover" />
//           </div>

//           <h1 className="text-4xl font-bold text-blue-600 mb-4">{event.title}</h1>

//           <div className="mb-6">
//             <p className="text-gray-700 mb-4">{event.description}</p>
//             <p className="text-gray-700">{event.longDescription}</p>
//           </div>

//           <div className="space-y-4 mb-8">
//             <div>
//               <p className="text-gray-500 font-medium">Venue:</p>
//               <p className="text-xl font-bold">{event.venue}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 font-medium">Date & Time:</p>
//               <p className="text-xl font-bold">{event.date}</p>
//             </div>

//             <div>
//               <p className="text-gray-500 font-medium">Ticket price:</p>
//               <p className="text-xl font-bold text-blue-600">{event.ticketPrice}</p>
//             </div>
//           </div>

//           <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-all font-medium text-lg">
//             Buy Now
//           </button>
//         </div>

//         {/* Divider - Hidden on mobile */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Upcoming Events Section */}
//         <div className="w-full lg:w-2/5 mt-8 lg:mt-0">
//           <h1 className="text-2xl font-bold mb-6">Upcoming Events:</h1>

//           <div className="space-y-6">
//             {upcomingEvents.map((upcomingEvent) => (
//               <div key={upcomingEvent.id} className="bg-white rounded-xl shadow-md overflow-hidden">
//                 <div className="p-4">
//                   <h2 className="text-xl font-bold text-gray-800">{upcomingEvent.title}</h2>
//                   <p className="text-blue-600 text-sm">{upcomingEvent.date}</p>
//                 </div>
//                 <div className="relative h-40 w-full overflow-hidden">
//                   <img
//                     src={upcomingEvent.image || "/placeholder.svg"}
//                     alt={upcomingEvent.title}
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

// export default EventDetailsPage
