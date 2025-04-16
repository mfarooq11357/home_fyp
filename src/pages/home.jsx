import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";



export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const teamMembers = [
    {
      name: "Dr Ahmed Ali",
      description: "A visionary leader and researcher with over 20 years of experience in healthcare innovation. Dr. Ahmed has contributed to groundbreaking medical solutions, inspiring countless professionals worldwide.",
      image: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png" // Replace with actual image path
    },
    {
      name: "Dr Shazaib Khan",
      description: "A technology enthusiast and entrepreneur, Dr. Shahzaib has successfully bridged the gap between IT and medicine. His efforts have revolutionized patient care and hospital management systems. Great job done by him.",
      image: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png" // Replace with actual image path
    },
    {
      name: "Dr Umer Farooq",
      description: "An accomplished academic and mentor, Dr. Umer has transformed education through his passion for teaching and commitment to student success. His innovative methods continue to shape future leaders.",
      image: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png" // Replace with actual image path
    },
    {
      name: "Dr Sarah Ahmed",
      description: "Leading expert in digital healthcare with a focus on accessibility and equity in medical systems. Dr. Sarah has pioneered several initiatives that have improved healthcare delivery in underserved communities.",
      image: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png" // Replace with actual image path
    },
    {
      name: "Dr Malik Hassan",
      description: "Renowned researcher in biomedical engineering whose work has led to significant advancements in prosthetic technology. Dr. Hassan's dedication to improving quality of life for patients has earned international recognition.",
      image: "https://i.ibb.co/ksKn2gWQ/Ellipse-1.png" // Replace with actual image path
    }
  ];

  // Custom arrows for slider
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
      style={{ ...style, left: "-40px" }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </div>
    </button>
  );
};

const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
      style={{ ...style, right: "-40px" }}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-full h-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </div>
    </button>
  );
};

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: "0",
  beforeChange: (current, next) => setActiveSlide(next),
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "20px"
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: "30px"
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        centerPadding: "0"
      }
    }
  ]
};


  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="w-full md:w-1/2 space-y-4  md:space-y-8 mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-[#2D50A1] leading-tight">
              CONNECTING, COMMUNITIES,
              <span className="block">Empowering Growth</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-lg pb-6">
              Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications.
            </p>
            <Link to="/signup" >
            <button className="px-6 py-2 border border-[#2D50A1] text-blue-700 rounded-md hover:bg-[#2D50A1] hover:text-white transition-colors duration-300 text-sm sm:text-base">
              Register now
            </button>
            </Link>
          </div>
          
          {/* Right Content - Image */}
          <div className="w-full md:w-1/2 flex flex-col items-center">
            <div className="relative w-full aspect-[5/3] rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://i.ibb.co/Lhr7b7Tk/image-4-Picsart-Ai-Image-Enhancer.png"
                alt="Celebrating Excellence"
                className="object-cover absolute inset-0 w-full h-full"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="mt-3 text-sm sm:text-base text-blue-700 font-medium text-center">
              "Celebrating Excellence: Recognizing Achievements"
            </p>
          </div>
        </div>
      </div>





{/* 
      <div className="flex flex-row overflow-hidden rounded-xl shadow-lg max-w-2xl bg-white h-[170x] text-sm">
  <div className="bg-blue-700 w-full md:w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
    <img 
      src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
      className="w-full h-full object-cover object-center"
    />
  </div>
  <div className="w-full md:w-2/3 p-4 flex flex-col justify-center">
    <h3 className="font-bold mb-1 text-gray-900">Personalized Views</h3>
    <p className="text-gray-700 text-xs">
      Streamlined, role-based access tailored for admins, leaders, and members.
    </p>
  </div>
</div> */}

<section className="container mx-auto px-4 py-12">
  <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">What We Offer</h2>
  <p className=" text-center text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
        From events to engagement — we make society management effortless.
        </p>
  
  <div className="flex flex-col md:flex-row gap-6">
    {/* First Column */}
    <div className="md:w-1/2 flex flex-col gap-6">
      {/* Event Management Card */}
      <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/MDxc1sw9/Capture-Picsart-Ai-Image-Enhancer.png" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Event Management</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs">
            Plan, organize, and track events effortlessly with our intuitive calendar.
          </p>
        </div>
      </div>
            {/* Event Management Card */}
            <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/8n2FTWXf/Web-Photo-Editor-4.jpg" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Membership Management</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs">
          Manage society members and send real-time updates, all in one centralized platform.
          </p>
        </div>
      </div>
            {/* Event Management Card */}
            <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Recognition & Achievements</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs">
          Celebrate society milestones with badges, leaderboards, and recognition programs.
          </p>
        </div>
      </div>

    </div>

    {/* Second Column */}
    <div className="lg:pt-24 md:w-1/2 flex flex-col gap-6">
      {/* Membership Management Card */}
      <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/fzskhqxT/Web-Photo-Editor-3.jpg" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Membership management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Collaboration & Discussion</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs">
          Foster teamwork with discussion boards and collaborative features for society leaders.
          </p>
        </div>
      </div>
            {/* Event Management Card */}
            <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/YBSKvbKG/Capture-Picsart-Ai-Image-Enhancer-1.png" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Personalized Views</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs">
          Streamlined, role-based access tailored for admins, leaders, and members.
          </p>
        </div>
      </div>
            {/* Event Management Card */}
            <div className="flex overflow-hidden rounded-[26px] shadow-lg bg-white hover:shadow-xl transition-shadow">
        <div className="w-[40%]  lg:w-1/3  flex-shrink-0  overflow-hidden">
          <img 
            src="https://i.ibb.co/NnrQrxp6/Capture-Picsart-Ai-Image-Enhancer-2.png" 
            className="w-full h-full object-contain object-center bg-gray-100 "
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900 lg:text-[26px]">Real-Time Updates</h3>
          <p className="text-gray-700 text-xs lg:text-[16px] lg:text-text-xs ">
          Instantly notify members and leaders with real-time announcements and alerts.
          </p>
        </div>
      </div>

      {/* Repeat similar structure for other cards in second column */}
    </div>
  </div>
</section>










<section className="py-12 px-4 pb-28 bg-white">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">OUR TEAM</h2>
        <p className="text-center text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
          The team behind every unforgettable student event.
        </p>
        
        <div className="relative px-10">
          <Slider {...settings}>
            {teamMembers.map((member, index) => (
              <div key={index} className="px-3">
                <div 
                  className={`relative rounded-[26px] overflow-hidden shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.1)] h-full transition-all duration-300 ${
                    activeSlide === index ? "scale-105 z-20" : "scale-95 opacity-75"
                  }`}
                >
                  {/* Upper white part with image */}
                  <div className="bg-white p-8 flex justify-center items-center h-60 relative z-10">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>

                  {/* Blue part with text */}
                  <div  
                    className="bg-[url('https://i.ibb.co/Nd2Nrhq3/Web-Photo-Editor-2.jpg')] w-full bg-center bg-no-repeat pt-14 pb-12 px-6 relative z-10 h-64"
                    style={{ backgroundSize: "100% 100%" }}
                  >
                    <h3 className="text-center text-xl font-semibold text-white mb-2">{member.name}</h3>
                    <p className="text-center text-white opacity-90 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
    </section>
  );
}
