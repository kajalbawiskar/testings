// CreateDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { googleads, bingads } from "../assets/index";
import { IoMdClose } from "react-icons/io";
import ProjectDetails from "./ProjectDetails";

ChartJS.register(ArcElement, Tooltip, Legend);

const CreateDetails = () => {
  const { projectId } = useParams();
  const [projects, setProjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [googleCustomerIds, setGoogleCustomerIds] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [bingAdsUrl, setBingAdsUrl] = useState(""); 
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://api.confidanto.com/projects/${projectId}`
        );
        setProject(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get(`https://api.confidanto.com/projects/${projectId}`);
        setProjects(response.data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, [projectId]);

  useEffect(() => {
    // Check for navigation state to set the current step
    if (location.state && location.state.step) {
      setCurrentStep(location.state.step);
    } else {
      // Fallback based on pathname if no state is provided
      if (location.pathname === "/Bingdetails") {
        setCurrentStep(1);
      } else if (location.pathname === "/Googledetails") {
        setCurrentStep(2);
      }
    }
  }, [location]);

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

  const handleConnectGoogleAds = async () => {
    try {
      window.location.href =
        "https://connect.confidanto.com/authorize";
    } catch (error) {
      console.error("Error during authorization:", error);
    }
  };

  const handleConnectBingAds = async () => {
    const clientId = "f0e47d75-0b99-4b32-8b3b-166205baaca0";
    const redirectUri = "http://localhost:3000";
    const scope = "https://ads.microsoft.com/ads.manage offline_access";

    const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${encodeURIComponent(
      scope
    )}`;

    try {
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error during authorization:", error);
    }
  };

  const showBingAdsUrl = () => {
    setBingAdsUrl("http://localhost:3000/connect-with-Bingads"); // Set the URL when moving to step 2
  };

  return (
    <div className="flex flex-col items-start bg-gray-100 p-1 sm:p-8 min-h-screen justify-start">
      <div className="absolute inset-0 blur-sm overflow-hidden">
        <div className="blur-background h-[200px]">
          <ProjectDetails />
        </div>
      </div>
      <main className="w-full max-w-4xl flex flex-col lg:flex-row justify-center relative">
        
        <div
          className={`border border-gray-300 p-6 sm:p-10 rounded-lg shadow-lg bg-white w-full  mb-8 lg:mb-0 lg:mr-8 relative flex flex-col items-center justify-center ${
            currentStep === 2 ? "" : ""
          }`}
        >
          
          {currentStep === 1 && (
            <div className="mt-2 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 mb-2"
                  onClick={() =>
                    navigate(`/project-details/${projectId}`)
                  }
                >
                  <IoMdClose size={24} />
                </button>
                <div className="ml-4 bg-white text-center p-6 ">
                  <img
                    src={bingads}
                    alt="Microsoft Ads"
                    className="w-16 h-16 mx-auto mb-4"
                  />
                  <h3 className="text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-green-400 to-red-600 animate-text font-bold">
                    Bing Ads
                  </h3>
                  <ul className="text-left mb-4">
                    <li>
                      • <span className="font-bold">Grant Permissions</span>:
                      You'll be redirected to Bing Ads. Sign in to your Bing
                      account and grant the necessary permissions to allow
                      Confidanto access.
                    </li>
                    <li>
                      • <span className="font-bold">Auto-Sync</span>: Once
                      permissions are granted, Confidanto will automatically
                      sync your Bing Ads data.
                    </li>
                    <li>
                      • <span className="font-bold">Ready to Go</span>: Your
                      campaigns are now linked. Confidanto will handle the rest,
                      providing insights and analysis automatically.
                    </li>
                  </ul>
                  <button
                    className="bg-[#4142dc] text-white rounded-full py-2 px-4 hover:shadow-lg transition duration-300"
                    onClick={handleConnectBingAds}
                  >
                    Connect Existing
                  </button>
                </div>
                <div className="mt-8 text-center">
                  <button
                    className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-700 mb-2"
                    onClick={() =>
                      navigate(`/project-details/${projectId}`)
                    }
                  >
                    Don't have a Bing ads account
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="mt-2 flex justify-center">
              <div className="w-full max-w-md">
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 mb-2"
                  onClick={() =>
                    navigate(`/project-details/${projectId}`)
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
                  <ul className="text-left mb-4">
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
                  </ul>
                  <button
                    className="bg-[#4142dc] text-white rounded-full py-2 px-4 hover:shadow-lg transition duration-300"
                    onClick={handleConnectGoogleAds}
                  >
                    Connect Existing
                  </button>
                </div>
                <div className="mt-8 text-center">
                  <button
                    className="absolute bottom-4 right-4 text-blue-500 hover:text-blue-700 mb-2"
                    onClick={() =>
                      navigate(`/project-details/${projectId}`)
                    }
                  >
                    Don't have a Google ads account
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

export default CreateDetails;
