"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const UpcomingEvents = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://ses-management-system-nu.vercel.app/events?page=1&limit=2")
        const data = await response.json()
        setUpcomingEvents(data.events || [])
      } catch (error) {
        console.error("Error fetching upcoming events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUpcomingEvents()
  }, [])

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`)
  }

  if (loading) {
    return <p className="text-gray-600">Loading upcoming events...</p>
  }

  return (
    <div className="space-y-6">
      {upcomingEvents.map((upcomingEvent) => (
        <div 
          key={upcomingEvent._id} 
          className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer"
          onClick={() => handleEventClick(upcomingEvent._id)}
        >
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
  )
}

export default UpcomingEvents
