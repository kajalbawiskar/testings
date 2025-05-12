import React, { useEffect, useRef } from "react";
import { FiDollarSign } from "react-icons/fi";
import { HiOutlineCalendar } from "react-icons/hi";
import { TbCategory2 } from "react-icons/tb";
import { CiCircleList } from "react-icons/ci";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { Chat, Notification, UserProfile } from ".";
import { monthNames } from "../data/dummy";
import { useStateContext } from "../contexts/ContextProvider";
import axios from "axios";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ProjectSidebar from "../pages/ProjectSidebar";
import SelectProject from "./SelectProject";

const Navbar = ({ onLogout }) => {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setScreenSize,
    screenSize,
    setIsClicked,
  } = useStateContext();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setIsClicked(!isClicked.userProfile);
    }
  });

  const signUpDate = localStorage.getItem("start_date");
  const trialPeriodDays = 30;

  // Calculate trial end date
  const trialEndDate = new Date(signUpDate);
  trialEndDate.setDate(trialEndDate.getDate() + trialPeriodDays);

  function calculateDaysLeftInTrial(trialEndDate) {
    const currentDate = new Date();
    const timeDiff = trialEndDate - currentDate;

    // Convert time difference from milliseconds to days
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft;
  }

  const daysLeft = calculateDaysLeftInTrial(trialEndDate);
  

  const [userData, setUserData] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [additionalData, setAdditionalData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Error message state

  const url = "https://api.confidanto.com/header-data";

  const fetchInfo = () => {
    return axios
      .post(url, { email: localStorage.getItem("email") })
      .then((res) => {
        setUserData([res.data.userData]);
        const { start_date } = res.data.userData;
        localStorage.setItem("start_date", start_date);
        const startDate_backend = res.data.userData.start_date.split("-");
        const tempStartInd = Number(startDate_backend[1]);
        const startMonth_backend = monthNames[tempStartInd - 1];
        const subcategories_backend = res.data.userData.sucategory.split(",");

        let temp = "";
        if (subcategories_backend.length > 1) {
          temp =
            subcategories_backend[0] +
            " +" +
            (subcategories_backend.length - 1);
        } else {
          temp = subcategories_backend[0];
        }

        setAdditionalData([
          {
            value: res.data.userData.category,
            icon: <TbCategory2 />,
            title: "Category",
            iconColor: "#03C9D7",
            iconBg: "#E5FAFB",
            pcColor: "red-600",
          },
          {
            value: temp,
            icon: <CiCircleList />,
            title: "Subcategory",
            iconColor: "rgb(255, 244, 229)",
            iconBg: "rgb(254, 201, 15)",
            pcColor: "green-600",
          },
          {
            value: startMonth_backend,
            icon: <HiOutlineCalendar />,
            title: "Month Range",
            iconColor: "rgb(228, 106, 118)",
            iconBg: "rgb(255, 244, 229)",
            pcColor: "green-600",
          },
          {
            value: "$" + res.data.userData.exp_budget,
            icon: <FiDollarSign />,
            title: "Budget",
            iconColor: "rgb(0, 194, 146)",
            iconBg: "rgb(235, 250, 242)",
            pcColor: "red-600",
          },
        ]);
      })
      .catch((error) => console.log(error.response));
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowProfile(false);
    onLogout();
    navigate("/");
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowProfile(false);
    }
    if (toolsRef.current && !toolsRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  const email = localStorage.getItem("email");
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchInfo();
  }, []);
  const handleProjectChange = async (projectId) => {
    try {
      const response = await fetch(
        "https://api.confidanto.com/connect-google-ads/get-customer-id",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email, // Replace with actual dynamic email if needed
            project_id: projectId,
          }),
        }
      );

      const data = await response.json();
      const fetchedCustomerId = data[0]?.customer_id;

      if (fetchedCustomerId) {
        setCustomerId(fetchedCustomerId); 
        setErrorMessage(""); 
      } else {
        setErrorMessage("Please add your Google Ads account on project.");
      }
    } catch (error) {
      console.error("Error fetching customer ID:", error);
      setErrorMessage("Error fetching customer ID. Please try again.");
    }
  };
  const uniqueUserID = localStorage.getItem("uniqueUserID");
  const [userData1, setUserData1] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.confidanto.com/header-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        //console.log(result);
        localStorage.setItem("uniqueUserID", result.userData.unique_user_id);
        setUserData1(result.userData);
      } catch (error) {
        //console.log(error.response);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col flex-wrap md:flex-nowrap justify-between relative font-roboto">
      <div className="flex flex-wrap md:flex-nowrap justify-end p-2  md:mr-6 relative">
        <div className="flex items-center">
          {userData.map((dataObj) => {
            return (
              <>
                {screenSize > 900 && dataObj.subscription === "Free Trial" && (
                  <div className="flex items-center rounded-lg text-[#e6e5e3] px-2 py-2  w-20  hover:bg-[#aac7e5]  text-base ml-6">
                    <ProjectSidebar />
                  </div>
                )}
              </>
            );
          })}
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg ml-4"
            onClick={() => {
              //console.log("Toggling profile visibility"); // Debugging log
              setShowProfile((prevState) => !prevState);
            }}
          >
            <TooltipComponent content="Profile" position="BottomCenter">
              {userData.map((dataObj) => {
                return (
                  <div
                    className="rounded-full p-1.5 px-3.5 text-xl  text-white"
                    style={{ backgroundColor: "#4e47e5" }}
                  >
                    {dataObj.username.charAt(0, 1)}
                  </div>
                );
              })}
            </TooltipComponent>
            {screenSize > 900 && (
              <p>
                {userData.map((dataObj) => {
                  return (
                    <div className="flex flex-col">
                      <span className="text-gray-400 font-bold ml-1 text-base">
                        {dataObj.username}
                      </span>
                      <span className="text-gray-400 text-sm ml-1 flex justify-between items-center">
                        User ID: {uniqueUserID}
                        <span className="ml-2 ">
                          {showProfile ? (
                            <MdKeyboardArrowUp className="text-gray-400 font-bold text-14" />
                          ) : (
                            <MdKeyboardArrowDown className="text-gray-400 font-bold text-14" />
                          )}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </p>
            )}
          </div>

          {isClicked.chat && <Chat />}
          {isClicked.notification && <Notification />}
          {showProfile && (
            <div
              ref={profileRef}
              className="nav-item absolute right-1 top-12 shadow-md lg:top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg  font-roboto"
            >
              <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
                {userData.map((dataObj) => {
                  return (
                    <div
                      className="rounded-full p-2.5 px-5 bg-emerald-700 text-2xl text-white"
                      style={{ backgroundColor: "#4e47e5" }}
                    >
                      {dataObj.username.charAt(0, 1)}
                    </div>
                  );
                })}
                <div>
                  {userData.map((dataObj) => {
                    return (
                      <p className="font-semibold text-[rgb(22,45,61)] text-lg lg:text-xl dark:text-gray-200">
                        {dataObj.username}
                      </p>
                    );
                  })}

                  <p className="text-gray-500 text-sm dark:text-gray-400">
                    {uniqueUserID}
                  </p>
                  {userData.map((dataObj) => {
                    return (
                      <p className="text-gray-500 text-sm dark:text-gray-400">
                        {dataObj.email}
                      </p>
                    );
                  })}
                </div>
              </div>
              <div className="">
              {userData.map((dataObj) => {
                return (
                  <>
                    {dataObj.subscription === "Free Trial" && (
                        <div className="flex  text-[#e6e5e3] ">
                          <SelectProject
                            onSelectProject={handleProjectChange}
                          />
                        </div>
                      )}
                  </>
                );
              })}
              </div>
              <div className="flex justify-center items-center mt-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="rounded-full px-6 py-2 border-1 border-[#4e47e5] text-[#4e47e5] w-full hover:bg-[#4e47e5] hover:text-white "
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
