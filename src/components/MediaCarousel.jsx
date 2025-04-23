import { useState } from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
// MediaCarousel Component
const MediaCarousel = ({ media }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextMedia = () => {
    if (currentIndex < media.length - 1) setCurrentIndex(currentIndex + 1)
  }

  const prevMedia = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  if (!media || media.length === 0) return null

  return (
    <div className="relative">
      <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
        {media[currentIndex].type === 'image' ? (
          <img src={media[currentIndex].url} alt="Post content" className="w-full h-full object-cover" />
        ) : (
          <video src={media[currentIndex].url} controls className="w-full h-full object-cover" />
        )}
        {media.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{media.length}
          </div>
        )}
      </div>
      {media.length > 1 && (
        <>
          <button
            onClick={prevMedia}
            disabled={currentIndex === 0}
            className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextMedia}
            disabled={currentIndex === media.length - 1}
            className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${currentIndex === media.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'}`}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </div>
  )
}
export default MediaCarousel






// "use client"

// import { useState } from "react"
// import { ChevronLeft, ChevronRight } from 'lucide-react'

// const MediaCarousel = ({ media }) => {
//   const [currentIndex, setCurrentIndex] = useState(0)

//   const nextMedia = () => {
//     if (currentIndex < media.length - 1) {
//       setCurrentIndex(currentIndex + 1)
//     }
//   }

//   const prevMedia = () => {
//     if (currentIndex > 0) {
//       setCurrentIndex(currentIndex - 1)
//     }
//   }

//   if (!media || media.length === 0) return null

//   return (
//     <div className="relative">
//       <div className="w-full aspect-video bg-gray-100 relative overflow-hidden">
//         {media[currentIndex].type === 'image' ? (
//           <img 
//             src={media[currentIndex].url || "/placeholder.svg"} 
//             alt="Post content" 
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <video 
//             src={media[currentIndex].url} 
//             controls 
//             className="w-full h-full object-cover"
//           />
//         )}
        
//         {/* Media counter */}
//         {media.length > 1 && (
//           <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
//             {currentIndex + 1}/{media.length}
//           </div>
//         )}
//       </div>
      
//       {/* Navigation buttons for multiple media */}
//       {media.length > 1 && (
//         <>
//           <button 
//             onClick={prevMedia} 
//             disabled={currentIndex === 0}
//             className={`absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//               currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'
//             }`}
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <button 
//             onClick={nextMedia} 
//             disabled={currentIndex === media.length - 1}
//             className={`absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 rounded-full ${
//               currentIndex === media.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'
//             }`}
//           >
//             <ChevronRight size={24} />
//           </button>
//         </>
//       )}
//     </div>
//   )
// }

// export default MediaCarousel
