/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import { categoriesFew, ClientTypeFew } from "../data/dummy";
import { googleads, bingads } from "../assets/index";
import { IoMdClose } from "react-icons/io";
import ProjectList from "./ProjectList";
import ImageCropper from "./ImageCropper";
import defaultImage from "../assets/defaultImage.png";

ChartJS.register(ArcElement, Tooltip, Legend);

const CreateProject = () => {
  const [projects, setProjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    category: "",
    icon: defaultImage,
    clientType: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [googleCustomerIds, setGoogleCustomerIds] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(""); // State for selected customer ID
  const [username, setUsername] = useState("");
  const [projectId, setProjectId] = useState(""); // State for username
  const [email, setEmail] = useState(""); // State for email
  const [bingAdsUrl, setBingAdsUrl] = useState(""); // State for Bing Ads URL
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("https://api.confidanto.com/projects");
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await axios.post("https://api.confidanto.com/header-data", { email: localStorage.getItem("email") });
        if (response.data) {
          setUsername(response.data.username);
          setEmail(response.data.email);
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchHeaderData();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ids = searchParams.get("customer_ids");
    if (ids) {
      alert("Google Ads Account Connected Successfully...!");
      setCurrentStep(2);
      const idsArray = ids.split(",");
      setGoogleCustomerIds(idsArray);
    }

    if (location.pathname === "/connect-with-Googleads") {
      setCurrentStep(2);
    }
  }, [location]);
  const handleSaveCustomerId = async () => {
    try {
      // Ensure customer ID is selected
      if (!selectedCustomerId) {
        setErrorMessage("Please select a Google Ads account.");
        return;
      }
      function getUrlParameter(parameterName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(parameterName);
      }

      let project_id = JSON.parse(localStorage.getItem('project_id')) 
      let email = localStorage.getItem('email')
      let refreshToken = getUrlParameter('refresh_token') 
      console.log("REFRESH TOKEN", refreshToken)
      const requestData = {
        project_id: project_id, // Make sure projectId is correctly set
        customer_id: Number(selectedCustomerId), // Make sure the ID is correctly set
        email: email, // Pass the email
        refresh_token: refreshToken
      };

      
      console.log("Request Data:", requestData); // Log the request payload
      localStorage.removeItem("project_id")
      console.log("Storage: ",JSON.parse(localStorage.getItem('project_id')),(localStorage.getItem('email')))
      // return 
      
      const response = await axios.post(
        "https://api.confidanto.com/connect-google-ads/connect-with-google-ads",
        requestData
      );
  
      if (response.status === 201) {
        console.log("Customer ID saved successfully:", response.data);
        navigate(`/project-details/${project_id}`,{replace:true})      
        // route('/project-details')
        // Proceed to the next step or show success message
      }
      else if(response.status == 400){
        alert("Your account is already connected")
        navigate(`/projects`,{replace:true})      

      }
      else {
        console.log("Unexpected response status:", response);
        setErrorMessage("Unexpected error occurred. Please try again.");
        navigate(`/projects`,{replace:true})      
      }

    } catch (error) {
      if (error.response) {
        console.error("Error saving customer ID:", error.response.data);
        setErrorMessage(`Error: ${error.response.data.message || "Bad request"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        setErrorMessage("No response from server. Please check your network.");
      } else {
        // Something happened in setting up the request that triggered an error
        console.error("Error setting up request:", error.message);
        setErrorMessage("Error: Failed to save customer ID.");
      }
      navigate(`/projects`,{replace:true})      
    }
    finally{
      
    }
  };
  
  const handleCreateProject = async (event) => {

    event.preventDefault();
    const name = event.target.name.value;
    const category = event.target.category.value;
    const clientType = event.target.clientType.value;
    const updatedProjectDetails = { ...projectDetails, name, category, clientType };
    setProjectDetails(updatedProjectDetails);

    const formData = new FormData();
    formData.append("name", projectDetails.name);
    formData.append("category", projectDetails.category);
    formData.append("icon", projectDetails.icon);
    formData.append("clientType", projectDetails.clientType);
    console.log(clientType)
    const email = localStorage.getItem("email");
    formData.append("email", email);
    try {
      const response = await axios.post(
        "https://api.confidanto.com/create-project",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      localStorage.setItem("project_id", response.data.id);
      console.log("RSSSSS: ",response, response.data.id,JSON.parse(localStorage.getItem('project_id')))

      if (response.status === 200) {
        console.log(response.data.project_id)
        setCurrentStep(2);
        setProjectId(response.data.project_id)
        console.log(projectId)
        navigate("/connect-with-Googleads");
        showBingAdsUrl(); // Show Bing Ads URL on Step 2
      } else {
        setErrorMessage("Error creating project. Please try again.");
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setErrorMessage("Error saving project. Please try again.");
    }
  };
  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProjectDetails((prevDetails) => ({
        ...prevDetails,
        icon: file,
      }));
      setIsEditing(true); // Enable cropping mode
    }
  };

  const handleConnectGoogleAds = async () => {
    try {
      window.location.href =
        "https://connect.confidanto.com/authorize";
    } catch (error) {
      console.error("Error during authorization:", error);
    }
  };

  // const handleConnectBingAds = async () => {
  //   const clientId = "f0e47d75-0b99-4b32-8b3b-166205baaca0";
  //   const redirectUri = "http://localhost:3000";
  //   const scope = "https://ads.microsoft.com/ads.manage offline_access";

  //   const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
  //     scope
  //   )}`;

  //   try {
  //     window.location.href = authUrl;
  //   } catch (error) {
  //     console.error("Error during authorization:", error);
  //   }
  // };

  const showBingAdsUrl = () => {
    setBingAdsUrl("http://localhost:3000/connect-with-Bingads"); // Set the URL when moving to step 2
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ids = searchParams.get("customer_ids");
    if (ids) {
      alert("Google Ads Account Connected Successfully...!");
      setCurrentStep(2);
      const idsArray = ids.split(",");
      setGoogleCustomerIds(idsArray);
    }
  }, [location.search]);
  const handleIconClick = () => {
    // Trigger file input when the image is clicked
    document.getElementById("icon-upload-input").click();
  };

  return (
    <div className="flex flex-col items-center mt-20 bg-gray-100 p-1 sm:p-8 min-h-screen justify-start overflow-hidden">
      <div className="absolute inset-0 blur-sm overflow-hidden">
        <div className="blur-background h-[200px]">
          <ProjectList />
        </div>
      </div>
      <main className="w-full max-w-4xl flex flex-col lg:flex-row justify-center relative">
        <div
          className={`border border-gray-300 p-6 sm:p-10   w-full  flex flex-col items-center justify-center ${currentStep === 1
              ? " lg:w-1/2 bg-white border-gray-300"
              : "h-0 w-0 bg-transparent border-transparent"
            }`}
        >
          <div className="mt-8 bg-gradient-to-br">
            {currentStep === 1 && (
              <div className="mb-6 flex flex-col items-center ">
                <div className="project-icon-uploader">
                  <label className="block text-sm font-medium text-gray-700">
                    Project Icon
                  </label>

                  {/* Display the current icon, clicking triggers upload */}
                  <img
                    src={
                      typeof projectDetails.icon === "string"
                        ? projectDetails.icon
                        : URL.createObjectURL(projectDetails.icon)
                    }
                    alt="Project Icon"
                    className="w-24 h-24 rounded-full cursor-pointer"
                    onClick={handleIconClick}
                  />

                  <input
                    id="icon-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />

                  {isEditing && projectDetails.icon && (
                    <ImageCropper
                      projectDetails={projectDetails}
                      setProjectDetails={setProjectDetails}
                    />
                  )}
                </div>
                <input
                  type="file"
                  id="icon"
                  name="icon"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleIconUpload}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`border border-gray-300 p-6 sm:p-10 rounded-lg shadow-lg bg-white w-full  mb-8 lg:mb-0 lg:mr-8 relative flex flex-col items-center justify-center ${currentStep === 2 ? "" : ""
            }`}
        >
          {currentStep === 1 && (
            <>
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => navigate("/projects")}
              >
                <IoMdClose size={24} />
              </button>
              <h2 className="text-3xl font-semibold mb-6 text-gray-700 text-center">
                Create A Project
              </h2>
              <form onSubmit={handleCreateProject} className="w-full max-w-md">
                <div className="mb-6">
                  <label htmlFor="name" className="block mb=2 text-gray-600">
                    Project name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={projectDetails.name}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        name: e.target.value,
                      })
                    }
                  />
                  {errorMessage && (
                    <p className="text-red-500 mb-6">{errorMessage}</p>
                  )}
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-gray-600"
                  >
                    Business category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={projectDetails.category}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        category: e.target.value,
                      })
                    }
                  >
                    <option value="">Select category</option>
                    {categoriesFew.map((cat) => (
                      <option key={cat} value={cat} className="bg-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="clientType"
                    className="block mb-2 text-gray-600"
                  >
                    Client Type
                  </label>
                  <select
                    id="clientType"
                    name="clientType"
                    className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    value={projectDetails.clientType}
                    onChange={(e) =>
                      setProjectDetails({
                        ...projectDetails,
                        clientType: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Client type</option>
                    {ClientTypeFew.map((cat) => (
                      <option key={cat} value={cat} className="bg-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-[#4142dc] py-4 px-6 font-semibold text-xl text-white"
                >
                  Next
                </button>
              </form>
            </>
          )}
          {currentStep === 2 && (
            <div className="mt-2 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 mb-2"
                  onClick={() =>
                    setCurrentStep(1) || navigate("/create-project")
                  }
                >
                  <IoMdClose size={24} />
                </button>
                <div className="ml-4 bg-white text-center p-6 ">
                  {/* Step 2 Content */}
                  <img
                    src={googleads}
                    alt="Google Ads"
                    className="w-16 h-16 mx-auto mb-4"
                  />
                  <h3 className="text-2xl  mb-2 text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-yellow-400 to-blue-600  font-bold">
                    Google Ads
                  </h3>
                  {/* <ul className="text-left mb-4">
                    <li>
                      • <span className="font-bold">Grant Permissions</span>:
                      You'll be redirected to Google Ads. Sign in to your Google
                      account and grant the necessary permissions to allow
                      Confidanto access.{" "}
                    </li>
                    <li>
                      • <span className="font-bold">Auto-Sync</span>: Once
                      permissions are granted, Confidanto will automatically
                      sync your Google Ads data.
                    </li>
                    <li>
                      • <span className="font-bold">Ready to Go</span>: Your
                      campaigns are now linked. Confidanto will handle the rest,
                      providing insights and analysis automatically.
                    </li>
                  </ul> */}
                  {googleCustomerIds.length <= 0 && 
                    <button
                      className="bg-[#4142dc] text-white rounded-full py-2 px-4 hover:shadow-lg transition duration-300"
                      onClick={handleConnectGoogleAds}
                    >
                      Connect Existing
                    </button>
                  }
                </div>
                <div className="mt-8 text-center">
                  <button
                    className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-700 mb-2"
                    onClick={() => navigate("/projects")}
                  >
                    Don't have a google ads account
                  </button>
                </div>
                <div className="mt-8 text-center">
                  {googleCustomerIds.length > 0 ? (
                    <>
                      <label
                        htmlFor="google-ads-account"
                        className="block mb-2 text-gray-600"
                      >
                        Select Google Ads Account
                      </label>
                      <select
                        id="google-ads-account"
                        className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                      >
                        <option value="">Select account</option>
                        {googleCustomerIds.map((id) => (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        ))}
                      </select>
                      {selectedCustomerId && (
                        <button
                          className="bg-[#4142dc] mt-4 text-white rounded-full py-2 px-4 hover:shadow-lg transition duration-300"
                          onClick={handleSaveCustomerId}
                        >
                          Submit
                        </button>
                      )}
                    </>
                  ) : (
                    <p className="text-red-500 mb-6">
                      {/*No Google Ads accounts found.*/}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateProject;