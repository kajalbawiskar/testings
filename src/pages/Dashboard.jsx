import React, { useState, useEffect } from "react";
import axios from "axios";
import { categoriesFew } from "../data/dummy";
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const [forecastData, setForecastData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isData, setIsData] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [category, setCategory] = useState("");
  const [projectDetails, setProjectDetails] = useState({
    name: "",
    category: "",
  });

  const handleCreateProject = () => {
    const newProject = { id: projects.length + 1, projectName, category };
    setProjects([...projects, newProject]);
    setProjectDetails({ projectName, category });
    setCurrentStep(2);
  };

  const [htmlContent, setHtmlContent] = useState("");

  const [customerIds, setCustomerIds] = useState([]);

  const handleConnectGoogleAds = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/");
      console.log(response);
      // Process response data as needed
      setHtmlContent(response.data);
    } catch (error) {
      console.error("Error connecting with Google Ads:", error);
    }
  };

  const [googleAdsAccounts, setGoogleAdsAccounts] = useState([]);

  // Function to fetch Google Ads accounts from Node.js backend
  const fetchGoogleAdsAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/fetch-google-ads-accounts"
      );
      setGoogleAdsAccounts(response.data); // Assuming the API returns JSON array of accounts
    } catch (error) {
      console.error(
        "Error fetching Google Ads accounts from Node.js backend:",
        error
      );
    }
  };

  useEffect(() => {
    fetchGoogleAdsAccounts();
  }, []);

  const handleGetGoogleAdsAccounts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/get_google_ads_accounts"
      );
      console.log("Google Ads Accounts:", response.data);
      // Handle the response data as needed in your React application
    } catch (error) {
      console.error("Error fetching Google Ads accounts:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.post(
          "https://api.confidanto.com/forecast-user-dashboard",
          {
            category: "Travel and Tourism",
            region: "India",
            subcategories: ["Hotel booking platform"],
            startDate: "2024-01-01",
            endDate: "2024-01-05",
          }
        );
        if (isMounted) {
          setForecastData(response.data.forecastData);
          setIsData(true);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching forecast data:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmitProject = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/projects",
        projectDetails
      );
      console.log("Project saved successfully:", response.data);
      // Optionally reset the form or navigate to another page
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  console.log(forecastData);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ids = searchParams.get("customer_ids");
    if (ids) {
      // Split customer IDs into an array
      alert("Google Ads Account Connected Successfully...!");
      setCurrentStep(3);
      const idsArray = ids.split(",");
      setCustomerIds(idsArray);
    }
  }, [location.search]);

  console.log(customerIds);
  const uniqueUserID = localStorage.getItem("uniqueUserID");
  const [userData, setUserData] = useState();
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
        console.log(result);
        localStorage.setItem("uniqueUserID", result.userData.unique_user_id);
        setUserData(result.userData);
      } catch (error) {
        console.log(error.response);
      }
    };

    fetchData();
  }, []);
  console.log(userData);
  return (
    <div className="flex flex-col items-center bg-gray-100 p-1 sm:p-8">
      <nav className="flex justify-between items-center w-full max-w-4xl mt-1 mb-2 bg-white p-4 shadow-md rounded-lg">
        <select className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="projects-profiles">Projects/Profiles</option>
        </select>
        <h1>User ID: {uniqueUserID}</h1>
        <button className="bg-pink-600 text-white rounded-full py-2 px-6 shadow-lg hover:bg-pink-700 transition duration-300">
          Add New
        </button>
      </nav>
      <main className="w-full max-w-4xl flex flex-col lg:flex-row justify-center">
        <div className="border border-gray-300 p-6 sm:p-10 rounded-lg shadow-lg bg-white w-full lg:w-1/2 mb-8 lg:mb-0 lg:mr-8">
          {currentStep === 1 && (
            <>
              <h2 className="text-3xl font-semibold mb-6 text-gray-700 text-center">
                Create A Project
              </h2>

              <form onSubmit={handleCreateProject}>
                <div className="mb-6">
                  <label htmlFor="name" className="block mb-2 text-gray-600">
                    Project name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={(e) => setProjectName(e.target.value)}
                    className="w-full p-3 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="category"
                    className="block mb-2 text-gray-600"
                  >
                    Category
                  </label>
                  <select
                    className="p-2 w-full border rounded"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select category</option>
                    {categoriesFew.map((cat) => (
                      <option key={cat} value={cat} className="bg-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <h3 className="text-xl mb-4 text-gray-700">Choose Profiles</h3>
                <p className="mb-6 text-sm text-gray-500">
                  *All Profiles belonging to a Project must use the same
                  currency and time zone.
                </p>
                <button
                  type="submit"
                  className="bg-orange-600 text-white rounded-full py-3 px-6 shadow-lg hover:bg-orange-700 transition duration-300 w-full"
                >
                  Create Project
                </button>
              </form>
            </>
          )}
          {currentStep === 2 && (
            <div className="mt-8">
              <div className="mb-4">
                <input
                  type="checkbox"
                  id="no-account"
                  checked={checkboxChecked}
                  onChange={() => setCurrentStep(3)}
                />
                <label htmlFor="no-account" className="ml-2 text-gray-600">
                  Don't have an account?
                </label>
              </div>
              <button
                className="bg-blue-600 text-white rounded-full py-3 px-6 shadow-lg hover:bg-blue-700 transition duration-300 w-full mb-4"
                onClick={handleConnectGoogleAds}
              >
                Connect with Google Ads
              </button>
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          )}
          {currentStep === 3 && (
            <div className="mt-8">
              <div className="mb-4">
                <input
                  type="checkbox"
                  id="no-account"
                  checked={checkboxChecked}
                  onChange={() => setCheckboxChecked(!checkboxChecked)}
                />
                <label htmlFor="no-account" className="ml-2 text-gray-600">
                  Don't have an account?
                </label>
              </div>
              <button
                className="bg-green-600 text-white rounded-full py-3 px-6 shadow-lg hover:bg-green-700 transition duration-300 w-full mb-4"
                onClick={() => setCurrentStep(4)}
              >
                Connect with Bing Ads
              </button>
              {checkboxChecked && (
                <button
                  className="bg-green-600 text-white rounded-full py-3 px-6 shadow-lg hover:bg-green-700 transition duration-300 w-full"
                  onClick={() => setCurrentStep(4)}
                >
                  Don't have an account? Connect with Bing Ads
                </button>
              )}
            </div>
          )}
          {currentStep === 4 && (
            <div className="mt-8">
              <button
                className="bg-purple-600 text-white rounded-full py-3 px-6 shadow-lg hover:bg-purple-700 transition duration-300 w-full"
                onClick={handleSubmitProject}
              >
                Submit Project
              </button>
            </div>
          )}
        </div>
        <div className="border border-gray-300 p-6 sm:p-10 rounded-lg shadow-lg bg-white w-full lg:w-1/2">
          <div className="mt-8">
            <h3 className="text-2xl mb-4 text-gray-700">Step-by-Step Guide</h3>
            {currentStep === 1 && (
              <p className="mb-4 text-gray-600">
                <strong>Step 1: Create Project</strong>
                <br />
                1. Select input project name, category.
                <br />
                2. Choose profiles.
                <br />
                3. Click 'Create Project'.
              </p>
            )}
            {currentStep === 2 && (
              <p className="mb-4 text-gray-600">
                <strong>Step 2: Choose Ad Account</strong>
                <br />
                1. Connect with Google Ads.
                <br />
                2. Connect with Bing Ads.
              </p>
            )}
            {currentStep === 3 && (
              <p className="mb-4 text-gray-600">
                <strong>Step 3: Confirm Account</strong>
                <br />
                1. Don't have an account? Connect with Bing Ads.
              </p>
            )}
            {currentStep === 4 && (
              <p className="mb-4 text-gray-600">
                <strong>Step 4: Submit Project</strong>
                <br />
                Click 'Submit Project' to save the project details.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
