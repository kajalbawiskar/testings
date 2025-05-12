import React, { useEffect, useState } from 'react';
import axios from 'axios';
import splogo from '../assets/splogo.png';
import ChatBox from '../components/ChatBox';
import { FaComments } from 'react-icons/fa';

const SupportPage = () => {
  const [userData, setUserData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const url = "https://api.confidanto.com/header-data";

  const fetchInfo = async () => {
    try {
      const res = await axios.post(url, { email: localStorage.getItem("email") });
      setUserData(res.data.userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* Header */}
      <div className="bg-[#4142dc] text-white p-4">
        <div className="container mx-auto flex items-center justify-start ml-9">
          <img src={splogo} alt="logo" className="h-9 w-9 bg-white p-1 items-start rounded" />
          <div className="text-3xl font-bold ml-2">Help</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="text-left mb-8 ml-9">
          <h1 className="text-3xl font-bold">We're here to help.</h1>
        </div>

        {/* Dropdown and Search Bar */}
        <div className="flex justify-start items-center mb-8 ml-9">
          <div className="relative inline-block w-64 text-black">
            <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
              <option>Confidanto</option>
              <option>Corporate Billing</option>
              <option>Learning</option>
              <option>Marketing Solutions</option>
              <option>Recruiter</option>
              <option>Sales Insights</option>
              <option>Sales Navigator</option>
              <option>Talent Hub</option>
              <option>Talent Insights</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.5 7.5l5 5 5-5H5.5z" /></svg>
            </div>
          </div>
          <div className="ml-4 w-1/2">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring"
              placeholder="How can we help?"
              aria-label="Search help topics"
            />
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ml-9 mt-9 font-sans">
          <div>
            <h2 className="font-semibold mb-2">Basics</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Close your account</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">LinkedIn public profile visibility</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Apply for jobs on LinkedIn</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Data and Privacy</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Your data, your rights</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Privacy settings</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Subscription Billing</h2>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-600 hover:underline">Manage subscriptions</a></li>
              <li><a href="#" className="text-blue-600 hover:underline">Billing history</a></li>
            </ul>
          </div>
          {userData && (
            <div className="flex gap-5 items-center mt-6 border-b-1 pb-6">
              <div className="rounded-full p-2.5 px-5 bg-emerald-700 text-2xl text-white">
                {userData.username.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-[#162d3d] text-lg lg:text-xl dark:text-gray-200">
                  {userData.username}
                </p>
                <p className="text-gray-500 text-sm dark:text-gray-400">
                  {userData.email}
                </p>
                <p className="text-gray-500 capitalize text-sm dark:text-gray-400">
                  {userData.userType}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Icon */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        >
          <FaComments className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Box */}
      <ChatBox isOpen={isChatOpen} toggleChat={toggleChat} />
    </div>
  );
};

export default SupportPage;
