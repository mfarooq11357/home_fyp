import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './navbar';
import Home from './pages/home';
// import Services from './components/Services';
import FAQS from './pages/Faqs';
import About from './about';
import Login from './Login';
import Signup from './Signup';
import Footer from './Footer';
// import MagneticFollower from './components/MagneticFollower';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                     {/* <Route path="/services" element={<Services />} />
                     <Route path="/contact" element={<ContactUs />} /> */}
                     <Route path="/contact" element={<FAQS />} />
                     <Route path="/about" element={<About/>} />
                     <Route path="/login" element={<Login/>} />
                     <Route path="/signup" element={<Signup />} />
                </Routes>
                 <Footer/>
            </div>
        </Router>



    );
};

export default App;