"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, MessageCircle, Share2, ThumbsUp, ChevronRight, ChevronLeft, MoreVertical, Edit, Trash2 } from 'lucide-react'
import { FaRegLaughBeam } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import EditPostModal from "./EditPostModal"
import DeleteConfirmModal from "./DeleteConfirmModal"

const Post = ({ post, onPostDeleted }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
  const [showReactionOptions, setShowReactionOptions] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState(null)
  const [commentText, setCommentText] = useState("")
  const [isLiked, setIsLiked] = useState(post.likedByMe || false)
  const [reactionType, setReactionType] = useState(post.reactionType || null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [likesCount, setLikesCount] = useState(post.likesCount || 0)
  const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0)
  const [sharesCount, setSharesCount] = useState(post.sharesCount || 0)

  const navigate = useNavigate()
  const likeButtonRef = useRef(null)
  const reactionOptionsRef = useRef(null)
  const optionsMenuRef = useRef(null)
  const optionsButtonRef = useRef(null)

  // Get current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Truncate description if needed
  const truncatedDescription =
    post.description.length > 200 && !showFullDescription
      ? `${post.description.substring(0, 200)}...`
      : post.description

  // Handle media navigation
  const nextMedia = () => {
    if (currentMediaIndex < post.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1)
    }
  }

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1)
    }
  }

  // Handle reactions
  const handleLikeMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setShowReactionOptions(true)
    }
  }

  const handleLikeMouseLeave = () => {
    // Don't hide immediately to allow moving to the reaction options
    setTimeout(() => {
      if (!reactionOptionsRef.current?.matches(":hover")) {
        setShowReactionOptions(false)
      }
    }, 100)
  }

  const handleReactionOptionsMouseEnter = () => {
    setShowReactionOptions(true)
  }

  const handleReactionOptionsMouseLeave = () => {
    setShowReactionOptions(false)
  }

  const handleLikeTouchStart = () => {
    const timer = setTimeout(() => {
      setShowReactionOptions(true)
    }, 500) // 500ms long press
    setLongPressTimer(timer)
  }

  const handleLikeTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  // Handle click outside to close menus
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close reaction options
      if (
        reactionOptionsRef.current &&
        !reactionOptionsRef.current.contains(event.target) &&
        likeButtonRef.current &&
        !likeButtonRef.current.contains(event.target)
      ) {
        setShowReactionOptions(false)
      }

      // Close options menu
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target) &&
        optionsButtonRef.current &&
        !optionsButtonRef.current.contains(event.target)
      ) {
        setShowOptionsMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle reaction selection
  const selectReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${post._id}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reactionType }),
      })

      if (response.ok) {
        const data = await response.json()
        // Toggle like state immediately for better UX
        setIsLiked(data.liked)
        setReactionType(data.liked ? reactionType : null)
        setLikesCount(data.likesCount)
        setShowReactionOptions(false)
        
        if (data.liked) {
          toast.success(`You ${reactionType}d this post!`, {
            theme: "light",
          })
        } else {
          toast.info("Reaction removed", {
            theme: "light",
          })
        }
      } else {
        throw new Error("Failed to react")
      }
    } catch (error) {
      console.error("Error reacting to post:", error)
      toast.error("Failed to react to post", {
        theme: "light",
      })
    }
  }

  // Get reaction icon based on reaction type
  const getReactionIcon = () => {
    switch (reactionType) {
      case "like":
        return <ThumbsUp size={20} className="mr-2 fill-blue-600 text-blue-600" />
      case "love":
        return <Heart size={20} className="mr-2 fill-red-500 text-red-500" />
      case "laugh":
        return <FaRegLaughBeam size={20} className="mr-2 text-yellow-500" />
      default:
        return <ThumbsUp size={20} className="mr-2" />
    }
  }

  // Handle share
  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${post._id}/shares`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSharesCount(sharesCount + 1)
        toast.success("Post shared successfully!", {
          theme: "light",
        })
      } else {
        throw new Error("Failed to share post")
      }
    } catch (error) {
      console.error("Error sharing post:", error)
      toast.error("Failed to share post", {
        theme: "light",
      })
    }
  }

  // Handle post deletion
  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${post._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setShowDeleteModal(false) // Close the modal after successful deletion
        toast.success("Post deleted successfully!", {
          theme: "light",
        })
        if (onPostDeleted) {
          onPostDeleted(post._id)
        }
      } else {
        throw new Error("Failed to delete post")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      toast.error("Failed to delete post", {
        theme: "light",
      })
    }
  }

  // Navigation functions
  const goToPostDetails = () => navigate(`/feed/post/${post._id}`)
  const goToLikesPage = () => navigate(`/feed/post/${post._id}/likes`)
  const goToUserProfile = (userId) => navigate(`/PublicProfile/${userId}`)

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${post._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      })

      if (response.ok) {
        setCommentText("")
        setCommentsCount(commentsCount + 1)
        toast.success("Comment added successfully!", {
          theme: "light",
        })
      } else {
        throw new Error("Failed to comment")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Failed to add comment", {
        theme: "light",
      })
    }
  }

  // Get user profile image
  const [user, setUser] = useState(null)
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const userImage = user?.picture || "/placeholder.svg?height=32&width=32"

  // Check if current user is the author of the post
  const isAuthor =
    currentUser && post.author && (currentUser._id === post.author._id || currentUser.id === post.author._id)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6 transition-shadow hover:shadow-lg">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={() => goToUserProfile(post.author._id)}
          >
            <img
              src={post.author.picture || "/placeholder.svg?height=48&width=48"}
              alt={post.author.name || `${post.author.firstName} ${post.author.lastName}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3">
            <h3
              className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => goToUserProfile(post.author._id)}
            >
              {post.author.name || `${post.author.firstName} ${post.author.lastName}`}
            </h3>
            <p className="text-sm text-gray-500">
              {post.author.role} •{" "}
              {post.createdAt && !isNaN(new Date(post.createdAt))
                ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
                : "Unknown time"}
            </p>
          </div>
        </div>

        {/* Options menu (three dots) */}
        {isAuthor && (
          <div className="relative">
            <button
              ref={optionsButtonRef}
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreVertical size={20} />
            </button>

            {showOptionsMenu && (
              <div
                ref={optionsMenuRef}
                className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
              >
                <button
                  onClick={() => {
                    setShowEditModal(true)
                    setShowOptionsMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Edit size={16} className="mr-2" />
                  Edit Post
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true)
                    setShowOptionsMenu(false)
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete Post
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Description */}
      <div className="px-4 pb-3">
        <p className="text-gray-800">
          {truncatedDescription}
          {post.description.length > 200 && (
            <button
              className="text-blue-600 hover:text-blue-800 ml-1 font-medium transition-colors"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "See less" : "See more"}
            </button>
          )}
        </p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative">
          <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
            {post.media[currentMediaIndex].type === "image" ? (
              <img
                src={post.media[currentMediaIndex].url || "/placeholder.svg"}
                alt="Post content"
                className="w-full h-full object-cover"
              />
            ) : (
              <video src={post.media[currentMediaIndex].url} controls className="w-full h-full object-cover" />
            )}

            {/* Media counter */}
            {post.media.length > 1 && (
              <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                {currentMediaIndex + 1}/{post.media.length}
              </div>
            )}
          </div>

          {/* Navigation buttons for multiple media */}
          {post.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                disabled={currentMediaIndex === 0}
                className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full transition-opacity ${
                  currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : "opacity-75 hover:opacity-100"
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextMedia}
                disabled={currentMediaIndex === post.media.length - 1}
                className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full transition-opacity ${
                  currentMediaIndex === post.media.length - 1
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Post Stats - First row with likes and comments counts */}
      <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <button className="flex items-center hover:text-blue-600 transition-colors" onClick={goToLikesPage}>
            <ThumbsUp size={16} className={`mr-1 ${isLiked ? "text-blue-600 fill-blue-600" : "text-gray-500"}`} />
            <span className={isLiked ? "text-blue-600" : "text-gray-500"}>{likesCount}</span>
          </button>
        </div>
        <div className="flex items-center space-x-4 text-gray-500">
          <button className="hover:text-blue-600 transition-colors" onClick={goToPostDetails}>
            <span>{commentsCount} comments</span>
          </button>
          <span>{sharesCount} shares</span>
        </div>
      </div>

      {/* Divider line */}
      <div className="border-t border-gray-200 mx-4"></div>

      {/* Post Actions - Second row with like, comment, share buttons */}
      <div className="px-4 py-2 flex justify-between">
        {/* Like button with reaction options */}
        <div className="relative w-1/3">
          <button
            ref={likeButtonRef}
            className={`flex flex-col items-center justify-center w-full py-2 px-4 ${
              isLiked ? (reactionType === "love" ? "text-red-500" : reactionType === "laugh" ? "text-yellow-500" : "text-blue-600") : "text-gray-600"
            } hover:bg-gray-50 rounded-md transition-colors`}
            onMouseEnter={handleLikeMouseEnter}
            onMouseLeave={handleLikeMouseLeave}
            onTouchStart={handleLikeTouchStart}
            onTouchEnd={handleLikeTouchEnd}
            onClick={() => selectReaction("like")}
          >
            <span className="text-xs mb-1">{likesCount}</span>
            <div className="flex items-center">
              {isLiked ? getReactionIcon() : <ThumbsUp size={20} className="mr-2" />}
              <span>Like</span>
            </div>
          </button>

          {/* Reaction options */}
          {showReactionOptions && (
            <div
              ref={reactionOptionsRef}
              className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10"
              onMouseEnter={handleReactionOptionsMouseEnter}
              onMouseLeave={handleReactionOptionsMouseLeave}
            >
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
                onClick={() => selectReaction("like")}
              >
                <ThumbsUp size={24} className="text-blue-600" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
                onClick={() => selectReaction("love")}
              >
                <Heart size={24} className="text-red-500" />
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
                onClick={() => selectReaction("laugh")}
              >
                <FaRegLaughBeam size={24} className="text-yellow-500" />
              </button>
            </div>
          )}
        </div>

        {/* Comment button */}
        <button
          className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
          onClick={goToPostDetails}
        >
          <span className="text-xs mb-1">{commentsCount}</span>
          <div className="flex items-center">
            <MessageCircle size={20} className="mr-2" />
            <span>Comment</span>
          </div>
        </button>

        {/* Share button */}
        <button
          className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
          onClick={handleShare}
        >
          <span className="text-xs mb-1">{sharesCount}</span>
          <div className="flex items-center">
            <Share2 size={20} className="mr-2" />
            <span>Share</span>
          </div>
        </button>
      </div>

      {/* Comment input section */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
            <img src={userImage || "/placeholder.svg"} alt="Your profile" className="w-full h-full object-cover" />
          </div>
          <input
            type="text"
            placeholder="Write a comment..."
            className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(e)}
          />
          <button
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
            disabled={!commentText.trim()}
            onClick={handleCommentSubmit}
          >
            Post
          </button>
        </div>
      </div>

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={(updatedPost) => {
            // Update the post in the parent component
            if (onPostDeleted) {
              onPostDeleted(post._id, updatedPost)
            }
            setShowEditModal(false)
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Post"
          message="Are you sure you want to delete this post? This action cannot be undone."
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default Post

























// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Heart, MessageCircle, Share2, ThumbsUp, ChevronRight, ChevronLeft } from 'lucide-react'
// import { FaRegLaughBeam } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"
// import { formatDistanceToNow } from 'date-fns'

// const Post = ({ post }) => {
//   const [showFullDescription, setShowFullDescription] = useState(false)
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [longPressTimer, setLongPressTimer] = useState(null)
//   const [commentText, setCommentText] = useState("")
//   const [isLiked, setIsLiked] = useState(false)
//   const navigate = useNavigate()
//   const likeButtonRef = useRef(null)
//   const reactionOptionsRef = useRef(null)

//   // Check if the current user has liked this post
//   useEffect(() => {
//     const checkIfLiked = async () => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`http://localhost:3000/posts/${post._id}/isLiked`, {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setIsLiked(data.isLiked)
//         }
//       } catch (error) {
//         console.error('Error checking if post is liked:', error)
//       }
//     }
    
//     checkIfLiked()
//   }, [post._id])

//   // Truncate description if needed
//   const truncatedDescription =
//     post.description.length > 200 && !showFullDescription
//       ? `${post.description.substring(0, 200)}...`
//       : post.description

//   // Handle media navigation
//   const nextMedia = () => {
//     if (currentMediaIndex < post.media.length - 1) {
//       setCurrentMediaIndex(currentMediaIndex + 1)
//     }
//   }

//   const prevMedia = () => {
//     if (currentMediaIndex > 0) {
//       setCurrentMediaIndex(currentMediaIndex - 1)
//     }
//   }

//   // Handle reactions
//   const handleLikeMouseEnter = () => {
//     if (window.innerWidth >= 768) {
//       setShowReactionOptions(true)
//     }
//   }

//   const handleLikeMouseLeave = (e) => {
//     if (
//       window.innerWidth >= 768 &&
//       reactionOptionsRef.current &&
//       !reactionOptionsRef.current.contains(e.relatedTarget)
//     ) {
//       setShowReactionOptions(false)
//     }
//   }

//   const handleReactionOptionsMouseEnter = () => {
//     if (window.innerWidth >= 768) {
//       setShowReactionOptions(true)
//     }
//   }

//   const handleReactionOptionsMouseLeave = () => {
//     if (window.innerWidth >= 768) {
//       setShowReactionOptions(false)
//     }
//   }

//   const handleLikeTouchStart = () => {
//     const timer = setTimeout(() => {
//       setShowReactionOptions(true)
//     }, 500) // 500ms long press
//     setLongPressTimer(timer)
//   }

//   const handleLikeTouchEnd = () => {
//     if (longPressTimer) {
//       clearTimeout(longPressTimer)
//       setLongPressTimer(null)
//     }
//   }

//   // Handle click outside to close reaction options
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         reactionOptionsRef.current &&
//         !reactionOptionsRef.current.contains(event.target) &&
//         likeButtonRef.current &&
//         !likeButtonRef.current.contains(event.target)
//       ) {
//         setShowReactionOptions(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Handle reaction selection
//   const selectReaction = async (reactionType) => {
//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`http://localhost:3000/posts/${post._id}/likes`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ reactionType }),
//       })
      
//       if (response.ok) {
//         // Toggle like state immediately for better UX
//         setIsLiked(!isLiked)
//         setShowReactionOptions(false)
//       } else {
//         throw new Error('Failed to react')
//       }
//     } catch (error) {
//       console.error('Error reacting to post:', error)
//     }
//   }

//   // Handle share
//   const handleShare = async () => {
//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`http://localhost:3000/posts/${post._id}/share`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       })
      
//       if (!response.ok) {
//         throw new Error('Failed to share post')
//       }
      
//       // You could update the UI to show the post was shared
//       alert('Post shared successfully!')
//     } catch (error) {
//       console.error('Error sharing post:', error)
//     }
//   }

//   // Navigation functions
//   const goToPostDetails = () => navigate(`/feed/post/${post._id}`)
//   const goToLikesPage = () => navigate(`/feed/post/${post._id}/likes`)
//   const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

//   // Handle comment submission
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault()
//     if (!commentText.trim()) return
    
//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`http://localhost:3000/posts/${post._id}/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: commentText }),
//       })
      
//       if (response.ok) {
//         setCommentText("")
//       } else {
//         throw new Error('Failed to comment')
//       }
//     } catch (error) {
//       console.error('Error posting comment:', error)
//     }
//   }

//   // Get user profile image
//   const [user, setUser] = useState(null)
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//     }
//   }, [])

//   const userImage = user?.picture || "/placeholder.svg?height=32&width=32"

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//       {/* Post Header */}
//       <div className="p-4 flex items-center">
//         <div
//           className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//           onClick={() => goToUserProfile(post.author._id)}
//         >
//           <img
//             src={post.author.picture || "/placeholder.svg?height=48&width=48"}
//             alt={post.author.name || `${post.author.firstName} ${post.author.lastName}`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-3">
//           <h3
//             className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//             onClick={() => goToUserProfile(post.author._id)}
//           >
//             {post.author.name || `${post.author.firstName} ${post.author.lastName}`}
//           </h3>
//           <p className="text-sm text-gray-500">
//             {post.author.role} • {
//               post.createdAt && !isNaN(new Date(post.createdAt))
//                 ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
//                 : "Unknown time"
//             }
//           </p>
//         </div>
//       </div>

//       {/* Post Description */}
//       <div className="px-4 pb-3">
//         <p className="text-gray-800">
//           {truncatedDescription}
//           {post.description.length > 200 && (
//             <button
//               className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
//               onClick={() => setShowFullDescription(!showFullDescription)}
//             >
//               {showFullDescription ? "See less" : "See more"}
//             </button>
//           )}
//         </p>
//       </div>

//       {/* Post Media */}
//       {post.media && post.media.length > 0 && (
//         <div className="relative">
//           <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
//             {post.media[currentMediaIndex].type === "image" ? (
//               <img
//                 src={post.media[currentMediaIndex].url || "/placeholder.svg"}
//                 alt="Post content"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <video src={post.media[currentMediaIndex].url} controls className="w-full h-full object-cover" />
//             )}

//             {/* Media counter */}
//             {post.media.length > 1 && (
//               <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                 {currentMediaIndex + 1}/{post.media.length}
//               </div>
//             )}
//           </div>

//           {/* Navigation buttons for multiple media */}
//           {post.media.length > 1 && (
//             <>
//               <button
//                 onClick={prevMedia}
//                 disabled={currentMediaIndex === 0}
//                 className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-70"
//                 }`}
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button
//                 onClick={nextMedia}
//                 disabled={currentMediaIndex === post.media.length - 1}
//                 className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === post.media.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-70"
//                 }`}
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Post Stats - First row with likes and comments counts */}
//       <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//         <div className="flex items-center space-x-2">
//           <button 
//             className="flex items-center text-gray-500 hover:text-blue-600" 
//             onClick={goToLikesPage}
//           >
//             <ThumbsUp size={16} className={`mr-1 ${isLiked ? "text-blue-600" : "text-gray-500"}`} />
//             <span className={isLiked ? "text-blue-600" : "text-gray-500"}>{post.likesCount || 0}</span>
//           </button>
//         </div>
//         <div className="flex items-center space-x-4 text-gray-500">
//           <button className="hover:text-blue-600" onClick={goToPostDetails}>
//             <span>{post.commentsCount || 0} comments</span>
//           </button>
//           <span>{post.sharesCount || 0} shares</span>
//         </div>
//       </div>

//       {/* Divider line */}
//       <div className="border-t border-gray-200 mx-4"></div>

//       {/* Post Actions - Second row with like, comment, share buttons */}
//       <div className="px-4 py-2 flex justify-between">
//         {/* Like button with reaction options */}
//         <div className="relative w-1/3">
//           <button
//             ref={likeButtonRef}
//             className={`flex flex-col items-center justify-center w-full py-2 px-4 ${
//               isLiked ? "text-blue-600" : "text-gray-600"
//             } hover:bg-gray-50 rounded-md transition-colors`}
//             onMouseEnter={handleLikeMouseEnter}
//             onMouseLeave={handleLikeMouseLeave}
//             onTouchStart={handleLikeTouchStart}
//             onTouchEnd={handleLikeTouchEnd}
//             onClick={() => selectReaction("like")}
//           >
//             <div className="flex items-center">
//               <ThumbsUp size={20} className="mr-2" />
//               <span>Like</span>
//             </div>
//           </button>

//           {/* Reaction options */}
//           {showReactionOptions && (
//             <div
//               ref={reactionOptionsRef}
//               className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10"
//               onMouseEnter={handleReactionOptionsMouseEnter}
//               onMouseLeave={handleReactionOptionsMouseLeave}
//             >
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("like")}
//               >
//                 <ThumbsUp size={24} className="text-blue-600" />
//               </button>
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("love")}
//               >
//                 <Heart size={24} className="text-red-500" />
//               </button>
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("laugh")}
//               >
//                 <FaRegLaughBeam size={24} className="text-yellow-500" />
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Comment button */}
//         <button
//           className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//           onClick={goToPostDetails}
//         >
//           <div className="flex items-center">
//             <MessageCircle size={20} className="mr-2" />
//             <span>Comment</span>
//           </div>
//         </button>

//         {/* Share button */}
//         <button 
//           className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//           onClick={handleShare}
//         >
//           <div className="flex items-center">
//             <Share2 size={20} className="mr-2" />
//             <span>Share</span>
//           </div>
//         </button>
//       </div>

//       {/* Comment input section */}
//       <div className="px-4 py-3 border-t border-gray-100">
//         <div className="flex items-center">
//           <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//             <img src={userImage || "/placeholder.svg"} alt="Your profile" className="w-full h-full object-cover" />
//           </div>
//           <input
//             type="text"
//             placeholder="Write a comment..."
//             className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//             onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(e)}
//           />
//           <button
//             className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//             disabled={!commentText.trim()}
//             onClick={handleCommentSubmit}
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Post









// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Heart, MessageCircle, Share2, ThumbsUp, ChevronRight, ChevronLeft } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"

// const Post = ({ post }) => {
//   const [showFullDescription, setShowFullDescription] = useState(false)
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [longPressTimer, setLongPressTimer] = useState(null)
//   const [commentText, setCommentText] = useState("")
//   const navigate = useNavigate()
//   const likeButtonRef = useRef(null)
//   const reactionOptionsRef = useRef(null)

//   // Truncate description if needed
//   const truncatedDescription =
//     post.description.length > 200 && !showFullDescription
//       ? `${post.description.substring(0, 200)}...`
//       : post.description

//   // Handle media navigation
//   const nextMedia = () => {
//     if (currentMediaIndex < post.media.length - 1) {
//       setCurrentMediaIndex(currentMediaIndex + 1)
//     }
//   }

//   const prevMedia = () => {
//     if (currentMediaIndex > 0) {
//       setCurrentMediaIndex(currentMediaIndex - 1)
//     }
//   }

//   // Handle reactions
//   const handleLikeMouseEnter = () => {
//     if (window.innerWidth >= 768) {
//       // Only on larger screens
//       setShowReactionOptions(true)
//     }
//   }

//   const handleLikeMouseLeave = (e) => {
//     // Check if the mouse is moving to the reaction options
//     if (
//       window.innerWidth >= 768 &&
//       reactionOptionsRef.current &&
//       !reactionOptionsRef.current.contains(e.relatedTarget)
//     ) {
//       setShowReactionOptions(false)
//     }
//   }

//   const handleReactionOptionsMouseEnter = () => {
//     if (window.innerWidth >= 768) {
//       setShowReactionOptions(true)
//     }
//   }

//   const handleReactionOptionsMouseLeave = () => {
//     if (window.innerWidth >= 768) {
//       setShowReactionOptions(false)
//     }
//   }

//   const handleLikeTouchStart = () => {
//     // For mobile: start timer for long press
//     const timer = setTimeout(() => {
//       setShowReactionOptions(true)
//     }, 500) // 500ms long press
//     setLongPressTimer(timer)
//   }

//   const handleLikeTouchEnd = () => {
//     // Clear the timer if touch ends before long press threshold
//     if (longPressTimer) {
//       clearTimeout(longPressTimer)
//       setLongPressTimer(null)
//     }
//   }

//   // Handle click outside to close reaction options
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         reactionOptionsRef.current &&
//         !reactionOptionsRef.current.contains(event.target) &&
//         likeButtonRef.current &&
//         !likeButtonRef.current.contains(event.target)
//       ) {
//         setShowReactionOptions(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   // Handle reaction selection
//   const selectReaction = (reactionType) => {
//     console.log(`Reacted with ${reactionType} to post ${post.id}`)
//     setShowReactionOptions(false)
//     // Here you would call your API to save the reaction
//   }

//   // Navigate to post details
//   const goToPostDetails = () => {
//     navigate(`/feed/post/${post.id}`)
//   }

//   // Navigate to likes page
//   const goToLikesPage = () => {
//     navigate(`/feed/post/${post.id}/likes`)
//   }

//   // Handle comment submission
//   const handleCommentSubmit = (e) => {
//     e.preventDefault()
//     if (commentText.trim()) {
//       console.log(`New comment on post ${post.id}: ${commentText}`)
//       setCommentText("")
//       // Here you would call your API to save the comment
//     }
//   }

//   // Navigate to user profile
//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//       {/* Post Header */}
//       <div className="p-4 flex items-center">
//         <div
//           className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//           onClick={() => goToUserProfile(post.author.id)}
//         >
//           <img
//             src={post.author.profilePicture || "/placeholder.svg"}
//             alt={post.author.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-3">
//           <h3
//             className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//             onClick={() => goToUserProfile(post.author.id)}
//           >
//             {post.author.name}
//           </h3>
//           <p className="text-sm text-gray-500">
//             {post.author.role} • {post.timeAgo}
//           </p>
//         </div>
//       </div>

//       {/* Post Description */}
//       <div className="px-4 pb-3">
//         <p className="text-gray-800">
//           {truncatedDescription}
//           {post.description.length > 200 && (
//             <button
//               className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
//               onClick={() => setShowFullDescription(!showFullDescription)}
//             >
//               {showFullDescription ? "See less" : "See more"}
//             </button>
//           )}
//         </p>
//       </div>

//       {/* Post Media */}
//       {post.media && post.media.length > 0 && (
//         <div className="relative">
//           <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
//             {post.media[currentMediaIndex].type === "image" ? (
//               <img
//                 src={post.media[currentMediaIndex].url || "/placeholder.svg"}
//                 alt="Post content"
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <video src={post.media[currentMediaIndex].url} controls className="w-full h-full object-cover" />
//             )}

//             {/* Media counter */}
//             {post.media.length > 1 && (
//               <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                 {currentMediaIndex + 1}/{post.media.length}
//               </div>
//             )}
//           </div>

//           {/* Navigation buttons for multiple media */}
//           {post.media.length > 1 && (
//             <>
//               <button
//                 onClick={prevMedia}
//                 disabled={currentMediaIndex === 0}
//                 className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-70"
//                 }`}
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button
//                 onClick={nextMedia}
//                 disabled={currentMediaIndex === post.media.length - 1}
//                 className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === post.media.length - 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-70"
//                 }`}
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Post Stats */}
//       <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//         <div className="flex items-center space-x-2">
//           <button className="flex items-center text-gray-500 hover:text-blue-600" onClick={goToLikesPage}>
//             <ThumbsUp size={16} className="mr-1" />
//             <span>{post.likes.count}</span>
//           </button>
//         </div>
//         <div className="flex items-center space-x-4 text-gray-500">
//           <button className="hover:text-blue-600" onClick={goToPostDetails}>
//             <span>{post.comments.count} comments</span>
//           </button>
//           <button className="hover:text-blue-600">
//             <span>{post.shares} shares</span>
//           </button>
//         </div>
//       </div>

//       {/* Post Actions */}
//       <div className="px-4 py-2 flex justify-between border-t border-gray-100">
//         <div className="relative">
//           <button
//             ref={likeButtonRef}
//             className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//             onMouseEnter={handleLikeMouseEnter}
//             onMouseLeave={handleLikeMouseLeave}
//             onTouchStart={handleLikeTouchStart}
//             onTouchEnd={handleLikeTouchEnd}
//             onClick={() => selectReaction("like")}
//           >
//             <span className="text-xs mb-1">{post.likes.count}</span>
//             <div className="flex items-center">
//               <ThumbsUp size={20} className="mr-2" />
//               <span>Like</span>
//             </div>
//           </button>

//           {/* Reaction options */}
//           {showReactionOptions && (
//             <div
//               ref={reactionOptionsRef}
//               className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10"
//               onMouseEnter={handleReactionOptionsMouseEnter}
//               onMouseLeave={handleReactionOptionsMouseLeave}
//             >
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("like")}
//               >
//                 <ThumbsUp size={24} className="text-blue-600" />
//               </button>
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("love")}
//               >
//                 <Heart size={24} className="text-red-500" />
//               </button>
//               <button
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction("laugh")}
//               >
//                 <FaRegLaughBeam size={24} className="text-yellow-500" />
//               </button>
//             </div>
//           )}
//         </div>

//         <button
//           className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//           onClick={goToPostDetails}
//         >
//           <span className="text-xs mb-1">{post.comments.count}</span>
//           <div className="flex items-center">
//             <MessageCircle size={20} className="mr-2" />
//             <span>Comment</span>
//           </div>
//         </button>

//         <button className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//           <span className="text-xs mb-1">{post.shares}</span>
//           <div className="flex items-center">
//             <Share2 size={20} className="mr-2" />
//             <span>Share</span>
//           </div>
//         </button>
//       </div>

//       {/* Quick Comment Section */}
//       <div className="px-4 py-3 border-t border-gray-100">
//         <form onSubmit={handleCommentSubmit} className="flex items-center">
//           <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//             <img src="/placeholder.svg?height=32&width=32" alt="Your profile" className="w-full h-full object-cover" />
//           </div>
//           <input
//             type="text"
//             placeholder="Write a comment..."
//             className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//           />
//           <button
//             type="submit"
//             className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//             disabled={!commentText.trim()}
//           >
//             Post
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Post






















// "use client"

// import { useState, useRef } from "react"
// import { Heart, MessageCircle, Share2, ThumbsUp, ChevronRight, ChevronLeft } from 'lucide-react'
// import { FaRegLaughBeam } from "react-icons/fa"
// import { useNavigate } from "react-router-dom"

// const Post = ({ post }) => {
//   const [showFullDescription, setShowFullDescription] = useState(false)
//   const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [longPressTimer, setLongPressTimer] = useState(null)
//   const [commentText, setCommentText] = useState("")
//   const navigate = useNavigate()
//   const likeButtonRef = useRef(null)

//   // Truncate description if needed
//   const truncatedDescription = post.description.length > 200 && !showFullDescription
//     ? `${post.description.substring(0, 200)}...`
//     : post.description

//   // Handle media navigation
//   const nextMedia = () => {
//     if (currentMediaIndex < post.media.length - 1) {
//       setCurrentMediaIndex(currentMediaIndex + 1)
//     }
//   }

//   const prevMedia = () => {
//     if (currentMediaIndex > 0) {
//       setCurrentMediaIndex(currentMediaIndex - 1)
//     }
//   }

//   // Handle reactions
//   const handleLikeMouseEnter = () => {
//     if (window.innerWidth >= 768) { // Only on larger screens
//       setShowReactionOptions(true)
//     }
//   }

//   const handleLikeMouseLeave = () => {
//     if (window.innerWidth >= 768) { // Only on larger screens
//       setShowReactionOptions(false)
//     }
//   }

//   const handleLikeTouchStart = () => {
//     // For mobile: start timer for long press
//     const timer = setTimeout(() => {
//       setShowReactionOptions(true)
//     }, 500) // 500ms long press
//     setLongPressTimer(timer)
//   }

//   const handleLikeTouchEnd = () => {
//     // Clear the timer if touch ends before long press threshold
//     if (longPressTimer) {
//       clearTimeout(longPressTimer)
//       setLongPressTimer(null)
//     }
//   }

//   // Handle reaction selection
//   const selectReaction = (reactionType) => {
//     console.log(`Reacted with ${reactionType} to post ${post.id}`)
//     setShowReactionOptions(false)
//     // Here you would call your API to save the reaction
//   }

//   // Navigate to post details
//   const goToPostDetails = () => {
//     navigate(`/feed/post/${post.id}`)
//   }

//   // Navigate to likes page
//   const goToLikesPage = () => {
//     navigate(`/feed/post/${post.id}/likes`)
//   }

//   // Handle comment submission
//   const handleCommentSubmit = (e) => {
//     e.preventDefault()
//     if (commentText.trim()) {
//       console.log(`New comment on post ${post.id}: ${commentText}`)
//       setCommentText("")
//       // Here you would call your API to save the comment
//     }
//   }

//   // Navigate to user profile
//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//       {/* Post Header */}
//       <div className="p-4 flex items-center">
//         <div 
//           className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//           onClick={() => goToUserProfile(post.author.id)}
//         >
//           <img 
//             src={post.author.profilePicture || "/placeholder.svg"} 
//             alt={post.author.name} 
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-3">
//           <h3 
//             className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//             onClick={() => goToUserProfile(post.author.id)}
//           >
//             {post.author.name}
//           </h3>
//           <p className="text-sm text-gray-500">{post.author.role} • {post.timeAgo}</p>
//         </div>
//       </div>

//       {/* Post Description */}
//       <div className="px-4 pb-3">
//         <p className="text-gray-800">
//           {truncatedDescription}
//           {post.description.length > 200 && (
//             <button 
//               className="text-blue-600 hover:text-blue-800 ml-1 font-medium"
//               onClick={() => setShowFullDescription(!showFullDescription)}
//             >
//               {showFullDescription ? "See less" : "See more"}
//             </button>
//           )}
//         </p>
//       </div>

//       {/* Post Media */}
//       {post.media && post.media.length > 0 && (
//         <div className="relative">
//           <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
//             {post.media[currentMediaIndex].type === 'image' ? (
//               <img 
//                 src={post.media[currentMediaIndex].url || "/placeholder.svg"} 
//                 alt="Post content" 
//                 className="w-full h-full object-cover"
//               />
//             ) : (
//               <video 
//                 src={post.media[currentMediaIndex].url} 
//                 controls 
//                 className="w-full h-full object-cover"
//               />
//             )}
            
//             {/* Media counter */}
//             {post.media.length > 1 && (
//               <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//                 {currentMediaIndex + 1}/{post.media.length}
//               </div>
//             )}
//           </div>
          
//           {/* Navigation buttons for multiple media */}
//           {post.media.length > 1 && (
//             <>
//               <button 
//                 onClick={prevMedia} 
//                 disabled={currentMediaIndex === 0}
//                 className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'
//                 }`}
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <button 
//                 onClick={nextMedia} 
//                 disabled={currentMediaIndex === post.media.length - 1}
//                 className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//                   currentMediaIndex === post.media.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'
//                 }`}
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* Post Stats */}
//       <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//         <div className="flex items-center space-x-2">
//           <button 
//             className="flex items-center text-gray-500 hover:text-blue-600"
//             onClick={goToLikesPage}
//           >
//             <ThumbsUp size={16} className="mr-1" />
//             <span>{post.likes.count}</span>
//           </button>
//         </div>
//         <div className="flex items-center space-x-4 text-gray-500">
//           <button className="hover:text-blue-600" onClick={goToPostDetails}>
//             <span>{post.comments.count} comments</span>
//           </button>
//           <button className="hover:text-blue-600">
//             <span>{post.shares} shares</span>
//           </button>
//         </div>
//       </div>

//       {/* Post Actions */}
//       <div className="px-4 py-2 flex justify-between border-t border-gray-100">
//         <div className="relative">
//           <button 
//             ref={likeButtonRef}
//             className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//             onMouseEnter={handleLikeMouseEnter}
//             onMouseLeave={handleLikeMouseLeave}
//             onTouchStart={handleLikeTouchStart}
//             onTouchEnd={handleLikeTouchEnd}
//             onClick={() => selectReaction('like')}
//           >
//             <ThumbsUp size={20} className="mr-2" />
//             <span>Like</span>
//           </button>
          
//           {/* Reaction options */}
//           {showReactionOptions && (
//             <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10">
//               <button 
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction('like')}
//               >
//                 <ThumbsUp size={24} className="text-blue-600" />
//               </button>
//               <button 
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction('love')}
//               >
//                 <Heart size={24} className="text-red-500" />
//               </button>
//               <button 
//                 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 onClick={() => selectReaction('laugh')}
//               >
//                 <FaRegLaughBeam size={24} className="text-yellow-500" />
//               </button>
//             </div>
//           )}
//         </div>
        
//         <button 
//           className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//           onClick={goToPostDetails}
//         >
//           <MessageCircle size={20} className="mr-2" />
//           <span>Comment</span>
//         </button>
        
//         <button className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//           <Share2 size={20} className="mr-2" />
//           <span>Share</span>
//         </button>
//       </div>

//       {/* Quick Comment Section */}
//       <div className="px-4 py-3 border-t border-gray-100">
//         <form onSubmit={handleCommentSubmit} className="flex items-center">
//           <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//             <img 
//               src="/placeholder.svg?height=32&width=32" 
//               alt="Your profile" 
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <input
//             type="text"
//             placeholder="Write a comment..."
//             className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={commentText}
//             onChange={(e) => setCommentText(e.target.value)}
//           />
//           <button 
//             type="submit"
//             className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//             disabled={!commentText.trim()}
//           >
//             Post
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Post
