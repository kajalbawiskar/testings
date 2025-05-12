import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";
import { states } from "../data/states";
import { countries } from "../data/countries";
import { IoPeople } from "react-icons/io5";
import { adsGif } from "../assets";
import { GrMoney } from "react-icons/gr";
import { GoDownload } from "react-icons/go";
import { Doughnut, Bar } from "react-chartjs-2";
import { categoriesFew, monthNames } from "../data/dummy";
import Select from "react-select";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
} from "../data/subcategory";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from "react-icons/ai";
import { HiEye } from "react-icons/hi2";

function MediaPlanning() {
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [currentBudget, setCurrentBudget] = useState(10000);
  const [selectedSubcategory, setSelectedSubcategory] = useState([]);
  const [budget, setBudget] = useState(0);
  const [budgetError, setBudgetError] = useState("");
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [spend, setSpend] = useState(budget);
  const [foreCastData, setForeCastData] = useState([]);
  const [goal, setGoal] = useState("");
  const [currency, setCurrency] = useState("");

  const [isLoading, setIsLoading] = useState(false);
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

  let type = null;
  const cat = category;
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

  const resultRef = useRef(null);
  const chartRef = useRef(null);
  let options = null;
  let optionList;
  if (type) {
    options = type.map((el) => <option key={el}>{el}</option>);
    optionList = type.map((service) => ({ value: service, label: service }));
  }

  const handleSubCategoryDropdownChange = (data) => {
    setSelectedSubcategory(data);
  };

  let temp = [];
  if (selectedSubcategory) {
    for (let i = 0; i < selectedSubcategory.length; i++) {
      temp.push(selectedSubcategory[i].value);
    }
  }

  const budgetAllocation = {
    Facebook: currentBudget * 0.15,
    GoogleShopping: currentBudget * 0.45,
    YouTube: currentBudget * 0.3,
    GoogleSearch: currentBudget * 0.1,
  };
  
  const pieData = {
    labels: ["Facebook", "Google Shopping", "YouTube", "Google Search"],
    datasets: [
      {
        data: Object.values(budgetAllocation),
        backgroundColor: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef"],
        hoverBackgroundColor: ["#03045e", "#0077b6", "#00b4d8", "#90e0ef"],
      },
    ],
  };
  const startDate = value.startDate;
  const endDate = value.endDate;
  let startMonth = startDate !== "" ? parseInt(startDate.split("-")[1]) : null;
  let endMonth = endDate !== "" ? parseInt(endDate.split("-")[1]) : null;
  let months_selected = null;
  let startMonthIndex = 0;
  let endMonthIndex = 0;
  for (let i = 0; i < monthNames.length; i++) {
    if (monthNames[i] === startMonth) startMonthIndex = i;
    if (monthNames[i] === endMonth) endMonthIndex = i;
  }

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.data = pieData;
      chart.update();
    }
  }, [currentBudget]);
  months_selected = monthNames.slice(startMonth - 1, endMonth);
  let subcategory = temp;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsLoading(true);
    setSpend(budget);
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
        setForeCastData(res.data.forecastData);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(foreCastData.length / itemsPerPage);

  const currentItems = foreCastData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const [optionListBackend, setOptionList] = useState([]);

  useEffect(() => {
    let categoryReqBody = category;

    if (categoryReqBody) {
      axios
        .post("https://api.confidanto.com/fetch-subcategories", {
          category: categoryReqBody,
        })
        .then((res) => {
          const subcategories = res.data.subcategories;
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

  const ageData = {
    labels: ["18-24", "25-54", "55-64", "65+"],
    datasets: [
      {
        data: [30, 43, 12, 15],
        backgroundColor: ["#52b788", "#74c69d", "#95d5b2", "#b7e4c7"],
        hoverBackgroundColor: ["#52b788", "#74c69d", "#95d5b2", "#b7e4c7"],
      },
    ],
  };

  const [region, setRegion] = useState("");
  const [q, setQ] = useState("");
  const gl = region;
  const [selectedCountry, setSelectedCountry] = useState("");
  const countryStates = states.filter(
    (state) => state.country_code === selectedCountry
  );
  const countryName = countries.filter((country) => country.iso2 === region);
  let cname;
  if (countryName.length > 0) {
    cname = countryName[0].name;
  }

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
  const spendVsRevenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Spend",
        data: [5000, 7000, 6000, 8000, 7500], // Dummy data for spend
        backgroundColor: "#3b28cc",
      },
      {
        label: "Revenue",
        data: [15000, 17000, 16000, 18000, 17500], // Dummy data for revenue
        backgroundColor: "#2667ff",
      },
    ],
  };

  const barChartOptions = {
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
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
  const handleCloseClick = () => {
    setIsFormVisible(true); // Show the form again
  };


  const handleDownload = async () => {
    const body = document.body;
    const html = document.documentElement;
    const width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    
    const canvas = await html2canvas(document.body, {
      width: width,
      height: height,
      windowWidth: width,
      windowHeight: height,
      useCORS: true,
      scrollY: -window.scrollY, // To ensure scrolling is considered
      scale: 2 // Increase the scale to improve resolution
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // Width of A4 in mm
    const pageHeight = 297; // Height of A4 in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('webpage.pdf');
  };

  return (
    <div className="image-gallery mb-32 overflow-y-visible h-full font-roboto">
      {isFormVisible && (
        <div className="bg-white m-4 rounded-lg shadow-md shadow-gray-500 py-8">
          <h1 className="text-5xl mx-12 pb-2 mt-2 uppercase text-[#070a74] font-semibold">
            Media planning
          </h1>
          <form className="max-w-full mx-auto" onSubmit={handleSubmit}>
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
                    isSearchDisabled
                      ? "bg-[#c9c9e7] text-white cursor-not-allowed"
                      : "bg-[#070a74] text-white cursor-pointer"
                  } ${
                    !isSearchDisabled &&
                    "hover:bg-white hover:text-[#070a74] hover:border hover:border-[#070a74]"
                  } text-white font-bold py-2.5 px-12 rounded-full mx-auto`}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {!isFormVisible && (
        <div className="flex justify-end mx-4 mt-2">
          <AiOutlineClose
            size={24}
            className="cursor-pointer text-gray-700 hover:text-gray-900"
            onClick={handleCloseClick}
          />
        </div>
      )}
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-8">
          <LoadingAnimation />
        </div>
      ) : (
        <div
          id="report"
          className="bg-white rounded-lg mx-4  font-roboto flex flex-col justify-center items-center shadow-md shadow-gray-500"
        >
          {foreCastData.length > 0 ? (
            <>
              <div className="flex justify-end items-center w-full m-4 mr-8">
              <button className="py-2 px-4 flex mx-2 justify-center items-center text-base bg-[#4142dc] text-white hover:shadow-md">
                <HiEye className="mr-2" />
                View By
                </button>
                <button onClick={handleDownload} className="py-2 px-4 mx-2 flex justify-center items-center text-base bg-[#4142dc] text-white hover:shadow-md">
                <GoDownload className="mr-2" />
                Download
                </button>
              </div>
              <div className="grid grid-cols-2 w-full gap-8 mb-24">
                <div className="mx-4 ml-2 w-full h-96">
                  <div className="bg-white  p-4 mx-4 rounded-lg shadow-md shadow-gray-300 ">
                    <h2 className="text-xl font-bold mb-4 text-gray-500">
                      Estimated Spend vs Revenue
                    </h2>
                    <div className="flex w-full h-full">
                      <Bar
                        data={spendVsRevenueData}
                        options={barChartOptions}
                      />
                    </div>
                  </div>
                </div>
                <div className="mx-4 ml-2 w-full h-96">
                  <div className="flex flex-col shadow-md shadow-gray-300 pb-8 font-roboto rounded-lg w-full h-full">
                    <div className="flex mt-2 mb-2 p-4 justify-between items-center">
                      <h1 className="text-xl font-semibold text-gray-500 p-2  flex">
                        <span className="mr-2">
                          <IoPeople />
                        </span>
                        Age
                      </h1>
                    </div>
                    <div className="flex pb-4 rounded-md justify-center items-center">
                      <div className="flex ">
                        <Doughnut
                          data={ageData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="flex flex-col mx-4">
                        {ageData.labels.map((label, index) => (
                          <div key={index} className="text-xs mb-1">
                            <div
                              className="inline-block mr-2 rounded-full"
                              style={{
                                backgroundColor:
                                  ageData.datasets[0].backgroundColor[index],
                                width: "10px",
                                height: "10px",
                              }}
                            ></div>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mx-4 ml-2 w-full h-96">
                  <div className="flex flex-col p-4  shadow-md shadow-gray-300 w-full font-roboto rounded-lg">
                    <div className="flex mt-2 mb-2 justify-between items-center">
                      <h1 className="text-xl font-semibold text-gray-500 p-2  flex">
                        <span className="mr-2">
                          <GrMoney />
                        </span>
                        Estimated Budget Allocation
                      </h1>
                    </div>
                    <div className="flex  pb-4 rounded-md justify-center items-center h-full">
                      <div className="flex w-1/2 h-[300px]">
                        <Doughnut
                          data={pieData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }}
                        />
                      </div>
                      <div className="flex flex-col mx-4">
                        {pieData.labels.map((label, index) => (
                          <div key={index} className="text-xs mb-1">
                            <div
                              className="inline-block mr-2 rounded-full"
                              style={{
                                backgroundColor:
                                  pieData.datasets[0].backgroundColor[index],
                                width: "10px",
                                height: "10px",
                              }}
                            ></div>
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full h-96 overflow-y-auto">
                  <h1 className="text-3xl py-4 font-bold text-center bg-fixed">
                    Forecasting
                  </h1>
                  <div className="mx-4 overflow-x-auto ">
                    <table className="w-full">
                      <thead className="text-base text-black normal-case bg-gray-200 dark:text-gray-400">
                        <tr>
                          <th className="px-3 py-4 text-left">Subcategory</th>
                          <th className="px-3 py-4 text-left">Days</th>
                          <th className="px-3 py-4 text-left">CPC</th>
                          <th className="px-3 py-4 text-left">CTR</th>
                          <th className="px-3 py-4 text-left">CVR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((res, index) => (
                          <tr
                            key={index}
                            className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                          >
                            <td className="px-3 py-4">
                              {new Date(res.Date).toISOString().split("T")[0]}
                            </td>
                            <td className="px-3 py-4">
                              {currency}
                              {res.CPC}
                            </td>
                            <td className="px-3 py-4">{res.CTR}%</td>
                            <td className="px-3 py-4">{res.CVR}%</td>

                            <td className="px-3 py-4">
                              {currency}
                              {(
                                Number(spend) /
                                (Math.ceil(Number(spend) / Number(res.CPC)) *
                                  (Number(res.CVR) / 100))
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
                            <td className="px-3 py-4">{totalMonths}</td>
                            <td className="px-3 py-4">{totalCPCPage}%</td>
                            <td className="px-3 py-4">{totalCTRPage}%</td>
                            <td className="px-3 py-4">{totalCVRPage}%</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-center my-4">
                    <button className="" onClick={() => navigate("/projects")}>
                      {" "}
                      Continue{" "}
                    </button>
                  </div>
                </div>
              </div>
            </>
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

export default MediaPlanning;
