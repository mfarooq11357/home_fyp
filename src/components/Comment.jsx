


"use client"

import { useState, useRef, useEffect } from "react"
import { ThumbsUp, MoreVertical, Edit, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { formatDistanceToNow } from "date-fns"
import { toast } from "react-toastify"
import DeleteConfirmModal from "./DeleteConfirmModal"

const Comment = ({ comment, postId, onReply, onCommentUpdated, onCommentDeleted, level = 0 }) => {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.text)
  const [showOptionsMenu, setShowOptionsMenu] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isLiked, setIsLiked] = useState(comment.isLikedByMe || false)
  const [likesCount, setLikesCount] = useState(comment.likesCount || 0)
  const [currentUser, setCurrentUser] = useState(null)

  const navigate = useNavigate()
  const optionsMenuRef = useRef(null)
  const optionsButtonRef = useRef(null)

  // Get current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  // Handle click outside to close options menu
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  const handleReplySubmit = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText, parentCommentId: comment._id }),
      })
      if (response.ok) {
        const newReply = await response.json()
        setReplyText("")
        setShowReplyForm(false)
        toast.success("Reply added successfully!", {
          theme: "light",
        })
        if (onReply) {
          onReply(comment._id, newReply)
        }
      } else throw new Error("Failed to reply")
    } catch (error) {
      console.error("Error replying to comment:", error)
      toast.error("Failed to add reply", {
        theme: "light",
      })
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editText.trim()) return
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editText }),
      })
      if (response.ok) {
        const updatedComment = await response.json()
        setIsEditing(false)
        toast.success("Comment updated successfully!", {
          theme: "light",
        })
        if (onCommentUpdated) {
          onCommentUpdated(comment._id, updatedComment)
        }
      } else throw new Error("Failed to update comment")
    } catch (error) {
      console.error("Error updating comment:", error)
      toast.error("Failed to update comment", {
        theme: "light",
      })
    }
  }

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        toast.success("Comment deleted successfully!", {
          theme: "light",
        })
        if (onCommentDeleted) {
          onCommentDeleted(comment._id)
        }
      } else throw new Error("Failed to delete comment")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment", {
        theme: "light",
      })
    }
  }

  const handleLikeComment = async () => {
    try {
      const token = localStorage.getItem("token")
      const method = isLiked ? "DELETE" : "POST"
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}/likes`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setLikesCount(data.likesCount)
      } else {
        throw new Error("Failed to toggle like")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to toggle like", {
        theme: "light",
      })
    }
  }

  const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

  // Check if current user is the author of the comment
  const isAuthor =
    currentUser && comment.author && (currentUser._id === comment.author._id || currentUser.id === comment.author._id)

  return (
    <div className={`mb-3 ${level > 0 ? "ml-12" : ""}`}>
      <div className="flex mt-4">
        <div
          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
          onClick={() => goToUserProfile(comment.author._id)}
        >
          <img
            src={comment.author.picture || "/placeholder.svg"}
            alt={comment.author.firstName || "User"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-2 flex-1">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mb-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end mt-2 space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setEditText(comment.text)
                  }}
                  className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  disabled={!editText.trim()}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-100 rounded-lg px-3 py-2 group relative">
              <div className="flex justify-between items-start">
                <div
                  className="font-semibold text-sm cursor-pointer hover:underline"
                  onClick={() => goToUserProfile(comment.author._id)}
                >
                  {`${comment.author.firstName || ""} ${comment.author.lastName || ""}`}
                </div>

                {/* Comment options menu */}
                {isAuthor && (
                  <div className="relative">
                    <button
                      ref={optionsButtonRef}
                      onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showOptionsMenu && (
                      <div
                        ref={optionsMenuRef}
                        className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                      >
                        <button
                          onClick={() => {
                            setIsEditing(true)
                            setShowOptionsMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Edit size={14} className="mr-2" />
                          Edit Comment
                        </button>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true)
                            setShowOptionsMenu(false)
                          }}
                          className="flex items-center w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete Comment
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-800">{comment.text}</p>
            </div>
          )}

          <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
            <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
            <button
              className={`font-medium hover:text-blue-600 transition-colors ${isLiked ? "text-blue-600" : ""}`}
              onClick={handleLikeComment}
            >
              <ThumbsUp size={12} className={`inline mr-1 ${isLiked ? "fill-blue-600 text-blue-600" : ""}`} />
              {likesCount > 0 ? likesCount : "Like"}
            </button>
            <button
              className="font-medium hover:text-blue-600 transition-colors"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-2 flex items-center">
              <input
                type="text"
                placeholder={`Reply to ${comment.author.firstName || "User"}...`}
                className="flex-1 bg-gray-100 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                autoFocus
              />
              <button
                onClick={handleReplySubmit}
                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
                disabled={!replyText.trim()}
              >
                Reply
              </button>
            </div>
          )}

          {/* Nested replies */}
          {comment.replies &&
            comment.replies.map((reply) => (
              <Comment
                key={reply._id}
                comment={reply}
                postId={postId}
                onReply={onReply}
                onCommentUpdated={onCommentUpdated}
                onCommentDeleted={onCommentDeleted}
                level={level + 1}
              />
            ))}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmModal
          title="Delete Comment"
          message="Are you sure you want to delete this comment? This action cannot be undone."
          onConfirm={handleDeleteComment}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default Comment
















// "use client"

// import { useState, useRef, useEffect } from "react"
// import { ThumbsUp, MoreVertical, Edit, Trash2 } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { formatDistanceToNow } from "date-fns"
// import { toast } from "react-toastify"
// import DeleteConfirmModal from "./DeleteConfirmModal"

// const Comment = ({ comment, postId, onReply, onCommentUpdated, onCommentDeleted, level = 0 }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [replyText, setReplyText] = useState("")
//   const [isEditing, setIsEditing] = useState(false)
//   const [editText, setEditText] = useState(comment.text)
//   const [showOptionsMenu, setShowOptionsMenu] = useState(false)
//   const [showDeleteModal, setShowDeleteModal] = useState(false)
//   const [isLiked, setIsLiked] = useState(false)
//   const [likesCount, setLikesCount] = useState(comment.likesCount || 0)
//   const [currentUser, setCurrentUser] = useState(null)

//   const navigate = useNavigate()
//   const optionsMenuRef = useRef(null)
//   const optionsButtonRef = useRef(null)

//   // Get current user
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       setCurrentUser(JSON.parse(storedUser))
//     }
//   }, [])

//   // Check if comment is liked
//   useEffect(() => {
//     const checkIfLiked = async () => {
//       try {
//         const token = localStorage.getItem("token")
//         const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}/isLiked`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         if (response.ok) {
//           const data = await response.json()
//           setIsLiked(data.isLiked)
//         }
//       } catch (error) {
//         console.error("Error checking if comment is liked:", error)
//       }
//     }

//     checkIfLiked()
//   }, [comment._id, postId])

//   // Handle click outside to close options menu
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         optionsMenuRef.current &&
//         !optionsMenuRef.current.contains(event.target) &&
//         optionsButtonRef.current &&
//         !optionsButtonRef.current.contains(event.target)
//       ) {
//         setShowOptionsMenu(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [])

//   const handleReplySubmit = async (e) => {
//     e.preventDefault()
//     if (!replyText.trim()) return
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: replyText, parentCommentId: comment._id }),
//       })
//       if (response.ok) {
//         const newReply = await response.json()
//         setReplyText("")
//         setShowReplyForm(false)
//         toast.success("Reply added successfully!", {
//           theme: "light",
//         })
//         if (onReply) {
//           onReply(comment._id, newReply)
//         }
//       } else throw new Error("Failed to reply")
//     } catch (error) {
//       console.error("Error replying to comment:", error)
//       toast.error("Failed to add reply", {
//         theme: "light",
//       })
//     }
//   }

//   const handleEditSubmit = async (e) => {
//     e.preventDefault()
//     if (!editText.trim()) return
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: editText }),
//       })
//       if (response.ok) {
//         const updatedComment = await response.json()
//         setIsEditing(false)
//         toast.success("Comment updated successfully!", {
//           theme: "light",
//         })
//         if (onCommentUpdated) {
//           onCommentUpdated(comment._id, updatedComment)
//         }
//       } else throw new Error("Failed to update comment")
//     } catch (error) {
//       console.error("Error updating comment:", error)
//       toast.error("Failed to update comment", {
//         theme: "light",
//       })
//     }
//   }

//   const handleDeleteComment = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       if (response.ok) {
//         toast.success("Comment deleted successfully!", {
//           theme: "light",
//         })
//         if (onCommentDeleted) {
//           onCommentDeleted(comment._id)
//         }
//       } else throw new Error("Failed to delete comment")
//     } catch (error) {
//       console.error("Error deleting comment:", error)
//       toast.error("Failed to delete comment", {
//         theme: "light",
//       })
//     }
//   }

//   const handleLikeComment = async () => {
//     try {
//       const token = localStorage.getItem("token")
//       const response = await fetch(`http://localhost:3000/posts/${postId}/comments/${comment._id}/like`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       if (response.ok) {
//         const data = await response.json()
//         setIsLiked(data.liked)
//         setLikesCount(data.likesCount)
//       } else throw new Error("Failed to like comment")
//     } catch (error) {
//       console.error("Error liking comment:", error)
//       toast.error("Failed to like comment", {
//         theme: "light",
//       })
//     }
//   }

//   const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

//   // Check if current user is the author of the comment
//   const isAuthor =
//     currentUser && comment.author && (currentUser._id === comment.author._id || currentUser.id === comment.author._id)

//   return (
//     <div className={`mb-3 ${level > 0 ? "ml-12" : ""}`}>
//       <div className="flex mt-4">
//         <div
//           className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
//           onClick={() => goToUserProfile(comment.author._id)}
//         >
//           <img
//             src={comment.author.picture || "/placeholder.svg"}
//             alt={comment.author.firstName || "User"}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-2 flex-1">
//           {isEditing ? (
//             <form onSubmit={handleEditSubmit} className="mb-2">
//               <textarea
//                 value={editText}
//                 onChange={(e) => setEditText(e.target.value)}
//                 className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//                 rows={2}
//                 autoFocus
//               />
//               <div className="flex justify-end mt-2 space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setIsEditing(false)
//                     setEditText(comment.text)
//                   }}
//                   className="px-3 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                   disabled={!editText.trim()}
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="bg-gray-100 rounded-lg px-3 py-2 group relative">
//               <div className="flex justify-between items-start">
//                 <div
//                   className="font-semibold text-sm cursor-pointer hover:underline"
//                   onClick={() => goToUserProfile(comment.author._id)}
//                 >
//                   {`${comment.author.firstName || ""} ${comment.author.lastName || ""}`}
//                 </div>

//                 {/* Comment options menu */}
//                 {isAuthor && (
//                   <div className="relative">
//                     <button
//                       ref={optionsButtonRef}
//                       onClick={() => setShowOptionsMenu(!showOptionsMenu)}
//                       className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
//                     >
//                       <MoreVertical size={16} />
//                     </button>

//                     {showOptionsMenu && (
//                       <div
//                         ref={optionsMenuRef}
//                         className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
//                       >
//                         <button
//                           onClick={() => {
//                             setIsEditing(true)
//                             setShowOptionsMenu(false)
//                           }}
//                           className="flex items-center w-full px-4 py-2 text-xs text-gray-700 hover:bg-gray-100 transition-colors"
//                         >
//                           <Edit size={14} className="mr-2" />
//                           Edit Comment
//                         </button>
//                         <button
//                           onClick={() => {
//                             setShowDeleteModal(true)
//                             setShowOptionsMenu(false)
//                           }}
//                           className="flex items-center w-full px-4 py-2 text-xs text-red-600 hover:bg-gray-100 transition-colors"
//                         >
//                           <Trash2 size={14} className="mr-2" />
//                           Delete Comment
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//               <p className="text-sm text-gray-800">{comment.text}</p>
//             </div>
//           )}

//           <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
//             <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
//             <button
//               className={`font-medium hover:text-blue-600 transition-colors ${isLiked ? "text-blue-600" : ""}`}
//               onClick={handleLikeComment}
//             >
//               <ThumbsUp size={12} className={`inline mr-1 ${isLiked ? "fill-blue-600 text-blue-600" : ""}`} />
//               {likesCount > 0 ? likesCount : "Like"}
//             </button>
//             <button
//               className="font-medium hover:text-blue-600 transition-colors"
//               onClick={() => setShowReplyForm(!showReplyForm)}
//             >
//               Reply
//             </button>
//           </div>

//           {showReplyForm && (
//             <div className="mt-2 flex items-center">
//               <input
//                 type="text"
//                 placeholder={`Reply to ${comment.author.firstName || "User"}...`}
//                 className="flex-1 bg-gray-100 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 autoFocus
//               />
//               <button
//                 onClick={handleReplySubmit}
//                 className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
//                 disabled={!replyText.trim()}
//               >
//                 Reply
//               </button>
//             </div>
//           )}

//           {/* Nested replies */}
//           {comment.replies &&
//             comment.replies.map((reply) => (
//               <Comment
//                 key={reply._id}
//                 comment={reply}
//                 postId={postId}
//                 onReply={onReply}
//                 onCommentUpdated={onCommentUpdated}
//                 onCommentDeleted={onCommentDeleted}
//                 level={level + 1}
//               />
//             ))}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && (
//         <DeleteConfirmModal
//           title="Delete Comment"
//           message="Are you sure you want to delete this comment? This action cannot be undone."
//           onConfirm={handleDeleteComment}
//           onCancel={() => setShowDeleteModal(false)}
//         />
//       )}
//     </div>
//   )
// }

// export default Comment











// import { useState } from "react"
// import { ThumbsUp } from "lucide-react"
// import { useNavigate } from "react-router-dom"
// import { formatDistanceToNow } from "date-fns"



// // Comment Component
// const Comment = ({ comment, postId, onReply, level = 0 }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [replyText, setReplyText] = useState("")
//   const navigate = useNavigate()

//   const handleReplySubmit = async (e) => {
//     e.preventDefault()
//     if (!replyText.trim()) return
//     try {
//       const token = localStorage.getItem('token')
//       const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({ text: replyText, parentCommentId: comment._id }),
//       })
//       if (response.ok) {
//         setReplyText("")
//         setShowReplyForm(false)
//         onReply(comment._id, replyText)
//       } else throw new Error('Failed to reply')
//     } catch (error) {
//       console.error('Error replying to comment:', error)
//     }
//   }

//   const goToUserProfile = (userId) => navigate(`/profile/${userId}`)

//   return (
//     <div className={`mb-3 ${level > 0 ? "ml-12" : ""}`}>
//       <div className="flex mt-4">
//         <div
//           className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
//           onClick={() => goToUserProfile(comment.author._id)}
//         >
//           <img
//             src={comment.author.picture || "/placeholder.svg"}
//             alt={comment.author.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-2 flex-1">
//           <div className="bg-gray-100 rounded-lg px-3 py-2">
//             <div
//               className="font-semibold text-sm cursor-pointer hover:underline"
//               onClick={() => goToUserProfile(comment.author._id)}
//             >
//               {`${comment.author.firstName} ${comment.author.lastName}`}
//             </div>
//             <p className="text-sm text-gray-800">{comment.text}</p>
//           </div>
//           <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
//             <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
//             <button className="font-medium hover:text-blue-600">
//               <ThumbsUp size={12} className="inline mr-1" />
//               {comment.likesCount > 0 ? comment.likesCount : 'Like'}
//             </button>
//             <button className="font-medium hover:text-blue-600" onClick={() => setShowReplyForm(!showReplyForm)}>
//               Reply
//             </button>
//           </div>
//           {showReplyForm && (
//             <div className="mt-2 flex items-center">
//               <input
//                 type="text"
//                 placeholder={`Reply to ${comment.author.firstName}...`}
//                 className="flex-1 bg-gray-100 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 autoFocus
//               />
//               <button
//                 onClick={handleReplySubmit}
//                 className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
//                 disabled={!replyText.trim()}
//               >
//                 Reply
//               </button>
//             </div>
//           )}
//           {comment.replies && comment.replies.map((reply) => (
//             <Comment key={reply._id} comment={reply} postId={postId} onReply={onReply} level={level + 1} />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
// export default Comment







// "use client"

// import { useState } from "react"
// import { ThumbsUp } from "lucide-react"
// import { useNavigate } from "react-router-dom"

// const Comment = ({ comment, postId, onReply, level = 0 }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [replyText, setReplyText] = useState("")
//   const navigate = useNavigate()

//   const handleReplySubmit = (e) => {
//     e.preventDefault()
//     if (replyText.trim()) {
//       onReply(comment.id, replyText)
//       setReplyText("")
//       setShowReplyForm(false)
//     }
//   }

//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   return (
//     <div className={`mb-3 ${level > 0 ? "ml-12" : ""}`}>
//       <div className="flex">
//         <div
//           className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
//           onClick={() => goToUserProfile(comment.author.id)}
//         >
//           <img
//             src={comment.author.profilePicture || "/placeholder.svg"}
//             alt={comment.author.name}
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-2 flex-1">
//           <div className="bg-gray-100 rounded-lg px-3 py-2">
//             <div
//               className="font-semibold text-sm cursor-pointer hover:underline"
//               onClick={() => goToUserProfile(comment.author.id)}
//             >
//               {comment.author.name}
//             </div>
//             <p className="text-sm text-gray-800">{comment.text}</p>
//           </div>

//           <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
//             <span>{comment.timeAgo}</span>
//             <button className="font-medium hover:text-blue-600">
//               <ThumbsUp size={12} className="inline mr-1" />
//               {comment.likes > 0 && <span>{comment.likes}</span>}
//               {comment.likes === 0 && <span>Like</span>}
//             </button>
//             <button className="font-medium hover:text-blue-600" onClick={() => setShowReplyForm(!showReplyForm)}>
//               Reply
//             </button>
//           </div>

//           {/* Reply form */}
//           {showReplyForm && (
//             <form onSubmit={handleReplySubmit} className="mt-2 flex items-center">
//               <input
//                 type="text"
//                 placeholder={`Reply to ${comment.author.name}...`}
//                 className="flex-1 bg-gray-100 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 autoFocus
//               />
//               <button
//                 type="submit"
//                 className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
//                 disabled={!replyText.trim()}
//               >
//                 Reply
//               </button>
//             </form>
//           )}

//           {/* Nested replies */}
//           {comment.replies &&
//             comment.replies.map((reply) => (
//               <Comment key={reply.id} comment={reply} postId={postId} onReply={onReply} level={level + 1} />
//             ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Comment

















// "use client"

// import { useState } from "react"
// import { ThumbsUp, MessageCircle } from 'lucide-react'
// import { useNavigate } from "react-router-dom"

// const Comment = ({ comment, postId, onReply, level = 0 }) => {
//   const [showReplyForm, setShowReplyForm] = useState(false)
//   const [replyText, setReplyText] = useState("")
//   const navigate = useNavigate()

//   const handleReplySubmit = (e) => {
//     e.preventDefault()
//     if (replyText.trim()) {
//       onReply(comment.id, replyText)
//       setReplyText("")
//       setShowReplyForm(false)
//     }
//   }

//   const goToUserProfile = (userId) => {
//     navigate(`/profile/${userId}`)
//   }

//   return (
//     <div className={`mb-3 ${level > 0 ? 'ml-12' : ''}`}>
//       <div className="flex">
//         <div 
//           className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 cursor-pointer"
//           onClick={() => goToUserProfile(comment.author.id)}
//         >
//           <img 
//             src={comment.author.profilePicture || "/placeholder.svg"} 
//             alt={comment.author.name} 
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="ml-2 flex-1">
//           <div className="bg-gray-100 rounded-lg px-3 py-2">
//             <div 
//               className="font-semibold text-sm cursor-pointer hover:underline"
//               onClick={() => goToUserProfile(comment.author.id)}
//             >
//               {comment.author.name}
//             </div>
//             <p className="text-sm text-gray-800">{comment.text}</p>
//           </div>
          
//           <div className="flex items-center mt-1 text-xs text-gray-500 space-x-3">
//             <span>{comment.timeAgo}</span>
//             <button className="font-medium hover:text-blue-600">
//               <ThumbsUp size={12} className="inline mr-1" />
//               {comment.likes > 0 && <span>{comment.likes}</span>}
//               {comment.likes === 0 && <span>Like</span>}
//             </button>
//             <button 
//               className="font-medium hover:text-blue-600"
//               onClick={() => setShowReplyForm(!showReplyForm)}
//             >
//               Reply
//             </button>
//           </div>
          
//           {/* Reply form */}
//           {showReplyForm && (
//             <form onSubmit={handleReplySubmit} className="mt-2 flex items-center">
//               <input
//                 type="text"
//                 placeholder={`Reply to ${comment.author.name}...`}
//                 className="flex-1 bg-gray-100 rounded-full py-1 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={replyText}
//                 onChange={(e) => setReplyText(e.target.value)}
//                 autoFocus
//               />
//               <button 
//                 type="submit"
//                 className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-full text-xs font-medium hover:bg-blue-700 transition-colors"
//                 disabled={!replyText.trim()}
//               >
//                 Reply
//               </button>
//             </form>
//           )}
          
//           {/* Nested replies */}
//           {comment.replies && comment.replies.map(reply => (
//             <Comment 
//               key={reply.id} 
//               comment={reply} 
//               postId={postId} 
//               onReply={onReply} 
//               level={level + 1} 
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Comment
