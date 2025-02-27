import React from 'react';

const Footer = () => {
  return(
  <><footer className="bg-zinc-900 py-12 text-gray-400">
<div className="container mx-auto grid gap-8 px-6 md:grid-cols-3">
  <div>
    <h2 className="mb-4 text-lg font-bold uppercase">My Society</h2>
    <p className="text-sm">
      Discover and manage events with ease. Stay updated on upcoming activities and never miss out on important opportunities.
    </p>
  </div>

  <div>
    <h2 className="mb-4 text-lg font-bold uppercase">Contact Us</h2>
    <ul className="space-y-2 text-sm">
      <li><a href="#" className="hover:text-white">Home</a></li>
      <li><a href="#" className="hover:text-white">About</a></li>
      <li><a href="#" className="hover:text-white">Contact</a></li>
      <li><a href="#" className="hover:text-white">Events</a></li>
    </ul>
  </div>
  <div>
    <h2 className="mb-4 text-lg font-bold uppercase">Our Newsletter</h2>
    <p className="mb-4 text-sm">
      Subscribe to our newsletter and get the latest updates on events, alumni news, and more!
    </p>
  </div>
</div>
</footer>
</>
  );
}

export default Footer;