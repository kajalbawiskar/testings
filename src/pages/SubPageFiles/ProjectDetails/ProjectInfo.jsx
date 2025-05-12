import React, { useState } from 'react';
import axios from 'axios';
import { FcInfo } from "react-icons/fc";

const ProjectInfo = () => {
  const [showInput, setShowInput] = useState(false);
  const [website, setWebsite] = useState('');

  const handleNameClick = () => {
    setShowInput(true);
  };

  const handleInputChange = (e) => {
    setWebsite(e.target.value);
  };

  const handleInputSubmit = async () => {
    if (website.trim() === '') {
      alert('website name cannot be empty.');
      return;
    }

    try {
      const response = await axios.post('https://api.confidanto.com/add-brand/add-brand', {
        email: "santoshsakre21@gmail.com",
        website: website,
        customer_id: "4643036315",
      });

      alert('Brand added successfully: ' + response.data.message);
      setShowInput(false);
      setWebsite('');
    } catch (error) {
      console.error('Error adding brand:', error);
      alert('Failed to add brand. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <div className="p-4 bg-white shadow-md rounded-lg">
        {showInput ? (
          <div className="flex flex-col items-center space-y-4">
            <input
              type="text"
              value={website}
              onChange={handleInputChange}
              placeholder="Enter website name"
              className="border border-gray-300 rounded-md p-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleInputSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        ) : (
          <p
            onClick={handleNameClick}
            className="text-xl font-semibold text-blue-500 cursor-pointer hover:underline flex items-center gap-2"
          >
            Project Info<FcInfo/>
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectInfo;
