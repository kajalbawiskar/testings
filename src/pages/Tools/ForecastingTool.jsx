import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useStateContext } from "../../contexts/ContextProvider";
import { states } from "../../data/states";
import { SearchResultTable } from "../../components";
import { BsDownload, BsInfoCircle } from "react-icons/bs";
import { countries } from "../../data/countries";
import { NavLink } from "react-router-dom";
import { RxCaretDown } from "react-icons/rx";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import { adsGif } from "../../assets";
import { categories, categoriesFew, monthNames } from "../../data/dummy";
import Select from "react-select";
import JsPDF from "jspdf";
import {
  animals_pets,
  attorneys,
  autom,
  advocacy,
  art_ent,
  beauty,
  business,
  dating,
  dentists,
  edu,
  finance,
  home_improve,
  home_goods,
  furniture,
  health,
  health_medical,
  ecomm,
  real_estate,
  travel_and_tourism,
} from "../../data/subcategory";
import Datepicker from "react-tailwindcss-datepicker";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

function ForecastingTool() {
  const [category, setCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [budget, setBudget] = useState(0);
  const [budgetError, setBudgetError] = useState("");
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [spend, setSpend] = useState(budget);
  const [foreCastData, setForeCastData] = useState([]);
  const [goal, setGoal] = useState("");
  const [avgBudget, setAvgBudget] = useState(0);
  const [currency, setCurrency] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  console.log(currency);
  const Goals = [
    "To create awareness",
    "Increase revenue",
    "Awareness + Revenue",
  ];
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };

  const handleSpend = (e) => {
    const inputValue = e.target.value;

    if (e.target.value === "") {
      setBudgetError("Please enter a valid budget");
      setIsSearchDisabled(true);
    } else if (!isNaN(inputValue)) {
      setBudget(inputValue);
      setBudgetError("");
      setIsSearchDisabled(false);
    } else {
      setBudgetError("Please enter a valid budget");
      setIsSearchDisabled(true);
    }
  };

  console.log(value);
  let type = null;
  const cat = category;
  console.log(cat);
  if (cat === "Animals & Pets") {
    type = animals_pets;
  } else if (cat === "Advocacy") {
    type = advocacy;
  } else if (cat === "Arts & Entertainment") {
    type = art_ent;
  } else if (cat === "Automotive") {
    type = autom;
  } else if (cat === "Attorneys & Legal Services") {
    type = attorneys;
  } else if (cat === "Beauty & Personal Care") {
    type = beauty;
  } else if (cat === "Business Services") {
    type = business;
  } else if (cat === "Books & Literature") {
    type = business;
  } else if (cat === "Dating & Personals") {
    type = dating;
  } else if (cat === "Dentists & Dental Services") {
    type = dentists;
  } else if (cat === "Education & Instruction") {
    type = edu;
  } else if (cat === "Finance & Insurance") {
    type = finance;
  } else if (cat === "Home & Home Improvement") {
    type = home_improve;
  } else if (cat === "Furniture") {
    type = furniture;
  } else if (cat === "Health & Fitness") {
    type = health;
  } else if (cat === "Health & Medical") {
    type = health_medical;
  } else if (cat === "Home Goods") {
    type = home_goods;
  } else if (cat === "E-Commerce") {
    type = ecomm;
  } else if (cat === "Real Estate") {
    type = real_estate;
  } else if (cat === "Travel and Tourism") {
    type = travel_and_tourism;
  }

  let options = null;
  console.log(type);
  let optionList;
  if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
    optionList = type.map((service) => ({ value: service, label: service }));
    console.log(optionList);
  }

  const handleSubCategoryDropdownChange = (data) => {
    setSelectedSubcategory(data);
  };

  console.log(selectedSubcategory);
  let temp = [];
  if (selectedSubcategory) {
    for (let i = 0; i < selectedSubcategory.length; i++) {
      temp.push(selectedSubcategory[i].value);
    }
  }
  console.log(temp);

  const startDate = value.startDate;
  const endDate = value.endDate;
  let startMonth = startDate !== "" ? parseInt(startDate.split("-")[1]) : null;
  let endMonth = endDate !== "" ? parseInt(endDate.split("-")[1]) : null;
  console.log(endMonth);
  let months_selected = null;
  let startMonthIndex = 0;
  let endMonthIndex = 0;
  for (let i = 0; i < monthNames.length; i++) {
    if (monthNames[i] === startMonth) startMonthIndex = i;
    if (monthNames[i] === endMonth) endMonthIndex = i;
  }
  //console.log(endDate);

  months_selected = monthNames.slice(startMonth - 1, endMonth);
  console.log(months_selected);
  let subcategory = temp;
  let months = months_selected;
  console.log(subcategory);
  console.log(months);
  const generatePDF = () => {
    const report = new JsPDF("portrait", "pt", "a4");
    report
      .html(document.querySelector("#report"), {
        html2canvas: { scale: 0.51 },
        x: 0,
        y: 50,
      })
      .then(() => {
        report.save("forecasting.pdf");
      });
  };

  console.log(category);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSpend(budget);
    console.log(category);
    /*axios
      .post("https://api.confidanto.com/forecasting", {
        category,
        subcategory,
        months,
      })
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        setForeCastData(res.data.forecastData);
      })
      .catch((err) => console.log(err));*/
    //console.log(startDate);
    axios
      .post(
        "https://api.confidanto.com/forecast-user-dashboard",
        {
          category: category,
          region: region,
          subcategories: subcategory,
          startDate: startDate,
          endDate: endDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        setIsLoading(false);
        console.log(res.data);
        setForeCastData(res.data.forecastData);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  console.log(foreCastData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total number of pages
  const totalPages = Math.ceil(foreCastData.length / itemsPerPage);

  // Get the current items for the page
  const currentItems = foreCastData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [optionListBackend, setOptionList] = useState([]);

  useEffect(() => {
    let categoryReqBody = category;

    if (categoryReqBody) {
      console.log("Fetching subcategories for category:", categoryReqBody);

      axios
        .post("https://api.confidanto.com/fetch-subcategories", {
          category: categoryReqBody,
        })
        .then((res) => {
          console.log("Subcategories response:", res.data.subcategories);
          const subcategories = res.data.subcategories; // Assuming API returns data in this format
          const options = subcategories.map((subcategory) => ({
            value: subcategory,
            label: subcategory,
          }));

          setOptionList(options);
        })
        .catch((error) => {
          console.error("Error fetching subcategories:", error);
        });
    }
  }, [category]);

  const [region, setRegion] = useState("");
  const [q, setQ] = useState("");
  const gl = region;
  const [selectedCountry, setSelectedCountry] = useState("");
  const countryStates = states.filter(
    (state) => state.country_code === selectedCountry
  );
  const countryName = countries.filter((country) => country.iso2 === region);
  console.log(region);
  //console.log(countryName[0].name);
  console.log(gl);
  let cname;
  if (countryName.length > 0) {
    cname = countryName[0].name;
  }
  console.log(cname);

  const country_name = cname;
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQ(event.target.value);
  };

  const totalMonths = foreCastData.length;
  const totalCPC = foreCastData
    .reduce((acc, curr) => acc + parseFloat(curr.CPC), 0)
    .toFixed(2);
  const totalCTR = foreCastData
    .reduce((acc, curr) => acc + parseFloat(curr.CTR), 0)
    .toFixed(2);
  const totalCVR = foreCastData
    .reduce((acc, curr) => acc + parseFloat(curr.CVR), 0)
    .toFixed(2);
  const totalImpressions = foreCastData
    .reduce(
      (acc, curr) =>
        acc +
        Math.floor(
          Math.floor(Number(spend) / Number(curr.CPC)) /
            (Number(curr.CTR) / 100)
        ),
      0
    )
    .toFixed(2);
  const totalClicks = foreCastData
    .reduce(
      (acc, curr) => acc + Math.floor(Number(spend) / Number(curr.CPC)),
      0
    )
    .toFixed(2);
  const totalLeads = foreCastData
    .reduce(
      (acc, curr) =>
        acc +
        Math.ceil(Number(spend) / Number(curr.CPC)) * (Number(curr.CVR) / 100),
      0
    )
    .toFixed(2);
  const totalCPL = foreCastData
    .reduce(
      (acc, curr) =>
        acc +
        Math.floor(
          Number(spend) /
            (Math.ceil(Number(spend) / Number(curr.CPC)) *
              (Number(curr.CVR) / 100))
        ),
      0
    )
    .toFixed(2);
  const totalSpend = spend * foreCastData.length;
  const totalRevenue = foreCastData
    .reduce(
      (acc, curr) =>
        acc +
        Math.floor(
          Math.floor(Number(spend) / Number(curr.CPC)) * Number(curr.CVR)
        ) *
          Number(spend),
      0
    )
    .toFixed(2);

  const totalCPCPage = (
    foreCastData.reduce((acc, item) => acc + Number(item.CPC), 0) /
    foreCastData.length
  ).toFixed(2);
  const totalCTRPage = (
    foreCastData.reduce((acc, item) => acc + Number(item.CTR), 0) /
    foreCastData.length
  ).toFixed(2);
  const totalCVRPage = (
    foreCastData.reduce((acc, item) => acc + Number(item.CVR), 0) /
    foreCastData.length
  ).toFixed(2);
  const totalImpressionsPage = foreCastData.reduce(
    (acc, item) =>
      acc +
      Math.ceil(
        Math.ceil(Number(spend) / Number(item.CPC)) / (Number(item.CTR) / 100)
      ),
    0
  );
  const totalClicksPage = foreCastData.reduce(
    (acc, item) => acc + Math.ceil(Number(spend) / Number(item.CPC)),
    0
  );
  const totalLeadsPage = foreCastData
    .reduce(
      (acc, item) =>
        acc +
        Math.ceil(Number(spend) / Number(item.CPC)) * (Number(item.CVR) / 100),
      0
    )
    .toFixed(2);
  const totalCPLPage = (Number(spend) / totalLeadsPage).toFixed(2);
  const totalSpendPage = foreCastData.reduce(
    (acc, item) => acc + Number(spend),
    0
  );
  const totalRevenuePage = foreCastData
    .reduce(
      (acc, item) =>
        acc +
        Math.ceil(Number(spend) / Number(item.CPC)) *
          (Number(item.CVR) / 100) *
          Number(spend),
      0
    )
    .toFixed(2);
  return (
    <div className="image-gallery mb-32 overflow-y-visible h-full font-roboto">
      <style>
        {`
          .break-all {
            word-wrap: break-word;
          }
          .react-select__control {
            border-radius: 0px; !important;
          }

          .react-select {
            &__control {
              border: 0;
              border-radius: 0;
                }  
            }
        `}
      </style>
      <div className="bg-white m-4 rounded-lg shadow-md shadow-gray-500 py-8">
        <h1 className="text-5xl mx-12 pb-2 mt-2 uppercase text-[#070a74] font-semibold">
          Media Planning
        </h1>
        <form className="max-w-full mx-auto" onSubmit={handleSubmit}>
          {/*<div className="flex justify-end pr-8 w-full">
            <div className="mr-16">
              <input
                type="radio"
                id="monthovermonth"
                name="displayType"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300"
                value="Month-Over-Month"
              />
              <label htmlFor="monthovermonth" className="ml-2">
                Month-Over-Month
              </label>
            </div>
            <div className="mr-16">
              <input
                type="radio"
                id="weekoverweek"
                name="displayType"
                className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300"
                value="Week-Over-Week"
              />
              <label htmlFor="weekoverweek" className="ml-2">
                Week-Over-Week
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="dayonday"
                name="displayType"
                className="w-4 h-4  text-blue-600 bg-gray-100 border-gray-300"
                value="Day-On-Day"
              />
              <label htmlFor="Day-On-Day" className="ml-2">
                Day-On-Day
              </label>
            </div>
          </div>*/}
          <div className="flex flex-col lg:flex-row mx-12 mt-2 py-4">
            <div className="flex flex-col w-full">
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelectedSubcategory([]);
                }}
                className="bg-white border border-gray-400 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" className="bg-white">
                  Select Category
                </option>
                {categoriesFew.map((cat) => (
                  <option key={cat} value={cat} className="bg-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full">
              <div className="relative">
                <Select
                  className="react-select w-full bg-transparent border-2 mx-2 border-gray-400 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500"
                  options={optionListBackend}
                  value={selectedSubcategory}
                  onChange={handleSubCategoryDropdownChange}
                  isMulti={true}
                  id="multi-select"
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({
                      ...base,
                      zIndex: 9999,
                    }),
                  }}
                  placeholder=" Select a Subcatgory "
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <div className="border-2 border-x-gray-400 ml-4 w-full">
                <Datepicker
                  value={value}
                  onChange={handleValueChange}
                  popoverDirection="down"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row mx-12 mt-2 py-4">
            <div className="flex flex-col w-full">
              <select
                onChange={(e) => {
                  setRegion(e.target.value);
                  if (e.target.value === "USA") {
                    setCurrency("$");
                  } else if (e.target.value === "UK") {
                    setCurrency("£");
                  } else if (e.target.value === "India") {
                    setCurrency("₹");
                  } else if (e.target.value === "Europe") {
                    setCurrency("€");
                  } else if (e.target.value === "Australia") {
                    setCurrency("$");
                  }
                }}
                className="bg-white border border-gray-400 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" className="bg-white">
                  Select region you want to run ads in
                </option>
                <option className="bg-white" value="USA">
                  USA
                </option>
                <option className="bg-white" value="UK">
                  UK
                </option>
                <option className="bg-white" value="Europe">
                  Europe
                </option>
                <option className="bg-white" value="Australia">
                  Australia
                </option>
                <option className="bg-white" value="India">
                  India
                </option>
              </select>
            </div>
            <div className="flex flex-col w-full">
              <select
                onChange={(e) => setGoal(e.target.value)}
                className="bg-white border mx-2 border-gray-400 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              >
                <option value="" className="bg-white">
                  Select business goal
                </option>
                {Goals.map((goal) => (
                  <option key={goal} value={goal} className="bg-white">
                    {goal}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col w-full">
              <div className="flex justify-center items-center w-full border border-gray-400 ml-4">
                {region && (
                  <label className=" text-base text-center border-r border-gray-400 py-2 px-3">
                    {currency}
                  </label>
                )}
                <input
                  type="text"
                  id="spend"
                  className="bg-white text-gray-900 text-base block w-full p-2"
                  placeholder="Enter budget"
                  onChange={handleSpend}
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center p-2">
            <div className="flex-grow justify-center flex">
              <button
                type="submit"
                disabled={isSearchDisabled}
                className={`bg-[#070a74] ${
                  isSearchDisabled &&
                  "bg-[#6d6deb] text-white cursor-not-allowed"
                } ${
                  !isSearchDisabled &&
                  "hover:bg-white hover:text-[#070a74] hover:border hover:border-[#070a74]"
                } text-white font-bold py-2.5 px-12 rounded-full mx-auto`}
              >
                Submit
              </button>
            </div>
            {/*<TooltipComponent content="Download" position="BottomCenter">
              <div className="flex flex-col justify-center items-center">
                <button className="text-3xl text-center" onClick={generatePDF}>
                  <BsDownload />
                </button>
                <p className="text-sm text-gray-500 text-center">Download</p>
              </div>
            </TooltipComponent>*/}
          </div>
        </form>
      </div>
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-8">
          <LoadingAnimation />
        </div>
      ) : (
        <div
          id="report"
          className="bg-white rounded-lg mx-4 font-roboto flex flex-col justify-center items-center shadow-md shadow-gray-500"
        >
          {foreCastData.length > 0 ? (
            <div className="w-full">
              <h1 className="text-3xl py-4 font-bold text-center">
                Forecasting
              </h1>
              <div className="mx-4 overflow-x-auto">
                <table className="w-full">
                  <thead className="text-base text-black normal-case bg-gray-200 dark:text-gray-400">
                    <tr>
                      <th
                        className="px-3 py-4 text-left"
                        style={{ minWidth: "200px" }}
                      >
                        Subcategory
                      </th>
                      <th
                        className="px-3 py-4 text-left"
                        style={{ minWidth: "150px" }}
                      >
                        Days
                      </th>
                      <th className="px-3 py-4 text-left">CPC</th>
                      <th className="px-3 py-4 text-left">CTR</th>
                      <th className="px-3 py-4 text-left">CVR</th>
                      <th className="px-3 py-4 text-left">Impressions</th>
                      <th className="px-3 py-4 text-left">Clicks</th>
                      <th className="px-3 py-4 text-left">Leads</th>
                      <th className="px-3 py-4 text-left">CPL</th>
                      <th className="px-3 py-4 text-left">Spend</th>
                      <th className="px-3 py-4 text-left">Revenue</th>
                      <th className="px-3 py-4 text-left">Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((res, index) => (
                      <tr
                        key={index}
                        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                      >
                        <td className="px-3 py-4" style={{ minWidth: "200px" }}>
                          {res.Subcategory}
                        </td>
                        <td className="px-3 py-4" style={{ minWidth: "150px" }}>
                          {new Date(res.Date).toISOString().split("T")[0]}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {res.CPC}
                        </td>
                        <td className="px-3 py-4">{res.CTR}%</td>
                        <td className="px-3 py-4">{res.CVR}%</td>
                        <td className="px-3 py-4">
                          {Math.ceil(
                            Math.ceil(Number(spend) / Number(res.CPC)) /
                              (Number(res.CTR) / 100)
                          ).toLocaleString()}
                        </td>
                        <td className="px-3 py-4">
                          {Math.ceil(Number(spend) / Number(res.CPC))}
                        </td>
                        <td className="px-3 py-4">
                          {(
                            Math.ceil(Number(spend) / Number(res.CPC)) *
                            (Number(res.CVR) / 100)
                          ).toFixed(2)}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {(
                            Number(spend) /
                            (Math.ceil(Number(spend) / Number(res.CPC)) *
                              (Number(res.CVR) / 100))
                          ).toFixed(2)}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {spend}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {(
                            (
                              Math.ceil(Number(spend) / Number(res.CPC)) *
                              (Number(res.CVR) / 100)
                            ).toFixed(2) * Number(spend)
                          ).toFixed(2)}
                        </td>
                        <td className="px-3 py-4">
                          <p
                            className={` ${
                              res.Impact_india !== ""
                                ? "bg-green-200 p-2 px-4 text-center animate-pulse"
                                : "bg-transparent"
                            }`}
                          >
                            {res.Impact_india}
                          </p>
                        </td>
                      </tr>
                    ))}
                    {currentPage === totalPages && (
                      <tr className="bg-gray-600 text-white">
                        <td className="px-3 py-4">Total</td>
                        <td className="px-3 py-4" style={{ minWidth: "150px" }}>
                          {totalMonths}
                        </td>
                        <td className="px-3 py-4">{totalCPCPage}%</td>
                        <td className="px-3 py-4">{totalCTRPage}%</td>
                        <td className="px-3 py-4">{totalCVRPage}%</td>
                        <td className="px-3 py-4">{totalImpressionsPage}</td>
                        <td className="px-3 py-4">{totalClicksPage}</td>
                        <td className="px-3 py-4">{totalLeadsPage}</td>
                        <td className="px-3 py-4">
                          {currency}
                          {totalCPLPage}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {totalSpendPage}
                        </td>
                        <td className="px-3 py-4">
                          {currency}
                          {totalRevenuePage}
                        </td>
                        <td className="px-3 py-4" style={{ minWidth: "200px" }}>
                          -
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="flex justify-center my-4">
                <button
                  className={`px-4 py-4 mx-1 flex bg-[#0077b6] text-white rounded-full ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (currentPage > 1) {
                      handlePageChange(currentPage - 1);
                    }
                  }}
                  disabled={currentPage === 1}
                >
                  <span>
                    <GrCaretPrevious />
                  </span>
                </button>
                <button
                  className={`px-4 py-4 mx-1 flex bg-[#0077b6] text-white rounded-full ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={() => {
                    if (currentPage < totalPages) {
                      handlePageChange(currentPage + 1);
                    }
                  }}
                  disabled={currentPage === totalPages}
                >
                  <span>
                    <GrCaretNext />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center mt-8 bg-white mx-4 h-auto rounded-lg p-2">
              <div className="max-w-[500px] mx-auto">
                <img src={adsGif} alt="Ads GIF" className="max-w-full h-auto" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ForecastingTool;
