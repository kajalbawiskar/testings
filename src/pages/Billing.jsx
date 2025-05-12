/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import { FaBusinessTime } from "react-icons/fa";
import { BsDownload } from "react-icons/bs";
import { GiTeamIdea } from "react-icons/gi";
import { RiTeamFill } from "react-icons/ri";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import {
  IoIosCheckmarkCircleOutline,
} from "react-icons/io";

const Billing = () => {
  const [userRegion, setUserRegion] = useState("Loading...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();

        if (data.countryName === "India") {
          setUserRegion("India");
        } else if (
          ["United States", "United Kingdom", "Europe"].includes(
            data.countryName
          )
        ) {
          setUserRegion("USA, Europe, UK");
        } else {
          setUserRegion("Other");
        }
      });
    } else {
      setUserRegion("Geolocation not supported");
    }
  }, []);

  const plans = [
    {
      id: "IN-1",
      name: "Free",
      price: "0",
      month: " /month",
      currency: "Rs",
      region: "India",
      features: [
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Detailed Forecasting for all categories",
        " - Seed Keyword Analysis",
        " - Age/Gender Analysis",
        " - Location Analysis",
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <BsDownload className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
    {
      id: "IN-2",
      name: "Standard",
      price: "800 ",
      month: "/project /month",
      currency: "Rs",
      region: "India",
      features: [
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        "Detailed Forecasting for all categories",
        "Seed Keyword Analysis",
        "Age/Gender Analysis",
        "Location Analysis",
        {
          text: <b>Reporting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Time Segmentation</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        "Daily Reporting",
        "Weekly Reporting",
        "Monthly Reporting",
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Alerts/Notifications</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <FaBusinessTime className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
    {
      id: "US-1",
      name: "Free",
      price: "0",
      month: " /month",
      currency: "$",
      region: "USA, Europe, UK",
      features: [
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Detailed Forecasting for all categories",
        " - Seed Keyword Analysis",
        " - Age/Gender Analysis",
        " - Location Analysis",
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <BsDownload className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
    {
      id: "US-2",
      name: "Standard",
      price: "85.00",
      month: " /month",
      currency: "$",
      region: "USA, Europe, UK",
      features: [
        {
          text: <b>Upto 2 projects</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Detailed Forecasting for all categories",
        " - Seed Keyword Analysis",
        " - Age/Gender Analysis",
        " - Location Analysis",
        {
          text: <b>Reporting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Daily Reporting",
        " - Weekly Reporting",
        " - Monthly Reporting",
        {
          text: <b>Time Segmentation</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Alerts/Notifications</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <FaBusinessTime className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
    {
      id: "US-3",
      name: "Advance",
      price: "135.00",
      month: " /month",
      currency: "$",
      region: "USA, Europe, UK",
      features: [
        {
          text: <b>Upto 4 projects</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Detailed Forecasting for all categories",
        " - Seed Keyword Analysis",
        " - Age/Gender Analysis",
        " - Location Analysis",
        {
          text: <b>Reporting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Daily Reporting",
        " - Weekly Reporting",
        " - Monthly Reporting",
        {
          text: <b>Time Segmentation</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Alerts/Notifications</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <GiTeamIdea className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
    {
      id: "US-4",
      name: "Advance+",
      price: "160.00",
      month: " /month",
      currency: "$",
      region: "USA, Europe, UK",
      features: [
        {
          text: <b>Upto 6 projects</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Media Planning</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Detailed Forecasting for all categories",
        " - Seed Keyword Analysis",
        " - Age/Gender Analysis",
        " - Location Analysis",
        {
          text: <b>Reporting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        " - Daily Reporting",
        " - Weekly Reporting",
        " - Monthly Reporting",
        {
          text: <b>Time Segmentation</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Ad copy Crafting</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
        {
          text: <b>Alerts/Notifications</b>,
          icon: <IoIosCheckmarkCircleOutline className="text-blue-500 mr-2" />,
        },
      ],
      icon: (
        <RiTeamFill className="absolute top-2 right-2 text-gray-100 text-4xl" />
      ),
    },
  ];
  
  const filteredPlans =
    userRegion === "Loading..."
      ? plans.filter((plan) => plan.region === "USA, Europe, UK")
      : plans.filter((plan) => plan.region.includes(userRegion));


  const signUpDate = localStorage.getItem("start_date");
  const trialPeriodDays = 14;

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
  const daysLeftText =
    daysLeft > 0
      ? `${daysLeft} days left in your trial`
      : "Your trial has ended";
  
  return (
    <>
      <div className="flex flex-col justify-end bg-[#4142dc] p-2 relative font-neue ">
        <div className="flex items-center justify-center">
          <div className="lg:w-28 w-16 border-t border-zinc-300"></div>
          <h5 className="text-zinc-100 mx-4 font-semibold text-sm lg:text-xl animate-pulse">
            {daysLeftText}
          </h5>
          <div className="lg:w-28 w-16 border-t border-zinc-300"></div>
        </div>
      </div>
      <div className=" bg-white flex flex-col items-center bg-blend-exclusion lg:mb-20">
        <h1 className="text-3xl font-bold my-8">Confidanto Premium plans</h1>
        <div className="lg:flex my-2  ">
          <p>All plans include:</p>
          <p className="lg:mx-4 flex">
            <IoCheckmarkCircleOutline className="text-blue-500 mr-2 lg:text-2xl" />{" "}
            24/7 customer care
          </p>
          <p className="flex lg:ml-2">
            <IoCheckmarkCircleOutline className="text-blue-500 mr-2 lg:text-2xl" />{" "}
            We also provide a dedicated support team
          </p>
        </div>
        <p className="flex mb-8 mx-16 pl-8">
          <IoCheckmarkCircleOutline className="text-blue-500 mr-2 text-2xl" />{" "}
          14 days free trial where you can create as many projects as you want!
        </p>

        <div
          className={`grid ${
            userRegion === "India"
              ? "grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
          } gap-6 w-full max-w-max`}
        >
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 flex flex-col"
            >
              <div className="flex-grow">
                {plan.icon}
                <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
                <p className="text-2xl font-semibold mb-6 p-3 bg-[#f0f2ff] rounded-sm text-center">
                  <span className="text-sm align-middle">{plan.currency} </span>
                  {plan.price}
                  <span className="text-sm">{plan.month}</span>
                </p>
                <h3 className="text-lg font-extralight text-gray-500 mb-2">
                  Plan Includes:
                </h3>
                <ul className="mb-6">
                  {plan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-500 mb-2"
                    >
                      {feature.icon}
                      {feature.text || feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <button className="group relative min-w-fit lg:w-4/6 text-[rgb(65,66,220)] flex justify-center py-2 px-6 border border-[#4142dc] text-base font-medium rounded-md hover:text-white bg-transparent hover:bg-[rgb(65,66,220)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-auto">
                  <NavLink to="/Join">Join the Waitlist</NavLink>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Billing;
