"use client"

import { useState } from "react"
import { Search, MoreVertical, ArrowLeft, Camera, Send } from "lucide-react"

const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState(null)
  const [showChatOnMobile, setShowChatOnMobile] = useState(false)

  const users = [
    {
      id: 1,
      name: "Alex Smith",
      avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
      lastMessage: "I am doing well, Can we meet tomorrow?",
      messages: [
        { id: 1, text: "Hey There!", sender: "them", time: "4:15 PM" },
        { id: 2, text: "How are you?", sender: "them", time: "4:15 PM" },
        { id: 3, text: "How was your day?", sender: "them", time: "4:15 PM" },
        { id: 4, text: "Hello!", sender: "me", time: "4:15 PM" },
        { id: 5, text: "I am fine and how are you?", sender: "me", time: "4:15 PM" },
        { id: 6, text: "Today was great!!!", sender: "me", time: "4:15 PM" },
        { id: 7, text: "I am doing well, Can we meet tomorrow?", sender: "them", time: "4:15 PM" },
      ],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
      lastMessage: "Let's catch up soon!",
      messages: [
        { id: 1, text: "Hi Sarah!", sender: "me", time: "2:30 PM" },
        { id: 2, text: "Hello! How are you doing?", sender: "them", time: "2:32 PM" },
        { id: 3, text: "Let's catch up soon!", sender: "them", time: "2:33 PM" },
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
      lastMessage: "Did you see the latest project update?",
      messages: [{ id: 1, text: "Did you see the latest project update?", sender: "them", time: "11:45 AM" }],
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
      lastMessage: "Thanks for your help yesterday!",
      messages: [{ id: 1, text: "Thanks for your help yesterday!", sender: "them", time: "Yesterday" }],
    },
    {
      id: 5,
      name: "David Wilson",
      avatar: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png",
      lastMessage: "Are we still meeting at 3?",
      messages: [{ id: 1, text: "Are we still meeting at 3?", sender: "them", time: "Yesterday" }],
    },
  ]

  const handleChatSelect = (user) => {
    setSelectedChat(user)
    setShowChatOnMobile(true)
  }

  const handleBackClick = () => {
    setShowChatOnMobile(false)
  }

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Chat List - Hidden on mobile when a chat is selected */}
        <div
          className={`w-full lg:w-2/5 bg-white border-r border-gray-200 flex flex-col ${
            showChatOnMobile ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold mb-4">Chats</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-100 rounded-full py-2 pl-10 pr-4 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleChatSelect(user)}
              >
                <div className="relative">
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="font-semibold">{user.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Divider - Only visible on desktop */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="h-full">
            <img src="https://i.ibb.co/rBZSJDk/Line-61.png" alt="Divider" className="h-full object-contain" />
          </div>
        </div>

        {/* Chat Window - Shown on mobile only when a chat is selected */}
        <div
          className={`w-full lg:w-3/5 bg-gray-50 flex flex-col ${
            showChatOnMobile || selectedChat ? "flex" : "hidden lg:flex"
          }`}
        >
          {selectedChat ? (
            <>
              <div className="bg-white p-4 border-b border-gray-200 flex items-center">
                <button onClick={handleBackClick} className="mr-2 lg:hidden text-gray-600 hover:text-gray-800">
                  <ArrowLeft size={20} />
                </button>
                <img
                  src={selectedChat.avatar || "/placeholder.svg"}
                  alt={selectedChat.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="ml-3 flex-1">
                  <h3 className="font-semibold">{selectedChat.name}</h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center mb-4">
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Today</span>
                </div>

                {selectedChat.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    {message.sender === "them" && (
                      <img
                        src={selectedChat.avatar || "/placeholder.svg"}
                        alt={selectedChat.name}
                        className="w-8 h-8 rounded-full object-cover mr-2 self-end"
                      />
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2 rounded-lg relative ${
                        message.sender === "me"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <p>{message.text}</p>
                      <span
                        className={`text-xs block mt-1 ${message.sender === "me" ? "text-blue-100" : "text-gray-500"}`}
                      >
                        {message.time}
                      </span>
                    </div>
                  </div>
                ))}

                {selectedChat.id === 1 && (
                  <div className="text-center my-4">
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">1 new message</span>
                  </div>
                )}
              </div>

              <div className="bg-white p-4 border-t border-gray-200 flex items-center">
                <button className="text-blue-600 mr-4">
                  <Camera size={24} />
                </button>
                <input
                  type="text"
                  placeholder="Type your message here..."
                  className="flex-1 bg-gray-100 rounded-full py-3 px-4 focus:outline-none"
                />
                <button className="ml-4 bg-blue-600 text-white p-2 rounded-full">
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-8 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <MessageIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No chat selected</h3>
              <p className="text-gray-500">Select a conversation from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Custom message icon component
const MessageIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

export default ChatPage
