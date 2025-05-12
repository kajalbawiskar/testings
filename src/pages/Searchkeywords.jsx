import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaColumns,
  FaExpand,
  FaCompress,
  FaLayerGroup,
} from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import Switcher7 from "./Tools/Switcher";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoCodeSharp } from "react-icons/io5";
import ModifyColumns from "./Tools/ModifyColumns";
import Download from "./Components/Download";

import { MdOutlineSegment } from "react-icons/md";
import {
  fetchKeywordData,
  fetchKeywordCompareData,
  fetchKeywordGroupsData,
  fetchKeywordSegmentDeviceData,
  fetchKeywordSegmentClickTypeData,
  fetchKeywordSegmentTopVsOtherData,
  fetchKeywordSegmentNetworkData,
  fetchKeywordSegmentDateData,
} from "./Components/Keywords/KeywordsFetch";

const Searchkeywords = () => {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});
  const [totalShow, setTotalShow] = useState(true);

  const [segmentType, setSegmentType] = useState("default");
  const [random, setRandom] = useState(Math.random());

  const [dateGroupBy, setDateGroupBy] = useState("date");

  const toggleSegmentType = (segment, filterType) => {
    // segment is the value added to the setSegmentType
    // FilterType is where that segment is coming from (additional conditions can be applied depending where it's intiated)
    switch (filterType) {
      case "date":
      case "week":
      case "month":
        setDateGroupBy(filterType);
        setSegmentType(segment);
        break;
      default:
        setSegmentType(segment);
        break;
    }

    // re render
    setRandom(Math.random());
  };

  // Fetch With Date
  const fetchAdGroupData = () => {
    if (state.length > 1) {
      toggleSegmentType("compare", "date");
    } else {
      // toggleSegmentType("default", "date")
      setRandom(Math.random());
    }
  };

  useEffect(async () => {
    await fetchCustomColumns();
    await fetchGroups();
    setData([]);
    setColumns([]);
    setTotal({});

    switch (segmentType) {
      case "default":
        await fetchKeywordData(state, setColumns, setData, setTotal);
        break;
      case "compare":
        await fetchKeywordCompareData(state, setColumns, setData, setTotal);
        break;
      case "groups":
        await fetchKeywordGroupsData(
          state,
          setColumns,
          setData,
          setTotal,
          selectedGroupIds,
          SetSelectedGroupIds
        );
        break;
      case "date":
        await fetchKeywordSegmentDateData(
          state,
          setColumns,
          setData,
          setTotal,
          dateGroupBy
        );
        break;
      case "device":
        await fetchKeywordSegmentDeviceData(
          state,
          setColumns,
          setData,
          setTotal
        );
        break;
      case "network":
        await fetchKeywordSegmentNetworkData(
          state,
          setColumns,
          setData,
          setTotal
        );
        break;
      case "clicktype":
        await fetchKeywordSegmentClickTypeData(
          state,
          setColumns,
          setData,
          setTotal
        );
        break;
      case "topvsother":
        await fetchKeywordSegmentTopVsOtherData(
          state,
          setColumns,
          setData,
          setTotal
        );
        break;
      default:
        break;
    }
  }, [random]);

  const fetchCustomColumns = async () => {
    axios
      .post("https://api.confidanto.com/custom_columns/get-custom-columns", {
        email: localStorage.getItem("email"),
      })
      .then((res) => {
        let resData = res.data.data;
        let temp = resData.map((i) => {
          let obj = {
            id: i.id,
            title: i.custom_column,
            key: i.custom_column,
            visible: false,
            category: "Custom Columns",
          };
          console.log("ci", i);

          return obj;
        });
        console.log("temp: ", temp);

        setCustomColumns(temp);
        setColumns([...columns, ...temp]);
        setBackupColumns([...columns, ...temp]);
        console.log("custom columns: ", customColumns, columns);
      });
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id: localStorage.getItem("customer_id"),
        }
      );

      if (response.data.groups) {
        const groupsData = response.data.groups;
        setSavedGroups(groupsData);

        // Extract group IDs
        const names = groupsData.map((group) => group.group_name);
        setGroupNames(names);
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };

  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [backupColumns, setBackupColumns] = useState(columns);
  const [customColumns, setCustomColumns] = useState([]);
  const [NoDefaultDataColumns] = useState([
    "average_cpc_percent_diff",
    "clicks_percent_diff",
    "conversion_rate_percent_diff",
    "conversions_percent_diff",
    "cost_per_conversion_percent_diff",
    "costs_percent_diff",
    "ctr_percent_diff",
    "impressions_percent_diff",
    "interaction_rate_percent_diff",

    "status",
  ]);
  const [PercentColumns] = useState([
    "average_cpc_percent_diff",
    "clicks_percent_diff",
    "conversion_rate_percent_diff",
    "conversions_percent_diff",
    "cost_per_conversion_percent_diff",
    "costs_percent_diff",
    "ctr_percent_diff",
    "impressions_percent_diff",
    "interaction_rate_percent_diff",
  ]);

  const [tableVisible, setTableVisible] = useState(true);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();

  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: "selection",
    },
  ]);

  const [isGroupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [savedGroups, setSavedGroups] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroupIds, SetSelectedGroupIds] = useState([]);

  const handleGroupCheckboxChange = (e) => {
    let checkedId = e.target.value;
    console.log(checkedId, selectedGroupIds);
    if (e.target.checked) {
      SetSelectedGroupIds([...selectedGroupIds, checkedId]);
    } else {
      SetSelectedGroupIds(selectedGroupIds.filter((id) => id !== checkedId));
    }
  };

  function handleSelectDateRanges(ranges) {
    let key = Object.keys(ranges)[0]; //curr key
    let values = Object.values(ranges)[0]; //curr obj vals

    // Set Selection Date
    // if(key == "selection"){
    for (const i of state) {
      if (i.key == key) {
        i.startDate = values.startDate;
        i.endDate = values.endDate;
      }
    }
    setState(state);
  }

  function compareDateRanges() {
    let tempStates = state;

    if (state.length > 1) {
      setState([tempStates[0]]);
    } else {
      let newState = {
        startDate: new Date(year, month - 1, 1),
        endDate: new Date(year, month, 0),
        key: "compare",
      };

      setState([...tempStates, newState]);
    }

    console.log(state);
  }

  const datePickerRef = useRef(null);

  let segmentButtonRef = useRef(null);
  let FilterRef = useRef(null);
  let CategoryRef = useRef(null);
  let DownloadRef = useRef(null);
  let ColumnRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of the datepicker
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      if (FilterRef.current && !FilterRef.current.contains(event.target)) {
        // // Filter
        // setShowFilterDropdown(false)
        // setShowFilterDropdown(false);
        // hide if click on drop so off here
      }

      if (CategoryRef.current && !CategoryRef.current.contains(event.target)) {
        // // Category
        // setGroupDropdownVisible(false)
        setGroupDropdownVisible(false);
      }

      if (DownloadRef.current && !DownloadRef.current.contains(event.target)) {
        // // Download
        // setShowDownloadOptions(false)
        setShowDownloadOptions(false);
      }

      if (ColumnRef.current && !ColumnRef.current.contains(event.target)) {
        // // Columns
        // setShowColumnsMenu(false)
        setShowColumnsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [segmentBoxToggle, setSegmentBoxToggle] = useState(false);
  const [showViewBy, setShowViewBy] = useState(false);

  function closeModalBoxes(type) {
    setShowColumnsMenu(false);
    setShowDownloadOptions(false);
    setGroupDropdownVisible(false);
    setFilterBoxToggle(false);
    setSegmentBoxToggle(false);
    setShowDatePicker(false);

    if (type == "Date") {
      setShowDatePicker(!showDatePicker);
    } else if (type == "Segment") {
      setSegmentBoxToggle(!segmentBoxToggle);
    } else if (type == "Filter") {
      setFilterBoxToggle(!filterBoxToggle);
    } else if (type == "Category") {
      setGroupDropdownVisible(!isGroupDropdownVisible);
    } else if (type == "Download") {
      setShowDownloadOptions(!showDownloadOptions);
    } else if (type == "Column") {
      setShowColumnsMenu(!showColumnsMenu);
    }
  }

  const formatButtonLabel = () => {
    const { startDate, endDate } = state[0];

    // Check if start and end dates are in the same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      // Format as 'Nov 1 - 5, 2024'
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
    } else {
      // Format as 'Nov 1, 2024 - Dec 5, 2024' if they differ
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  // 404 Error
  let filterButtonRef = useRef(null);
  const [filterBoxToggle, setFilterBoxToggle] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [showCheck404Data, setShowCheck404Data] = useState(false);
  const [check404Data, setCheck404Data] = useState([]);
  const [error, setError] = useState(null);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      // Toggle the checked state
      const newCheckedState = !prevChecked;

      // Update the visibility based on the new state
      setShowCheck404Data(newCheckedState);
      setTableVisible(!newCheckedState);

      // Return the new checked state
      return newCheckedState;
    });
  };

  useEffect(() => {
    const fetch404Data = async () => {
      try {
        console.log(data);
        if (data.length === 0) return; // No data to process

        const response = await fetch(
          "https://api.confidanto.com/check-ads-404",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          const errorDetails = await response.text(); // Get more details on the error
          throw new Error(
            `HTTP error! status: ${response.status}. Details: ${errorDetails}`
          );
        }

        const result = await response.json();
        console.log(result);
        // Filter the data to keep only those with Page status 404

        // console.log("filteredData");
        // console.log(filteredData);
        const filteredData = result.filter(
          (item) => item["Page status"] === 404
        );
        // console.log(filteredData);

        // console.log(filteredData.length);

        // console.log("JNHGVFCDXSZDFGVHBJN");

        // const coombinedData = filteredData.map((item)=>{
        //   console.log();
        // })

        // console.log(coombinedData);
        // Combine the Final URLs, Descriptions, and Headlines into the Headlines field with styling
        const combinedData = filteredData.map((item) => ({
          ...item,
          headlines: [
            ...item.headlines.map(
              (headline) =>
                `<span class="text-blue-800 cursor-pointer"> ${headline} |</span> `
            ),
            ...item.final_urls.map(
              (url) =>
                `<br/> <span class="text-green-500 cursor-pointer"> ${url}</span> <br/>`
            ),
            ...item.descriptions.map(
              (description) =>
                `<span class="cursor-pointer"> ${description} </span>`
            ),
          ].join(" "),
        }));

        // console.log("COMBINED DATA")
        // console.log(combinedData);

        setCheck404Data(combinedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetch404Data();
  }, [data]);

  const transformPrimaryStatus = (primary_status) => {
    const words = primary_status.split("_");
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Asc Desc Buttons
  // true=Asc, False = Desc
  const [currentOrderType, setCurrentOrderType] = useState(true);
  const [currentOrderVariable, setCurrentOrderVariable] = useState(null);

  const toggleOrderType = () => {
    setCurrentOrderType(!currentOrderType);
  };
  const toggleCurrentOrderVariable = (type) => {
    setCurrentOrderVariable(type);
  };

  const changeOrderTypeCampaign = (type) => {
    // arrow ui
    if (type != currentOrderVariable) {
      toggleOrderType();
    }
    toggleOrderType();
    toggleCurrentOrderVariable(type);

    // sort data
    let temp = data;
    let tempDataValue = temp[0][type];

    console.log(
      type,
      currentOrderVariable,
      currentOrderType,
      tempDataValue,
      typeof tempDataValue
    );
    if (currentOrderType) {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => a[type] - b[type]);
      } else {
        data.sort((a, b) => a[type].localeCompare(b[type]));
      }
    } else {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => b[type] - a[type]);
      } else {
        data.sort((a, b) => b[type].localeCompare(a[type]));
      }
    }
    setData(temp);
  };

  const handleResize = (index, event) => {
    event.preventDefault();
    document.body.style.cursor = "col-resize";

    const startX = event.clientX;
    const startWidth = columns[index].width;

    const onMouseMove = (e) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), 50);
      setColumns((prevColumns) =>
        prevColumns.map((col, i) =>
          i === index ? { ...col, width: newWidth } : col
        )
      );
    };

    const onMouseUp = () => {
      document.body.style.cursor = "default";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const totalPages = Math.ceil(data.length / rowsPerPage);


   // 🛑 Defensive check before using .slice()
  const safeData = Array.isArray(data) ? data : [];

  // Get the current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = safeData.slice(indexOfFirstRow, indexOfLastRow);

  // Handle Rows Per Page Change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div
        className={`flex h-screen bg-white ${
          isFullScreen
            ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
            : "mb-16"
        }`}
      >
        <main className="flex-grow p-6 overflow-y-scroll">
          <div className="flex justify-end items-center mb-4">
            {/* <div className="text-2xl font-bold text-gray-700">Search keywords</div> */}
            <div className="flex space-x-2">
              <div className="relative" ref={datePickerRef}>
                <button
                  // onClick={toggleDatePicker}
                  onClick={() => {
                    closeModalBoxes("Date");
                  }}
                  className="text-base border mr-2 border-gray-400 p-2 w-60"
                >
                  {formatButtonLabel()}
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 shadow-lg bg-white right-2">
                    <DateRangePicker
                      // onChange={(item) => setState([item.selection])}
                      onChange={(e) => {
                        handleSelectDateRanges(e);
                      }}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={state}
                      direction="horizontal"
                      maxDate={new Date()}
                    />
                    <div className=" flex flex-row  justify-between items-center mb-2 mx-2">
                      <button
                        onClick={fetchAdGroupData} // Call API when dates are selected
                        className="bg-blue-500 text-white px-4 py-2 rounded text-center mt-2"
                      >
                        Apply
                      </button>

                      <Switcher7
                        onToggle={() => compareDateRanges()}
                        flag={state.length > 1}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="">
                <button
                  ref={segmentButtonRef}
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={() => {
                    closeModalBoxes("Segment");
                  }}
                >
                  <MdOutlineSegment cclassName="ml-5" /> Segment
                </button>
                {segmentBoxToggle && (
                  <div
                    className="absolute z-20 w-56 bg-white shadow-lg rounded-lg mt-2 p-4 border border-gray-200"
                    style={{
                      top:
                        segmentButtonRef.current?.offsetTop +
                        segmentButtonRef.current?.offsetHeight,
                      left: segmentButtonRef.current?.offsetLeft,
                    }}
                  >
                    <p className="p-2 text-sm text-gray-400">By</p>
                    <button
                      className="p-2 flex items-center hover:bg-gray-50 cursor-pointer w-full justify-between"
                      onClick={() => setShowViewBy(!showViewBy)}
                    >
                      View By{" "}
                      {showViewBy ? (
                        <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                      ) : (
                        <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                      )}
                    </button>

                    {showViewBy && (
                      <ul className="mx-2">
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("default", "segments");
                          }}
                        >
                          None
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("date", "date");
                          }}
                        >
                          Date
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("date", "week");
                          }}
                        >
                          Week
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("date", "month");
                          }}
                        >
                          Month
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("device", "segments");
                          }}
                        >
                          Device
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("network", "segments");
                          }}
                        >
                          Network
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("clicktype", "segments");
                          }}
                        >
                          Click Type
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            toggleSegmentType("topvsother", "segments");
                          }}
                        >
                          Top Vs Other
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                ref={filterButtonRef}
                // onClick={toggleFilterBox}
                onClick={() => {
                  closeModalBoxes("Filter");
                }}
              >
                <FaFilter className="ml-5" /> Add filter
              </button>
              {filterBoxToggle && (
                <div
                  className="absolute z-20 w-56 bg-white shadow-lg rounded-lg mt-2 p-4 border border-gray-200"
                  style={{
                    top:
                      filterButtonRef.current?.offsetTop +
                      filterButtonRef.current?.offsetHeight,
                    left: filterButtonRef.current?.offsetLeft,
                  }}
                  ref={FilterRef}
                >
                  <div className="mt-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                        className="form-checkbox"
                      />
                      <span>Check 404 Error</span>
                    </label>
                  </div>
                </div>
              )}

              <div className="relative" ref={CategoryRef}>
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  // onClick={() => setGroupDropdownVisible(!isGroupDropdownVisible)}
                  // onClick={()=>{toggleDropDownTabs("Category")}}
                  onClick={() => {
                    closeModalBoxes("Category");
                  }}
                >
                  <FaLayerGroup className="ml-5" />
                  Category
                </button>
                {isGroupDropdownVisible && (
                  <>
                    <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border w-64 border-gray-200">
                      <ul className="mx-2 h-56 overflow-y-auto">
                        <li
                          className="p-2 hover:bg-gray-100 cursor-pointer capitalize"
                          // onClick={() => handleGroupClick(null)}
                        >
                          All
                        </li>
                        {savedGroups.map((data, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100  capitalize space-x-2"
                          >
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              name=""
                              id=""
                              value={data.group_id}
                              onChange={(e) => handleGroupCheckboxChange(e)}
                            />
                            <span>{data.group_name}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 my-2 rounded-sm w-full"
                        onClick={() => {
                          toggleSegmentType("groups", "groups");
                        }}
                      >
                        Filter
                      </button>

                      <Link
                        to="/google-ads/campaign-groups"
                        className="p-2 flex items-center hover:bg-gray-50 cursor-pointer justify-between w-full"
                      >
                        Edit Groups
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <Download
                columns={columns}
                data={data}
                closeModalBoxes={closeModalBoxes}
                showDownloadOptions={showDownloadOptions}
                setShowDownloadOptions={setShowDownloadOptions}
                DownloadRef={DownloadRef}
              />
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <FaCompress className="ml-5" />
                ) : (
                  <FaExpand className="ml-5" />
                )}{" "}
                {isFullScreen ? "Collapse" : "Expand"}
              </button>

              <div className="relative" ref={ColumnRef}>
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  // onClick={openColumnsMenu}
                  onClick={() => {
                    closeModalBoxes("Column");
                  }}
                >
                  <FaColumns className="ml-5" /> Columns
                </button>
                {showColumnsMenu && (
                  <ModifyColumns
                    columns={columns}
                    setColumns={setColumns}
                    setTableVisible={setTableVisible}
                    setShowColumnsMenu={setShowColumnsMenu}
                  />
                )}
              </div>
            </div>
          </div>
          {tableVisible && (
            <div className="overflow-x-auto mb-10">
              <table className="min-w-full bg-white rounded-lg overflow-y-scroll shadow-md">
                <thead className="">
                  <tr className="bg-gray-200 text-sm leading-normal">
                    {columns
                      .filter((col) => col.visible)
                      .map((col, index) => (
                        <th
                          key={col.key}
                          style={{ width: col.width }}
                          onMouseDown={(e) => handleResize(index, e)}
                          className={`py-3 px-6 border-r-2 border-gray-300 text-left w-auto ${
                            col.sticky
                              ? "sticky left-0 bg-gray-200 z-10 shadow-md"
                              : ""
                          }`}
                        >
                          {/* <div
                            onMouseDown={(e) => handleResize(index, e)}
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200"
                        ></div> */}
                          <button
                            className="flex flex-row justify-between items-center w-full h-full"
                            onClick={() => {
                              changeOrderTypeCampaign(col.key);
                            }}
                          >
                            <h2 className=" whitespace-nowrap flex flex-row justify-between items-center font-bold">
                              {col.title}
                              {col.percentage_diff == true && (
                                <div className="mx-2">
                                  <IoCodeSharp />
                                </div>
                              )}
                            </h2>
                            {currentOrderVariable == col.key && (
                              <>
                                {currentOrderType ? (
                                  <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                                ) : (
                                  <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                                )}
                              </>
                            )}
                          </button>
                          <div
                            onMouseDown={(e) => handleResize(index, e)}
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-200"
                          ></div>
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {data.length > 0 ? (
                    currentData.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <td
                              key={col.key}
                              className={`py-3 px-6 border-r-2 border-gray-200 text-left w-auto ${
                                col.sticky
                                  ? "sticky left-0 bg-gray-100 z-10 shadow-md"
                                  : ""
                              }`}
                            >
                              {NoDefaultDataColumns.indexOf(col.key) == -1 &&
                                (Array.isArray(item[col.key])
                                  ? item[col.key].join(", ")
                                  : item[col.key])}

                              {PercentColumns.indexOf(col.key) != -1 ? (
                                <>
                                  {item[col.key] == null ? (
                                    <span>--</span>
                                  ) : (
                                    <>
                                      <span>{item[col.key] + "%"}</span>
                                    </>
                                  )}
                                </>
                              ) : null}

                              {col.key === "status" ? (
                                <td key={col.key} className="py-3 text-left">
                                  <div className="flex items-center">
                                    {item.status === "ENABLED" && (
                                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                    )}
                                    {item.status === "PAUSED" && (
                                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                    )}
                                    {item.status === "REMOVED" && (
                                      <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                    )}
                                    {/* {item.status.charAt(0).toUpperCase() +
                                      item.status.slice(1).toLowerCase()} */}
                                  </div>
                                </td>
                              ) : null}
                            </td>
                          ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td
                        colSpan={columns.filter((col) => col.visible).length}
                        className="py-3 px-6 text-center"
                      >
                        <div className="flex justify-center items-center h-40 mt-3">
                          {data.length===0?"Data is not available for this date range":
                          <LoadingAnimation />}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {totalShow && (
                  <tfoot>
                    <tr className="font-bold text-gray-700 bg-gray-100 w-full">
                      {() => {
                        Object.keys(total).forEach((key) => delete total[key]);
                      }}
                      {() => {
                        setTotal({});
                      }}
                      {() => {
                        Object.keys(total).forEach((key) => delete total[key]);
                      }}
                      {() => {
                        setTotal({});
                      }}

                      {columns
                        .filter((col) => col.visible)
                        .map((col) => {
                          total[col.key] = 0;
                        })}
                      {safeData.map((d) => {
                        Object.keys(d).forEach((val) => {
                          Object.keys(total).forEach((totalVal) => {
                            if (totalVal == val) {
                              total[val] = total[val] + d[val];
                            }
                          });
                        });
                      })}

                      {Object.entries(total).map((t, k) => {
                        let tempval = "";
                        let ignoreColumns = [
                          "id",
                          "customer_id",
                          "amount_micros",
                          "campaign_id",
                          "keyword_id",
                          "ad_group_id",
                        ];
                        if (typeof t[1] == "number") {
                          if (ignoreColumns.indexOf(t[0]) == -1) {
                            tempval = numberWithCommas(t[1].toFixed(2));
                          }

                          if (PercentColumns.indexOf(t[0]) != -1) {
                            tempval = String(tempval) + " %";
                          }
                        }
                        return (
                          <td className="py-3 px-6 text-left">{tempval}</td>
                        );
                      })}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}

          {showCheck404Data && (
            <div className="overflow-x-auto">
              {check404Data.length > 0 ? (
                <>
                  <h1 className="text-2xl text-center p-4 font-semibold">
                    URLs with 404 Error
                  </h1>

                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead className="sticky top-0 bg-gray-200 z-10">
                      <tr className="uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">Status Code</th>
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <th key={col.key} className="py-3 px-6 text-left">
                              {col.title}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {check404Data.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          <td className="py-3 px-6 text-left text-red-500 font-semibold">
                            {item["Page status"]}
                          </td>
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => (
                              <td
                                key={col.key}
                                className={`py-3 px-6 text-left ${
                                  col.key === "campaign" ||
                                  col.key === "ad_group_name"
                                    ? "text-blue-500"
                                    : ""
                                }`}
                              >
                                {col.key === "headlines" ? (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: item[col.key],
                                    }}
                                  />
                                ) : col.key === "primary_status" ? (
                                  <span>
                                    {transformPrimaryStatus(item[col.key])}
                                  </span>
                                ) : col.key === "status" ? (
                                  <span className="flex items-center justify-center">
                                    <span
                                      className={`w-2.5 h-2.5 rounded-full ${
                                        item[col.key] === "ENABLED"
                                          ? "bg-green-500"
                                          : item[col.key] === "PAUSED"
                                          ? "bg-gray-500"
                                          : ""
                                      }`}
                                    ></span>
                                  </span>
                                ) : Array.isArray(item[col.key]) ? (
                                  item[col.key].join(", ")
                                ) : (
                                  item[col.key]
                                )}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              ) : (
                <div className="flex justify-center items-center h-40 mt-8">
                  <h1 className="text-2xl text-center p-4">
                    No broken or 404 URLs found in your Ads.
                  </h1>
                </div>
              )}
            </div>
          )}
          <div className="flex justify-end items-center mt-4 font-serif p-3 rounded-lg">
            <div className="flex items-center space-x-2 mr-4">
              <label className="text-gray-700">Rows per page:</label>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded px-2 py-1"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center space-x-3">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className={`px-1 py-1 text-gray-700 rounded ${
                  currentPage === 1
                    ? " cursor-not-allowed"
                    : " hover:bg-gray-100"
                }`}
              >
                <FaChevronLeft />
              </button>
              <span className="text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className={`px-1 py-1 text-gray-700 font-bold rounded ${
                  currentPage === totalPages
                    ? " cursor-not-allowed"
                    : " hover:bg-gray-100"
                }`}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Searchkeywords;
