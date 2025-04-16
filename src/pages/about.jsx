import React from 'react';

const AboutUs = () => {
  const About = [
    {
      image: 'https://i.ibb.co/pjT6LzG9/Group.png',
      title: 'Event Management',
      description: 'Easily discover, manage, and stay updated on upcoming events.',
    },
    {
      image: 'https://i.ibb.co/Dfw7VKLD/Group-1.png',
      title: 'User Management',
      description: 'Manage members, students, and alumni for a connected community.',
    },
    {
      image: 'https://i.ibb.co/Q3F3LRkF/Vector.png',
      title: 'Certificate Generation',
      description: 'Generate and access accurate certificates with ease.',
    },
  ];

  return (
    <section className="py-12 px-4 pb-28 bg-white">
      <div className="container mx-auto">
      <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">WHO WE ARE</h2>
        <p className=" text-left text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
          At Our Society, we specialize in developing comprehensive Society Management Systems for universities, empowering institutions to
          streamline the operations of societies, events, and communications. Our platform helps in planning events, managing enrollment,
          tracking funding, financial oversight, and communications. With user-friendly tools and robust analytics, we help universities foster
          engagement, enhance collaboration, and simplify administrative tasks, creating a seamless experience for both students and
          administrators.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {About.map((About, index) => (
            <div key={index} className="relative  rounded-[26px] overflow-hidden shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.1)] h-full">
           {/* Upper white part with image */}
          <div className="bg-white p-8 flex justify-center items-center h-40 relative z-10">
            <img 
              src={About.image} 
              alt={About.title} 
              className="w-42 h-42 object-contain"
            />
           </div>
  
  {/* Blue part with text */}
  <div  
   className="bg-[url('https://i.ibb.co/Nd2Nrhq3/Web-Photo-Editor-2.jpg')] w-full bg-center bg-no-repeat pt-10 pb-8 px-6 relative z-10 h-48"
   style={{ backgroundSize: "100% 100%" }}
  >
    <h3 className="text-xl font-semibold text-white mb-2 text-center">{About.title}</h3>
    <p className="text-white opacity-90 text-center">{About.description}</p>
  </div>
</div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
