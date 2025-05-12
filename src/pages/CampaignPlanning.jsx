import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";
import { states } from "../data/states";
import { countries } from "../data/countries";
import { IoPeople } from "react-icons/io5";
import { GrCaretPrevious, GrCaretNext } from "react-icons/gr";
import { adsGif } from "../assets";
import { GrMoney } from "react-icons/gr";
import { GoDownload } from "react-icons/go";
import { Doughnut, Pie, Bar } from "react-chartjs-2";
import { categories, categoriesFew, monthNames } from "../data/dummy";
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

function CampaignPlanning() {
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
  const [keywords, setKeywords] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [ageGroups, setAgeGroups] = useState([]);
  const [adCopy, setAdCopy] = useState([]);
  const [competitors, setCompetitors] = useState([]);
  const [budgetAllocation, setBudgetAllocation] = useState([]);
  const [resultData,setResultData] = useState("")
  // Chart Data States
  const [pieData, setPieData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [spendVsRevenueData, setSpendVsRevenueData] = useState({});
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

  const resultRef = useRef(null);
  const chartRef = useRef(null);
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

  const handleBudgetChange = (newBudget) => {
    setCurrentBudget(newBudget);
  };

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
  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current;
      chart.data = pieData;
      chart.update();
    }
  }, [currentBudget]);
  months_selected = monthNames.slice(startMonth - 1, endMonth);
  console.log(months_selected);
  let subcategory = temp;
  let months = months_selected;
  console.log(subcategory);
  console.log(months);
  const generatePDF = () => {
    const report = new jsPDF("portrait", "pt", "a4");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormVisible(false);
    setIsLoading(true);
    setSpend(budget);
    const prompt = `
      Category: ${category}
      Subcategories: ${subcategory}
      Region: ${region}
      Goal: ${goal}
      Budget: ${budget}
  
      Please:
      1. Suggest 20 relevant keywords with search volume for each subcategory.
      2. Group them into campaigns and ad groups.
      3. Allocate a “budget” for each campaign based on my total budget of ${budget}.
      4. Suggest top 5 locations in ${region} to advertise.
      5. Recommend target age groups who have potential to convert.
      6. Provide 5 headlines (max 30 characters each) and 5 descriptions (max 90 characters each) for ad copy.
      7. Identify top competitors who are actively running sponsored for similar campaigns or categoried
    `;
    try {

      axios.post("https://api.confidanto.com/chatgpt/generate-ad",{prompt:prompt})
      .then(res=>{
        console.log("RES: ",res.data.response);

        setResultData(res.data.response);
        setIsLoading(false);

      })
      // const res = await fetch('https://api.confidanto.com/chatgpt/generate-ad', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ prompt }),
      // })

      // .then(res=>{
      //   console.log(res);
      //   if (!res.ok) {
      //     throw new Error('Failed to fetch response from server.');
      //   }
  
      //   if(res.ok){
      //     // console.log(res.text(),res.text().PromiseResult,res.text()[["PromiseResult"]])
      //     setIsLoading(false);
      //   }
      // })
      // .then(res=>{
        
      // })
      // const resultData = await res.json();
      // setKeywords(resultData.keywords);
      // setCampaigns(resultData.campaigns);
      // setBudgetAllocation(resultData.budgetAllocation);
      // setTopLocations(resultData.topLocations);
      // setAgeGroups(resultData.ageGroups);
      // setAdCopy(resultData.adCopy);
      // setCompetitors(resultData.competitors);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  console.log(foreCastData);
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
      console.log("Fetching subcategories for category:", categoryReqBody);

      axios
        .post("https://api.confidanto.com/fetch-subcategories", {
          category: categoryReqBody,
        })
        .then((res) => {
          console.log("Subcategories response:", res.data.subcategories);
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
  // const spendVsRevenueData = {
  //   labels: ["Jan", "Feb", "Mar", "Apr", "May"],
  //   datasets: [
  //     {
  //       label: "Spend",
  //       data: [5000, 7000, 6000, 8000, 7500], // Dummy data for spend
  //       backgroundColor: "#3b28cc",
  //     },
  //     {
  //       label: "Revenue",
  //       data: [15000, 17000, 16000, 18000, 17500], // Dummy data for revenue
  //       backgroundColor: "#2667ff",
  //     },
  //   ],
  // };

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
          Campaign Planning
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
                  className={`bg-[#070a74] ${isSearchDisabled
                      ? "bg-[#c9c9e7] text-white cursor-not-allowed"
                      : "bg-[#070a74] text-white cursor-pointer"
                    } ${!isSearchDisabled &&
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
              <div className="mt-6">
                <Pie data={pieData} />
                <Bar data={ageData} />
                <Bar data={spendVsRevenueData} />
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center mt-8 bg-white  h-auto rounded-lg p-2">
              <div className="max-w-[500px] ">
                <pre className="text-wrap">{resultData}</pre>
              </div>
            </div>
            //     {/* <img src={adsGif} alt="Ads GIF" className="max-w-full h-auto" /> */}
          )}
        </div>
      )}
    </div>
  );
}

export default CampaignPlanning;