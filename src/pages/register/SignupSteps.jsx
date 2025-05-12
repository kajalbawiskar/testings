/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { confilogo } from "../logo/index";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import countryList from "country-list";

const CampaignCreation = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [designation, setDesignation] = useState("");
  const [region, setRegion] = useState("");
  const navigate = useNavigate();
  const countries = countryList.getData();

  const handleOrganisationChange = (e) => setOrganisation(e.target.value);
  const handleDesignationChange = (e) => setDesignation(e.target.value);
  const handleRegionChange = (e) => setRegion(e.target.value);
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };
  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to get correct month
    const day = today.getDate().toString().padStart(2, "0");

    // Format the date as yyyy-dd-mm
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }
  const email = localStorage.getItem("email");
  const start_date = getCurrentDate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("https://api.confidanto.com/additional-details", {
        email,
        organisation,
        designation,
        region,
        userType,
        start_date,
      })
      .then((res) => {
        if (res.data) {
          alert("Done! Now Enjoy Boundless Access to MySpace.");
          navigate("/get-started");
        } else {
          alert("Failed to Register");
          navigate("/login");
        }
      })
      .catch((error) => {
        alert("Error");
      });
  };

  const handleGoogleLoginSuccess = (response) => {
    const { email, name } = response.profileObj;
    axios
      .post("https://api.confidanto.com/google-login", {
        email,
        name,
      })
      .then((res) => {
        if (res.data.message === "User logged in successfully") {
          localStorage.setItem("email", email);
          localStorage.setItem("userName", name);
          navigate("/signup-steps");
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const handleGoogleLoginFailure = (response) => {
    alert("Google login failed. Please try again.");
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="flex flex-col lg:flex-row min-h-screen">
              <style>
                {`
                  body {
                    font-family: 'Calibri', sans-serif;
                  }
                `}
              </style>

              <div className="bg-white w-full lg:w-1/2 flex flex-col justify-center items-center py-4">
                <div className="flex justify-center mb-4">
                  <a
                    href="https://www.confidanto.com"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={confilogo}
                      alt="Logo"
                      className="h-8 lg:h-10"
                      style={{ width: "150px", height: "35px" }}
                    />
                  </a>
                </div>
                <div className="w-full max-w-xl bg-white bg-opacity-75 rounded-lg py-4">
                  <form className="bg-white py-6" onSubmit={handleSubmit}>
                    <div className="mb-9">
                      <label
                        className="block text-gray-700 text-lg font-semibold mb-2"
                        htmlFor="organisation"
                      >
                        Enter your Organisation/Business Name:
                      </label>
                      <input
                        id="organisation"
                        name="organisation"
                        type="text"
                        autoComplete="organisation"
                        required
                        className="w-full px-4 py-2 text-gray-900 text-lg bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Organisation/Business Name"
                        value={organisation}
                        onChange={handleOrganisationChange}
                      />
                    </div>
                    <div className="mb-9">
                      <label
                        className="block text-gray-700 text-lg font-semibold mb-2"
                        htmlFor="designation"
                      >
                        Your Designation:
                      </label>
                      <select
                        id="designation"
                        name="designation"
                        required
                        className="w-full px-4 py-2 text-lg text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        value={designation}
                        onChange={handleDesignationChange}
                      >
                        <option value="">Select Designation</option>
                        <option value="Founder">Founder</option>
                        <option value="Co-founder">Co-founder</option>
                        <option value="Senior Manager">Senior Manager</option>
                        <option value="Manager">Manager</option>
                        <option value="Employee">Employee</option>
                        <option value="Creative_Director">
                          Creative Director
                        </option>
                        <option value="Art_Director">Art Director</option>
                        <option value="SEO_Specialist">SEO Specialist</option>
                        <option value="Content_Strategist">
                          Content Strategist
                        </option>
                        <option value="Public_Relations_Specialist">
                          Public Relations Specialist
                        </option>
                        <option value="Event_Coordinator">
                          Event Coordinator
                        </option>
                        <option value="Copywriter">Copywriter</option>
                        <option value="Graphic_Designer">
                          Graphic Designer
                        </option>
                        <option value="Account_Executive">
                          Account Executive
                        </option>
                        <option value="Media_Planner">Media Planner</option>
                        <option value="Digital_Marketing_Specialist">
                          Digital Marketing Specialist
                        </option>
                        <option value="Social_Media_Manager">
                          Social Media Manager
                        </option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-lg font-semibold mb-2"
                        htmlFor="region"
                      >
                        Specify Your Business Location
                      </label>
                      <select
                        id="region"
                        name="region"
                        className="w-full px-4 py-2 text-lg text-gray-900 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-600"
                        value={region}
                        onChange={handleRegionChange}
                      >
                        <option value="">Select Region</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-between mt-9">
                      <button
                        type="button"
                        className="w-full lg:w-auto text-[#0f62e6] border border-[#0f62e6] py-2 px-4 text-sm font-medium rounded-full hover:bg-[#0f62e6] hover:text-white transition-colors m-2"
                        onClick={handlePreviousStep}
                      >
                        ◄ Previous
                      </button>
                      <button
                        onClick={handleNextStep}
                        className="w-full lg:w-auto text-[#0f62e6] border border-[#0f62e6] py-2 px-4 text-sm font-medium rounded-full hover:bg-[#0f62e6] hover:text-white transition-colors m-2"
                      >
                        Next ►
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <div className="bg-blue-200 w-full lg:w-1/2 text-start flex flex-col justify-center items-center p-4">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-pulse tracking-wide">
                    Get a Free Access to <span className="text-4xl">M</span>y
                    <span className="text-4xl">S</span>pace 🚀
                  </h1>
                </div>
                <ul className="list-none list-inside mb-6 space-y-2">
                  {[
                    "Competition/Brand Seed keyword analysis",
                    "Know your keyword's ad position on Google Search based on location",
                    "An awesome tool to get competitor data based on location",
                    "Monthly Google search volume based on location",
                    "Access to Confidanto's intelligent dashboard",
                    "Customized Reporting and Insights",
                    "Dedicated Google Account Manager",
                  ].map((text, index) => (
                    <li
                      key={index}
                      className="p-4 flex rounded-lg shadow-sm text-lg text-gray-700 "
                    >
                      <BsFillPatchCheckFill className="text-gray-700 mr-2  mt-1.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <div className="flex flex-col lg:flex-row h-screen">
            <style>
              {`
              body {
                font-family: 'Calibri', sans-serif;
              }
            `}
            </style>
            <div className="bg-blue-200 w-full lg:w-1/2 text-start flex flex-col justify-center items-center p-4 lg:p-0">
              <div className="flex flex-col justify-center">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-800 mb-6 animate-pulse tracking-wide">
                    Get a Free Access to <span className="text-4xl">M</span>y
                    <span className="text-4xl">S</span>pace 🚀
                  </h1>
                </div>
                <ul className="list-none list-inside mb-6 space-y-2">
                  {[
                    "Competition/Brand Seed keyword analysis",
                    "Know your keyword's ad position on Google Search based on location",
                    "An awesome tool to get competitor data based on location",
                    "Monthly Google search volume based on location",
                    "Access to Confidanto's intelligent dashboard",
                    "Customized Reporting and Insights",
                    "Dedicated Google Account Manager",
                  ].map((text, index) => (
                    <li
                      key={index}
                      className="p-4 flex  rounded-lg shadow-sm text-lg text-gray-700 "
                    >
                      <BsFillPatchCheckFill className="text-gray-700 mr-2 mt-1.5" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-white w-full lg:w-1/2 flex flex-col justify-center items-center p-2 lg:p-0">
              <div className="mb-7">
                <a href="https://www.confidanto.com" rel="noopener noreferrer">
                  <img
                    src={confilogo}
                    alt="Logo"
                    className="h-6 w-32 lg:h-7 lg:w-20 mb-1 mt-4 ml-8"
                    style={{ width: "150px", height: "35px" }}
                  />
                </a>
              </div>
              <div className="items-center w-full max-w-md">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="">
                    <label
                      className="block text-gray-700 text-xl font-semibold"
                      htmlFor="businessStatus"
                    >
                      Are you an agency owner who will be running ads on behalf
                      of business owners or an individual account owner?
                    </label>
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="flex mt-7 items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-lg text-indigo-600"
                        name="userType"
                        value="individual"
                        checked={userType === "individual"}
                        onChange={handleUserTypeChange}
                      />
                      <span className="ml-2 text-lg text-gray-700">
                        I have my own brand
                      </span>
                    </div>
                    <div className="flex items-center my-7">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-lg text-indigo-600"
                        name="userType"
                        value="agency"
                        checked={userType === "agency"}
                        onChange={handleUserTypeChange}
                      />
                      <span className="ml-2 text-lg text-gray-700">
                        I own an agency
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-8">
                    <button
                      type="button"
                      className="w-full lg:w-auto text-[#0f62e6] border border-[#0f62e6] py-2 px-4 text-lg font-medium rounded-full hover:bg-[#0f62e6] hover:text-white transition-colors m-2"
                      onClick={handlePreviousStep}
                    >
                      ◄ Previous
                    </button>
                    <button
                      type="submit"
                      className="w-full lg:w-auto text-[#0f62e6] border border-[#0f62e6] py-2 px-4 text-lg font-medium rounded-full hover:bg-[#0f62e6] hover:text-white transition-colors m-2"
                    >
                      Submit ►
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return <>{renderStepContent()}</>;
};

export default CampaignCreation;
