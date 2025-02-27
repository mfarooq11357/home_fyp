import React from "react";
import { UserCircle } from 'lucide-react';

const home = () => {
  return (
    <section className=" bg-black text-white">
      <div className="container mx-auto px-4 py-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-2xl md:text-5xl font-bold tracking-tight">
              <span className="text-yellow-400">CONNECTING, COMMUNITIES,</span>
              <br />
              <span className="text-yellow-400">Empowering Growth</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0">
              "Your gateway to seamless event management, meaningful alumni connections, and hassle-free certifications."
            </p>

            <div className=" pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="/register"
                className="bg-[#9dff2c] hover:bg-[#8ce626] text-black font-semibold text-lg px-8 py-2 rounded-lg text-center"
              >
                Register
              </a>
              <a
                href="/login"
                className="bg-[#9dff2c] hover:bg-[#8ce626] text-black font-semibold text-lg px-8 py-2  rounded-lg text-center"
              >
                Login
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
              <img
                src="/assets/image 4.png"
                alt="Celebrating Excellence Ceremony"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-semibold text-yellow-400">
                "Celebrating Excellence: Recognizing Achievements"
              </h2>
              <p className="text-gray-300">Se Society Management System</p>
              <p className="text-sm text-gray-400">
                "This ceremony celebrates the outstanding contributions in academics, research, and community service."
              </p>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-black py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-12 text-left">
          Our Teams
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Team Member 1 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 rounded-full p-8 inline-block">
                <UserCircle className="w-16 h-16 text-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Dr Ahmed Ali</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A visionary leader and researcher with over 20 years of experience in healthcare innovation. Dr. Ahmed has contributed to groundbreaking medical solutions, inspiring countless professionals worldwide.
            </p>
          </div>

          {/* Team Member 2 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 rounded-full p-8 inline-block">
                <UserCircle className="w-16 h-16 text-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Dr Umer Farooq</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              An accomplished academic and mentor. Dr Umer has transformed education through his passion for teaching and commitment to student success. His innovative methods continue to shape future leaders.
            </p>
          </div>

          {/* Team Member 3 */}
          <div className="bg-white rounded-lg p-6 text-center shadow-lg transition-transform transform hover:scale-105">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400 rounded-full p-8 inline-block">
                <UserCircle className="w-16 h-16 text-black" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-black mb-4">Dr Shazaib Khan</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              A technology enthusiast and entrepreneur. Dr Shazaib has successfully bridged the gap between IT and medicine. His efforts have revolutionized patient care and hospital management systems.
            </p>
          </div>
        </div>
      </div>
    </section>
     <section className="bg-black text-white py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-yellow-400">
              "Unlock Opportunities with Us"
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Efficient tools to manage society events, memberships, and activities in
                one place. Plan, organize, and track events effortlessly with our intuitive
                calendar.
              </p>
              
              <p>
                Centralized platform for managing members and sending
                real-time updates. Foster teamwork with discussion boards and
                collaborative features for society leaders.
              </p>
              
              <p>
                Celebrate achievements with
                badges, leaderboards, and recognition programs. Personalized views
                for administrators, society leaders, and members to streamline access.
              </p>
            </div>
          </div>

          {/* Logo/Graphic */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  {/* <span className="block text-4xl md:text-5xl font-bold">
        
                  </span> */}
                   <div className="relative  w-full overflow-hidden rounded-lg">
              <img
                src="/assets/image 8.png"
                alt="Celebrating Excellence Ceremony"
                className="object-cover w-full h-full"
              />
            </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </section>
  );
};

export default home;
