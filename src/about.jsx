import React from "react";
import { Rocket, Lightbulb, Award } from "lucide-react";

export default function About() {
  return (
    <section className="bg-black px-4 py-16 text-white">
      <div className="container mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-yellow-500">WHO WE ARE</h2>

        <p className="mx-auto mb-12 max-w-4xl text-center text-gray-300">
          At Our Society, we specialize in developing comprehensive Society Management Systems for universities, empowering institutions to
          streamline the operations of societies, events, and communications. Our platform helps in planning events, managing enrollment,
          tracking funding, financial oversight, and communications. With user-friendly tools and robust analytics, we help universities foster
          engagement, enhance collaboration, and simplify administrative tasks, creating a seamless experience for both students and
          administrators.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Event Management Card */}
          <div className="flex flex-col items-center rounded-lg bg-zinc-800 p-6 text-center">
            <div className="mb-4 rounded-full bg-yellow-500/10 p-4">
              <Rocket className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Event Management</h3>
            <p className="text-gray-400">
              Discover and manage events with ease. Stay updated on upcoming events and never miss out on important opportunities.
            </p>
          </div>

          {/* User Management Card */}
          <div className="flex flex-col items-center rounded-lg bg-zinc-800 p-6 text-center">
            <div className="mb-4 rounded-full bg-yellow-500/10 p-4">
              <Lightbulb className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">User Management</h3>
            <p className="text-gray-400">
              Manage society members, students, and alumni efficiently for a dynamic and connected professional community.
            </p>
          </div>

          {/* Certificate Generation Card */}
          <div className="flex flex-col items-center rounded-lg bg-zinc-800 p-6 text-center">
            <div className="mb-4 rounded-full bg-yellow-500/10 p-4">
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="mb-3 text-xl font-semibold">Certificate Generation</h3>
            <p className="text-gray-400">
              Generate and access your certificates effortlessly, ensuring accuracy and reliability for every achievement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
