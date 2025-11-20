"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, ArrowLeft, ThumbsUp, Heart, MessageCircle, Share2, MoreVertical, Edit, Trash2 } from "lucide-react"
import { FaRegLaughBeam } from "react-icons/fa"
import Comment from "../components/Comment"
import MediaCarousel from "../components/MediaCarousel"
import Loader from "../components/Loader"
import UpcomingEvents from "../components/UpcommingEvents"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import EditPostModal from "../components/EditPostModal"
import DeleteConfirmModal from "../components/DeleteConfirmModal"

const PostDetail = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState("")
  const [showReactionOptions, setShowReactionOptions] = useState(false)
  const [displayedComments, setDisplayedComments] = useState([])
  const [isLiked, setIsLiked] = useState(false)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [user, setUser] = useState(null)

  const likeButtonRef = useRef(null)
  const reactionOptionsRef = useRef(null)

  // Get current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  const userImage = user?.picture || "/placeholder.svg?height=32&width=32"

  // Fetch post and comments
  useEffect(() => {
    const fetchPostData = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")

        // Fetch post details
        const postResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        // Fetch comments
        const commentsResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!postResponse.ok) {
          throw new Error("Failed to fetch post")
        }

        const postData = await postResponse.json()
        const commentsData = await commentsResponse.json()

        setPost({
          ...postData,
          author: {
            ...postData.author,
            name: `${postData.author.firstName} ${postData.author.lastName}`,
          },
        })
        setDisplayedComments(commentsData)
        setIsLiked(postData.likedByMe || false)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching post data:", error)
        toast.error("Failed to load post", {
          theme: "light",
        })
        setLoading(false)
      }
    }

    fetchPostData()
  }, [postId])

  // Handle reaction options hover
  const handleLikeMouseEnter = () => {
    setShowReactionOptions(true)
  }

  const handleLikeMouseLeave = () => {
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

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      })

      if (response.ok) {
        const newComment = await response.json()
        setDisplayedComments([newComment, ...displayedComments])
        setCommentText("")

        // Update post comment count
        setPost((prev) => ({
          ...prev,
          commentsCount: (prev.commentsCount || 0) + 1,
        }))

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

  // Handle reply to comment
  const handleReply = (commentId, newReply) => {
    setDisplayedComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          }
        }
        return comment
      }),
    )

    setPost((prev) => ({
      ...prev,
      commentsCount: (prev.commentsCount || 0) + 1,
    }))
  }

  // Handle comment update
  const handleCommentUpdate = (updatedComment) => {
    setDisplayedComments((prevComments) =>
      prevComments.map((comment) => {
        if (comment._id === updatedComment._id) {
          return { ...comment, ...updatedComment }
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply._id === updatedComment._id ? { ...reply, ...updatedComment } : reply,
            ),
          }
        }
        return comment
      }),
    )
  }

  // Handle comment deletion
  const handleCommentDelete = (commentId) => {
    setDisplayedComments((prevComments) => {
      const filteredComments = prevComments.filter((comment) => comment._id !== commentId)
      if (filteredComments.length === prevComments.length) {
        return prevComments.map((comment) => {
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply._id !== commentId),
            }
          }
          return comment
        })
      }
      return filteredComments
    })

    setPost((prev) => ({
      ...prev,
      commentsCount: Math.max(0, (prev.commentsCount || 0) - 1),
    }))
  }

  // Handle reaction selection
  const selectReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/likes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reactionType }),
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)

        setPost((prev) => ({
          ...prev,
          likesCount: data.likesCount,
        }))

        setShowReactionOptions(false)
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

  // Handle share
  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/shares`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setPost((prev) => ({
          ...prev,
          sharesCount: (prev.sharesCount || 0) + 1,
        }))

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
      const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Post deleted successfully!", {
          theme: "light",
        })
        navigate("/feed")
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

  const goToLikesPage = () => navigate(`/feed/post/${postId}/likes`)
  const goBackToFeed = () => navigate("/feed")
  const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

  const isAuthor =
    currentUser && post && post.author && (currentUser._id === post.author._id || currentUser.id === post.author._id)

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Loader />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
        <button
          onClick={goBackToFeed}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Feed
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8 relative">
        <div className="w-full lg:w-4/5">
          <button
            onClick={goBackToFeed}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            Back to Feed
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className="w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105"
                  onClick={() => goToUserProfile(post.author._id)}
                >
                  <img
                    src={post.author.picture || "/placeholder.svg"}
                    alt={post.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="ml-3">
                  <h3
                    className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => goToUserProfile(post.author._id)}
                  >
                    {post.author.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {post.author.role} â€¢ {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>

              {/* Options menu (three dots) */}
              {isAuthor && (
                <div className="relative">
                  <button
                    onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {showOptionsMenu && (
                    <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
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
              <p className="text-gray-800 whitespace-pre-line">{post.description}</p>
            </div>

            {/* Post Media */}
            {post.media && post.media.length > 0 && <MediaCarousel media={post.media} />}

            {/* Post Stats */}
            <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <button className="flex items-center hover:text-blue-600 transition-colors" onClick={goToLikesPage}>
                  <ThumbsUp size={16} className={`mr-1 ${isLiked ? "text-blue-600 fill-blue-600" : "text-gray-500"}`} />
                  <span className={isLiked ? "text-blue-600" : "text-gray-500"}>{post.likesCount || 0}</span>
                </button>
              </div>
              <div className="flex items-center space-x-4 text-gray-500">
                <span>{post.commentsCount || 0} comments</span>
                <span>{post.sharesCount || 0} shares</span>
              </div>
            </div>

            {/* Divider line */}
            <div className="border-t border-gray-200 mx-4"></div>

            {/* Post Actions */}
            <div className="px-4 py-2 flex justify-between">
              {/* Like button with reaction options */}
              <div className="relative w-1/3">
                <button
                  ref={likeButtonRef}
                  className={`flex flex-col items-center justify-center w-full py-2 px-4 ${
                    isLiked ? "text-blue-600" : "text-gray-600"
                  } hover:bg-gray-50 rounded-md transition-colors`}
                  onMouseEnter={handleLikeMouseEnter}
                  onMouseLeave={handleLikeMouseLeave}
                  onClick={() => selectReaction("like")}
                >
                  <span className="text-xs mb-1">{post.likesCount || 0}</span>
                  <div className="flex items-center">
                    <ThumbsUp size={20} className={`mr-2 ${isLiked ? "fill-blue-600" : ""}`} />
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
              <button className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
                <span className="text-xs mb-1">{post.commentsCount || 0}</span>
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
                <span className="text-xs mb-1">{post.sharesCount || 0}</span>
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
                  <img
                    src={userImage || "/placeholder.svg"}
                    alt="Your profile"
                    className="w-full h-full object-cover"
                  />
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
                  onClick={handleCommentSubmit}
                  className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                  disabled={!commentText.trim()}
                >
                  Post
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="px-4 py-3 border-t border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>
              <div className="space-y-4">
                {displayedComments.length > 0 ? (
                  displayedComments.map((comment) => (
                    <Comment
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      onReply={handleReply}
                      onCommentUpdated={handleCommentUpdate}
                      onCommentDeleted={handleCommentDelete}
                    />
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
                )}
              </div>
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

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={(updatedPost) => {
            setPost({ ...post, ...updatedPost })
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

export default PostDetail




















// "use client"

// import { useState, useEffect, useRef } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Calendar, ArrowLeft, ThumbsUp, Heart, MessageCircle, Share2, MoreVertical, Edit, Trash2 } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Comment from "../components/Comment"
// import MediaCarousel from "../components/MediaCarousel"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"
// import { formatDistanceToNow } from "date-fns"
// import { toast } from "react-toastify"
// import EditPostModal from "../components/EditPostModal"
// import DeleteConfirmModal from "../components/DeleteConfirmModal"

// const PostDetail = () => {
//   const { postId } = useParams()
//   const navigate = useNavigate()
//   const [post, setPost] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [commentText, setCommentText] = useState("")
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [displayedComments, setDisplayedComments] = useState([])
//   const [isLiked, setIsLiked] = useState(false)
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false)
//   const [showEditModal, setShowEditModal] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [currentUser, setCurrentUser] = useState(null)
//   const [user, setUser] = useState(null)

//   const likeButtonRef = useRef(null)
//   const reactionOptionsRef = useRef(null)

//   // Get current user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       setUser(JSON.parse(storedUser))
//       setCurrentUser(JSON.parse(storedUser))
//     }
//   }, [])

//   const userImage = user?.picture || "/placeholder.svg?height=32&width=32"

//   // Fetch post and comments
//   useEffect(() => {
//     const fetchPostData = async () => {
//       setLoading(true)
//       try {
//         const token = localStorage.getItem("token")

//         // Fetch post details
//         const postResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         // Fetch comments
//         const commentsResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })

//         if (!postResponse.ok) {
//           throw new Error("Failed to fetch post")
//         }

//         const postData = await postResponse.json()
//         const commentsData = await commentsResponse.json()

//         setPost({
//           ...postData,
//           author: {
//             ...postData.author,
//             name: `${postData.author.firstName} ${postData.author.lastName}`,
//           },
//         })
//         setDisplayedComments(commentsData)
//         setIsLiked(postData.likedByMe || false)
//         setLoading(false)
//       } catch (error) {
//         console.error("Error fetching post data:", error)
//         toast.error("Failed to load post", {
//           theme: "light",
//         })
//         setLoading(false)
//       }
//     }

//     fetchPostData()
//   }, [postId])

//   // Handle reaction options hover
//   const handleLikeMouseEnter = () => {
//     setShowReactionOptions(true)
//   }

//   const handleLikeMouseLeave = () => {
//     setTimeout(() => {
//       if (!reactionOptionsRef.current?.matches(":hover")) {
//         setShowReactionOptions(false)
//       }
//     }, 100)
//   }

//   const handleReactionOptionsMouseEnter = () => {
//     setShowReactionOptions(true)
//   }

//   const handleReactionOptionsMouseLeave = () => {
//     setShowReactionOptions(false)
//   }

//   // Handle comment submission
//   const handleCommentSubmit = async (e) => {
//     e.preventDefault()
//     if (!commentText.trim()) return

//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: commentText }),
//       })

//       if (response.ok) {
//         const newComment = await response.json()
//         setDisplayedComments([newComment, ...displayedComments])
//         setCommentText("")

//         // Update post comment count
//         setPost((prev) => ({
//           ...prev,
//           commentsCount: (prev.commentsCount || 0) + 1,
//         }))

//         toast.success("Comment added successfully!", {
//           theme: "light",
//         })
//       } else {
//         throw new Error("Failed to comment")
//       }
//     } catch (error) {
//       console.error("Error posting comment:", error)
//       toast.error("Failed to add comment", {
//         theme: "light",
//       })
//     }
//   }

//   // Handle reply to comment
//   const handleReply = (commentId, newReply) => {
//     // Update the comments state with the new reply
//     setDisplayedComments((prevComments) =>
//       prevComments.map((comment) => {
//         if (comment._id === commentId) {
//           return {
//             ...comment,
//             replies: [...(comment.replies || []), newReply],
//           }
//         }
//         return comment
//       }),
//     )

//     // Update post comment count
//     setPost((prev) => ({
//       ...prev,
//       commentsCount: (prev.commentsCount || 0) + 1,
//     }))
//   }

//   // Handle comment update
//   const handleCommentUpdate = (commentId, updatedComment) => {
//     setDisplayedComments((prevComments) =>
//       prevComments.map((comment) => {
//         if (comment._id === commentId) {
//           return { ...comment, ...updatedComment }
//         }

//         // Check if the comment is in replies
//         if (comment.replies && comment.replies.length > 0) {
//           return {
//             ...comment,
//             replies: comment.replies.map((reply) =>
//               reply._id === commentId ? { ...reply, ...updatedComment } : reply,
//             ),
//           }
//         }

//         return comment
//       }),
//     )
//   }

//   // Handle comment deletion
//   const handleCommentDelete = (commentId, updatedCommentsCount) => {
//     const removeCommentById = (comments, commentId) => {
//       return comments.filter((comment) => {
//         if (comment._id === commentId) return false
//         if (comment.replies) {
//           comment.replies = removeCommentById(comment.replies, commentId)
//         }
//         return true
//       })
//     }

//     setDisplayedComments((prevComments) => removeCommentById(prevComments, commentId))
//     setPost((prev) => ({
//       ...prev,
//       commentsCount: updatedCommentsCount,
//     }))
//   }

//   // Handle reaction selection
//   const selectReaction = async (reactionType) => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/likes`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ reactionType }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setIsLiked(data.liked)

//         // Update post likes count
//         setPost((prev) => ({
//           ...prev,
//           likesCount: data.likesCount,
//         }))

//         setShowReactionOptions(false)
//       } else {
//         throw new Error("Failed to react")
//       }
//     } catch (error) {
//       console.error("Error reacting to post:", error)
//       toast.error("Failed to react to post", {
//         theme: "light",
//       })
//     }
//   }

//   // Handle share
//   const handleShare = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/shares`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         // Update post shares count
//         setPost((prev) => ({
//           ...prev,
//           sharesCount: (prev.sharesCount || 0) + 1,
//         }))

//         toast.success("Post shared successfully!", {
//           theme: "light",
//         })
//       } else {
//         throw new Error("Failed to share post")
//       }
//     } catch (error) {
//       console.error("Error sharing post:", error)
//       toast.error("Failed to share post", {
//         theme: "light",
//       })
//     }
//   }

//   // Handle post deletion
//   const handleDeletePost = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })

//       if (response.ok) {
//         toast.success("Post deleted successfully!", {
//           theme: "light",
//         })
//         navigate("/feed")
//       } else {
//         throw new Error("Failed to delete post")
//       }
//     } catch (error) {
//       console.error("Error deleting post:", error)
//       toast.error("Failed to delete post", {
//         theme: "light",
//       })
//     }
//   }

//   const goToLikesPage = () => navigate(`/feed/post/${postId}/likes`)
//   const goBackToFeed = () => navigate("/feed")
//   const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

//   // Check if current user is the author of the post
//   const isAuthor =
//     currentUser && post && post.author && (currentUser._id === post.author._id || currentUser.id === post.author._id)

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
//         <button
//           onClick={goBackToFeed}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Feed
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         <div className="w-full lg:w-4/5">
//           <button
//             onClick={goBackToFeed}
//             className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
//           >
//             <ArrowLeft size={20} className="mr-1" />
//             Back to Feed
//           </button>

//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             {/* Post Header */}
//             <div className="p-4 flex items-center justify-between">
//               <div className="flex items-center">
//                 <div
//                   className="w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-transform hover:scale-105"
//                   onClick={() => goToUserProfile(post.author._id)}
//                 >
//                   <img
//                     src={post.author.picture || "/placeholder.svg"}
//                     alt={post.author.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <div className="ml-3">
//                   <h3
//                     className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors"
//                     onClick={() => goToUserProfile(post.author._id)}
//                   >
//                     {post.author.name}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {post.author.role} â€¢ {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//                   </p>
//                 </div>
//               </div>

//               {/* Options menu (three dots) */}
//               {isAuthor && (
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowOptionsMenu(!showOptionsMenu)}
//                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//                   >
//                     <MoreVertical size={20} />
//                   </button>

//                   {showOptionsMenu && (
//                     <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
//                       <button
//                         onClick={() => {
//                           setShowEditModal(true)
//                           setShowOptionsMenu(false)
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                       >
//                         <Edit size={16} className="mr-2" />
//                         Edit Post
//                       </button>
//                       <button
//                         onClick={() => {
//                           setShowDeleteModal(true)
//                           setShowOptionsMenu(false)
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
//                       >
//                         <Trash2 size={16} className="mr-2" />
//                         Delete Post
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             {/* Post Description */}
//             <div className="px-4 pb-3">
//               <p className="text-gray-800 whitespace-pre-line">{post.description}</p>
//             </div>

//             {/* Post Media */}
//             {post.media && post.media.length > 0 && <MediaCarousel media={post.media} />}

//             {/* Post Stats */}
//             <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//               <div className="flex items-center space-x-2">
//                 <button className="flex items-center hover:text-blue-600 transition-colors" onClick={goToLikesPage}>
//                   <ThumbsUp size={16} className={`mr-1 ${isLiked ? "text-blue-600 fill-blue-600" : "text-gray-500"}`} />
//                   <span className={isLiked ? "text-blue-600" : "text-gray-500"}>{post.likesCount || 0}</span>
//                 </button>
//               </div>
//               <div className="flex items-center space-x-4 text-gray-500">
//                 <span>{post.commentsCount || 0} comments</span>
//                 <span>{post.sharesCount || 0} shares</span>
//               </div>
//             </div>

//             {/* Divider line */}
//             <div className="border-t border-gray-200 mx-4"></div>

//             {/* Post Actions */}
//             <div className="px-4 py-2 flex justify-between">
//               {/* Like button with reaction options */}
//               <div className="relative w-1/3">
//                 <button
//                   ref={likeButtonRef}
//                   className={`flex flex-col items-center justify-center w-full py-2 px-4 ${
//                     isLiked ? "text-blue-600" : "text-gray-600"
//                   } hover:bg-gray-50 rounded-md transition-colors`}
//                   onMouseEnter={handleLikeMouseEnter}
//                   onMouseLeave={handleLikeMouseLeave}
//                   onClick={() => selectReaction("like")}
//                 >
//                   <span className="text-xs mb-1">{post.likesCount || 0}</span>
//                   <div className="flex items-center">
//                     <ThumbsUp size={20} className={`mr-2 ${isLiked ? "fill-blue-600" : ""}`} />
//                     <span>Like</span>
//                   </div>
//                 </button>

//                 {/* Reaction options */}
//                 {showReactionOptions && (
//                   <div
//                     ref={reactionOptionsRef}
//                     className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10"
//                     onMouseEnter={handleReactionOptionsMouseEnter}
//                     onMouseLeave={handleReactionOptionsMouseLeave}
//                   >
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
//                       onClick={() => selectReaction("like")}
//                     >
//                       <ThumbsUp size={24} className="text-blue-600" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
//                       onClick={() => selectReaction("love")}
//                     >
//                       <Heart size={24} className="text-red-500" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors transform hover:scale-110"
//                       onClick={() => selectReaction("laugh")}
//                     >
//                       <FaRegLaughBeam size={24} className="text-yellow-500" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Comment button */}
//               <button className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                 <span className="text-xs mb-1">{post.commentsCount || 0}</span>
//                 <div className="flex items-center">
//                   <MessageCircle size={20} className="mr-2" />
//                   <span>Comment</span>
//                 </div>
//               </button>

//               {/* Share button */}
//               <button
//                 className="w-1/3 flex flex-col items-center justify-center py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//                 onClick={handleShare}
//               >
//                 <span className="text-xs mb-1">{post.sharesCount || 0}</span>
//                 <div className="flex items-center">
//                   <Share2 size={20} className="mr-2" />
//                   <span>Share</span>
//                 </div>
//               </button>
//             </div>

//             {/* Comment input section */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <div className="flex items-center">
//                 <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                   <img
//                     src={userImage || "/placeholder.svg"}
//                     alt="Your profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Write a comment..."
//                   className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(e)}
//                 />
//                 <button
//                   onClick={handleCommentSubmit}
//                   className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//                   disabled={!commentText.trim()}
//                 >
//                   Post
//                 </button>
//               </div>
//             </div>

//             {/* Comments Section */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>
//               <div className="space-y-4">
//                 {displayedComments.length > 0 ? (
//                   displayedComments.map((comment) => (
//                     <Comment
//                       key={comment._id}
//                       comment={comment}
//                       postId={post._id}
//                       onReply={handleReply}
//                       onCommentUpdated={handleCommentUpdate}
//                       onCommentDeleted={handleCommentDelete}
//                     />
//                   ))
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No comments yet. Be the first to comment!</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         <div className="hidden lg:block w-1/5 mt-0 sticky top-20">
//           <h1 className="text-[1.4rem] font-bold mb-6 flex items-center">
//             <Calendar className="mr-2 text-blue-600" />
//             Upcoming Events
//           </h1>
//           <UpcomingEvents />
//         </div>
//       </div>

//       {/* Edit Post Modal */}
//       {showEditModal && (
//         <EditPostModal
//           post={post}
//           onClose={() => setShowEditModal(false)}
//           onPostUpdated={(updatedPost) => {
//             setPost({ ...post, ...updatedPost })
//             setShowEditModal(false)
//           }}
//         />
//       )}

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <DeleteConfirmModal
//           title="Delete Post"
//           message="Are you sure you want to delete this post? This action cannot be undone."
//           onConfirm={handleDeletePost}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </div>
//   )
// }

// export default PostDetail





















// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Calendar, ArrowLeft, ThumbsUp, Heart, MessageCircle, Share2 } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Comment from "../components/Comment"
// import MediaCarousel from "../components/MediaCarousel"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"
// import { formatDistanceToNow } from "date-fns"




// // PostDetail Component
// const PostDetail = () => {
//     const { postId } = useParams()
//     const navigate = useNavigate()
//     const [post, setPost] = useState(null)
//     const [loading, setLoading] = useState(true)
//     const [commentText, setCommentText] = useState("")
//     const [showReactionOptions, setShowReactionOptions] = useState(false)
//     const [displayedComments, setDisplayedComments] = useState([])
//     const [user, setUser] = useState(null);
//       // Load user details from localStorage (assuming they were saved after login)
//       useEffect(() => {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       }, []);
    
//       const userImage = user?.picture ; 
  
//     useEffect(() => {
//       const fetchPost = async () => {
//         setLoading(true)
//         try {
//           const token = localStorage.getItem('token')
//           const postResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}`, {
//             headers: { 'Authorization': `Bearer ${token}` },
//           })
//           const commentsResponse = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
//             headers: { 'Authorization': `Bearer ${token}` },
//           })
//           const postData = await postResponse.json()
//           const commentsData = await commentsResponse.json()
//           setPost({
//             ...postData,
//             author: { ...postData.author, name: `${postData.author.firstName} ${postData.author.lastName}` },
//             likesCount: postData.likesCount,
//             commentsCount: postData.commentsCount,
//             sharesCount: postData.sharesCount,
//           })
//           setDisplayedComments(commentsData)
//           setLoading(false)
//         } catch (error) {
//           console.error('Error fetching post:', error)
//           setLoading(false)
//         }
//       }
//       fetchPost()
//     }, [postId])
  
//     const handleCommentSubmit = async (e) => {
//       e.preventDefault()
//       if (!commentText.trim()) return
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ text: commentText }),
//         })
//         if (response.ok) {
//           const newComment = await response.json()
//           setDisplayedComments([newComment, ...displayedComments])
//           setCommentText("")
//         } else throw new Error('Failed to comment')
//       } catch (error) {
//         console.error('Error posting comment:', error)
//       }
//     }
  
//     const handleReply = async (commentId, replyText) => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/comments`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ text: replyText, parentCommentId: commentId }),
//         })
//         if (response.ok) {
//           const newReply = await response.json()
//           setDisplayedComments(displayedComments.map(comment =>
//             comment._id === commentId ? { ...comment, replies: [...(comment.replies || []), newReply] } : comment
//           ))
//         } else throw new Error('Failed to reply')
//       } catch (error) {
//         console.error('Error replying to comment:', error)
//       }
//     }
  
//     const selectReaction = async (reactionType) => {
//       try {
//         const token = localStorage.getItem('token')
//         const response = await fetch(`https://ses-management-system-nu.vercel.app/posts/${postId}/likes`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`,
//           },
//           body: JSON.stringify({ reactionType }),
//         })
//         if (!response.ok) throw new Error('Failed to react')
//         setShowReactionOptions(false)
//       } catch (error) {
//         console.error('Error reacting to post:', error)
//       }
//     }
  
//     const goToLikesPage = () => navigate(`/feed/post/${postId}/likes`)
//     const goBackToFeed = () => navigate("/feed")
  
//     if (loading) return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
  
//     if (!post) return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
//         <button onClick={goBackToFeed} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
//           Back to Feed
//         </button>
//       </div>
//     )
  
//     return (
//       <div className="container mx-auto py-8 px-4">
//         <div className="flex flex-col lg:flex-row gap-8 relative">
//           <div className="w-full lg:w-4/5">
//             <button onClick={goBackToFeed} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//               <ArrowLeft size={20} className="mr-1" />
//               Back to Feed
//             </button>
//             <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//               <div className="p-4 flex items-center">
//                 <div
//                   className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//                   onClick={() => navigate(`/profile/${post.author._id}`)}
//                 >
//                   <img src={post.author.picture || "/placeholder.svg"} alt={post.author.name} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="ml-3">
//                   <h3
//                     className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//                     onClick={() => navigate(`/profile/${post.author._id}`)}
//                   >
//                     {post.author.name}
//                   </h3>
//                   <p className="text-sm text-gray-500">
//                     {post.author.role} â€¢ {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
//                   </p>
//                 </div>
//               </div>
//               <div className="px-4 pb-3">
//                 <p className="text-gray-800 whitespace-pre-line">{post.description}</p>
//               </div>
//               {post.media && post.media.length > 0 && <MediaCarousel media={post.media} />}
//               <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//                 <div className="flex items-center space-x-2">
//                   <button className="flex items-center text-gray-500 hover:text-blue-600" onClick={goToLikesPage}>
//                     <ThumbsUp size={16} className="mr-1" />
//                     <span>{post.likesCount}</span>
//                   </button>
//                 </div>
//                 <div className="flex items-center space-x-4 text-gray-500">
//                   <span>{post.commentsCount} comments</span>
//                   <span>{post.sharesCount} shares</span>
//                 </div>
//               </div>
//               <div className="px-4 py-2 flex justify-between border-t border-gray-100">
//                 <div className="relative">
//                   <button
//                     className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//                     onMouseEnter={() => window.innerWidth >= 768 && setShowReactionOptions(true)}
//                     onMouseLeave={() => window.innerWidth >= 768 && setShowReactionOptions(false)}
//                     onClick={() => selectReaction("like")}
//                   >
//                     <span className="text-xs mb-1">{post.likesCount}</span>
//                     <div className="flex items-center">
//                       <ThumbsUp size={20} className="mr-2" />
//                       <span>Like</span>
//                     </div>
//                   </button>
//                   {showReactionOptions && (
//                     <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10">
//                       <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => selectReaction("like")}>
//                         <ThumbsUp size={24} className="text-blue-600" />
//                       </button>
//                       <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => selectReaction("love")}>
//                         <Heart size={24} className="text-red-500" />
//                       </button>
//                       <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={() => selectReaction("laugh")}>
//                         <FaRegLaughBeam size={24} className="text-yellow-500" />
//                       </button>
//                     </div>
//                   )}
//                 </div>
//                 <button className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                   <span className="text-xs mb-1">{post.commentsCount}</span>
//                   <div className="flex items-center">
//                     <MessageCircle size={20} className="mr-2" />
//                     <span>Comment</span>
//                   </div>
//                 </button>
//                 <button className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                   <span className="text-xs mb-1">{post.sharesCount}</span>
//                   <div className="flex items-center">
//                     <Share2 size={20} className="mr-2" />
//                     <span>Share</span>
//                   </div>
//                 </button>
//               </div>
//               <div className="px-4 py-3 border-t border-gray-100">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                     <img src={userImage} alt="Your profile" className="w-full h-full object-cover" />
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="Write a comment..."
//                     className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={commentText}
//                     onChange={(e) => setCommentText(e.target.value)}
//                     onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(e)}
//                   />
//                   <button
//                     onClick={handleCommentSubmit}
//                     className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//                     disabled={!commentText.trim()}
//                   >
//                     Post
//                   </button>
//                 </div>
//               </div>
//               <div className="px-4 py-3 border-t border-gray-100">
//                 <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>
//                 <div className="space-y-4">
//                   {displayedComments.map((comment) => (
//                     <Comment key={comment._id} comment={comment} postId={post._id} onReply={handleReply} />
//                   ))}
//                 </div>
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
//   export default PostDetail






// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Calendar, ArrowLeft, ThumbsUp, Heart, MessageCircle, Share2 } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Comment from "../components/Comment"
// import MediaCarousel from "../components/MediaCarousel"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"

// // Mock data for a single post with comments
// const mockPostWithComments = {
//   id: 1,
//   author: {
//     id: 101,
//     name: "Ahmed Ali",
//     profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//     role: "Software Engineer",
//   },
//   description:
//     "Just finished working on a new project using React and Next.js. The performance improvements are incredible! I've been working on this for the past few weeks and I'm really happy with the results. Let me know what you think about the design and functionality.",
//   media: [
//     { type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" },
//     { type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" },
//   ],
//   timeAgo: "2 hours ago",
//   likes: {
//     count: 24,
//     userReactions: [
//       {
//         userId: 102,
//         name: "Fatima Zahra",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "like",
//       },
//       {
//         userId: 103,
//         name: "Muhammad Farooq",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "love",
//       },
//       {
//         userId: 104,
//         name: "Ayesha Khan",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "laugh",
//       },
//     ],
//   },
//   comments: {
//     count: 5,
//     items: [
//       {
//         id: 201,
//         author: {
//           id: 102,
//           name: "Fatima Zahra",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "This looks amazing! The UI is so clean and intuitive.",
//         timeAgo: "1 hour ago",
//         likes: 3,
//         replies: [
//           {
//             id: 301,
//             author: {
//               id: 101,
//               name: "Ahmed Ali",
//               profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//             },
//             text: "Thanks Fatima! I spent a lot of time on the UI design.",
//             timeAgo: "45 minutes ago",
//             likes: 1,
//             replies: [],
//           },
//         ],
//       },
//       {
//         id: 202,
//         author: {
//           id: 103,
//           name: "Muhammad Farooq",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "Great work! How did you handle the state management?",
//         timeAgo: "1.5 hours ago",
//         likes: 2,
//         replies: [],
//       },
//       {
//         id: 203,
//         author: {
//           id: 104,
//           name: "Ayesha Khan",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "The performance improvements are impressive. Would love to see how you optimized it.",
//         timeAgo: "1.5 hours ago",
//         likes: 1,
//         replies: [],
//       },
//       {
//         id: 204,
//         author: {
//           id: 105,
//           name: "Ali Hassan",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "Is this project open source? Would love to contribute!",
//         timeAgo: "1.5 hours ago",
//         likes: 0,
//         replies: [],
//       },
//       {
//         id: 205,
//         author: {
//           id: 106,
//           name: "Zainab Bibi",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "The design is beautiful. What CSS framework did you use?",
//         timeAgo: "2 hours ago",
//         likes: 1,
//         replies: [],
//       },
//     ],
//   },
//   shares: 3,
// }

// // Generate more mock comments
// const generateMoreComments = (startId, count) => {
//   const comments = []
//   for (let i = 0; i < count; i++) {
//     comments.push({
//       id: startId + i,
//       author: {
//         id: 107 + i,
//         name: `User ${i + 1}`,
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       },
//       text: `This is comment number ${i + 1} that was loaded later. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
//       timeAgo: `${i + 3} hours ago`,
//       likes: Math.floor(Math.random() * 5),
//       replies: [],
//     })
//   }
//   return comments
// }

// const PostDetail = () => {
//   const { postId } = useParams()
//   const navigate = useNavigate()
//   const [post, setPost] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [commentText, setCommentText] = useState("")
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [displayedComments, setDisplayedComments] = useState([])
//   const [hasMoreComments, setHasMoreComments] = useState(true)
//   const [loadingMoreComments, setLoadingMoreComments] = useState(false)

//   // Fetch post data
//   useEffect(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       // In a real app, you would fetch the post by ID from your API
//       setPost(mockPostWithComments)
//       setDisplayedComments(mockPostWithComments.comments.items.slice(0, 10))
//       setHasMoreComments(mockPostWithComments.comments.items.length > 10)
//       setLoading(false)
//     }, 1000)
//   }, [postId])

//   // Handle comment submission
//   const handleCommentSubmit = (e) => {
//     e.preventDefault()
//     if (commentText.trim()) {
//       // In a real app, you would send this to your API
//       console.log(`New comment on post ${postId}: ${commentText}`)

//       // Add the new comment to the displayed comments
//       const newComment = {
//         id: Date.now(),
//         author: {
//           id: 999, // Current user ID
//           name: "Current User", // Current user name
//           profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//         },
//         text: commentText,
//         timeAgo: "Just now",
//         likes: 0,
//         replies: [],
//       }

//       setDisplayedComments([newComment, ...displayedComments])
//       setCommentText("")
//     }
//   }

//   // Handle reply to comment
//   const handleReply = (commentId, replyText) => {
//     // In a real app, you would send this to your API
//     console.log(`Reply to comment ${commentId}: ${replyText}`)

//     // Update the comments with the new reply
//     const updatedComments = displayedComments.map((comment) => {
//       if (comment.id === commentId) {
//         const newReply = {
//           id: Date.now(),
//           author: {
//             id: 999, // Current user ID
//             name: "Current User", // Current user name
//             profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//           },
//           text: replyText,
//           timeAgo: "Just now",
//           likes: 0,
//           replies: [],
//         }

//         return {
//           ...comment,
//           replies: [...(comment.replies || []), newReply],
//         }
//       } else if (comment.replies) {
//         // Check if the comment is in the replies
//         const updatedReplies = comment.replies.map((reply) => {
//           if (reply.id === commentId) {
//             const newReply = {
//               id: Date.now(),
//               author: {
//                 id: 999, // Current user ID
//                 name: "Current User", // Current user name
//                 profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//               },
//               text: replyText,
//               timeAgo: "Just now",
//               likes: 0,
//               replies: [],
//             }

//             return {
//               ...reply,
//               replies: [...(reply.replies || []), newReply],
//             }
//           }
//           return reply
//         })

//         return {
//           ...comment,
//           replies: updatedReplies,
//         }
//       }

//       return comment
//     })

//     setDisplayedComments(updatedComments)
//   }

//   // Load more comments
//   const loadMoreComments = () => {
//     setLoadingMoreComments(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       const moreComments = generateMoreComments(300, 10)
//       setDisplayedComments([...displayedComments, ...moreComments])
//       setHasMoreComments(false) // For demo purposes, we'll only load one more batch
//       setLoadingMoreComments(false)
//     }, 1000)
//   }

//   // Handle reaction selection
//   const selectReaction = (reactionType) => {
//     console.log(`Reacted with ${reactionType} to post ${postId}`)
//     setShowReactionOptions(false)
//     // Here you would call your API to save the reaction
//   }

//   // Navigate to likes page
//   const goToLikesPage = () => {
//     navigate(`/feed/post/${postId}/likes`)
//   }

//   // Navigate back to feed
//   const goBackToFeed = () => {
//     navigate("/feed")
//   }

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//         <Loader />
//       </div>
//     )
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
//         <button
//           onClick={goBackToFeed}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Feed
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Post Detail Section - 4/5 width on large screens */}
//         <div className="w-full lg:w-4/5">
//           {/* Back button */}
//           <button onClick={goBackToFeed} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//             <ArrowLeft size={20} className="mr-1" />
//             Back to Feed
//           </button>

//           {/* Post container */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             {/* Post Header */}
//             <div className="p-4 flex items-center">
//               <div
//                 className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//                 onClick={() => navigate(`/profile/${post.author.id}`)}
//               >
//                 <img
//                   src={post.author.profilePicture || "/placeholder.svg"}
//                   alt={post.author.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="ml-3">
//                 <h3
//                   className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//                   onClick={() => navigate(`/profile/${post.author.id}`)}
//                 >
//                   {post.author.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {post.author.role} â€¢ {post.timeAgo}
//                 </p>
//               </div>
//             </div>

//             {/* Post Description */}
//             <div className="px-4 pb-3">
//               <p className="text-gray-800 whitespace-pre-line">{post.description}</p>
//             </div>

//             {/* Post Media */}
//             {post.media && post.media.length > 0 && <MediaCarousel media={post.media} />}

//             {/* Post Stats */}
//             <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//               <div className="flex items-center space-x-2">
//                 <button className="flex items-center text-gray-500 hover:text-blue-600" onClick={goToLikesPage}>
//                   <ThumbsUp size={16} className="mr-1" />
//                   <span>{post.likes.count}</span>
//                 </button>
//               </div>
//               <div className="flex items-center space-x-4 text-gray-500">
//                 <span>{post.comments.count} comments</span>
//                 <span>{post.shares} shares</span>
//               </div>
//             </div>

//             {/* Post Actions */}
//             <div className="px-4 py-2 flex justify-between border-t border-gray-100">
//               <div className="relative">
//                 <button
//                   className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//                   onMouseEnter={() => window.innerWidth >= 768 && setShowReactionOptions(true)}
//                   onMouseLeave={() => window.innerWidth >= 768 && setShowReactionOptions(false)}
//                   onClick={() => selectReaction("like")}
//                 >
//                   <span className="text-xs mb-1">{post.likes.count}</span>
//                   <div className="flex items-center">
//                     <ThumbsUp size={20} className="mr-2" />
//                     <span>Like</span>
//                   </div>
//                 </button>

//                 {/* Reaction options */}
//                 {showReactionOptions && (
//                   <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10">
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("like")}
//                     >
//                       <ThumbsUp size={24} className="text-blue-600" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("love")}
//                     >
//                       <Heart size={24} className="text-red-500" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("laugh")}
//                     >
//                       <FaRegLaughBeam size={24} className="text-yellow-500" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <button className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                 <span className="text-xs mb-1">{post.comments.count}</span>
//                 <div className="flex items-center">
//                   <MessageCircle size={20} className="mr-2" />
//                   <span>Comment</span>
//                 </div>
//               </button>

//               <button className="flex flex-col items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                 <span className="text-xs mb-1">{post.shares}</span>
//                 <div className="flex items-center">
//                   <Share2 size={20} className="mr-2" />
//                   <span>Share</span>
//                 </div>
//               </button>
//             </div>

//             {/* Comment Form */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <form onSubmit={handleCommentSubmit} className="flex items-center">
//                 <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                   <img
//                     src="/placeholder.svg?height=32&width=32"
//                     alt="Your profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Write a comment..."
//                   className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//                   disabled={!commentText.trim()}
//                 >
//                   Post
//                 </button>
//               </form>
//             </div>

//             {/* Comments Section */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>

//               <div className="space-y-4">
//                 {displayedComments.map((comment) => (
//                   <Comment key={comment.id} comment={comment} postId={post.id} onReply={handleReply} />
//                 ))}

//                 {/* Load more comments button */}
//                 {hasMoreComments && (
//                   <div className="text-center pt-2">
//                     <button
//                       onClick={loadMoreComments}
//                       disabled={loadingMoreComments}
//                       className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//                     >
//                       {loadingMoreComments ? "Loading..." : "Load More Comments"}
//                     </button>
//                   </div>
//                 )}

//                 {/* No more comments message */}
//                 {!hasMoreComments && displayedComments.length > 10 && (
//                   <div className="text-center pt-2 text-gray-500 text-sm">No more comments to load</div>
//                 )}
//               </div>
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

// export default PostDetail


















// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { Calendar, ArrowLeft, ThumbsUp, Heart, MessageCircle, Share2 } from "lucide-react"
// import { FaRegLaughBeam } from "react-icons/fa"
// import Comment from "../components/Comment"
// import MediaCarousel from "../components/MediaCarousel"
// import Loader from "../components/Loader"
// import UpcomingEvents from "../components/UpcommingEvents"

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

// // Mock data for a single post with comments
// const mockPostWithComments = {
//   id: 1,
//   author: {
//     id: 101,
//     name: "Ahmed Ali",
//     profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//     role: "Software Engineer",
//   },
//   description:
//     "Just finished working on a new project using React and Next.js. The performance improvements are incredible! I've been working on this for the past few weeks and I'm really happy with the results. Let me know what you think about the design and functionality.",
//   media: [
//     { type: "image", url: "https://i.ibb.co/1YSzM2hL/image-7.png" },
//     { type: "image", url: "https://i.ibb.co/Zs0rtgG/image-7-1.png" },
//   ],
//   timeAgo: "2 hours ago",
//   likes: {
//     count: 24,
//     userReactions: [
//       {
//         userId: 102,
//         name: "Fatima Zahra",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "like",
//       },
//       {
//         userId: 103,
//         name: "Muhammad Farooq",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "love",
//       },
//       {
//         userId: 104,
//         name: "Ayesha Khan",
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         reactionType: "laugh",
//       },
//     ],
//   },
//   comments: {
//     count: 5,
//     items: [
//       {
//         id: 201,
//         author: {
//           id: 102,
//           name: "Fatima Zahra",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "This looks amazing! The UI is so clean and intuitive.",
//         timeAgo: "1 hour ago",
//         likes: 3,
//         replies: [
//           {
//             id: 301,
//             author: {
//               id: 101,
//               name: "Ahmed Ali",
//               profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//             },
//             text: "Thanks Fatima! I spent a lot of time on the UI design.",
//             timeAgo: "45 minutes ago",
//             likes: 1,
//             replies: [],
//           },
//         ],
//       },
//       {
//         id: 202,
//         author: {
//           id: 103,
//           name: "Muhammad Farooq",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "Great work! How did you handle the state management?",
//         timeAgo: "1.5 hours ago",
//         likes: 2,
//         replies: [],
//       },
//       {
//         id: 203,
//         author: {
//           id: 104,
//           name: "Ayesha Khan",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "The performance improvements are impressive. Would love to see how you optimized it.",
//         timeAgo: "1.5 hours ago",
//         likes: 1,
//         replies: [],
//       },
//       {
//         id: 204,
//         author: {
//           id: 105,
//           name: "Ali Hassan",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "Is this project open source? Would love to contribute!",
//         timeAgo: "1.5 hours ago",
//         likes: 0,
//         replies: [],
//       },
//       {
//         id: 205,
//         author: {
//           id: 106,
//           name: "Zainab Bibi",
//           profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//         },
//         text: "The design is beautiful. What CSS framework did you use?",
//         timeAgo: "2 hours ago",
//         likes: 1,
//         replies: [],
//       },
//     ],
//   },
//   shares: 3,
// }

// // Generate more mock comments
// const generateMoreComments = (startId, count) => {
//   const comments = []
//   for (let i = 0; i < count; i++) {
//     comments.push({
//       id: startId + i,
//       author: {
//         id: 107 + i,
//         name: `User ${i + 1}`,
//         profilePicture: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       },
//       text: `This is comment number ${i + 1} that was loaded later. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
//       timeAgo: `${i + 3} hours ago`,
//       likes: Math.floor(Math.random() * 5),
//       replies: [],
//     })
//   }
//   return comments
// }

// const PostDetail = () => {
//   const { postId } = useParams()
//   const navigate = useNavigate()
//   const [post, setPost] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [commentText, setCommentText] = useState("")
//   const [showReactionOptions, setShowReactionOptions] = useState(false)
//   const [displayedComments, setDisplayedComments] = useState([])
//   const [hasMoreComments, setHasMoreComments] = useState(true)
//   const [loadingMoreComments, setLoadingMoreComments] = useState(false)

//   // Fetch post data
//   useEffect(() => {
//     setLoading(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       // In a real app, you would fetch the post by ID from your API
//       setPost(mockPostWithComments)
//       setDisplayedComments(mockPostWithComments.comments.items.slice(0, 10))
//       setHasMoreComments(mockPostWithComments.comments.items.length > 10)
//       setLoading(false)
//     }, 1000)
//   }, [postId])

//   // Handle comment submission
//   const handleCommentSubmit = (e) => {
//     e.preventDefault()
//     if (commentText.trim()) {
//       // In a real app, you would send this to your API
//       console.log(`New comment on post ${postId}: ${commentText}`)

//       // Add the new comment to the displayed comments
//       const newComment = {
//         id: Date.now(),
//         author: {
//           id: 999, // Current user ID
//           name: "Current User", // Current user name
//           profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//         },
//         text: commentText,
//         timeAgo: "Just now",
//         likes: 0,
//         replies: [],
//       }

//       setDisplayedComments([newComment, ...displayedComments])
//       setCommentText("")
//     }
//   }

//   // Handle reply to comment
//   const handleReply = (commentId, replyText) => {
//     // In a real app, you would send this to your API
//     console.log(`Reply to comment ${commentId}: ${replyText}`)

//     // Update the comments with the new reply
//     const updatedComments = displayedComments.map((comment) => {
//       if (comment.id === commentId) {
//         const newReply = {
//           id: Date.now(),
//           author: {
//             id: 999, // Current user ID
//             name: "Current User", // Current user name
//             profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//           },
//           text: replyText,
//           timeAgo: "Just now",
//           likes: 0,
//           replies: [],
//         }

//         return {
//           ...comment,
//           replies: [...(comment.replies || []), newReply],
//         }
//       } else if (comment.replies) {
//         // Check if the comment is in the replies
//         const updatedReplies = comment.replies.map((reply) => {
//           if (reply.id === commentId) {
//             const newReply = {
//               id: Date.now(),
//               author: {
//                 id: 999, // Current user ID
//                 name: "Current User", // Current user name
//                 profilePicture: "/placeholder.svg?height=32&width=32", // Current user profile picture
//               },
//               text: replyText,
//               timeAgo: "Just now",
//               likes: 0,
//               replies: [],
//             }

//             return {
//               ...reply,
//               replies: [...(reply.replies || []), newReply],
//             }
//           }
//           return reply
//         })

//         return {
//           ...comment,
//           replies: updatedReplies,
//         }
//       }

//       return comment
//     })

//     setDisplayedComments(updatedComments)
//   }

//   // Load more comments
//   const loadMoreComments = () => {
//     setLoadingMoreComments(true)

//     // Simulate API call with setTimeout
//     setTimeout(() => {
//       const moreComments = generateMoreComments(300, 10)
//       setDisplayedComments([...displayedComments, ...moreComments])
//       setHasMoreComments(false) // For demo purposes, we'll only load one more batch
//       setLoadingMoreComments(false)
//     }, 1000)
//   }

//   // Handle reaction selection
//   const selectReaction = (reactionType) => {
//     console.log(`Reacted with ${reactionType} to post ${postId}`)
//     setShowReactionOptions(false)
//     // Here you would call your API to save the reaction
//   }

//   // Navigate to likes page
//   const goToLikesPage = () => {
//     navigate(`/feed/post/${postId}/likes`)
//   }

//   // Navigate back to feed
//   const goBackToFeed = () => {
//     navigate("/feed")
//   }

//   if (loading) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
//         <p className="mt-4 text-gray-600">Loading post...</p>
//       </div>
//     )
//   }

//   if (!post) {
//     return (
//       <div className="container mx-auto py-8 px-4 text-center">
//         <h1 className="text-2xl font-bold text-gray-800">Post not found</h1>
//         <button
//           onClick={goBackToFeed}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//         >
//           Back to Feed
//         </button>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-8 px-4">
//       <div className="flex flex-col lg:flex-row gap-8 relative">
//         {/* Post Detail Section - 3/4 width on large screens */}
//         <div className="w-full lg:w-3/4">
//           {/* Back button */}
//           <button onClick={goBackToFeed} className="flex items-center text-blue-600 hover:text-blue-800 mb-4">
//             <ArrowLeft size={20} className="mr-1" />
//             Back to Feed
//           </button>

//           {/* Post container */}
//           <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//             {/* Post Header */}
//             <div className="p-4 flex items-center">
//               <div
//                 className="w-12 h-12 rounded-full overflow-hidden cursor-pointer"
//                 onClick={() => navigate(`/profile/${post.author.id}`)}
//               >
//                 <img
//                   src={post.author.profilePicture || "/placeholder.svg"}
//                   alt={post.author.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="ml-3">
//                 <h3
//                   className="font-semibold text-gray-800 cursor-pointer hover:text-blue-600"
//                   onClick={() => navigate(`/profile/${post.author.id}`)}
//                 >
//                   {post.author.name}
//                 </h3>
//                 <p className="text-sm text-gray-500">
//                   {post.author.role} â€¢ {post.timeAgo}
//                 </p>
//               </div>
//             </div>

//             {/* Post Description */}
//             <div className="px-4 pb-3">
//               <p className="text-gray-800 whitespace-pre-line">{post.description}</p>
//             </div>

//             {/* Post Media */}
//             {post.media && post.media.length > 0 && <MediaCarousel media={post.media} />}

//             {/* Post Stats */}
//             <div className="px-4 py-2 flex justify-between items-center border-t border-gray-100">
//               <div className="flex items-center space-x-2">
//                 <button className="flex items-center text-gray-500 hover:text-blue-600" onClick={goToLikesPage}>
//                   <ThumbsUp size={16} className="mr-1" />
//                   <span>{post.likes.count}</span>
//                 </button>
//               </div>
//               <div className="flex items-center space-x-4 text-gray-500">
//                 <span>{post.comments.count} comments</span>
//                 <span>{post.shares} shares</span>
//               </div>
//             </div>

//             {/* Post Actions */}
//             <div className="px-4 py-2 flex justify-between border-t border-gray-100">
//               <div className="relative">
//                 <button
//                   className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
//                   onMouseEnter={() => window.innerWidth >= 768 && setShowReactionOptions(true)}
//                   onMouseLeave={() => window.innerWidth >= 768 && setShowReactionOptions(false)}
//                   onClick={() => selectReaction("like")}
//                 >
//                   <ThumbsUp size={20} className="mr-2" />
//                   <span>Like</span>
//                 </button>

//                 {/* Reaction options */}
//                 {showReactionOptions && (
//                   <div className="absolute bottom-full left-0 mb-2 bg-white rounded-full shadow-lg p-1 flex space-x-1 z-10">
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("like")}
//                     >
//                       <ThumbsUp size={24} className="text-blue-600" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("love")}
//                     >
//                       <Heart size={24} className="text-red-500" />
//                     </button>
//                     <button
//                       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                       onClick={() => selectReaction("laugh")}
//                     >
//                       <FaRegLaughBeam size={24} className="text-yellow-500" />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               <button className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                 <MessageCircle size={20} className="mr-2" />
//                 <span>Comment</span>
//               </button>

//               <button className="flex items-center justify-center w-full py-2 px-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors">
//                 <Share2 size={20} className="mr-2" />
//                 <span>Share</span>
//               </button>
//             </div>

//             {/* Comment Form */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <form onSubmit={handleCommentSubmit} className="flex items-center">
//                 <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
//                   <img
//                     src="/placeholder.svg?height=32&width=32"
//                     alt="Your profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Write a comment..."
//                   className="flex-1 bg-gray-100 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={commentText}
//                   onChange={(e) => setCommentText(e.target.value)}
//                 />
//                 <button
//                   type="submit"
//                   className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
//                   disabled={!commentText.trim()}
//                 >
//                   Post
//                 </button>
//               </form>
//             </div>

//             {/* Comments Section */}
//             <div className="px-4 py-3 border-t border-gray-100">
//               <h3 className="font-semibold text-gray-800 mb-4">Comments</h3>

//               <div className="space-y-4">
//                 {displayedComments.map((comment) => (
//                   <Comment key={comment.id} comment={comment} postId={post.id} onReply={handleReply} />
//                 ))}

//                 {/* Load more comments button */}
//                 {hasMoreComments && (
//                   <div className="text-center pt-2">
//                     <button
//                       onClick={loadMoreComments}
//                       disabled={loadingMoreComments}
//                       className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
//                     >
//                       {loadingMoreComments ? "Loading..." : "Load More Comments"}
//                     </button>
//                   </div>
//                 )}

//                 {/* No more comments message */}
//                 {!hasMoreComments && displayedComments.length > 10 && (
//                   <div className="text-center pt-2 text-gray-500 text-sm">No more comments to load</div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>
//     {/* Upcoming Events Section - 1/5 width on large screens, fixed position */}
//     <div className="hidden lg:block w-1/5 mt-0 sticky top-20">
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

// export default PostDetail

