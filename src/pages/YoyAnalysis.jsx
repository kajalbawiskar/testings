import React, { useState } from "react";
import { Header } from "../components";
import { searches, durations, categories } from "../data/dummy";
import GoogleTrends from "../components/GoogleTrends";
import { yoyBackG } from "../assets";

const YoyAnalysis = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [region, setRegion] = useState("Select a Region");
  const [duration, setDuration] = useState("Select Duration");
  const [category, setCategory] = useState("Select Category");
  const [search, setSearch] = useState("Select Type");
  const [isData, setIsData] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState("");
  const countryList = require("country-list");
  const countries = countryList.getData();
  const countryCode = countryList.getCode(region);

  const handleSearch = (e) => {
    setSearchKeyword(e.target.value);
    setIsData(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (duration === "Past day") {
      setSelectedDuration("now 1-H");
    } else if (duration === "Past hour") {
      setSelectedDuration("now 1-d");
    } else if (duration === "Past 4 hours") {
      setSelectedDuration("now 4-H");
    } else if (duration === "Past 7 days") {
      setSelectedDuration("now 7-d");
    } else if (duration === "Past 30 days") {
      setSelectedDuration("today 1-m");
    } else if (duration === "Past 90 days") {
      setSelectedDuration("today 3-m");
    } else if (duration === "Past 12 months") {
      setSelectedDuration("today 12-m");
    } else if (duration === "Past 5 years") {
      setSelectedDuration("today 5-y");
    } else if (duration === "2004-present") {
      console.log(duration);
    }
    setIsData(true)
  };

  
  console.log(selectedDuration);
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header title="Year Over Year Analysis" />
      <form class="max-w-full mx-auto" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              id="budget"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pt-9 pb-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Term"
              onChange={handleSearch}
              required
            />
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              id="budget"
              className="bg-blue-100 bg-opacity-11 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-3 pt-9 pb-9 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="+       Compare"
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-4 md:gap-6">
          <div className="relative z-0 w-full mb-4 group">
            <select
              onChange={(e) => setRegion(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Select a Region">-- Select a Region --</option>
              {countries.map((country) => (
                <option key={country.code}>{country.name}</option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setDuration(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Select Duration"> -- Select Duration -- </option>
              {durations.map((duration) => (
                <option key={duration}>{duration}</option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Select Category"> -- Select Category -- </option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <select
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="Select Type"> -- Select Type -- </option>
              {searches.map((search) => (
                <option key={search}>{search}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-center p-2">
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-full"
          >
            Get Analysis
          </button>
        </div>
      </form>
      {isData ? (
        <div>
          <div className="flex flex-wrap justify-center w-full">
            <div className="w-full pl-3 pr-3">
              <div id="widget" className="w-full">
                <GoogleTrends
                  type="TIMESERIES"
                  keyword={searchKeyword}
                  geo={countryCode}
                  time={selectedDuration}
                  url="https://ssl.gstatic.com/trends_nrtr/3601_RC01/embed_loader.js"
                />
              </div>
            </div>
            <div className="w-full pl-3 pr-3">
              <div id="widget" className="w-full">
                <GoogleTrends
                  type="GEO_MAP"
                  keyword={searchKeyword}
                  geo={countryCode}
                  time={selectedDuration}
                  url="https://ssl.gstatic.com/trends_nrtr/3601_RC01/embed_loader.js"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center w-full">
            <div className="w-full pl-3 pr-3">
              <div id="widget" className="w-full">
                <GoogleTrends
                  type="RELATED_TOPICS"
                  keyword={searchKeyword}
                  geo={countryCode}
                  time={selectedDuration}
                  url="https://ssl.gstatic.com/trends_nrtr/3601_RC01/embed_loader.js"
                />
              </div>
            </div>
            <div className="w-full pl-3 pr-3">
              <div id="widget" className="w-full">
                <GoogleTrends
                  type="RELATED_QUERIES"
                  keyword={searchKeyword}
                  geo={countryCode}
                  time={selectedDuration}
                  url="https://ssl.gstatic.com/trends_nrtr/3601_RC01/embed_loader.js"
                />
              </div>
            </div>
          </div>
        </div>
      ):
      (
        <div className="flex flex-wrap justify-center w-full">
          <img className="object-cover h-fit w-fit" src={yoyBackG} alt="Year over Year Analysis" />
        </div>
      )
      }
    </div>
  );
};
export default YoyAnalysis;
