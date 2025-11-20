"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, ThumbsUp, Heart, Calendar } from "lucide-react"
import { FaRegLaughBeam } from "react-icons/fa"
import Loader from "../components/Loader"
import UpcomingEvents from "../components/UpcommingEvents"
import { toast } from "react-toastify"

const PostLikes = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [likes, setLikes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const fetchLikes = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/likes`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch likes")
        }

        const data = await response.json()
        setLikes(data)
      } catch (error) {
        console.error("Error fetching likes:", error)
        toast.error("Failed to load likes", {
          theme: "light",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchLikes()
  }, [postId])

  const filteredLikes = likes?.likes?.filter((user) => filter === "all" || user.reactionType === filter) || []

  const goBackToPost = () => navigate(`/feed/post/${postId}`)
  const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

  const getReactionIcon = (type) => {
    switch (type) {
      case "like":
        return <ThumbsUp size={16} className="text-blue-600" />
      case "love":
        return <Heart size={16} className="text-red-500" />
      case "laugh":
        return <FaRegLaughBeam size={16} className="text-yellow-500" />
      default:
        return <ThumbsUp size={16} className="text-blue-600" />
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    )
  }

  if (!likes) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Likes not found</h1>
        <button
          onClick={goBackToPost}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Post
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="w-full lg:w-4/5">
          <button
            onClick={goBackToPost}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Post
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-800">People who liked this post</h1>
              <p className="text-gray-600">Total: {likes.totalLikes} likes</p>
            </div>

            <div className="flex border-b border-gray-100">
              <button
                className={`px-4 py-2 font-medium transition-colors ${filter === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                className={`px-4 py-2 font-medium flex items-center transition-colors ${filter === "like" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setFilter("like")}
              >
                <ThumbsUp size={16} className="mr-1" />
                Like
              </button>
              <button
                className={`px-4 py-2 font-medium flex items-center transition-colors ${filter === "love" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setFilter("love")}
              >
                <Heart size={16} className="mr-1" />
                Love
              </button>
              <button
                className={`px-4 py-2 font-medium flex items-center transition-colors ${filter === "laugh" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
                onClick={() => setFilter("laugh")}
              >
                <FaRegLaughBeam size={16} className="mr-1" />
                Haha
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredLikes.length > 0 ? (
                filteredLikes.map((user) => (
                  <div
                    key={user.userId}
                    className="p-4 flex items-center hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => goToUserProfile(user.userId)}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img
                        src={user.Picture || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    </div>
                    <div className="flex-shrink-0">{getReactionIcon(user.reactionType)}</div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-600">No users found with this reaction type</div>
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        <div className="hidden lg:block w-1/5 mt-0 sticky top-20">
          <h1 className="text-[1.4rem] font-bold mb-6 flex items-center">
            <Calendar className="mr-2 text-blue-600" />
            Upcoming Events
          </h1>
          <UpcomingEvents />
        </div>
      </div>
    </div>
  )
}

export default PostLikes





























// // "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { ArrowLeft, ThumbsUp, Heart, Calendar } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"
// // PostLikes Component
// const PostLikes = () => {
//     const { postId } = useParams()
//     const navigate = useNavigate()
//     const [likes, setLikes] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [filter, setFilter] = useState("all")
  
//     useEffect(() => {
//       const fetchLikes = async () => {
//         setLoading(true)
//         try {
//           const token = localStorage.getItem('token')
//           const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/likes`, {
//             headers: { 'Authorization': `Bearer ${token}` },
//           })
//           const data = await response.json()
//           setLikes(data)
//           setLoading(false)
//         } catch (error) {
//           console.error('Error fetching likes:', error)
//           setLoading(false)
//         }
//       }
//       fetchLikes()
//     }, [postId])
  
//     const filteredLikes = likes?.likes.filter((user) => filter === "all" || user.reactionType === filter) || []
//     const goBackToPost = () => navigate(`/feed/post/${postId}`)
//     const goToUserProfile = (userId) => navigate(`/profile/${userId}`)
  
//     const getReactionIcon = (type) => {
//       switch (type) {
//         case "like": return <ThumbsUp size={16} className="text-blue-600" />
//         case "love": return <Heart size={16} className="text-red-500" />
//         case "laugh": return <FaRegLaughBeam size={16} className="text-yellow-500" />
//         default: return <ThumbsUp size={16} className="text-blue-600" />
//       }
//     }
  
//     if (loading) return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
  
//     if (!likes) return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Likes not found</h1>
//         <button onClick={goBackToPost} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//           Back to Post
//         </button>
//       </div>
//     )
  
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="flex flex-col lg:flex-row gap-8 relative">
//           <div className="w-full lg:w-4/5">
//             <button onClick={goBackToPost} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//               <ArrowLeft size={20} className="mr-1" />
//               Back to Post
//             </button>
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <div className="p-4 border-b border-gray-100">
//                 <h1 className="text-xl font-bold text-gray-800">People who liked this post</h1>
//                 <p className="text-gray-600">Total: {likes.totalLikes} likes</p>
//               </div>
//               <div className="flex border-b border-gray-100">
//                 <button
//                   className={`px-4 py-2 font-medium ${filter === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                   onClick={() => setFilter("all")}
//                 >
//                   All
//                 </button>
//                 <button
//                   className={`px-4 py-2 font-medium flex items-center ${filter === "like" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                   onClick={() => setFilter("like")}
//                 >
//                   <ThumbsUp size={16} className="mr-1" />
//                   Like
//                 </button>
//                 <button
//                   className={`px-4 py-2 font-medium flex items-center ${filter === "love" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                   onClick={() => setFilter("love")}
//                 >
//                   <Heart size={16} className="mr-1" />
//                   Love
//                 </button>
//                 <button
//                   className={`px-4 py-2 font-medium flex items-center ${filter === "laugh" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                   onClick={() => setFilter("laugh")}
//                 >
//                   <FaRegLaughBeam size={16} className="mr-1" />
//                   Haha
//                 </button>
//               </div>
//               <div className="divide-y divide-gray-100">


//                 {filteredLikes.length > 0 ? filteredLikes.map((user) => (
//                   <div
//                     key={user.userId}
//                     className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
//                     onClick={() => goToUserProfile(user.userId)}
//                   >
//                     <div className="w-12 h-12 rounded-full overflow-hidden">
//                       <img src={user.Picture || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="font-semibold text-gray-800">{user.name}</h3>
//                     </div>
//                     <div className="flex-shrink-0">{getReactionIcon(user.reactionType)}</div>
//                   </div>
//                 )) : (
//                   <div className="p-8 text-center text-gray-600">No users found with this reaction type</div>
//                 )}
//               </div>
//             </div>
//           </div>
//           <div className="hidden lg:flex items-center justify-center">
//             <div className="h-full">
//               <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//             </div>
//           </div>
//           <div className="hidden lg:block w-1/5 mt-0 sticky top-20">
//             <h1 className="text-[1.4rem] font-bold mb-6 flex items-center">
//               <Calendar className="mr-2 text-blue-600" />
//               Upcoming Events
//             </h1>
//             <UpcomingEvents />
//           </div>
//         </div>
//       </div>
//     )
//   }


// export default PostLikes





// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { ArrowLeft, ThumbsUp, Heart, Calendar } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"

// // Mock data for post likes
// const mockPostLikes = {
//   postId: 1,
//   totalLikes: 24,
//   users: [
//     {
//       userId: 102,
//       name: "Fatima Zahra",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 103,
//       name: "Muhammad Farooq",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 104,
//       name: "Ayesha Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 105,
//       name: "Ali Hassan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 106,
//       name: "Zainab Bibi",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     { userId: 107, name: "Usman Ali", profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png", reactionType: "like" },
//     {
//       userId: 108,
//       name: "Sana Malik",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 109,
//       name: "Imran Ahmed",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 110,
//       name: "Nadia Jamil",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 111,
//       name: "Bilal Mahmood",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 112,
//       name: "Saima Nawaz",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 113,
//       name: "Kamran Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 114,
//       name: "Rabia Aslam",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 115,
//       name: "Tariq Mehmood",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//   ],
// }

// const PostLikes = () => {
//   const { postId } = useParams()
//   const navigate = useNavigate()
//   const [likes, setLikes] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("all") // "all", "like", "love", "laugh"

//   // Fetch likes data
//   useEffect(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       // In a real app, you would fetch the likes by post ID from your API
//       setLikes(mockPostLikes)
//       setLoading(false)
//     }, 1000)
//   }, [postId])

//   // Filter likes based on reaction type
//   const filteredLikes =
//     likes?.users.filter((user) => {
//       if (filter === "all") return true
//       return user.reactionType === filter
//     }) || []

//   // Navigate back to post detail
//   const goBackToPost = () => {
//     navigate(`/feed/post/${postId}`)
//   }

//   // Navigate to user profile
//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   // Get reaction icon based on type
//   const getReactionIcon = (type) => {
//     switch (type) {
//       case "like":
//         return <ThumbsUp size={16} className="text-blue-600" />
//       case "love":
//         return <Heart size={16} className="text-red-500" />
//       case "laugh":
//         return <FaRegLaughBeam size={16} className="text-yellow-500" />
//       default:
//         return <ThumbsUp size={16} className="text-blue-600" />
//     }
//   }

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
//   }

//   if (!likes) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Likes not found</h1>
//         <button
//           onClick={goBackToPost}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Post
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Likes Section - 4/5 width on large screens */}
//         <div className="w-full lg:w-4/5">
//           {/* Back button */}
//           <button onClick={goBackToPost} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//             <ArrowLeft size={20} className="mr-1" />
//             Back to Post
//           </button>

//           {/* Likes container */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             <div className="p-4 border-b border-gray-100">
//               <h1 className="text-xl font-bold text-gray-800">People who liked this post</h1>
//               <p className="text-gray-600">Total: {likes.totalLikes} likes</p>
//             </div>

//             {/* Filter tabs */}
//             <div className="flex border-b border-gray-100">
//               <button
//                 className={`px-4 py-2 font-medium ${filter === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("all")}
//               >
//                 All
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "like" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("like")}
//               >
//                 <ThumbsUp size={16} className="mr-1" />
//                 Like
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "love" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("love")}
//               >
//                 <Heart size={16} className="mr-1" />
//                 Love
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "laugh" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("laugh")}
//               >
//                 <FaRegLaughBeam size={16} className="mr-1" />
//                 Haha
//               </button>
//             </div>

//             {/* Users list */}
//             <div className="divide-y divide-gray-100">
//               {filteredLikes.length > 0 ? (
//                 filteredLikes.map((user) => (
//                   <div
//                     key={user.userId}
//                     className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
//                     onClick={() => goToUserProfile(user.userId)}
//                   >
//                     <div className="w-12 h-12 rounded-full overflow-hidden">
//                       <img
//                         src={user.profilePicture || "/placeholder.svg"}
//                         alt={user.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="font-semibold text-gray-800">{user.name}</h3>
//                     </div>
//                     <div className="flex-shrink-0">{getReactionIcon(user.reactionType)}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-8 text-center text-gray-600">No users found with this reaction type</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Upcoming Events Section - 1/5 width on large screens, fixed position */}
//         <div className="hidden lg:block w-1/5 mt-0 sticky top-20">
//           <h1 className="text-[1.4rem] font-bold mb-6 flex items-center">
//             <Calendar className="mr-2 text-blue-600" />
//             Upcoming Events
//           </h1>
//           <UpcomingEvents />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PostLikes










// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { ArrowLeft, ThumbsUp, Heart } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import { Calendar } from "lucide-react"

// // Mock data for events (same as in Feed.jsx)
// const events = [
//   {
//     id: 1,
//     title: "Tech fest",
//     date: "Tuesday, 20 March 2025",
//     image: "https://i.ibb.co/1YSzM2hL/image-7.png",
//   },
//   {
//     id: 2,
//     title: "Kheil Tamasha",
//     date: "Tuesday, 20 March 2025",
//     image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
//   },
// ]

// // Mock data for post likes
// const mockPostLikes = {
//   postId: 1,
//   totalLikes: 24,
//   users: [
//     {
//       userId: 102,
//       name: "Fatima Zahra",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 103,
//       name: "Muhammad Farooq",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 104,
//       name: "Ayesha Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 105,
//       name: "Ali Hassan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 106,
//       name: "Zainab Bibi",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     { userId: 107, name: "Usman Ali", profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png", reactionType: "like" },
//     {
//       userId: 108,
//       name: "Sana Malik",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 109,
//       name: "Imran Ahmed",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 110,
//       name: "Nadia Jamil",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 111,
//       name: "Bilal Mahmood",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 112,
//       name: "Saima Nawaz",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "laugh",
//     },
//     {
//       userId: 113,
//       name: "Kamran Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//     {
//       userId: 114,
//       name: "Rabia Aslam",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "love",
//     },
//     {
//       userId: 115,
//       name: "Tariq Mehmood",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       reactionType: "like",
//     },
//   ],
// }

// const PostLikes = () => {
//   const { postId } = useParams()
//   const navigate = useNavigate()
//   const [likes, setLikes] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [filter, setFilter] = useState("all") // "all", "like", "love", "laugh"

//   // Fetch likes data
//   useEffect(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       // In a real app, you would fetch the likes by post ID from your API
//       setLikes(mockPostLikes)
//       setLoading(false)
//     }, 1000)
//   }, [postId])

//   // Filter likes based on reaction type
//   const filteredLikes =
//     likes?.users.filter((user) => {
//       if (filter === "all") return true
//       return user.reactionType === filter
//     }) || []

//   // Navigate back to post detail
//   const goBackToPost = () => {
//     navigate(`/feed/post/${postId}`)
//   }

//   // Navigate to user profile
//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   // Get reaction icon based on type
//   const getReactionIcon = (type) => {
//     switch (type) {
//       case "like":
//         return <ThumbsUp size={16} className="text-blue-600" />
//       case "love":
//         return <Heart size={16} className="text-red-500" />
//       case "laugh":
//         return <FaRegLaughBeam size={16} className="text-yellow-500" />
//       default:
//         return <ThumbsUp size={16} className="text-blue-600" />
//     }
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//         <p className="mt-4 text-gray-600">Loading likes...</p>
//       </div>
//     )
//   }

//   if (!likes) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Likes not found</h1>
//         <button
//           onClick={goBackToPost}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Post
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Likes Section - 3/4 width on large screens */}
//         <div className="w-full lg:w-3/4">
//           {/* Back button */}
//           <button onClick={goBackToPost} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//             <ArrowLeft size={20} className="mr-1" />
//             Back to Post
//           </button>

//           {/* Likes container */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             <div className="p-4 border-b border-gray-100">
//               <h1 className="text-xl font-bold text-gray-800">People who liked this post</h1>
//               <p className="text-gray-600">Total: {likes.totalLikes} likes</p>
//             </div>

//             {/* Filter tabs */}
//             <div className="flex border-b border-gray-100">
//               <button
//                 className={`px-4 py-2 font-medium ${filter === "all" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("all")}
//               >
//                 All
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "like" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("like")}
//               >
//                 <ThumbsUp size={16} className="mr-1" />
//                 Like
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "love" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("love")}
//               >
//                 <Heart size={16} className="mr-1" />
//                 Love
//               </button>
//               <button
//                 className={`px-4 py-2 font-medium flex items-center ${filter === "laugh" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
//                 onClick={() => setFilter("laugh")}
//               >
//                 <FaRegLaughBeam size={16} className="mr-1" />
//                 Haha
//               </button>
//             </div>

//             {/* Users list */}
//             <div className="divide-y divide-gray-100">
//               {filteredLikes.length > 0 ? (
//                 filteredLikes.map((user) => (
//                   <div
//                     key={user.userId}
//                     className="p-4 flex items-center hover:bg-gray-50 cursor-pointer"
//                     onClick={() => goToUserProfile(user.userId)}
//                   >
//                     <div className="w-12 h-12 rounded-full overflow-hidden">
//                       <img
//                         src={user.profilePicture || "/placeholder.svg"}
//                         alt={user.name}
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="ml-3 flex-1">
//                       <h3 className="font-semibold text-gray-800">{user.name}</h3>
//                     </div>
//                     <div className="flex-shrink-0">{getReactionIcon(user.reactionType)}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-8 text-center text-gray-600">No users found with this reaction type</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="hidden lg:block absolute left-3/4 h-full">
//           <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//         </div>

//         {/* Upcoming Events Section - 1/4 width on large screens */}
//         <div className="w-full lg:w-1/4 mt-8 lg:mt-0">
//           <h1 className="text-2xl font-bold mb-6 flex items-center">
//             <Calendar className="mr-2 text-blue-600" />
//             Upcoming Events
//           </h1>

//           <div className="space-y-6">
//             {events.map((event) => (
//               <div
//                 key={event.id}
//                 className="overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all border border-gray-100"
//               >
//                 <div className="p-4 bg-white">
//                   <h2 className="text-xl font-bold text-gray-800">{event.title}</h2>
//                   <p className="text-blue-600 flex items-center">
//                     <Calendar className="w-4 h-4 mr-1" />
//                     {event.date}
//                   </p>
//                 </div>
//                 <div className="relative h-40 w-full overflow-hidden">
//                   <img
//                     src={event.image || "/placeholder.svg"}
//                     alt={event.title}
//                     className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PostLikes

