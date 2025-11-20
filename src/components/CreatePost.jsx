"use client"

import { useState, useRef } from "react"
import { ImageIcon, Video, Smile, X, Send } from "lucide-react"
import { toast } from "react-toastify"
import crypto from "crypto-js"

const CreatePost = ({ onPostCreated }) => {
  const [postText, setPostText] = useState("")
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewItems, setPreviewItems] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)

  // Cloudinary credentials
  const cloudName = "diane1tak"
  const apiKey = "595487194871695"
  const apiSecret = "mxA23kc58ZihQbGwPuM5mNicdFo"
  const uploadPreset = "sesmanagement"

  // Generate a signed signature for secure upload
  const generateSignature = (paramsToSign, apiSecret) => {
    const sorted = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&")
    return crypto.SHA1(sorted + apiSecret).toString()
  }

  // Handle file selection and upload to Cloudinary
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setSelectedFiles((prev) => [...prev, ...files])
    setIsUploading(true)

    // Show toast for upload start
    toast.info("Uploading media...", {
      theme: "light",
    })

    // Upload each file
    const uploadPromises = files.map(async (file) => {
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        return null
      }

      const timestamp = Math.floor(Date.now() / 1000)
      const params = { timestamp, upload_preset: uploadPreset }
      const signature = generateSignature(params, apiSecret)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", apiKey)
      formData.append("upload_preset", uploadPreset)
      formData.append("timestamp", timestamp)
      formData.append("signature", signature)

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: "POST",
          body: formData,
        })
        const data = await res.json()

        if (data.secure_url) {
          return {
            url: data.secure_url,
            type: file.type.startsWith("video/") ? "video" : "image",
            name: file.name,
          }
        }
      } catch (error) {
        console.error("Cloudinary upload error:", error)
      }
      return null
    })

    try {
      const results = await Promise.all(uploadPromises)
      const validItems = results.filter((item) => item !== null)
      setPreviewItems((prev) => [...prev, ...validItems])

      // Show success toast
      if (validItems.length > 0) {
        toast.success(`${validItems.length} file(s) uploaded successfully!`, {
          theme: "light",
        })
      }
    } catch (error) {
      console.error("Error uploading files:", error)
      toast.error("Failed to upload media", {
        theme: "light",
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Remove a selected/preview item
  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewItems((prev) => prev.filter((_, i) => i !== index))
    toast.info("Media removed", {
      theme: "light",
    })
  }

  // Submit the post with text and media
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!postText.trim() && previewItems.length === 0) {
      toast.error("Post cannot be empty", {
        theme: "light",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("https://ses-management-system-nu.vercel.app/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: postText,
          media: previewItems.map((item) => ({ type: item.type, url: item.url })),
        }),
      })

      if (response.ok) {
        setPostText("")
        setSelectedFiles([])
        setPreviewItems([])
        if (onPostCreated) {
          onPostCreated()
        }
      } else {
        throw new Error("Failed to create post")
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast.error("Failed to create post", {
        theme: "light",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Post</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />

          {isUploading && (
            <div className="mt-3 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-gray-600">Uploading media...</p>
            </div>
          )}

          {previewItems.length > 0 && (
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {previewItems.map((file, index) => (
                <div key={index} className="relative group">
                  {file.type === "image" ? (
                    <img
                      src={file.url || "/placeholder.svg"}
                      alt={file.name}
                      className="h-24 w-full object-cover rounded-md"
                    />
                  ) : (
                    <video src={file.url} className="h-24 w-full object-cover rounded-md" controls={false} />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                disabled={isUploading}
              >
                <ImageIcon size={20} className="mr-1" />
                <span className="hidden sm:inline">Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
                disabled={isUploading}
              >
                <Video size={20} className="mr-1" />
                <span className="hidden sm:inline">Video</span>
              </button>
              {/* <button
                type="button"
                className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Smile size={20} className="mr-1" />
                <span className="hidden sm:inline">Feeling</span>
              </button> */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*,video/*"
                className="hidden"
                disabled={isUploading}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || isUploading || (!postText.trim() && previewItems.length === 0)}
              className={`px-4 py-2 rounded-md flex items-center ${
                isSubmitting || isUploading || (!postText.trim() && previewItems.length === 0)
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <Send size={18} className="mr-1" />
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost




// import React, { useState, useRef } from "react";
// import { ImageIcon, Video, Smile, X, Send } from 'lucide-react';
// import crypto from 'crypto-js';

// // CreatePost Component with Cloudinary Upload Integration
// const CreatePost = () => {
//   const [postText, setPostText] = useState("");
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [previewItems, setPreviewItems] = useState([]);
//   const fileInputRef = useRef(null);

//   // Cloudinary credentials
//   const cloudName = 'diane1tak';
//   const apiKey = '595487194871695';
//   const apiSecret = 'mxA23kc58ZihQbGwPuM5mNicdFo';
//   const uploadPreset = 'sesmanagement';

//   // Generate a signed signature for secure upload
//   const generateSignature = (paramsToSign, apiSecret) => {
//     const sorted = Object.keys(paramsToSign)
//       .sort()
//       .map(key => `${key}=${paramsToSign[key]}`)
//       .join('&');
//     return crypto.SHA1(sorted + apiSecret).toString();
//   };

//   // Handle file selection and upload to Cloudinary
//   const handleFileSelect = async (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length === 0) return;

//     setSelectedFiles(prev => [...prev, ...files]);

//     // Upload each file
//     const uploadPromises = files.map(async (file) => {
//       if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
//         return null;
//       }

//       const timestamp = Math.floor(Date.now() / 1000);
//       const params = { timestamp, upload_preset: uploadPreset };
//       const signature = generateSignature(params, apiSecret);

//       const formData = new FormData();
//       formData.append('file', file);
//       formData.append('api_key', apiKey);
//       formData.append('upload_preset', uploadPreset);
//       formData.append('timestamp', timestamp);
//       formData.append('signature', signature);

//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
//         { method: 'POST', body: formData }
//       );
//       const data = await res.json();

//       if (data.secure_url) {
//         return {
//           url: data.secure_url,
//           type: file.type.startsWith('video/') ? 'video' : 'image',
//           name: file.name,
//         };
//       }

//       console.error('Cloudinary upload error:', data);
//       return null;
//     });

//     try {
//       const results = await Promise.all(uploadPromises);
//       const validItems = results.filter(item => item !== null);
//       setPreviewItems(prev => [...prev, ...validItems]);
//     } catch (error) {
//       console.error('Error uploading files:', error);
//     }
//   };

//   // Remove a selected/preview item
//   const removeFile = (index) => {
//     setSelectedFiles(prev => prev.filter((_, i) => i !== index));
//     setPreviewItems(prev => prev.filter((_, i) => i !== index));
//   };

//   // Submit the post with text and media
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!postText.trim() && previewItems.length === 0) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('https://ses-management-system-nu.vercel.app/posts', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           description: postText,
//           media: previewItems.map(item => ({ type: item.type, url: item.url })),
//         }),
//       });

//       if (response.ok) {
//         setPostText("");
//         setSelectedFiles([]);
//         setPreviewItems([]);
//       } else {
//         console.error('Failed to create post');
//       }
//     } catch (error) {
//       console.error('Error creating post:', error);
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//       <div className="p-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Post</h2>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             placeholder="What's on your mind?"
//             className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//             rows={3}
//             value={postText}
//             onChange={(e) => setPostText(e.target.value)}
//           />

//           {previewItems.length > 0 && (
//             <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {previewItems.map((file, index) => (
//                 <div key={index} className="relative group">
//                   {file.type === 'image' ? (
//                     <img src={file.url} alt={file.name} className="h-24 w-full object-cover rounded-md" />
//                   ) : (
//                     <video src={file.url} className="h-24 w-full object-cover rounded-md" controls={false} />
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => removeFile(index)}
//                     className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-4 flex justify-between items-center">
//             <div className="flex space-x-2">
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <ImageIcon size={20} className="mr-1" />
//                 <span className="hidden sm:inline">Photo/Video</span>
//               </button>
//               <button
//                 type="button"
//                 className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <Smile size={20} className="mr-1" />
//                 <span className="hidden sm:inline">Feeling</span>
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 accept="image/*,video/*"
//                 className="hidden"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={!postText.trim() && previewItems.length === 0}
//               className={`px-4 py-2 rounded-md flex items-center ${!postText.trim() && previewItems.length === 0 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
//             >
//               <Send size={18} className="mr-1" />
//               Post
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreatePost;










// "use client"

// import { useState, useRef } from "react"
// import { ImageIcon, Video, Smile, X, Send } from 'lucide-react'

// const CreatePost = () => {
//   const [postText, setPostText] = useState("")
//   const [selectedFiles, setSelectedFiles] = useState([])
//   const [previewUrls, setPreviewUrls] = useState([])
//   const fileInputRef = useRef(null)

//   const handleFileSelect = (e) => {
//     const files = Array.from(e.target.files)
//     if (files.length === 0) return

//     setSelectedFiles((prevFiles) => [...prevFiles, ...files])

//     // Create preview URLs for the selected files
//     const newPreviewUrls = files.map((file) => {
//       const isVideo = file.type.startsWith("video/")
//       return {
//         url: URL.createObjectURL(file),
//         type: isVideo ? "video" : "image",
//         name: file.name,
//       }
//     })

//     setPreviewUrls((prevUrls) => [...prevUrls, ...newPreviewUrls])
//   }

//   const removeFile = (index) => {
//     // Revoke the object URL to avoid memory leaks
//     URL.revokeObjectURL(previewUrls[index].url)

//     setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
//     setPreviewUrls((prevUrls) => prevUrls.filter((_, i) => i !== index))
//   }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     if (!postText.trim() && selectedFiles.length === 0) return

//     // Here you would typically send the post data to your API
//     console.log("Post text:", postText)
//     console.log("Selected files:", selectedFiles)

//     // Reset form
//     setPostText("")
//     setSelectedFiles([])
//     setPreviewUrls([])
//   }

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
//       <div className="p-4">
//         <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Post</h2>
//         <form onSubmit={handleSubmit}>
//           <textarea
//             placeholder="What's on your mind?"
//             className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
//             rows={3}
//             value={postText}
//             onChange={(e) => setPostText(e.target.value)}
//           ></textarea>

//           {/* Preview selected files */}
//           {previewUrls.length > 0 && (
//             <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {previewUrls.map((file, index) => (
//                 <div key={index} className="relative group">
//                   {file.type === "image" ? (
//                     <img
//                       src={file.url || "/placeholder.svg"}
//                       alt={file.name}
//                       className="h-24 w-full object-cover rounded-md"
//                     />
//                   ) : (
//                     <video
//                       src={file.url}
//                       className="h-24 w-full object-cover rounded-md"
//                       controls={false}
//                     ></video>
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => removeFile(index)}
//                     className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-4 flex justify-between items-center">
//             <div className="flex space-x-2">
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <ImageIcon size={20} className="mr-1" />
//                 <span className="hidden sm:inline">Photo</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => fileInputRef.current.click()}
//                 className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <Video size={20} className="mr-1" />
//                 <span className="hidden sm:inline">Video</span>
//               </button>
//               <button
//                 type="button"
//                 className="flex items-center text-gray-600 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100 transition-colors"
//               >
//                 <Smile size={20} className="mr-1" />
//                 <span className="hidden sm:inline">Feeling</span>
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileSelect}
//                 multiple
//                 accept="image/*,video/*"
//                 className="hidden"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={!postText.trim() && selectedFiles.length === 0}
//               className={`px-4 py-2 rounded-md flex items-center ${
//                 !postText.trim() && selectedFiles.length === 0
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-600 text-white hover:bg-blue-700"
//               }`}
//             >
//               <Send size={18} className="mr-1" />
//               Post
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default CreatePost

