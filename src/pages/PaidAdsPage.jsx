import React, { useState, useEffect, useRef } from "react";
import GoogleAdsIcon from "../data/Google_Ads_logo.png";
import BingAdsIcon from "../data/Bing_Ads_Icon.png";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../styles/CustomDateRangePicker.css";
import GoogleAdsTable from "./GoogleAdsTable";
import axios from "axios";
import {
  FaFilter,
  FaColumns,
  FaExpand,
  FaCompress,
  FaGripLines,
  FaLayerGroup,
} from "react-icons/fa";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link } from "react-router-dom";
import { IoIosArrowDown } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import ModifyColumns from "./Tools/ModifyColumns";


function PaidAdsPage() {
  const [currency, setCurrency] = useState("$");
  const [selectedPlatform, setSelectedPlatform] = useState("Google Ads");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [userBudget, setUserBudget] = useState({});

  const [columns, setColumns] = useState([ 
    {id:"0",title:"Id",visible:false,key:"project_id", category:"Project",isLocked:false},
    {id:"1",title:"Project",visible:true,key:"project_name", category:"Project",isLocked:true},
    {id:"2",title:"Remaining budget",visible:true,key:"remaining_budget", category:"Project",isLocked:false},
    {id:"3",title:"Impressions",visible:true,key:"impressions", category:"Metric",isLocked:false},
    {id:"4",title:"Clicks",visible:true,key:"clicks", category:"Metric",isLocked:false},
    {id:"5",title:"Conversions",visible:true,key:"conversions", category:"Metric",isLocked:false},
    {id:"6",title:"Costs",visible:true,key:"costs", category:"Metric",isLocked:false},
    {id:"7",title:"Ctr",visible:true,key:"ctr", category:"Metric",isLocked:false},
    {id:"8",title:"Interactions",visible:true,key:"interactions", category:"Metric",isLocked:false},
    {id:"9",title:"Avg Cpc",visible:false,key:"average_cpc", category:"Metric",isLocked:false},
    {id:"10",title:"Interaction Rate",visible:false,key:"interaction_rate", category:"Metric",isLocked:false},
    {id:"11",title:"Cost/Conv",visible:false,key:"cost_per_con", category:"Metric",isLocked:false},
    {id:"12",title:"Conversion Rate",visible:false,key:"conversion_rate", category:"Metric",isLocked:false},
])
  const [showColumnsMenu, setShowColumnsMenu] = useState(false)
  const [tableVisible, setTableVisible] = useState(true);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // If the item was dropped outside the list

    const updatedColumns = Array.from(columns);
    const [movedColumn] = updatedColumns.splice(source.index, 1);
    updatedColumns.splice(destination.index, 0, movedColumn);
    setColumns(updatedColumns);
  };
  
  const uniqueCategories = Array.from(
    new Set(columns.map((col) => col.category))
  );
  const ColumnItem = ({ column, index, toggleVisibility, category }) => {
    return (
      <div className="flex flex-row items-center justify-between  p-2 mb-1 rounded cursor-pointer bg-white shadow-sm hover:bg-slate-100">
        <div className="">
          <input
            type="checkbox"
            checked={column.visible}
            onChange={() => toggleVisibility(column.key)}
            className="mr-2"
            disabled={column.locked}
          />
          <span>{column.title}</span>
        </div>
        {category == "Custom Columns" && (
          <>
            <button
              // onClick={() => {
              //   deleteCustomColumn(column.id, column.title);
              // }}
            >
              <RiDeleteBin6Line />
            </button>
          </>
        )}
      </div>
    );
  };
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
    // Object.keys(total).forEach((key) => delete total[key]);
  };
  const [expandedCategory, setExpandedCategory] = useState(null);
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const applyChanges = () => {
    setShowColumnsMenu(false)
  }
  
  const cancelChanges = () => {
    setShowColumnsMenu(false)
  }


  
  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: "selection",
    },
  ]);
  function fetchAdGroupData(){
    console.log(state);
    fetchProjectData()
    toggleDatePicker()
  }

  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState({
    clientType: "all", // lead gen, revenue-based, all
    campaignType: "all", // e.g. search, display
    region: "all", // region filter
  });

  const [topBrands, setTopBrands] = useState([]); // for top spending brands

  const datePickerRef = useRef(null); // Reference for the datepicker container

  const email = localStorage.getItem("email");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://api.confidanto.com/fetch-project-budgets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            platform: selectedPlatform,
            filters: filters, 
          }),
        }
      );

      const data = await response.json();
      if (data && Array.isArray(data)) {
        const projects = data.map((project) => ({
          project: project.project_name,
          spend: "100",
          budget: project.project_budget,
          daily_spend_rate: "80%",
          impressions: "34,567",
          clicks: "236",
          cpc: "3.13",
        }));

        setTableData(projects);
        setTopBrands(data?.topBrands || []);
      } else {
        console.error("Unexpected data structure:", data);
        setTableData([]);
        setTopBrands([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTableData([]); 
      setTopBrands([]); 
    }
  };
  const [projectData, setProjectData] = useState([])
  const fetchProjectData = async () => {
    axios.post("https://api.confidanto.com/ads-overview-data",{
      email:localStorage.getItem("email"),
      start_date:format(state[0].startDate, "yyyy-MM-dd"),
      end_date:format(state[0].endDate, "yyyy-MM-dd"),
    }).then(res=>{
      console.log("Project Data: ",res);
      if(res.data[0].projects.length >=  1){
        let newProjectDataFormat = res.data[0].projects.map(item=>{

          let obj = {
            project_id:    item.project_id,
            project_name:    item.project_name,
            client_type:    item.client_type,

            average_cpc:    item.metrics.average_cpc,
            clicks:    item.metrics.clicks,
            conversion_rate:    item.metrics.conversion_rate,
            conversions:    item.metrics.conversions,
            cost_per_con:    item.metrics.cost_per_con,
            costs:    item.metrics.costs,
            ctr:    item.metrics.ctr,
            impressions:    item.metrics.impressions,
            interaction_rate:    item.metrics.interaction_rate,
            interactions:    item.metrics.interactions,
            remaining_budget:    item.metrics.remaining_budget,
          }
          return obj
        })
        console.log("item:",newProjectDataFormat);
        setProjectData(newProjectDataFormat)
      }
    }).catch(err=>{
      console.log("Project Data: ",err);
    })
  }

  useEffect(async() => {
    fetchData();
    fetchProjectData()
  }, [selectedPlatform, userBudget, filters]); // Fetch new data when filters change

  useEffect(() => {
    // Handle clicks outside of the datepicker
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const formatDateDisplay = (date) => {
    if (isToday(date)) {
      return `${format(date, "MMM dd, yyyy")}`;
      return `Today ${format(date, "MMM dd, yyyy")}`;
    } else if (isYesterday(date)) {
      return `${format(date, "MMM dd, yyyy")}`;
      return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    } else {
      return format(date, "MMM dd, yyyy")};
  };

  const formatButtonLabel = () => {
    const startDateLabel = formatDateDisplay(state[0].startDate);
    const endDateLabel = formatDateDisplay(state[0].endDate);

    if (startDateLabel === endDateLabel) return startDateLabel;

    return `${startDateLabel} - ${endDateLabel}`;
  };


  const [currClientType, setCurrClientType] = useState("All")

  const handleFilterChange = (e) => {
    console.log(e.target.value);
    setCurrClientType(e.target.value)
  };

  return (
    <div className="mb-60 overflow-y-visible h-full font-roboto ">
      <div className="bg-white m-4 rounded-lg shadow-md shadow-gray-500 py-8">
        <div className="flex items-center w-full justify-between mb-11">
          <img
            alt="Google Ads"
            src={GoogleAdsIcon}
            className="w-auto h-20 mx-2"
          />
          <h1 className="text-3xl mx-12 pb-2 mt-2 uppercase text-[#070a74] font-semibold text-center">
            Google Ads Overview
          </h1>
          <div className="flex items-center m-4 mr-8">
            <div className="relative" ref={datePickerRef}>
              <button
                onClick={toggleDatePicker}
                className="text-base border mr-2 border-gray-400 p-2 w-60"
              >
                {formatButtonLabel()}
              </button>
              {showDatePicker && (
                <div className="absolute z-10 mt-2 shadow-lg bg-white right-2">
                  <DateRangePicker
                    onChange={(item) => setState([item.selection])}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    ranges={state}
                    direction="horizontal"
                  />
                      <div className=" flex flex-row  justify-between items-center mb-2 mx-2">
                        <button
                          onClick={fetchAdGroupData} // Call API when dates are selected
                          className="bg-blue-500 text-white px-4 py-2 rounded text-center mt-2"
                        >
                          Apply
                        </button>
                      </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-row justify-between items-center space-x-4 mb-6 mx-12">
          <div>
            <select
              name="clientType"
              onChange={handleFilterChange}
              className="border p-2"
            >
              <option value="All">All Clients</option>
              <option value="Lead Gen">Lead Gen Clients</option>
              <option value="Revenue based">Revenue-Based Clients</option>
            </select>
            <select
              name="campaignType"
              // onChange={handleFilterChange}
              className="border p-2"
            >
              <option value="All">All Campaign Types</option>
              <option value="search">Search Campaigns</option>
              <option value="display">Display Campaigns</option>
            </select>
            <select
              name="region"
              // onChange={handleFilterChange}
              className="border p-2"
            >
              <option value="All">All Regions</option>
              <option value="north-america">North America</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
            </select>

          </div>

          <div className="columns relative">
            <button
              className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
              onClick={()=>{setShowColumnsMenu(!showColumnsMenu)}}
              >
                  <FaColumns className="ml-5" /> Columns
            </button>
            {showColumnsMenu && 
            
            <ModifyColumns
                  columns={columns}
                  setColumns={setColumns}
                  setTableVisible={setTableVisible}
                  setShowColumnsMenu={setShowColumnsMenu} 
                />

            }
          </div>
        </div>

        <div className="mt-6 mb-32 mx-12">
          <GoogleAdsTable

            projectData={projectData}
            columns={columns}
            error={false}
            clientType={currClientType}

            tableData={tableData}
            currency={currency}
            onSaveBudget={(newBudget) =>
              setUserBudget((prevBudget) => ({
                ...prevBudget,
                [newBudget.index]: newBudget.amount,
              }))
            }
          />
        </div>

        {/* Display Top Brands */}
        <div className="mt-6 mx-12">
          {/* <h2 className="text-2xl font-semibold">Top Spending Brands</h2> */}
          <ul>
            {topBrands.map((brand, index) => (
              <li key={index} className="my-2">
                {brand.name} - {currency}
                {brand.spend}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PaidAdsPage;