import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";

const TrafficAnalytics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        setCountries(response.data.map(country => ({
          code: country.cca2,
          name: country.name.common
        })));
        console.log(response);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const authResponse = await axios.get("http://localhost:3000/auth/google");
      if (authResponse.data === "Authentication successful.") {
        const response = await axios.get("http://localhost:3000/fetch-traffic-data", {
          params: {
            startDate: startDate.toISOString().split("T")[0],
            endDate: endDate.toISOString().split("T")[0],
            websiteUrl: websiteUrl,
            country: selectedCountry // Pass selected country as a query parameter
          },
        });
        setTrafficData(response.data);
      }
    } catch (error) {
      console.error("Error fetching traffic overview data:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-semibold">Google Traffic Analysis</h1>
      </header>
      <div className="container mx-auto p-4">
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Website URL</h2>
          <input
            type="text"
            className="border rounded p-2 w-full"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Date Range Selector</h2>
          <div className="flex space-x-4">
            <DatePicker
              className="border rounded p-2"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
            />
            <DatePicker
              className="border rounded p-2"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
            />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Select Country</h2>
          <select
            className="border rounded p-2 w-full"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Select a country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
        <div className="mt-8">
          {loading && <p className="text-gray-700">Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {trafficData && (
            <div className="bg-white shadow-md rounded-md p-4 mt-4">
              <h2 className="text-lg font-semibold mb-2">Traffic Overview</h2>
              <p>
                Total Sessions: {trafficData.totalsForAllResults["ga:totalSessions"]}
              </p>
              <p>
                Total Pageviews: {trafficData.totalsForAllResults["ga:totalPageviews"]}
              </p>
              <p>
                Bounce Rate: {trafficData.totalsForAllResults["ga:bounceRate"]}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrafficAnalytics;
