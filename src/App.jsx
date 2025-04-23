// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import Chatbot from './components/Chatbot';
import Navbar from './navbar';
import AuthNavbar from './AuthNavbar';
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
import NotificationsPage from './authorizedPages/NotificationsPage';
import RequestCertificatePage from './authorizedPages/RequestCertificate';
import AuthInitializer from './redux/AuthInitializer';
import PrivateRoute from './redux/PrivateRoute';
import PublicRoute from './redux/PublicRoute';
import Feed from './authorizedPages/Feed';
import PostDetail from './authorizedPages/PostDetail';
import PostLikes from './authorizedPages/PostLikes';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <div>
      <Chatbot />
        <AuthInitializer />
        {isAuthenticated ? <AuthNavbar /> : <Navbar />}
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/contact" element={<PublicRoute><FAQS /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* auth routes */}
          <Route path="/Profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/EditProfile" element={<PrivateRoute><ProfileEditPage /></PrivateRoute>} />
          <Route path="/PublicProfile" element={<PrivateRoute><PublicProfilePage /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/allUsers" element={<PrivateRoute><AllUsersPage /></PrivateRoute>} />
          <Route path="/Alumni" element={<PrivateRoute><AlumniPage /></PrivateRoute>} />
          <Route path="/Events" element={<PrivateRoute><EventsPage /></PrivateRoute>} />
          <Route path="/Events/:id" element={<PrivateRoute><EventDetailsPage /></PrivateRoute>} />
          <Route path="/Notifications" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/request-certificate" element={<PrivateRoute><RequestCertificatePage /></PrivateRoute>} />

            {/* New Feed Routes */}
            <Route path="/feed" element={<Feed />} />
            <Route path="/feed/post/:postId" element={<PostDetail />} />
            <Route path="/feed/post/:postId/likes" element={<PostLikes />} />
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













//Working before the redux
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
// import Navbar from './navbar';
// import AuthNavbar from './AuthNavbar'
// import Home from './pages/home';
// import FAQS from './pages/Faqs';
// import About from './pages/about';
// import Login from './pages/login';
// import Signup from './pages/Signup';
// import Footer from './Footer';
// import ProfilePage from './authorizedPages/profilePage';
// import ProfileEditPage from './authorizedPages/EditProfile';
// import PublicProfilePage from './authorizedPages/PublicprofilePage';
// import ChatPage from './authorizedPages/chatPage';
// import AllUsersPage from './authorizedPages/allUser';
// import AlumniPage from './authorizedPages/alumniPage';
// import EventDetailsPage from './authorizedPages/EventDetails';
// import EventsPage from './authorizedPages/Events';
// import NotificationsPage from './authorizedPages/NotificationsPage';
// import RequestCertificatePage from './authorizedPages/RequestCertificate';
// const App = () => {
//   return (
//     <Router>
//       <div>
//         <AuthNavbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/contact" element={<FAQS />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />


//           {/* auth routes */}
//           <Route path="/Profile" element={<ProfilePage />} />
//           <Route path="/EditProfile" element={<ProfileEditPage />} />
//           <Route path="/PublicProfile" element={<PublicProfilePage />} />
//           <Route path="/chat" element={<ChatPage />} />
//           <Route path="/allUsers" element={<AllUsersPage />} />
//           <Route path="/Alumni" element={<AlumniPage />} />
//           <Route path="/Events" element={<EventsPage />} />
//           <Route path="/Events/:id" element={<EventDetailsPage />} />
//           <Route path="/Notifications" element={<NotificationsPage />} />
//           <Route path="/request-certificate" element={<RequestCertificatePage />} />


//         </Routes>
//         <Footer />
//         <ToastContainer 
//           position="top-right"
//           autoClose={5000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//           theme="colored"
//         />
//       </div>
//     </Router>
//   );
// };

// export default App;


















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