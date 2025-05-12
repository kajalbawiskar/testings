import React from "react";
import confi from "../assets/confi-logo-new2.png"; // Assuming you have a component for the company logo
import { FaLinkedin, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
 
const Footer = () => (
  <div className="flex flex-col bg-white text-gray-800 py-4 lg:py-3 shadow-xl border-t border-gray-300 lg:mr-96 fixed bottom-0  lg:w-full z-50">
    <div className="container mx-auto flex justify-between items-center">
      <div>
        <a
          href="https://www.confidanto.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={confi} alt="Confidanto Logo" className="w-16 lg:w-28" />
        </a>
      </div>
      <div className="flex space-x-4 mr-96 md:mr-24">
        {/* Social media icons with color and margin */}
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaLinkedin className="social-icon text-sm lg:text-xl" style={{ color: "#0077b5" }} />
        </a>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaFacebook className="social-icon text-sm lg:text-xl" style={{ color: "#3b5998" }} />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaTwitter className="social-icon text-sm lg:text-xl" style={{ color: "#1da1f2" }} />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
          <FaInstagram className="social-icon text-sm lg:text-xl" style={{ color: "#c32aa3" }} />
        </a>
      </div>
    </div>
  </div>
);
 
export default Footer;