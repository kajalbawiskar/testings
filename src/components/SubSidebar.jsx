import React, { useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";

const subMenus = {
  "IoMenu":[],
  "All Projects": [
    { name: "Project List", path: "/projects" },
    { name: "Project Performance", path: "/ads-project-performance" },
  ],
  "Paid Ads": [
    { name: "Performance", path: "/google-ads/campaigns" },
    { name: "Reporting", path: "/google-ads/reporting/weekly-reporting" },
  ],
  Alerts: [
    { name: "Google Ads", path: "/google-ads-alerts" },
    { name: "Bing Ads", path: "/bing-ads-alerts" },
  ],
  Tools: [
    { name: "Change Log", path: "/change-log" },
    { name: "Seed Keyword Analysis", path: "/seed-keyword-analysis" },
    { name: "Ads - PromoRecap", path: "/tools/ads-PromoRecap" },
    { name: "Ad Copy Crafting", path: "/tools/ad-crafting" },
    { name: "Onboarding Audit", path: "/onboarding-audit" },
  ],
  Admin: [
    { name: "Account Setting", path: "/profile" },
    { name: "Support", path: "/customer-support" },
    { name: "Billing", path: "/billing-support" },
  ],
};

const dropdownOptions = {
  Performance: [
    { name: "Campaigns", path: "/google-ads/campaigns" },
    { name: "Locations", path: "/google-ads/locations" },
    { name: "Ads", path: "/google-ads/ads" },
    { name: "Keywords", path: "/google-ads/search-keywords" },
    { name: "Customer Search Pattern", path: "/google-ads/search-terms" },
    // { name: "Confi-ai", path: "/confi-ai" },
  ],
  Reporting: [
    { name: "Daily Reporting", path: "/google-ads/reporting/daily-reporting" },
    { name: "Weekly Reporting", path: "/google-ads/reporting/weekly-reporting" },
    { name: "Monthly Reporting", path: "/google-ads/reporting/monthly-reporting" },
    { name: "Custom Reporting", path: "/google-ads/custom-reproting" },
  ],
  Setting: [
    { name: "Configuration", path: "/google-ads/setting" },
  ],  
};



const Submenu = ({ menu, onClose }) => {
  const [showDropdown, setShowDropdown] = useState({});

  const [activeIndex, setActiveIndex] = useState(null);
  
  const [activemenu, setActivemenu] = useState(null);

  // Close submenu if Admin (IoSettingsOutline) is clicked
  useEffect(() => {
    if (menu === "IoMenu") {
      onClose();
    }
  }, [menu, onClose]);

  return (
    <div className="w-64 bg-gray-50 text-gray-900 shadow-lg rounded-lg p-4 h-full transition-transform duration-300 ease-in-out">
      <div className="flex justify-between items-center border-b pb-2">
        <h2 className="text-lg font-semibold">{menu}</h2>
        <button className="text-gray-700 hover:text-gray-900 font-bold text-xl" onClick={onClose}>
          ✕
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {subMenus[menu]?.map((item) => (
          <li key={item.name} className="relative">
            <div
              className={`p-3 flex justify-between items-center rounded-full font-medium cursor-pointer transition hover:bg-gray-200 hover:border-1 border-gray-500 ${
                activeIndex === item.name ? 'bg-blue-500 text-white hover:text-gray-800' : ''
              }`} 
              
              onClick={() =>
                (setShowDropdown((prev) => ({
                  ...prev,
                  [item.name]: !prev[item.name],
                }))
                ,setActiveIndex(item.name))
              }
            >
              {item.path ? (
                <Link to={item.path} className="w-full block">
                  {item.name}
                </Link>
              ) : (
                item.name
              )}

              {dropdownOptions[item.name] && (
                showDropdown[item.name] ? (
                  <IoIosArrowDown className="text-gray-600 transition-transform duration-300 rotate-180" />
                ) : (
                  <IoIosArrowForward className="text-gray-600 transition-transform duration-300" />
                )
              )}
            </div>

            {/* Animated Dropdown */}
            {dropdownOptions[item.name] && (
              <ul
                className={`ml-6 mt-2 bg-gray-50 rounded-lg p-2 space-y-2 overflow-hidden transition-all duration-300 ${
                  showDropdown[item.name] ? "max-h-70 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {dropdownOptions[item.name].map((option) => (
                  <li key={option.name} className={`${
                    activemenu=== option.name ? 'bg-blue-500 rounded-full font-medium cursor-pointer text-white hover:text-gray-800' : ''
                  }`} 
                  onClick={() =>
                    setActivemenu(option.name)
                  }>
                    <Link
                      to={option.path}
                      className="block p-2 text-sm hover:bg-blue-200 rounded-full hover:text-blue-700 cursor-pointer"
                    >
                      {option.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Submenu;