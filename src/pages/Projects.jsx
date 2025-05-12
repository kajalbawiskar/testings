import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate, useLocation } from "react-router-dom";
import ProjectList from "./ProjectList";

ChartJS.register(ArcElement, Tooltip, Legend);

const Projects = () => {
  useLayoutEffect(() => {

    localStorage.removeItem("project_id");
    localStorage.setItem("project_id",-1);
    localStorage.removeItem("project_name");
    localStorage.removeItem("customer_id");

    console.log("KJHBUGVYFCTDRX LOGGOGOGG ",localStorage.getItem("project_id"));
  }, []);
  const [forecastData, setForecastData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isData, setIsData] = useState(false);
  const [customerIds, setCustomerIds] = useState([]);
  const trialStatus = localStorage.getItem("daysLeftStatus");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(storedProjects);
  }, []);

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

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const ids = searchParams.get("customer_ids");
    if (ids) {
      alert("Google Ads Account Connected Successfully...!");
      setCurrentStep(2);
      const idsArray = ids.split(",");
      setCustomerIds(idsArray);
    }
  }, [location.search]);

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

  localStorage.setItem("daysLeftStatus", daysLeftText);

  return (
    <div className="relative">
      {/* Conditionally blur the project list when trial has ended */}
      <div className={trialStatus === "Your trial has ended" ? "blur-sm pointer-events-none max-h-screen overflow-hidden" : ""}>
        <ProjectList />
      </div>

      {/* Conditionally render the "Select Your Plan" button */}
      {trialStatus === "Your trial has ended" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-xl p-4 pb-0 fomt font-semibold text-white ">You Free Trial has been ended.</h1>
            <h1 className="text-lg p-4 text-white">Select your plan to continue to access your workspace.</h1>
          <button
            className="px-4 py-2 text-white bg-blue-600 hover:shadow-lg"
            onClick={() => navigate("/billing-support")}
          >
            Select Your Plan
          </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;