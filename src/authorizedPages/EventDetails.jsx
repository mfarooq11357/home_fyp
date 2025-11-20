"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FaStar, FaRegStar, FaStarHalfAlt, FaUser } from "react-icons/fa"

const EventDetailsPage = () => {
  const [event, setEvent] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [reviews, setReviews] = useState([])
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [userReview, setUserReview] = useState({
    rating: 5,
    comment: "",
  })
  const [isRegistered, setIsRegistered] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true)
      try {
        const eventResponse = await fetch(`https://ses-management-system-nu.vercel.app/events/${id}`)
        const eventData = await eventResponse.json()
        setEvent(eventData.event)

        const upcomingResponse = await fetch("https://ses-management-system-nu.vercel.app/events?page=1&limit=2")
        const upcomingData = await upcomingResponse.json()
        setUpcomingEvents(upcomingData.events || [])

        // Fetch reviews for this event
        const reviewsResponse = await fetch(`https://ses-management-system-nu.vercel.app/reviews/event/${id}`)
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])

        // Check if user is registered for this event
        const token = localStorage.getItem("token")
        if (token) {
          try {
            const userResponse = await fetch("https://ses-management-system-nu.vercel.app/user/me", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            const userData = await userResponse.json()
            if (userData.user && eventData.event.participants) {
              setIsRegistered(eventData.event.participants.includes(userData.user._id))
            }
          } catch (error) {
            console.error("Error checking registration status:", error)
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error)
        toast.error("Error fetching event details.")
      } finally {
        setLoading(false)
      }
    }
    fetchEventDetails()
  }, [id])

  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please log in to register for the event.")
        return
      }

      const response = await fetch("https://ses-management-system-nu.vercel.app/event-registration-requests/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Registration request submitted successfully.")
      } else {
        toast.error(data.error || "Failed to submit registration request.")
      }
    } catch (error) {
      console.error("Error submitting registration request:", error)
      toast.error("An error occurred while submitting the request.")
    }
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please log in to submit a review.")
        setShowReviewModal(false)
        return
      }

      const response = await fetch("https://ses-management-system-nu.vercel.app/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: id,
          rating: userReview.rating,
          comment: userReview.comment,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Review submitted successfully!")

        // Refresh reviews
        const reviewsResponse = await fetch(`https://ses-management-system-nu.vercel.app/reviews/event/${id}`)
        const reviewsData = await reviewsResponse.json()
        setReviews(reviewsData.reviews || [])

        // Update event data to get new rating
        const eventResponse = await fetch(`https://ses-management-system-nu.vercel.app/events/${id}`)
        const eventData = await eventResponse.json()
        setEvent(eventData.event)

        setShowReviewModal(false)
        setUserReview({ rating: 5, comment: "" })
      } else {
        toast.error(data.message || "Failed to submit review.")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("An error occurred while submitting your review.")
    }
  }

  const renderStars = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />)
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />)
      }
    }

    return stars
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

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
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col lg:flex-row gap-8 relative">
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
            {isRegistered ? (
              <button className="bg-green-600 text-white py-3 px-8 rounded-md transition-all font-medium text-lg cursor-default">
                Registered
              </button>
            ) : (
              <button
                onClick={handleBookNow}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md transition-all font-medium text-lg"
              >
                Book Now
              </button>
            )}

            {/* Reviews Section */}
            <div className="mt-16">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all"
                >
                  Leave a Review
                </button>
              </div>

              {/* Rating Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-blue-600">
                    {event.totalRating ? event.totalRating.toFixed(1) : "0.0"}
                  </div>
                  <div>
                    <div className="flex mb-1">{renderStars(event.totalRating || 0)}</div>
                    <p className="text-gray-500">Based on {event.totalReviews || 0} reviews</p>
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review._id} className="border-b pb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                          {review.user.picture ? (
                            <img
                              src={review.user.picture || "/placeholder.svg"}
                              alt={review.user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-600">
                              <FaUser size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{review.user.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">{renderStars(review.rating)}</div>
                                <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          {review.comment && <p className="mt-3 text-gray-700">{review.comment}</p>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full">
              <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
            </div>
          </div>
          <div className="w-full lg:w-1/6 mt-8 lg:mt-0">
            {/* <h1 className="text-[1.6rem] font-bold mb-6">Upcoming Events:</h1>
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
            </div> */}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setUserReview({ ...userReview, rating: star })}
                      className="text-2xl focus:outline-none"
                    >
                      {star <= userReview.rating ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-yellow-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="comment" className="block text-gray-700 mb-2">
                  Comment (Optional)
                </label>
                <textarea
                  id="comment"
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Share your experience..."
                  value={userReview.comment}
                  onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                ></textarea>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
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
//           <h1 className="text-[1.6rem] font-bold mb-6">Upcoming Events:</h1>

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

