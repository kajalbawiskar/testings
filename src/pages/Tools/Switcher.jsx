import React, { useState } from 'react';

const Switcher7 = ({ onToggle, flag }) => {
  // flag added 2
  const [isChecked, setIsChecked] = useState(flag);

  const handleToggle = () => {
    // setIsChecked(!isChecked);
    setIsChecked(!isChecked)
    onToggle(); // Call the parent function to notify about the toggle state
  };

  return (
    <div className="flex items-center space-x-4 ">
      <span className="text-gray-700 mx-5">Compare</span>
      <label className="relative inline-flex items-center cursor-pointer ml-5">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleToggle}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-checked:bg-blue-600 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:after:bg-white peer-checked:after:ring-2 peer-checked:after:ring-blue-400 after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 transition-all peer focus:outline-none"></div>
      </label>
    </div>
  );
};

export default Switcher7;
