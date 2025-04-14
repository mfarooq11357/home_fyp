import React from "react";

export default function HeroSection() {
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

            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-lg">
              Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications.
            </p>

            <button className="px-6 py-2 border border-[#2D50A1] text-blue-700 rounded-md hover:bg-[#2D50A1] hover:text-white transition-colors duration-300 text-sm sm:text-base">
              Register now
            </button>
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
  <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">What We Offer</h2>
  
  <div className="flex flex-col md:flex-row gap-6">
    {/* First Column */}
    <div className="md:w-1/2 flex flex-col gap-6">
      {/* Event Management Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Event management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Event Management</h3>
          <p className="text-gray-700 text-xs">
            Plan, organize, and track events effortlessly with our intuitive calendar.
          </p>
        </div>
      </div>

      {/* Recognition & Achievements Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Achievements"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Recognition & Achievements</h3>
          <p className="text-gray-700 text-xs">
            Celebrate society milestones with badges, leaderboards, and recognition programs.
          </p>
        </div>
      </div>

      {/* Personalized Views Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Personalized views"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Personalized Views</h3>
          <p className="text-gray-700 text-xs">
            Streamlined, role-based access tailored for admins, leaders, and members.
          </p>
        </div>
      </div>
    </div>

    {/* Second Column */}
    <div className="md:w-1/2 flex flex-col gap-6">
      {/* Membership Management Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Membership management"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Membership Management</h3>
          <p className="text-gray-700 text-xs">
            Manage society members and send real-time updates, all in one centralized platform.
          </p>
        </div>
      </div>

      {/* Collaboration & Discussion Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Collaboration"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Collaboration & Discussion</h3>
          <p className="text-gray-700 text-xs">
            Foster teamwork with discussion boards and collaborative features for society leaders.
          </p>
        </div>
      </div>

      {/* Real-Time Updates Card */}
      <div className="flex overflow-hidden rounded-xl shadow-lg bg-white h-[170px] hover:shadow-xl transition-shadow">
        <div className="bg-blue-700 w-1/3 flex items-stretch rounded-l-xl overflow-hidden">
          <img 
            src="https://i.ibb.co/hJHH1cr3/Web-Photo-Editor.jpg" 
            className="w-full h-full object-cover object-center"
            alt="Real-time updates"
          />
        </div>
        <div className="w-2/3 p-4 flex flex-col justify-center">
          <h3 className="font-bold mb-1 text-gray-900">Real-Time Updates</h3>
          <p className="text-gray-700 text-xs">
            Instantly notify members and leaders with real-time announcements and alerts.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
    </section>
  );
}
