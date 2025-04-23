"use client"

import { useState, useEffect } from "react"
import { Calendar } from 'lucide-react'
import Post from "../components/Post"
import CreatePost from "../components/CreatePost"
import UpcomingEvents from "../components/UpcommingEvents"
import Loader from "../components/Loader"
import { toast } from "react-toastify"

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const postsPerPage = 5

  // Initial fetch of posts
  useEffect(() => {
    const fetchInitialPosts = async () => {
      setInitialLoading(true)
      try {
        const token = localStorage.getItem("token")
        const response = await fetch(`http://localhost:3000/posts?page=1&limit=${postsPerPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }

        const data = await response.json()
        
        // Format posts
        const formattedPosts = data.posts.map((post) => ({
          ...post,
          author: {
            ...post.author,
            name: `${post.author.firstName} ${post.author.lastName}`,
          },
        }))

        setPosts(formattedPosts)
        setHasMore(page < data.totalPages)
        setTotalPages(data.totalPages)
      } catch (error) {
        console.error("Error fetching posts:", error)
        toast.error("Failed to load posts", {
          theme: "light",
        })
      } finally {
        setInitialLoading(false)
      }
    }

    fetchInitialPosts()
  }, [])

  // Load more posts when button is clicked
  const loadMorePosts = async () => {
    if (loading || !hasMore) return
    
    setLoading(true)
    try {
      const nextPage = page + 1
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts?page=${nextPage}&limit=${postsPerPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch more posts")
      }

      const data = await response.json()
      
      // Format new posts
      const formattedPosts = data.posts.map((post) => ({
        ...post,
        author: {
          ...post.author,
          name: `${post.author.firstName} ${post.author.lastName}`,
        },
      }))

      // Add new posts, ensuring no duplicates by checking _id
      const existingPostIds = new Set(posts.map(post => post._id))
      const uniqueNewPosts = formattedPosts.filter(post => !existingPostIds.has(post._id))
      
      setPosts(prevPosts => [...prevPosts, ...uniqueNewPosts])
      setPage(nextPage)
      setHasMore(nextPage < data.totalPages)
    } catch (error) {
      console.error("Error fetching more posts:", error)
      toast.error("Failed to load more posts", {
        theme: "light",
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle post deletion or update
  const handlePostAction = (postId, updatedPost = null) => {
    if (updatedPost) {
      // Update post
      setPosts(prevPosts => prevPosts.map(post => 
        post._id === postId ? { ...post, ...updatedPost } : post
      ))
    } else {
      // Delete post
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId))
    }
  }

  if (initialLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="w-full lg:w-4/5 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Feed</h1>

          <CreatePost
            onPostCreated={() => {
              // Reset feed to fetch new posts including the one just created
              setPosts([])
              setPage(1)
              setHasMore(true)
              
              // Refetch posts
              const fetchPosts = async () => {
                try {
                  const token = localStorage.getItem("token")
                  const response = await fetch(`http://localhost:3000/posts?page=1&limit=${postsPerPage}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  })
          
                  if (!response.ok) {
                    throw new Error("Failed to fetch posts")
                  }
          
                  const data = await response.json()
                  
                  // Format posts
                  const formattedPosts = data.posts.map((post) => ({
                    ...post,
                    author: {
                      ...post.author,
                      name: `${post.author.firstName} ${post.author.lastName}`,
                    },
                  }))
          
                  setPosts(formattedPosts)
                  setHasMore(1 < data.totalPages)
                  setTotalPages(data.totalPages)
                } catch (error) {
                  console.error("Error fetching posts:", error)
                }
              }
              
              fetchPosts()
            }}
          />

          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post._id} post={post} onPostDeleted={handlePostAction} />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-600">No posts to display. Create your first post!</p>
              </div>
            )}

            {loading && (
              <div className="text-center py-4">
                <Loader />
                <p className="mt-2 text-gray-600">Loading more posts...</p>
              </div>
            )}

            {hasMore && !loading && posts.length > 0 && (
              <div className="text-center py-4">
                <button
                  onClick={loadMorePosts}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Load More Posts
                </button>
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="text-center py-4 text-gray-600">You've reached the end of the feed</div>
            )}
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

export default Feed



















// import {Calendar} from "lucide-react";
// import { useState, useEffect, useRef, useCallback } from "react"
// import Post from "../components/Post"
// import CreatePost from "../components/CreatePost"
// import UpcomingEvents from "../components/UpcommingEvents"
// import Loader from "../components/Loader"


// // Feed Component
// const Feed = () => {
//     const [posts, setPosts] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [initialLoading, setInitialLoading] = useState(true)
//     const [page, setPage] = useState(1)
//     const [hasMore, setHasMore] = useState(true)
//     const loader = useRef(null)
//     const postsPerPage = 5
  
//     const fetchPosts = useCallback(async () => {
//       setLoading(true)
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`http://localhost:3000/posts?page=${page}&limit=${postsPerPage}`, {
//           headers: { 'Authorization': `Bearer ${token}` },
//         })
//         const data = await response.json()
//         const formattedPosts = data.posts.map(post => ({
//           ...post,
//           author: { ...post.author, name: `${post.author.firstName} ${post.author.lastName}` },
//         }))
//         setPosts((prevPosts) => [...prevPosts, ...formattedPosts])
//         setHasMore(page < data.totalPages)
//         setLoading(false)
//         setInitialLoading(false)
//       } catch (error) {
//         console.error('Error fetching posts:', error)
//         setLoading(false)
//         setInitialLoading(false)
//       }
//     }, [page])
  
//     useEffect(() => {
//       fetchPosts()
//     }, [fetchPosts])
  
//     useEffect(() => {
//       const options = {
//         root: null,
//         rootMargin: "20px",
//         threshold: 1.0,
//       }
//       const observer = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore && !loading) {
//           setPage((prevPage) => prevPage + 1)
//         }
//       }, options)
//       if (loader.current) observer.observe(loader.current)
//       return () => {
//         if (loader.current) observer.unobserve(loader.current)
//       }
//     }, [hasMore, loading])
  
//     if (initialLoading) return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
  
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="flex flex-col lg:flex-row gap-8 relative">
//           <div className="w-full lg:w-4/5 overflow-y-auto">
//             <h1 className="text-3xl font-bold mb-6 text-gray-800">Feed</h1>
//             <CreatePost />
//             <div className="space-y-6">
//               {posts.map((post) => (
//                 <Post key={post._id} post={post} />
//               ))}
//               {loading && (
//                 <div className="text-center py-4">
//                   <Loader />
//                   <p className="mt-2 text-gray-600">Loading more posts...</p>
//                 </div>
//               )}
//               {!hasMore && <div className="text-center py-4 text-gray-600">You've reached the end of the feed</div>}
//               <div ref={loader} />
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
  
//   // // Placeholder Loader Component
//   // const Loader = () => <div>Loading...</div>
  
//   // Placeholder UpcomingEvents Component
//   // const UpcomingEvents = () => <div>Upcoming Events Placeholder</div>
  
// export default Feed





// "use client"

// import {Calendar} from "lucide-react";
// import { useState, useEffect, useRef, useCallback } from "react"
// import Post from "../components/Post"
// import CreatePost from "../components/CreatePost"
// import UpcomingEvents from "../components/UpcommingEvents"
// import Loader from "../components/Loader"

// // Mock data for posts
// const mockPosts = [
//   {
//     id: 1,
//     author: {
//       id: 101,
//       name: "Ahmed Ali",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Software Engineer",
//     },
//     description:
//       "Just finished working on a new project using React and Next.js. The performance improvements are incredible! I've been working on this for the past few weeks and I'm really happy with the results. Let me know what you think about the design and functionality.",
//     media: [
//       { type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" },
//       { type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" },
//     ],
//     timeAgo: "2 hours ago",
//     likes: { count: 24, userReactions: [] },
//     comments: { count: 5, items: [] },
//     shares: 3,
//   },
//   {
//     id: 2,
//     author: {
//       id: 102,
//       name: "Fatima Zahra",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "UX Designer",
//     },
//     description:
//       "Excited to share my latest design project! I focused on creating an intuitive user experience with a clean, modern aesthetic. The client was thrilled with the final result.",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "5 hours ago",
//     likes: { count: 42, userReactions: [] },
//     comments: { count: 8, items: [] },
//     shares: 12,
//   },
//   {
//     id: 3,
//     author: {
//       id: 103,
//       name: "Muhammad Farooq",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Full Stack Developer",
//     },
//     description:
//       "Just deployed a new feature to our production environment. It was a challenging implementation, but the team pulled together and made it happen. Special thanks to everyone who contributed!",
//     media: [],
//     timeAgo: "Yesterday",
//     likes: { count: 18, userReactions: [] },
//     comments: { count: 3, items: [] },
//     shares: 2,
//   },
//   {
//     id: 4,
//     author: {
//       id: 104,
//       name: "Ayesha Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Project Manager",
//     },
//     description:
//       "Our team just hit a major milestone on the client project! Proud of everyone's hard work and dedication. Looking forward to the next phase of development.",
//     media: [{ type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" }],
//     timeAgo: "2 days ago",
//     likes: { count: 56, userReactions: [] },
//     comments: { count: 14, items: [] },
//     shares: 8,
//   },
//   {
//     id: 5,
//     author: {
//       id: 105,
//       name: "Ali Hassan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "DevOps Engineer",
//     },
//     description:
//       "Just optimized our CI/CD pipeline and reduced build times by 40%! Small changes can make a big difference in developer productivity.",
//     media: [],
//     timeAgo: "3 days ago",
//     likes: { count: 31, userReactions: [] },
//     comments: { count: 7, items: [] },
//     shares: 5,
//   },
//   {
//     id: 6,
//     author: {
//       id: 106,
//       name: "Zainab Bibi",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Data Scientist",
//     },
//     description:
//       "Excited to share the results of our latest data analysis project. We discovered some fascinating patterns that will help drive business decisions going forward.",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "4 days ago",
//     likes: { count: 27, userReactions: [] },
//     comments: { count: 6, items: [] },
//     shares: 4,
//   },
//   {
//     id: 7,
//     author: {
//       id: 107,
//       name: "Usman Ali",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Frontend Developer",
//     },
//     description:
//       "Just launched a new website for a client in the healthcare industry. Focused on accessibility and performance to ensure a great experience for all users.",
//     media: [{ type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" }],
//     timeAgo: "5 days ago",
//     likes: { count: 39, userReactions: [] },
//     comments: { count: 9, items: [] },
//     shares: 7,
//   },
//   {
//     id: 8,
//     author: {
//       id: 108,
//       name: "Sana Malik",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "UI Designer",
//     },
//     description:
//       "Sharing my latest UI design exploration. I've been experimenting with glassmorphism and dark mode interfaces. Would love to hear your thoughts!",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "1 week ago",
//     likes: { count: 45, userReactions: [] },
//     comments: { count: 11, items: [] },
//     shares: 9,
//   },
// ]

// const Feed = () => {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [initialLoading, setInitialLoading] = useState(true)
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)
//   const loader = useRef(null)
//   const postsPerPage = 5

//   // Fetch posts function (simulated with mock data)
//   const fetchPosts = useCallback(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       const startIndex = (page - 1) * postsPerPage
//       const endIndex = startIndex + postsPerPage
//       const newPosts = mockPosts.slice(startIndex, endIndex)

//       setPosts((prevPosts) => [...prevPosts, ...newPosts])
//       setHasMore(endIndex < mockPosts.length)
//       setLoading(false)
//       setInitialLoading(false)
//     }, 1000)
//   }, [page])

//   // Initial load
//   useEffect(() => {
//     fetchPosts()
//   }, [fetchPosts])

//   // Set up intersection observer for infinite scroll
//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 1.0,
//     }

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore && !loading) {
//         loadMorePosts()
//       }
//     }, options)

//     if (loader.current) {
//       observer.observe(loader.current)
//     }

//     return () => {
//       if (loader.current) {
//         observer.unobserve(loader.current)
//       }
//     }
//   }, [hasMore, loading])

//   // Load more posts
//   const loadMorePosts = () => {
//     if (!loading && hasMore) {
//       setPage((prevPage) => prevPage + 1)
//     }
//   }

//   if (initialLoading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Feed Section - 4/5 width on large screens */}
//         <div className="w-full lg:w-4/5 overflow-y-auto">
//           <h1 className="text-3xl font-bold mb-6 text-gray-800">Feed</h1>

//           {/* Create Post Component */}
//           <CreatePost />

//           {/* Posts */}
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <Post key={post.id} post={post} />
//             ))}

//             {/* Loading indicator */}
//             {loading && (
//               <div className="text-center py-4">
//                 <Loader />
//                 <p className="mt-2 text-gray-600">Loading more posts...</p>
//               </div>
//             )}

//             {/* Load more button */}
//             {hasMore && !loading && (
//               <div className="text-center py-4">
//                 <button
//                   onClick={loadMorePosts}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Load More Posts
//                 </button>
//               </div>
//             )}

//             {/* End of posts message */}
//             {!hasMore && <div className="text-center py-4 text-gray-600">You've reached the end of the feed</div>}

//             {/* Intersection observer target */}
//             <div ref={loader} />
//           </div>
//         </div>

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

// export default Feed



















// "use client"

// import { useState, useEffect, useRef, useCallback } from "react"
// import Post from "../components/Post"
// import { Calendar } from "lucide-react"

// // Mock data for posts
// const mockPosts = [
//   {
//     id: 1,
//     author: {
//       id: 101,
//       name: "Ahmed Ali",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Software Engineer",
//     },
//     description:
//       "Just finished working on a new project using React and Next.js. The performance improvements are incredible! I've been working on this for the past few weeks and I'm really happy with the results. Let me know what you think about the design and functionality.",
//     media: [
//       { type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" },
//       { type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" },
//     ],
//     timeAgo: "2 hours ago",
//     likes: { count: 24, userReactions: [] },
//     comments: { count: 5, items: [] },
//     shares: 3,
//   },
//   {
//     id: 2,
//     author: {
//       id: 102,
//       name: "Fatima Zahra",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "UX Designer",
//     },
//     description:
//       "Excited to share my latest design project! I focused on creating an intuitive user experience with a clean, modern aesthetic. The client was thrilled with the final result.",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "5 hours ago",
//     likes: { count: 42, userReactions: [] },
//     comments: { count: 8, items: [] },
//     shares: 12,
//   },
//   {
//     id: 3,
//     author: {
//       id: 103,
//       name: "Muhammad Farooq",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Full Stack Developer",
//     },
//     description:
//       "Just deployed a new feature to our production environment. It was a challenging implementation, but the team pulled together and made it happen. Special thanks to everyone who contributed!",
//     media: [],
//     timeAgo: "Yesterday",
//     likes: { count: 18, userReactions: [] },
//     comments: { count: 3, items: [] },
//     shares: 2,
//   },
//   {
//     id: 4,
//     author: {
//       id: 104,
//       name: "Ayesha Khan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Project Manager",
//     },
//     description:
//       "Our team just hit a major milestone on the client project! Proud of everyone's hard work and dedication. Looking forward to the next phase of development.",
//     media: [{ type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" }],
//     timeAgo: "2 days ago",
//     likes: { count: 56, userReactions: [] },
//     comments: { count: 14, items: [] },
//     shares: 8,
//   },
//   {
//     id: 5,
//     author: {
//       id: 105,
//       name: "Ali Hassan",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "DevOps Engineer",
//     },
//     description:
//       "Just optimized our CI/CD pipeline and reduced build times by 40%! Small changes can make a big difference in developer productivity.",
//     media: [],
//     timeAgo: "3 days ago",
//     likes: { count: 31, userReactions: [] },
//     comments: { count: 7, items: [] },
//     shares: 5,
//   },
//   {
//     id: 6,
//     author: {
//       id: 106,
//       name: "Zainab Bibi",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Data Scientist",
//     },
//     description:
//       "Excited to share the results of our latest data analysis project. We discovered some fascinating patterns that will help drive business decisions going forward.",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "4 days ago",
//     likes: { count: 27, userReactions: [] },
//     comments: { count: 6, items: [] },
//     shares: 4,
//   },
//   {
//     id: 7,
//     author: {
//       id: 107,
//       name: "Usman Ali",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "Frontend Developer",
//     },
//     description:
//       "Just launched a new website for a client in the healthcare industry. Focused on accessibility and performance to ensure a great experience for all users.",
//     media: [{ type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" }],
//     timeAgo: "5 days ago",
//     likes: { count: 39, userReactions: [] },
//     comments: { count: 9, items: [] },
//     shares: 7,
//   },
//   {
//     id: 8,
//     author: {
//       id: 108,
//       name: "Sana Malik",
//       profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       role: "UI Designer",
//     },
//     description:
//       "Sharing my latest UI design exploration. I've been experimenting with glassmorphism and dark mode interfaces. Would love to hear your thoughts!",
//     media: [{ type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" }],
//     timeAgo: "1 week ago",
//     likes: { count: 45, userReactions: [] },
//     comments: { count: 11, items: [] },
//     shares: 9,
//   },
// ]

// // Mock data for events
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

// const Feed = () => {
//   const [posts, setPosts] = useState([])
//   const [loading, setLoading] = useState(false)
//   const [page, setPage] = useState(1)
//   const [hasMore, setHasMore] = useState(true)
//   const loader = useRef(null)
//   const postsPerPage = 5

//   // Fetch posts function (simulated with mock data)
//   const fetchPosts = useCallback(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       const startIndex = (page - 1) * postsPerPage
//       const endIndex = startIndex + postsPerPage
//       const newPosts = mockPosts.slice(startIndex, endIndex)

//       setPosts((prevPosts) => [...prevPosts, ...newPosts])
//       setHasMore(endIndex < mockPosts.length)
//       setLoading(false)
//     }, 1000)
//   }, [page])

//   // Initial load
//   useEffect(() => {
//     fetchPosts()
//   }, [fetchPosts])

//   // Set up intersection observer for infinite scroll
//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 1.0,
//     }

//     const observer = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore && !loading) {
//         loadMorePosts()
//       }
//     }, options)

//     if (loader.current) {
//       observer.observe(loader.current)
//     }

//     return () => {
//       if (loader.current) {
//         observer.unobserve(loader.current)
//       }
//     }
//   }, [hasMore, loading])

//   // Load more posts
//   const loadMorePosts = () => {
//     if (!loading && hasMore) {
//       setPage((prevPage) => prevPage + 1)
//     }
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Feed Section - 3/4 width on large screens */}
//         <div className="w-full lg:w-3/4">
//           <h1 className="text-3xl font-bold mb-6 text-gray-800">Feed</h1>

//           {/* Posts */}
//           <div className="space-y-6">
//             {posts.map((post) => (
//               <Post key={post.id} post={post} />
//             ))}

//             {/* Loading indicator */}
//             {loading && (
//               <div className="text-center py-4">
//                 <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//                 <p className="mt-2 text-gray-600">Loading more posts...</p>
//               </div>
//             )}

//             {/* Load more button */}
//             {hasMore && !loading && (
//               <div className="text-center py-4">
//                 <button
//                   onClick={loadMorePosts}
//                   className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Load More Posts
//                 </button>
//               </div>
//             )}

//             {/* End of posts message */}
//             {!hasMore && <div className="text-center py-4 text-gray-600">You've reached the end of the feed</div>}

//             {/* Intersection observer target */}
//             <div ref={loader} />
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

// export default Feed
