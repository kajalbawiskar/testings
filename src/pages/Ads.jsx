import React, { useState, useEffect, useRef, useReducer } from "react";
import {
  FaFilter,
  FaSearch,
  FaColumns,
  FaExpand,
  FaCompress,
  FaGripLines,
  FaLayerGroup,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import LoadingAnimation from "../components/LoadingAnimation";
import { DateRangePicker } from "react-date-range";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import {
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";
import { MdOutlineSegment } from "react-icons/md";
import Switcher7 from "./Tools/Switcher";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

import { IoCodeSharp } from "react-icons/io5";

import CircularProgress from "@mui/material/CircularProgress";
import ModifyColumns from "./Tools/ModifyColumns";

import {
  fetchData,
  fetchAdsCompareData,
  fetchSegmentDeviceData,
  fetchSegmentNetworkData,
  fetchSegmentClickTypeData,
  fetchSegmentTopVsOtherData,
  fetchSegmentDateData,
  fetchAdsGroupTotal,
} from "./Components/Ads/AdsFetch";

import Download from "./Components/Download";

const Ads = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [columns, setColumns] = useState([]);

  const [ignoreMainColumns, setIgnoreMainColumns] = useState([
    "status",
    "headlines",
    "labels",
  ]);

  const [tempColumns, setTempColumns] = useState(columns);

  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showInitialData, setShowInitialData] = useState(true);
  const [adsDataOriginal, setAdsDataOriginal] = useState([]);
  const [adsDataOriginalDummy, setAdsDataOriginalDummy] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [check404Data, setCheck404Data] = useState([]);
  const [check404DataDummy, setCheck404DataDummy] = useState([]);

  const [showCheck404Data, setShowCheck404Data] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [random, setRandom] = useState(Math.random());

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

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const [isGroupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [savedGroups, setSavedGroups] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [totalShow, setTotalShow] = useState(true);

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

    //console.log(state)
  }

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

  const transformPrimaryStatus = (primary_status) => {
    const words = primary_status.split("_");
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Segment Data Change
  const [segmentType, setSegmentType] = useState("default");

  // Change Segments
  const changeGroupbyView = (segment, dateSegment = "none") => {
    let newObj = viewByObject;
    newObj.groupBy = dateSegment;
    setViewbyObject(newObj);

    setSegmentType(segment);
    setRandom(Math.random());
  };

  useEffect(() => {
    setData([]);
    switch (segmentType) {
      case "default":
        fetchData(state, setColumns, setData, setTotal, setError);
        break;
      case "compare":
        fetchAdsCompareData(
          state,
          setData,
          setShowDatePicker,
          setTotal,
          setColumns
        );
        break;
      case "groups":
        fetchAdsGroupTotal(
          state,
          setColumns,
          setData,
          setTotal,
          selectedGroupIds,
          SetSelectedGroupIds
        );
        break;
      case "segment_date":
        fetchSegmentDateData(
          state,
          setColumns,
          setData,
          setTotal,
          viewByObject
        );
        break;
      case "segment_device":
        fetchSegmentDeviceData(state, setColumns, setData, setTotal);
        break;
      case "segment_network":
        fetchSegmentNetworkData(state, setColumns, setData, setTotal);
        break;
      case "segment_clicktype":
        fetchSegmentClickTypeData(state, setColumns, setData, setTotal);
        break;
      case "segment_topvsother":
        fetchSegmentTopVsOtherData(state, setColumns, setData, setTotal);
        break;

      default:
        break;
    }

    getCustomColumns();
    fetchGroups();

    console.info("DATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA: ", data);
  }, [random]);

  const fetchAdGroupData = () => {
    if (state.length > 1) {
      changeGroupbyView("compare");
    } else {
      setRandom(Math.random()); // date changes for each segment
    }
  };

  //Custom Columns
  const getCustomColumns = async () => {
    axios
      .post("https://api.confidanto.com/custom_columns/get-custom-columns", {
        // email: "exampleuser@gmail.com"
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
          //console.log("ci",i)

          return obj;
        });
        setColumns([...columns, ...temp]);
        setTempColumns([...columns, ...temp]);
        //console.log("custom columns: ",customColumns, columns)
      });
  };

  const datePickerRef = useRef(null);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  let SegmentRef = useRef(null);
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

      if (SegmentRef.current && !SegmentRef.current.contains(event.target)) {
        // // Segment // toggleGroupListVisibility
        // setIsGroupListVisible(false)
        setIsGroupListVisible(false);
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

  function closeModalBoxes(type) {
    setShowColumnsMenu(false);
    setShowDownloadOptions(false);
    setGroupDropdownVisible(false);
    setShowFilterMenu(false);
    setIsGroupListVisible(false);
    setShowDatePicker(false);

    if (type == "Date") {
      setShowDatePicker(!showDatePicker);
    } else if (type == "Segment") {
      setIsGroupListVisible(!isGroupListVisible);
    } else if (type == "Filter") {
      setShowFilterMenu(!showFilterMenu);
    } else if (type == "Category") {
      setGroupDropdownVisible(!isGroupDropdownVisible);
    } else if (type == "Download") {
      setShowDownloadOptions(!showDownloadOptions);
    } else if (type == "Column") {
      setShowColumnsMenu(!showColumnsMenu);
    }
  }

  // 404 error
  useEffect(() => {
    const fetch404Data = async () => {
      try {
        //console.log(adsDataOriginal);
        if (adsDataOriginal.length === 0) return; // No data to process

        const response = await fetch(
          "https://api.confidanto.com/check-ads-404",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(adsDataOriginal),
          }
        );

        if (!response.ok) {
          const errorDetails = await response.text(); // Get more details on the error
          throw new Error(
            `HTTP error! status: ${response.status}. Details: ${errorDetails}`
          );
        }

        const result = await response.json();
        //console.log(result);
        // Filter the data to keep only those with Page status 404
        const filteredData = result.filter(
          (item) => item["Page status"] === 404
        );

        //console.log(filteredData.length);
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

        setCheck404Data(combinedData);
        setCheck404DataDummy(check404Data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetch404Data();
  }, [adsDataOriginal]);

  const formatButtonLabel = () => {
    const { startDate, endDate } = state[0];

    // Check if start and end dates are in the same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
    } else {
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
  };
  const handleFilterChange = (event) => {
    const value = event.target.value;
    setFilterStatus(typeof value === "string" ? value.split(",") : value);

    // use dummy to reset, use original to filter
    if (isChecked) {
      // 404
      const filtered404Data = check404Data.filter((item) =>
        value.includes(item.status)
      );
      if (filtered404Data.length <= 0) {
        alert("No data found 404");
      } else {
        setCheck404Data(filtered404Data);
      }
    } else {
      // data
      // Auto-apply filter after selection
      const filteredData = adsDataOriginal.filter((item) =>
        value.includes(item.status)
      );
      if (filteredData.length <= 0) {
        alert("No data found");
      } else {
        setData(filteredData);
      }
    }
  };

  let [total, setTotal] = useState({});

  const PercentColumns = [
    "impressions_percent_diff",
    "costs_percent_diff",
    "clicks_percent_diff",
    "conversion_percent_diff",
    "ctr_percent_diff",
    "conversion_rate_percent_diff",
    "cost_per_conv_percent_diff",
    "average_cpc_percent_diff",
  ];

  // 404 Error
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prevChecked) => {
      // Toggle the checked state
      const newCheckedState = !prevChecked;

      // Update the visibility based on the new state
      setShowCheck404Data(newCheckedState);
      setShowInitialData(!newCheckedState);

      // Return the new checked state
      return newCheckedState;
    });
  };

  const segmentButtonRef = useRef(null);
  const [isGroupListVisible, setIsGroupListVisible] = useState(false);
  const [ViewBySegmentVisible, setViewBySegmentVisible] = useState(false);

  const [showViewBy, setShowViewBy] = useState(false);

  today = new Date();
  let priorDate = new Date(today);
  priorDate.setDate(today.getDate() - 30);

  today = today.toJSON().slice(0, 10).replace(/-/g, "-");
  priorDate = priorDate.toJSON().slice(0, 10).replace(/-/g, "-");

  let [viewByObject, setViewbyObject] = useState({
    groupBy: "date",
    startDate: priorDate,
    endDate: today,
  });

  const changeDatebyView = (startdate, enddate) => {
    ////console.log("Date",startdate, enddate);

    let newObj = viewByObject;
    newObj.startDate = startdate;
    newObj.endDate = enddate;

    setViewbyObject(newObj);

    ////console.log(viewByObject);
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

  // Change Status

  const tableRef = useRef(null);
  const popupRef = useRef(null);

  const [currentStatus, setCurrentStatus] = useState("Null");
  const [currentAdId, setCurrentAdId] = useState(-1);

  const [statusLoading, setStatusLoading] = useState(false);

  const [popupData, setPopupData] = useState({
    isVisible: false,
    content: "",
    x: 0,
    y: 0,
  });
  const closePopup = () => {
    setPopupData({ isVisible: false, content: "", x: 0, y: 0 });
  };

  const openChangeStatusPopUp = (e, currentStatus, adId) => {
    // Enable Pop Up
    const rect = e.target.getBoundingClientRect(); // Get the position of the clicked cell
    setPopupData({
      isVisible: true,
      content: "DATA",
      x: rect.left + window.scrollX + rect.width / 2, // Center popup horizontally to cell
      y: rect.top + window.scrollY + rect.height + 5, // Place popup slightly below the cell
    });

    console.log("Status Button Clicked", currentStatus, adId);

    setCurrentStatus(currentStatus);
    setCurrentAdId(adId);
  };

  const changeStatusTo = async (newStatus) => {
    // Invalid ad id
    if (currentAdId == -1) {
      return;
    }

    setStatusLoading(true);

    console.log(newStatus, currentStatus, currentAdId);

    axios
      .post("https://api.confidanto.com/update-ad-group-ad", {
        customer_id: localStorage.getItem("customer_id"),
        ad_id: currentAdId,
        status: newStatus, //PAUSED, ENABLED
      })
      .then((res) => {
        setStatusLoading(false);
        setCurrentAdId(-1);
        setCurrentStatus("Null");
        closePopup();

        setRandom(Math.random());

        console.log("Status Changed", res);
      })
      .catch((err) => {
        console.log("Change Status Error", err);
      });
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        closePopup();
      }
    };

    const handleScroll = () => {
      closePopup();
    };

    if (popupData.isVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [popupData.isVisible]);

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get the current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData =
    data.length > 0 ? data.slice(indexOfFirstRow, indexOfLastRow) : data;

  // Handle Rows Per Page Change
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle Page Change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Formatting function
  const formatData = (key, value) => {
    const column = columns.find((col) => col.key === key);
    if (!column) return value;

    switch (column.format) {
      case "comma":
        return Number(value).toLocaleString();
      case "percentage":
        return `${value}%`;
      case "rupees":
        const numericValue = Number(value);
        return `₹${numericValue.toLocaleString()}`;
      default:
        return value;
    }
  };

  return (
    <div
      className={`flex h-screen bg-white ${
        isFullScreen
          ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
          : "mb-16"
      }`}
    >
      <main className="flex-grow p-6 overflow-auto">
        <div className="flex justify-end items-center mb-4">
          {/* <div className="text-2xl font-bold text-gray-700">Ads</div> */}
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
            <div className="relative" ref={SegmentRef}>
              <button
                ref={segmentButtonRef}
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                // onClick={handleSegmentClick}
                onClick={() => {
                  closeModalBoxes("Segment");
                }}
              >
                <MdOutlineSegment cclassName="ml-5" /> Segment
              </button>
              {isGroupListVisible && (
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
                          changeGroupbyView("default");
                        }}
                      >
                        None
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_date", "date");
                        }}
                      >
                        Day
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_date", "week");
                        }}
                      >
                        Week
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_date", "month");
                        }}
                      >
                        Month
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_device");
                        }}
                      >
                        Device
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_network");
                        }}
                      >
                        Network
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_clicktype");
                        }}
                      >
                        Click Type
                      </li>
                      <li
                        className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                        onClick={(e) => {
                          changeGroupbyView("segment_topvsother");
                        }}
                      >
                        Top vs Other
                      </li>
                    </ul>
                  )}
                </div>
              )}

              {/* <div className="relative" ref={FilterRef}> */}

              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                // onClick={toggleFilterMenu}
                onClick={() => {
                  closeModalBoxes("Filter");
                }}
              >
                <FaFilter className="ml-5" /> Add filter
              </button>
              {showFilterMenu && (
                <div
                  className="absolute right-0 mt-4 bg-white shadow-lg rounded-lg p-4 z-20 w-72"
                  ref={FilterRef}
                >
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      multiple
                      value={filterStatus}
                      onChange={handleFilterChange}
                      renderValue={(selected) => (
                        <div className="flex flex-wrap">
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={value}
                              className="m-1 bg-blue-100 text-blue-600"
                            />
                          ))}
                        </div>
                      )}
                      className="bg-gray-100 border rounded-lg"
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            "& .MuiMenuItem-root": {
                              padding: "8px 16px",
                              "&:hover": {
                                backgroundColor: "#f0f9ff",
                              },
                            },
                          },
                        },
                      }}
                    >
                      <MenuItem value="ENABLED">
                        <Checkbox
                          checked={filterStatus.indexOf("ENABLED") > -1}
                        />
                        ENABLED
                      </MenuItem>
                      <MenuItem value="PAUSED">
                        <Checkbox
                          checked={filterStatus.indexOf("PAUSED") > -1}
                        />
                        PAUSED
                      </MenuItem>
                    </Select>
                  </FormControl>
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
            </div>
            {/* </div> */}
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
                        changeGroupbyView("groups");
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
                  setTotal={setTotal}
                  setTotalShow={setTotalShow}
                />
              )}
            </div>
          </div>
        </div>
        {tableVisible && (
          <div className="overflow-auto h-full">
            {error ? (
              <div className="text-red-500 text-center">
                Error fetching data: {error}
              </div>
            ) : (
              <>
                {showInitialData && (
                  <div className="overflow-x-auto">
                    {data.length > 0 ? (
                      <>
                        <table
                          className="min-w-full bg-white rounded-lg overflow-y-auto shadow-md"
                          ref={tableRef}
                        >
                          <thead>
                            <tr className="bg-gray-200 normal-case text-sm leading-normal">
                              {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                  <th
                                    key={col.key}
                                    className="py-3 px-6 text-left w-auto "
                                  >
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
                                  </th>
                                ))}
                            </tr>
                          </thead>
                          <tbody className="text-gray-600 text-sm font-light">
                            {currentData.map((item, index) => (
                              <tr
                                key={index}
                                className={`border-1  border-gray-300`}
                              >
                                {columns
                                  .filter((col) => col.visible)
                                  .map((col) => (
                                    <td
                                      key={col.key}
                                      className="py-3 px-6 text-left w-auto"
                                    >
                                      {col.key === "headlines" ? (
                                        <span
                                          dangerouslySetInnerHTML={{
                                            __html: item[col.key],
                                          }}
                                        />
                                      ) : col.key == "labels" ? (
                                        <div className="flex flex-wrap gap-1">
                                          {item.labels &&
                                          item.labels.length > 0 ? (
                                            item.labels.map((label, idx) => (
                                              <div
                                                key={idx}
                                                className="flex items-center bg-gray-100 rounded-md pr-6 py-1 text-sm font-medium "
                                              >
                                                <div
                                                  className="w-2 h-full mr-2 rounded-l-md"
                                                  style={{
                                                    backgroundColor:
                                                      label.background_color ||
                                                      "#ccc",
                                                  }}
                                                ></div>
                                                <span className="text-gray-800 w-6 flex">
                                                  {label.label_name}
                                                </span>
                                              </div>
                                            ))
                                          ) : (
                                            <span className="text-gray-400 text-xs">
                                            </span>
                                          )}
                                        </div>
                                      ) : col.key === "status" ? (
                                        <div
                                          className="flex items-center cursor-pointer w-full h-full"
                                          onClick={(e) => {
                                            openChangeStatusPopUp(
                                              e,
                                              item.status,
                                              item.ad_id
                                            );
                                          }}
                                        >
                                          {item.status === "ENABLED" && (
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                          )}
                                          {item.status === "PAUSED" && (
                                            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                          )}
                                          {item.status === "REMOVED" && (
                                            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                          )}
                                        </div>
                                      ) : (
                                        formatData(col.key, item[col.key])
                                      )}
                                    </td>
                                  ))}
                              </tr>
                            ))}
                          </tbody>
                          {totalShow && (
                            <tfoot>
                              <tr className="font-bold text-gray-700 bg-gray-100 w-full">
                                {() => {
                                  Object.keys(total).forEach(
                                    (key) => delete total[key]
                                  );
                                }}
                                {() => {
                                  setTotal({});
                                }}
                                {() => {
                                  Object.keys(total).forEach(
                                    (key) => delete total[key]
                                  );
                                }}
                                {() => {
                                  setTotal({});
                                }}

                                {columns
                                  .filter((col) => col.visible)
                                  .map((col) => {
                                    total[col.key] = 0;
                                  })}
                                {data.map((d) => {
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
                                    "ad_id",
                                    "ad_group_id",
                                  ];
                                  if (typeof t[1] == "number") {
                                    if (ignoreColumns.indexOf(t[0]) == -1) {
                                      tempval = numberWithCommas(
                                        t[1].toFixed(2)
                                      );
                                    }

                                    if (PercentColumns.indexOf(t[0]) != -1) {
                                      tempval = String(tempval) + " %";
                                    }
                                  }
                                  return (
                                    <td className="py-3 px-6 text-left">
                                      {tempval}
                                    </td>
                                  );
                                })}
                              </tr>
                            </tfoot>
                          )}
                        </table>
                        {popupData.isVisible && (
                          <div
                            style={{
                              position: "fixed",
                              top: popupData.y - 50,
                              left: popupData.x + 70,
                              transform: "translate(-50%, 0)", // Center horizontally
                              backgroundColor: "white",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                              zIndex: 1000,
                              textAlign: "center",
                            }}
                            ref={popupRef}
                            className="py-4 rounded-md shadow-black flex flex-col justify-center items-center w-30"
                          >
                            {statusLoading && (
                              <div className="absolute ">
                                <CircularProgress />
                              </div>
                            )}

                            <div
                              className={`${
                                statusLoading
                                  ? " opacity-50 pointer-events-none"
                                  : ""
                              }`}
                            >
                              <button
                                className={`flex flex-row items-center p-2  w-full gap-2 
                                ${
                                  currentStatus == "ENABLED"
                                    ? "bg-gray-200 pointer-events-none"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  changeStatusTo("ENABLED");
                                }}
                              >
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <p className="text-left font-semibold text-sm">
                                  Enable
                                </p>
                              </button>

                              <button
                                className={`flex flex-row items-center p-2  w-full gap-2 
                                ${
                                  currentStatus == "PAUSED"
                                    ? "bg-gray-200 pointer-events-none"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  changeStatusTo("PAUSED");
                                }}
                              >
                                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                                <p className="text-left font-semibold text-sm">
                                  Pause
                                </p>
                              </button>
                              <button
                                className={`flex flex-row items-center p-2  w-full gap-2 pointer-events-none 
                                ${
                                  currentStatus == "REMOVED"
                                    ? "bg-gray-200 pointer-events-none"
                                    : "hover:bg-gray-50"
                                }`}
                                onClick={() => {
                                  changeStatusTo("REMOVED");
                                }}
                              >
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <p className="text-left font-semibold text-sm">
                                  Remove
                                </p>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center items-center h-40 mt-8">
                        <LoadingAnimation />
                      </div>
                    )}
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
                              <th className="py-3 px-6 text-left">
                                Status Code
                              </th>
                              {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                  <th
                                    key={col.key}
                                    className="py-3 px-6 text-left"
                                  >
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
                                          {transformPrimaryStatus(
                                            item[col.key]
                                          )}
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
              </>
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
          </div>
        )}
      </main>
    </div>
  );
};

export default Ads;