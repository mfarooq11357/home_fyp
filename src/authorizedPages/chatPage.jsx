"use client"

import { useState, useEffect, useRef } from "react"
import { Search, MoreVertical, ArrowLeft, Image as ImageIcon, Check, Send } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { io } from "socket.io-client"
import { jwtAuthMiddleware } from "../utils/jwt"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import crypto from 'crypto-js'

const ChatPage = () => {
  const [socket, setSocket] = useState(null)
  const [users, setUsers] = useState([])
  const [selectedChat, setSelectedChat] = useState(null)
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [onlineStatus, setOnlineStatus] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [mediaFile, setMediaFile] = useState(null)
  const [mediaPreview, setMediaPreview] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const chatContainerRef = useRef(null)
  const fileInputRef = useRef(null)
  const token = localStorage.getItem("token")

  // Cloudinary credentials
  const cloudName = 'diane1tak'
  const apiKey = '595487194871695'
  const apiSecret = 'mxA23kc58ZihQbGwPuM5mNicdFo'
  const uploadPreset = 'sesmanagement'

  // Initialize Socket.IO and fetch users
  useEffect(() => {
    const initSocket = async () => {
      const newSocket = io("https://ses-management-system-nu.vercel.app", {
        query: { token },
      })
      setSocket(newSocket)

      fetchChatUsers()

      newSocket.on('updateChatList', () => {
        fetchChatUsers()
      })

      return () => {
        newSocket.off('updateChatList')
        newSocket.disconnect()
      }
    }
    initSocket()
  }, [token])

  // Fetch chat users
  const fetchChatUsers = async () => {
    try {
      const response = await fetch("https://ses-management-system-nu.vercel.app/messages/chat-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      console.error("Error fetching chat users:", error)
    }
  }

  // Handle socket events
  useEffect(() => {
    if (!socket) return

    socket.on("newMessage", (message) => {
      if (
        (message.sender === selectedChat?._id && message.receiver === jwtAuthMiddleware(token).id) ||
        (message.receiver === selectedChat?._id && message.sender === jwtAuthMiddleware(token).id)
      ) {
        setMessages((prev) => [...prev, message])
        if (message.receiver === jwtAuthMiddleware(token).id && selectedChat?._id === message.sender) {
          socket.emit("markAsSeen", { messageId: message._id })
        }
      } else if (message.receiver === jwtAuthMiddleware(token).id) {
        toast.info(`New message from ${message.senderName}`, {
          position: "top-right",
          autoClose: 5000,
        })
      }
    })

    socket.on("messageSeen", (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      )
    })

    socket.on("userStatus", ({ userId, isOnline }) => {
      setOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }))
    })

    return () => {
      socket.off("newMessage")
      socket.off("messageSeen")
      socket.off("userStatus")
    }
  }, [socket, selectedChat, token])

  // Handle selected user and fetch chat history
  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedChat(location.state.selectedUser)
      setShowChatOnMobile(true)
      fetchChatHistory(location.state.selectedUser._id)
      if (socket) {
        socket.emit("subscribeToUserStatus", location.state.selectedUser._id)
      }
    }
  }, [location.state, socket])

  // Fetch chat history and mark unseen messages as seen
  const fetchChatHistory = async (userId) => {
    try {
      const response = await fetch(`https://ses-management-system-nu.vercel.app/messages/history/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      setMessages(data.messages || [])

      // Mark any unseen messages from the selected chat as seen
      const currentUserId = jwtAuthMiddleware(token).id
      if (socket && data.messages) {
        data.messages.forEach((message) => {
          if (!message.isSeen && message.receiver === currentUserId) {
            socket.emit("markAsSeen", { messageId: message._id })
          }
        })
      }
    } catch (error) {
      console.error("Error fetching chat history:", error)
    }
  }

  // Scroll to bottom when messages change or chat is selected
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, selectedChat])

  // Handle chat selection
  const handleChatSelect = (user) => {
    setSelectedChat(user)
    setShowChatOnMobile(true)
    fetchChatHistory(user._id)
    if (socket) {
      socket.emit("subscribeToUserStatus", user._id)
    }
  }

  // Handle sending a message
  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !mediaFile) || !selectedChat || !socket) return

    let mediaUrl = null
    if (mediaFile) {
      mediaUrl = await uploadMedia(mediaFile)
      if (!mediaUrl) {
        toast.error('Failed to upload media')
        return
      }
    }

    const message = {
      receiver: selectedChat._id,
      content: newMessage,
      mediaUrl,
      messageType: mediaFile ? (mediaFile.type.startsWith('image/') ? 'image' : 'file') : 'text',
    }

    try {
      const response = await fetch("https://ses-management-system-nu.vercel.app/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      })
      const data = await response.json()
      if (data.success) {
        setMessages((prev) => [...prev, data.message])
        setNewMessage("")
        setMediaFile(null)
        setMediaPreview(null)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  // Upload media to Cloudinary
  const uploadMedia = async (file) => {
    const timestamp = Math.floor(Date.now() / 1000)
    const paramsToSign = { timestamp, upload_preset: uploadPreset }
    const signature = generateSignature(paramsToSign, apiSecret)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      return data.secure_url || null
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error uploading media')
      return null
    }
  }

  // Generate Cloudinary signature
  const generateSignature = (paramsToSign, apiSecret) => {
    const sortedParams = Object.keys(paramsToSign).sort().reduce((acc, key) => {
      acc[key] = paramsToSign[key]
      return acc
    }, {})
    const paramString = Object.entries(sortedParams).map(([key, value]) => `${key}=${value}`).join('&')
    return crypto.SHA1(paramString + apiSecret).toString()
  }

  // Handle media selection
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setMediaFile(file)
      setMediaPreview(URL.createObjectURL(file))
    }
  }

  // Render media preview
  const renderMediaPreview = () => {
    if (!mediaPreview) return null
    return (
      <div className="mt-2">
        {mediaFile.type.startsWith('image/') ? (
          <img src={mediaPreview} alt="Preview" className="max-w-[200px] h-auto" />
        ) : (
          <p>{mediaFile.name}</p>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List */}
        <div
          className={`w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col ${
            showChatOnMobile ? "hidden" : "flex"
          } lg:flex`}
        >
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Chats</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {users
              .filter(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <div
                  key={user._id}
                  className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleChatSelect(user)}
                >
                  <div className="relative">
                    <img
                      src={user.picture || "/placeholder.svg"}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        onlineStatus[user._id] ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                    <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                  </div>
                  {user.unreadCount > 0 && (
                    <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {user.unreadCount}
                    </div>
                  )}
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Chat Window */}
        <div
          className={`w-full lg:w-3/5 bg-gray-50 flex flex-col ${
            showChatOnMobile ? "flex" : "hidden"
          } lg:flex`}
        >
          {selectedChat ? (
            <>
              <div className="bg-white p-4 border-b border-gray-200 flex items-center">
                <button
                  onClick={() => setShowChatOnMobile(false)}
                  className="mr-2 lg:hidden text-gray-600 hover:text-gray-800"
                >
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={selectedChat.picture || "/placeholder.svg"}
                  alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-semibold">{selectedChat.firstName} {selectedChat.lastName}</h3>
                  <p className={`text-xs ${onlineStatus[selectedChat._id] ? "text-green-500" : "text-black"}`}>
                    {onlineStatus[selectedChat._id] ? "Online" : "Offline"}
                  </p>
                </div>
              </div>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4">
                {messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((message) => (
                  <div
                    key={message._id}
                    className={`mb-4 flex ${message.sender === jwtAuthMiddleware(token).id ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender !== jwtAuthMiddleware(token).id && (
                      <img
                        src={selectedChat.picture || "/placeholder.svg"}
                        alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
                        className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                      />
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg relative ${
                        message.sender === jwtAuthMiddleware(token).id
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {message.messageType === 'text' ? (
                        <p>{message.content}</p>
                      ) : message.messageType === 'image' ? (
                        <img src={message.mediaUrl} alt="Sent image" className="max-w-full h-auto" />
                      ) : (
                        <a href={message.mediaUrl} target="_blank" rel="noopener noreferrer">
                          {message.mediaUrl.split('/').pop()}
                        </a>
                      )}
                      <div className="flex items-center justify-end mt-1">
                        <span
                          className={`text-xs ${message.sender === jwtAuthMiddleware(token).id ? "text-blue-100" : "text-gray-500"}`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {message.sender === jwtAuthMiddleware(token).id && (
                          <span className="ml-1 flex items-center">
                            {message.isSeen ? (
                              <>
                                <Check size={14} color="#00aaff" />
                                <Check size={14} color="#00aaff" style={{ marginLeft: '-5px' }} />
                              </>
                            ) : (
                              <Check size={14} color="#000" />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 border-t border-gray-200 flex items-center">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current.click()} className="text-blue-600 mr-4">
                  <ImageIcon size={24} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none"
                />
                {renderMediaPreview()}
                <button onClick={handleSendMessage} className="ml-4 bg-blue-600 text-white p-2 rounded-full">
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
              <p className="text-gray-500">Select a conversation from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage


// "use client"

// import { useState, useEffect, useRef } from "react"
// import { Search, MoreVertical, ArrowLeft, Camera, Send } from "lucide-react"
// import { useLocation, useNavigate } from "react-router-dom"
// import { io } from "socket.io-client"
// import { jwtAuthMiddleware } from "../utils/jwt" // Assuming you have this utility

// const ChatPage = () => {
//   const [socket, setSocket] = useState(null)
//   const [users, setUsers] = useState([])
//   const [selectedChat, setSelectedChat] = useState(null)
//   const [showChatOnMobile, setShowChatOnMobile] = useState(false)
//   const [messages, setMessages] = useState([])
//   const [newMessage, setNewMessage] = useState("")
//   const [onlineStatus, setOnlineStatus] = useState({})
//   const location = useLocation()
//   const navigate = useNavigate()
//   const messagesEndRef = useRef(null)

//   const selectedUser = location.state?.selectedUser
//   const token = localStorage.getItem("token") // Assuming token is stored in localStorage

//   // Initialize Socket.IO and fetch users
//   useEffect(() => {
//     const initSocket = async () => {
//       const newSocket = io("https://ses-management-system-nu.vercel.app", {
//         query: { token },
//       })
//       setSocket(newSocket)

//       // Fetch all users for chat list
//       try {
//         const response = await fetch("https://ses-management-system-nu.vercel.app/user/allUsers?page=1&limit=10", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         const data = await response.json()
//         setUsers(data.users || [])
//       } catch (error) {
//         console.error("Error fetching users:", error)
//       }

//       return () => newSocket.disconnect()
//     }
//     initSocket()
//   }, [token])

//   // Handle socket events
//   useEffect(() => {
//     if (!socket) return

//     socket.on("newMessage", (message) => {
//       if (
//         (message.sender === selectedChat?._id && message.receiver === jwtAuthMiddleware(token).id) ||
//         (message.receiver === selectedChat?._id && message.sender === jwtAuthMiddleware(token).id)
//       ) {
//         setMessages((prev) => [...prev, message])
//       }
//     })

//     socket.on("messageSeen", (updatedMessage) => {
//       setMessages((prev) =>
//         prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
//       )
//     })

//     socket.on("userStatus", ({ userId, isOnline }) => {
//       setOnlineStatus((prev) => ({ ...prev, [userId]: isOnline }))
//     })

//     return () => {
//       socket.off("newMessage")
//       socket.off("messageSeen")
//       socket.off("userStatus")
//     }
//   }, [socket, selectedChat, token])

//   // Handle selected user from PublicProfilePage and fetch chat history
//   useEffect(() => {
//     if (selectedUser) {
//       setSelectedChat(selectedUser)
//       setShowChatOnMobile(true)
//       fetchChatHistory(selectedUser._id)
//       if (socket) {
//         socket.emit("subscribeToUserStatus", selectedUser._id)
//       }
//     }
//   }, [selectedUser, socket])

//   // Fetch chat history
//   const fetchChatHistory = async (userId) => {
//     try {
//       const response = await fetch(`https://ses-management-system-nu.vercel.app/messages/history/${userId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       const data = await response.json()
//       setMessages(data.messages || [])
//     } catch (error) {
//       console.error("Error fetching chat history:", error)
//     }
//   }

//   // Scroll to bottom of messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
//   }, [messages])

//   // Handle chat selection
//   const handleChatSelect = (user) => {
//     setSelectedChat(user)
//     setShowChatOnMobile(true)
//     fetchChatHistory(user._id)
//     if (socket) {
//       socket.emit("subscribeToUserStatus", user._id)
//     }
//   }

//   // Handle sending a message
//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedChat || !socket) return

//     const message = {
//       receiver: selectedChat._id,
//       content: newMessage,
//       messageType: "text",
//     }

//     try {
//       const response = await fetch("https://ses-management-system-nu.vercel.app/messages/send", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(message),
//       })
//       const data = await response.json()
//       if (data.success) {
//         setMessages((prev) => [...prev, data.message])
//         setNewMessage("")
//       }
//     } catch (error) {
//       console.error("Error sending message:", error)
//     }
//   }

//   // Mark messages as seen
//   const markMessagesAsSeen = () => {
//     if (!socket || !selectedChat) return
//     messages.forEach((msg) => {
//       if (!msg.isSeen && msg.receiver === jwtAuthMiddleware(token).id) {
//         socket.emit("markAsSeen", { messageId: msg._id })
//       }
//     })
//   }

//   useEffect(() => {
//     if (selectedChat) markMessagesAsSeen()
//   }, [messages, selectedChat])

//   return (
//     <div className="container mx-auto h-screen flex flex-col">
//       <div className="flex flex-1 overflow-hidden">
//         {/* Chat List */}
//         <div
//           className={`w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col ${
//             showChatOnMobile ? "hidden lg:flex" : "flex"
//           }`}
//         >
//           <div className="p-4 border-b border-gray-200">
//             <h1 className="text-3xl font-bold mb-4">Chats</h1>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {users.map((user) => (
//               <div
//                 key={user._id}
//                 className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleChatSelect(user)}
//               >
//                 <div className="relative">
//                   <img
//                     src={user.picture || "/placeholder.svg"}
//                     alt={`${user.firstName} ${user.lastName}`}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div
//                     className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                       onlineStatus[user._id] ? "bg-green-500" : "bg-gray-400"
//                     }`}
//                   ></div>
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
//                   <p className="text-sm text-gray-500 truncate">
//                     {messages.find((m) => m.sender === user._id || m.receiver === user._id)?.content || "No messages yet"}
//                   </p>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600">
//                   <MoreVertical size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Divider */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Chat Window */}
//         <div
//           className={`w-full lg:w-3/5 bg-gray-50 flex flex-col ${
//             showChatOnMobile || selectedChat ? "flex" : "hidden lg:flex"
//           }`}
//         >
//           {selectedChat ? (
//             <>
//               <div className="bg-white p-4 border-b border-gray-200 flex items-center">
//                 <button
//                   onClick={() => setShowChatOnMobile(false)}
//                   className="mr-2 lg:hidden text-gray-600 hover:text-gray-800"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>
//                 <img
//                   src={selectedChat.picture || "/placeholder.svg"}
//                   alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="ml-3 flex-1">
//                   <h3 className="font-semibold">{selectedChat.firstName} {selectedChat.lastName}</h3>
//                   <p className="text-xs">{onlineStatus[selectedChat._id] ? "Online" : "Offline"}</p>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4 flex flex-col">
//                 {messages.map((message) => (
//                   <div
//                     key={message._id}
//                     className={`mb-4 flex ${message.sender === jwtAuthMiddleware(token).id ? "justify-end" : "justify-start"}`}
//                   >
//                     {message.sender !== jwtAuthMiddleware(token).id && (
//                       <img
//                         src={selectedChat.picture || "/placeholder.svg"}
//                         alt={`${selectedChat.firstName} ${selectedChat.lastName}`}
//                         className="w-8 h-8 rounded-full object-cover mr-2 self-end"
//                       />
//                     )}
//                     <div
//                       className={`max-w-[70%] px-4 py-2 rounded-lg relative ${
//                         message.sender === jwtAuthMiddleware(token).id
//                           ? "bg-blue-600 text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       <p>{message.content}</p>
//                       <div className="flex items-center justify-end mt-1">
//                         <span
//                           className={`text-xs ${message.sender === jwtAuthMiddleware(token).id ? "text-blue-100" : "text-gray-500"}`}
//                         >
//                           {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
//                         </span>
//                         {message.sender === jwtAuthMiddleware(token).id && (
//                           <span className="ml-1">
//                             {message.isSeen ? (
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="yellow" strokeWidth="2">
//                                 <path d="M1 12l7 7L22 5" />
//                                 <path d="M8 12l7 7" />
//                               </svg>
//                             ) : (
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2">
//                                 <path d="M1 12l7 7L22 5" />
//                               </svg>
//                             )}
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>

//               <div className="bg-white p-4 border-t border-gray-200 flex items-center">
//                 <button className="text-blue-600 mr-4">
//                   <Camera size={24} />
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Type your message here..."
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//                   className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none"
//                 />
//                 <button onClick={handleSendMessage} className="ml-4 bg-blue-600 text-white p-2 rounded-full">
//                   <Send size={20} />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
//               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                 <MessageIcon size={32} className="text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
//               <p className="text-gray-500">Select a conversation from the list to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Custom message icon component
// const MessageIcon = ({ size, className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//   </svg>
// )

// export default ChatPage









// "use client"

// import { useState } from "react"
// import { Search, MoreVertical, ArrowLeft, Camera, Send } from "lucide-react"

// const ChatPage = () => {
//   const [selectedChat, setSelectedChat] = useState(null)
//   const [showChatOnMobile, setShowChatOnMobile] = useState(false)

//   const users = [
//     {
//       id: 1,
//       name: "Alex Smith",
//       avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       lastMessage: "I am doing well, Can we meet tomorrow?",
//       messages: [
//         { id: 1, text: "Hey There!", sender: "them", time: "4:15 PM" },
//         { id: 2, text: "How are you?", sender: "them", time: "4:15 PM" },
//         { id: 3, text: "How was your day?", sender: "them", time: "4:15 PM" },
//         { id: 4, text: "Hello!", sender: "me", time: "4:15 PM" },
//         { id: 5, text: "I am fine and how are you?", sender: "me", time: "4:15 PM" },
//         { id: 6, text: "Today was great!!!", sender: "me", time: "4:15 PM" },
//         { id: 7, text: "I am doing well, Can we meet tomorrow?", sender: "them", time: "4:15 PM" },
//       ],
//     },
//     {
//       id: 2,
//       name: "Sarah Johnson",
//       avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       lastMessage: "Let's catch up soon!",
//       messages: [
//         { id: 1, text: "Hi Sarah!", sender: "me", time: "2:30 PM" },
//         { id: 2, text: "Hello! How are you doing?", sender: "them", time: "2:32 PM" },
//         { id: 3, text: "Let's catch up soon!", sender: "them", time: "2:33 PM" },
//       ],
//     },
//     {
//       id: 3,
//       name: "Michael Brown",
//       avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       lastMessage: "Did you see the latest project update?",
//       messages: [{ id: 1, text: "Did you see the latest project update?", sender: "them", time: "11:45 AM" }],
//     },
//     {
//       id: 4,
//       name: "Emily Davis",
//       avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       lastMessage: "Thanks for your help yesterday!",
//       messages: [{ id: 1, text: "Thanks for your help yesterday!", sender: "them", time: "Yesterday" }],
//     },
//     {
//       id: 5,
//       name: "David Wilson",
//       avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
//       lastMessage: "Are we still meeting at 3?",
//       messages: [{ id: 1, text: "Are we still meeting at 3?", sender: "them", time: "Yesterday" }],
//     },
//   ]

//   const handleChatSelect = (user) => {
//     setSelectedChat(user)
//     setShowChatOnMobile(true)
//   }

//   const handleBackClick = () => {
//     setShowChatOnMobile(false)
//   }

//   return (
//     <div className="container mx-auto h-screen flex flex-col">
//       <div className="flex flex-1 overflow-hidden">
//         {/* Chat List - Hidden on mobile when a chat is selected */}
//         <div
//           className={`w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col ${
//             showChatOnMobile ? "hidden lg:flex" : "flex"
//           }`}
//         >
//           <div className="p-4 border-b border-gray-200">
//             <h1 className="text-3xl font-bold mb-4">Chats</h1>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search"
//                 className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex-1 overflow-y-auto">
//             {users.map((user) => (
//               <div
//                 key={user.id}
//                 className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => handleChatSelect(user)}
//               >
//                 <div className="relative">
//                   <img
//                     src={user.avatar || "/placeholder.svg"}
//                     alt={user.name}
//                     className="w-12 h-12 rounded-full object-cover"
//                   />
//                   <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <h3 className="font-semibold">{user.name}</h3>
//                   <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600">
//                   <MoreVertical size={18} />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Divider - Only visible on desktop */}
//         <div className="hidden lg:flex items-center justify-center">
//           <div className="h-full">
//             <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
//           </div>
//         </div>

//         {/* Chat Window - Shown on mobile only when a chat is selected */}
//         <div
//           className={`w-full lg:w-3/5 bg-gray-50 flex flex-col ${
//             showChatOnMobile || selectedChat ? "flex" : "hidden lg:flex"
//           }`}
//         >
//           {selectedChat ? (
//             <>
//               <div className="bg-white p-4 border-b border-gray-200 flex items-center">
//                 <button onClick={handleBackClick} className="mr-2 lg:hidden text-gray-600 hover:text-gray-800">
//                   <ArrowLeft size={20} />
//                 </button>
//                 <img
//                   src={selectedChat.avatar || "/placeholder.svg"}
//                   alt={selectedChat.name}
//                   className="w-10 h-10 rounded-full object-cover"
//                 />
//                 <div className="ml-3 flex-1">
//                   <h3 className="font-semibold">{selectedChat.name}</h3>
//                   <p className="text-xs text-green-500">Online</p>
//                 </div>
//               </div>

//               <div className="flex-1 overflow-y-auto p-4">
//                 <div className="text-center mb-4">
//                   <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Today</span>
//                 </div>

//                 {selectedChat.messages.map((message) => (
//                   <div
//                     key={message.id}
//                     className={`mb-4 flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
//                   >
//                     {message.sender === "them" && (
//                       <img
//                         src={selectedChat.avatar || "/placeholder.svg"}
//                         alt={selectedChat.name}
//                         className="w-8 h-8 rounded-full object-cover mr-2 self-end"
//                       />
//                     )}
//                     <div
//                       className={`max-w-[70%] px-4 py-2 rounded-lg relative ${
//                         message.sender === "me"
//                           ? "bg-blue-600 text-white rounded-br-none"
//                           : "bg-gray-200 text-gray-800 rounded-bl-none"
//                       }`}
//                     >
//                       <p>{message.text}</p>
//                       <span
//                         className={`text-xs block mt-1 ${message.sender === "me" ? "text-blue-100" : "text-gray-500"}`}
//                       >
//                         {message.time}
//                       </span>
//                     </div>
//                   </div>
//                 ))}

//                 {selectedChat.id === 1 && (
//                   <div className="text-center my-4">
//                     <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">1 new message</span>
//                   </div>
//                 )}
//               </div>

//               <div className="bg-white p-4 border-t border-gray-200 flex items-center">
//                 <button className="text-blue-600 mr-4">
//                   <Camera size={24} />
//                 </button>
//                 <input
//                   type="text"
//                   placeholder="Type your message here..."
//                   className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none"
//                 />
//                 <button className="ml-4 bg-blue-600 text-white p-2 rounded-full">
//                   <Send size={20} />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
//               <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
//                 <MessageIcon size={32} className="text-gray-400" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
//               <p className="text-gray-500">Select a conversation from the list to start chatting</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

// // Custom message icon component
// const MessageIcon = ({ size, className }) => (
//   <svg
//     xmlns="http://www.w3.org/2000/svg"
//     width={size}
//     height={size}
//     viewBox="0 0 24 24"
//     fill="none"
//     stroke="currentColor"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={className}
//   >
//     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//   </svg>
// )

// export default ChatPage

