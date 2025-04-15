import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import Navbar from './navbar';
import Home from './pages/home';
import FAQS from './pages/Faqs';
import About from './pages/about';
import Login from './pages/login';
import Signup from './pages/Signup';
import Footer from './Footer';
import ProfilePage from './authorizedPages/profilePage';
import ProfileEditPage from './authorizedPages/EditProfile';
import PublicProfilePage from './authorizedPages/PublicprofilePage';
import ChatPage from './authorizedPages/chatPage';
import AllUsersPage from './authorizedPages/allUser';
import AlumniPage from './authorizedPages/alumniPage';
import EventDetailsPage from './authorizedPages/EventDetails';
import EventsPage from './authorizedPages/Events';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<FAQS />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/Profile" element={<ProfilePage />} />
          <Route path="/EditProfile" element={<ProfileEditPage />} />
          <Route path="/PublicProfile" element={<PublicProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/allUsers" element={<AllUsersPage />} />
          <Route path="/Alumni" element={<AlumniPage />} />
          <Route path="/Events" element={<EventsPage />} />
          <Route path="/EventDetails" element={<EventDetailsPage />} />
        </Routes>
        <Footer />
        <ToastContainer 
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
};

export default App;


















// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './navbar';
// import Home from './pages/home';
// // import Services from './components/Services';
// import FAQS from './pages/Faqs';
// import About from './pages/about';
// import Login from './pages/login';
// import Signup from './pages/Signup';
// import Footer from './Footer';
// // import MagneticFollower from './components/MagneticFollower';

// import ProfilePage from './authorizedPages/profilePage';
// import ProfileEditPage from './authorizedPages/EditProfile';
// import PublicProfilePage from './authorizedPages/PublicprofilePage';
// import ChatPage from './authorizedPages/chatPage';
// import AllUsersPage from './authorizedPages/allUser';
// import AlumniPage from './authorizedPages/alumniPage';
// import EventDetailsPage from './authorizedPages/EventDetails';
// import EventsPage from './authorizedPages/Events';
// const App = () => {
//     return (
//         <Router>
//             <div>
//                 <Navbar />
//                 <Routes>
//                     <Route path="/" element={<Home />} />
//                      {/* <Route path="/services" element={<Services />} />
//                      <Route path="/contact" element={<ContactUs />} /> */}
//                      <Route path="/contact" element={<FAQS />} />
//                      <Route path="/about" element={<About/>} />
//                      <Route path="/login" element={<Login/>} />
//                      <Route path="/signup" element={<Signup />} />



//                      <Route path="/Profile" element={<ProfilePage />} />
//                      <Route path="/EditProfile" element={<ProfileEditPage />} />
//                      <Route path="/PublicProfile" element={<PublicProfilePage />} />
//                      <Route path="/chat" element={<ChatPage />} />
//                      <Route path="/allUsers" element={<AllUsersPage />} />
//                      <Route path="/Alumni" element={<AlumniPage />} />
//                      <Route path="/Events" element={<EventsPage />} />
//                      <Route path="/EventDetails" element={<EventDetailsPage />} />


                     





//                 </Routes>
//                  <Footer/>
//             </div>
//         </Router>



//     );
// };

// export default App;