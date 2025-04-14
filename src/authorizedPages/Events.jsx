import React from "react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  // Sample events data
  const events = [
    {
      id: 1,
      title: "Tech fest 2024",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/1YSzM2hL/image-7.png",
    },
    {
      id: 2,
      title: "Kheil Tamasha",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
    },
    {
      id: 3,
      title: "Tech fest 2024",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/1YSzM2hL/image-7.png",
    },
    {
      id: 4,
      title: "Kheil Tamasha",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
    },
    {
      id: 5,
      title: "Tech fest 2024",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/1YSzM2hL/image-7.png",
    },
    {
      id: 6,
      title: "Kheil Tamasha",
      description: "Join us for a day of innovation and learning with industry experts.",
      venue: "Main Auditorium, Building ABC",
      date: "Tuesday, 20 March 2025",
      image: "https://i.ibb.co/Zs0rtgG/image-7-1.png",
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">What's Next?</h1>
        <p className="text-lg text-gray-600">
          Explore our lineup of upcoming events and never miss out.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <img
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-4">{event.description}</p>

              <div className="mb-2">
                <p className="text-sm text-gray-500">Venue:</p>
                <p className="font-medium">{event.venue}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-500">Date & Time:</p>
                <p className="font-medium">{event.date}</p>
              </div>

              <Link to={`/events/${event.id}`}>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md transition-all font-medium">
                  Book Now
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
