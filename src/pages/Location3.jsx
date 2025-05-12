import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaColumns, FaCompress, FaExpand } from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import { MdOutlineFileDownload, MdOutlineSegment } from "react-icons/md";
import { DateRangePicker } from "react-date-range";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaCaretRight } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";
import { IoIosArrowDown } from "react-icons/io";

import ModifyColumns from "./Tools/ModifyColumns";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

const Locations3 = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: new Date(2024, 8, 3),
      endDate: new Date(2024, 8, 25),
      // startDate: firstDayOfMonth,
      // endDate: today,
      key: "selection",
    },
  ]);

  let ColumnRef = useRef(null);

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [tableVisible, setTableVisible] = useState(true);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      id: "0",
      title: "Location",
      key: "name",
      visible: true,
      locked: true,
      isLocked: true,
    },
    {
      id: "1",
      title: "Impressions",
      key: "impressions",
      visible: true,
      locked: true,
      isLocked: false,
    },
    { id: "2", title: "Clicks", key: "clicks", visible: true, isLocked: false },
    {
      id: "3",
      title: "Cost",
      key: "costs",
      visible: true,
      locked: true,
      isLocked: false,
    },
    {
      id: "4",
      title: "Avg Cpc",
      key: "average_cpc",
      visible: false,
      isLocked: false,
    },
    {
      id: "5",
      title: "Conversions",
      key: "conversions",
      visible: false,
      isLocked: false,
    },
    { id: "6", title: "Ctr", key: "ctr", visible: false, isLocked: false },
    {
      id: "7",
      title: "Interactions",
      key: "interactions",
      visible: false,
      isLocked: false,
    },
    // { title: "Avg Cost", key: "average_cost", visible: true},
    // { title: "Avg Cpm", key: "average_cpm", visible: true},
    // { title: "Conversions by Clicks", key: "conversions_from_interactions_rate", visible: false},
    // { title: "Cost / Conversion", key: "cost_per_conversion", visible: false},
  ]);
  let [backupColumns, setBackupColumns] = useState(columns);

  let [total, setTotal] = useState({});
  let [showTotal, setShowTotal] = useState(true);

  let [locationType, setLocationType] = useState("country");
  let [parentLocation, setParentLocation] = useState("");
  let [parentLocationType, setParentLocationType] = useState("none");

  let [random, setRandom] = useState(Math.floor(Math.random() * 100) + 1);

  let [locationTypeArray, setLocationTypeArray] = useState([
    { id: 0, name: "country", priority: 0 },
    { id: 1, name: "state", priority: 1 },
    { id: 2, name: "city", priority: 2 },
  ]);

  let [narrowByArray, setNarrowByArray] = useState([
    { id: 0, locationType: null, locationParent: null },
    // {id:1, locationType:"State", locationParent:"India"},
    // {id:2, locationType:"City", locationParent:"Maharashta"},
    // {id:3, locationType:"Postal Code", locationParent:"Pune"},
  ]);

  function removeFromsetNarrowByArrowFunc() {
    console.log(
      "Before Removed element:",
      narrowByArray,
      narrowByArray.slice(0, -1)
    ); // Save or log the last element

    // Array Location Removal
    if (narrowByArray.length <= 1) return; // Handle the case where the array is empty

    // setNarrowByArray(prevItems => prevItems.slice(0, -1));
    setNarrowByArray((prevItems) => {
      if (prevItems.length === 0) return prevItems; // Prevents removing from an empty array
      return prevItems.slice(0, -1); // Returns a new array without the last element
    });
    // const newArray = narrowByArray.slice(0, -1); // Create a new array without the last element
    // setNarrowByArray(newArray);

    const lastElement = narrowByArray[narrowByArray.length - 2]; // Get the last element
    console.log("After Removed element:", lastElement, narrowByArray); // Save or log the last element

    if (
      lastElement.locationType == null ||
      lastElement.locationParent == null
    ) {
      ////console.log("Error Changing Parent or Location Type");
      // change Location Type
      setLocationType("country");
      //change Parent
      setParentLocation("all");
      setParentLocationType("none");
      // return 0
    } else {
      // change Location Type
      setLocationType(lastElement.locationType);
      //change Parent
      setParentLocation(lastElement.locationParent);

      // set parentlocationtype

      if (lastElement.locationType == "city") {
        setParentLocationType("state");
      } else if (lastElement.locationType == "state") {
        setParentLocationType("country");
      } else {
        setParentLocationType("country");
      }
    }

    // change random to use effect
    setRandom(Math.floor(Math.random() * 100) + 1);
  }

  const [age, setAge] = useState("");

  const handleSelectOptionChange = (event) => {
    //console.log(event.target.value)

    setLocationType(event.target.value);

    setRandom(Math.floor(Math.random() * 100) + 1);
    // setAge(event.target.value);
  };

  const NarrowLocationSelectOption = () => {
    let currLocation = locationTypeArray.filter(
      (item) => item.name == parentLocationType
    );

    //console.log("Select Drop DOwb: ",currLocation, parentLocationType)

    return (
      <>
        <FormControl fullWidth>
          {/* <InputLabel id="demo-simple-select-label">Scope</InputLabel> */}
          <Select
            // labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={locationType}
            // label="Age"
            onChange={handleSelectOptionChange}
          >
            {locationTypeArray.map((item) => {
              if (item.priority > currLocation[0].priority) {
                return (
                  <MenuItem value={item.name}>
                    {capitalizeFirstLetter(item.name)}
                  </MenuItem>
                );
              }
            })}
            {/* <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem> */}
          </Select>
        </FormControl>
      </>
    );
  };

  const handleNarrowByCityClick = async () => {
    const lastNarrow = narrowByArray[narrowByArray.length - 1];
  
    if (!lastNarrow.locationParent || lastNarrow.locationType !== "city") {
      alert("Please select a state to narrow by city.");
      return;
    }
  
    const selectedState = lastNarrow.locationParent;
  
    const requestBody = {
      customer_id: "4643036315",
      date_range: "LAST_30_DAYS",
      filter_by: "city",
      parent: {
        name: selectedState,
        type: "state",
      },
    };
  
    try {
      setLoading(true);
  
      const res = await fetch("https://api.confidanto.com/matched-location-narrow-by", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const cities = await res.json();
  
      if (!cities || cities.length === 0) {
        alert("No cities found for the selected state.");
        setData([]);
        return;
      }
  
      const formatted = cities.map((item) => {
        const row = { name: item.name };
        Object.entries(item.metrics || {}).forEach(([k, v]) => {
          row[k] = v;
        });
        return row;
      });
  
      setData(formatted); // Show city data in your table
      setColumns(backupColumns); // Reset column structure if needed
    } catch (err) {
      console.error("Error fetching city data:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const NarrowLocationDropDown = () => {
    let currLocation = locationTypeArray.filter(
      (item) => item.name == locationType
    );

    if (currLocation[0].priority >= 2) {
      return <></>;
    }
    return (
      <>
        {true && (
          <div
            className="absolute bg-white p-2 m-2 
          flex flex-col justify-center items-start 
          w-32 "
          >
            {locationTypeArray.map((item) => {
              if (item.priority > currLocation[0].priority) {
                return (
                  <button
                    className=" p-2  w-full hover:bg-slate-50"
                    onClick={() => {
                      ToggleLocationNarrowBy(item.name, parentLocation);
                    }}
                  >
                    <p>{capitalizeFirstLetter(item.name)}</p>
                  </button>
                );
              }
            })}
          </div>
        )}
      </>
    );
  };

  const ToggleLocationNarrowBy = (locationTypeInner, parentLocation) => {
    // setParentLocationTye to previous Location Type
    setParentLocationType(locationType);

    // change Location Type
    setLocationType(locationTypeInner);
    //change Parent
    let firstRowLocation = selectedRows[0]["campaign_name"];
    setParentLocation(firstRowLocation);

    // add to location History
    let obj = {
      id: narrowByArray.length,
      locationType: locationTypeInner,
      locationParent: firstRowLocation,
    };

    setNarrowByArray([...narrowByArray, obj]);

    // selections
    setSelectAll(false);
    setSelectedRows([]);

    // dropdown
    setNarrowByDropDown(false);

    // change random to use effect
    setRandom(Math.floor(Math.random() * 100) + 1);
  };

  // helper functions
  function capitalizeFirstLetter(str) {
    if (!str) return ""; // Handle empty strings
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function sortObjectsArray(arr, key, order = "asc") {
    return arr.sort((a, b) => {
      if (a[key] === undefined || b[key] === undefined) {
        throw new Error(`Key "${key}" does not exist in one of the objects.`);
      }

      const valueA = a[key];
      const valueB = b[key];

      if (typeof valueA === "string" && typeof valueB === "string") {
        // String comparison (case-insensitive)
        const comparison = valueA.localeCompare(valueB, undefined, {
          sensitivity: "base",
        });
        return order === "asc" ? comparison : -comparison;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        // Number comparison
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      throw new Error(
        "Unsupported data type for sorting. Ensure values are strings or numbers."
      );
    });
  }

  const customer_id = 4643036315;

  // matched
  function fetch_matched() {
    ////console.log("use Effect: ",
    //   locationType,
    //   parentLocation,
    //   random
    // );
    setLoading(true);
    setData([]);
    axios
      .post("https://api.confidanto.com/matched-location", {
        customer_id: "4643036315",
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
        filter_by: locationType, // default to city
      })
      .then((res) => {
        let locatoinArray = res.data[0];
        setLoading(false);
        if (locatoinArray == undefined) {
          setLoading(false);
          return;
        }
        let structuredData = locatoinArray.map((item) => {
          const output = { name: item.name };

          for (const [key, value] of Object.entries(item.metrics)) {
            output[key] = value;
          }
          return output;
        });

        setColumns(backupColumns);
        setData(structuredData);

        Object.keys(total).forEach((key) => delete total[key]);
        setTotal({});
        setShowTotal(true);
        //////console.log("structuredData: ",structuredData);

        setShowCheckBoxes(true);
      });
  }

  // Device
  const fetchDeviceData = () => {
    // newcols
    let newColumns = [
      { title: "Location", visible: true, id: 0, key: "state" },
      { title: "Device", visible: false, id: 1, key: "device" },
      { title: "Impressions", visible: true, id: 2, key: "impressions" },
      { title: "Clicks", visible: true, id: 3, key: "clicks" },
      { title: "Cost", visible: true, id: 3, key: "cost" },
      { title: "Conversions", visible: true, id: 4, key: "conversions" },
      { title: "Avg Cpc", visible: false, id: 5, key: "average_cpc" },
      {
        title: "Conversions rate",
        visible: false,
        id: 6,
        key: "conversions_from_interactions_rate",
      },
      {
        title: "Cost/conversion",
        visible: false,
        id: 7,
        key: "cost_per_conversion",
      },
      { title: "Ctr", visible: false, id: 8, key: "ctr" },
      {
        title: "Interaction rate",
        visible: false,
        id: 9,
        key: "interaction_rate",
      },
      { title: "Interactions", visible: false, id: 10, key: "interactions" },
    ];
    function addStateSubtotals(data) {
      // Helper to aggregate values
      const numericFields = [
        "average_cpc",
        "clicks",
        "conversions",
        "conversions_from_interactions_rate",
        "cost",
        "cost_per_conversion",
        "ctr",
        "impressions",
        "interaction_rate",
        "interactions",
      ];

      const stateTotals = {};

      // Step 1: Calculate totals for each state
      data.forEach((item) => {
        const { state } = item;

        if (!stateTotals[state]) {
          stateTotals[state] = {
            state: state,
            device: "TOTAL",
          };

          // Initialize numeric fields
          numericFields.forEach((field) => {
            stateTotals[state][field] = 0;
          });
        }

        // Aggregate numeric fields
        numericFields.forEach((field) => {
          stateTotals[state][field] += item[field];
        });
      });

      // Step 2: Combine original data with subtotal rows
      const outputData = [];
      const statesProcessed = new Set();

      data.forEach((item) => {
        outputData.push(item);

        if (!statesProcessed.has(item.state)) {
          statesProcessed.add(item.state);
          outputData.push(stateTotals[item.state]);
        }
      });

      return outputData;
    }

    function updateStateForNonTotalDevices(arr) {
      return arr.map((obj) => {
        if (obj.device !== "TOTAL") {
          return { ...obj, state: capitalizeFirstLetter(obj.device) };
        }
        return obj;
      });
    }

    function updateTotalForDevices(arr) {
      return arr.map((obj) => {
        if (obj.device == "TOTAL") {
          return { ...obj, device: "" };
        }
        return obj;
      });
    }

    function roundNumbersInObjects(arr) {
      return arr.map((obj) => {
        // Create a new object with modified numerical properties
        return Object.fromEntries(
          Object.entries(obj).map(([key, value]) => {
            // If value is a number, round it; otherwise, keep it unchanged
            if (typeof value === "number") {
              return [key, Math.round(value)];
            }
            return [key, value];
          })
        );
      });
    }

    // fetch
    setData([]);
    setLoading(true);
    setSegmentShow(false);

    axios
      .post("https://api.confidanto.com/matched-location-device-segment-data", {
        customer_id: "4643036315",
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
        filter_by: locationType,
      })
      .then((res) => {
        ////console.log("Device Fetch Location",res.data);
        let data = res.data;

        if (data) {
          let structuredData = [];
          for (const state in data) {
            for (const device in data[state]) {
              structuredData.push({
                state,
                device,
                ...data[state][device],
              });
            }
          }

          let newStructuredData = addStateSubtotals(structuredData);
          ////console.log("Structured Data",structuredData, newStructuredData);

          newStructuredData = sortObjectsArray(
            newStructuredData,
            "device",
            "desc"
          );
          newStructuredData = sortObjectsArray(
            newStructuredData,
            "state",
            "asc"
          );

          newStructuredData = updateStateForNonTotalDevices(newStructuredData);
          newStructuredData = roundNumbersInObjects(newStructuredData);

          setColumns(newColumns);
          setData(newStructuredData);

          Object.keys(total).forEach((key) => delete total[key]);
          setTotal({});
          setShowTotal(false);

          setShowCheckBoxes(false);

          setLoading(false);
        }
      })
      .catch((err) => {
        ////console.log("Device Fetch Location Error",err);
        setLoading(false);
      });
  };

  // Datewise
  const [selectDatewiseType, setSelectDatewiseType] = useState("year");
  const toggleDatewiseType = (type) => {
    setSelectDatewiseType(type);

    // call
    toggleSegmentChange("datewise");

    //
    setShowDatewiseType(false);
  };
  const [showDatewiseType, setShowDatewiseType] = useState(false);

  const fetchDatewiseData = () => {
    let newColumns = [
      { title: "Location", key: "location", visible: true },
      { title: "Date", key: "segment", visible: true },
      { title: "Avg Cpc", key: "average_cpc", visible: true },
      { title: "Clicks", key: "clicks", visible: true },
      { title: "Conversions", key: "conversions", visible: true },
      { title: "Impressions", key: "impressions", visible: true },
      { title: "Cost", key: "cost", visible: false },
      { title: "Cost/Conv", key: "cost_per_conversion", visible: false },
      { title: "Ctr", key: "ctr", visible: false },
      { title: "Interaction Rate", key: "interaction_rate", visible: false },
      { title: "Interactions", key: "interactions", visible: false },
    ];

    function transformData(input) {
      return {
        location:
          input.location?.state ||
          input.location?.city ||
          input.location?.country ||
          "",
        segment: input.segment || "",
        average_cpc: input.average_cpc || 0,
        clicks: input.clicks || 0,
        conversions: input.conversions || 0,
        impressions: input.impressions || 0,
        cost: input.cost || 0,
        cost_per_conversion: input.cost_per_conversion || 0,
        ctr: input.ctr || 0,
        interaction_rate: input.interaction_rate || 0,
        interactions: input.interactions || 0,
      };
    }

    setData([]);
    setLoading(true);

    axios
      .post("https://api.confidanto.com/matched-location-segment-data", {
        customer_id: "4643036315",
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
        group_by: selectDatewiseType, //date, week, month, quarter, year
        filter_by: locationType, //city, state
      })
      .then((res) => {
        let data = res.data;
        if (data) {
          let structuredData = data.map((item) => {
            ////console.log(item);
            return transformData(item);
          });
          ////console.log(structuredData);

          structuredData = sortObjectsArray(structuredData, "segment", "asc");
          structuredData = sortObjectsArray(structuredData, "location", "asc");

          setColumns(newColumns);
          setData(structuredData);

          setTotal({});
          setShowTotal(false);
          setShowCheckBoxes(false);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        ////console.log('Datesegment Location Error',err);
      });
  };

  // search
  const fetchPatternwiseData = () => {
    function flattenCampaignData(data) {
      const flatData = [];

      for (const location in data) {
        const types = data[location];

        for (const type in types) {
          const campaigns = types[type];

          campaigns.forEach((campaign) => {
            // Create a single flat object for the campaign
            const flattenedEntry = {
              location: location,
              type: type,
              ...campaign, // Merge all campaign metrics into this object
            };
            flatData.push(flattenedEntry);
          });
        }
      }

      return flatData;
    }

    let newColumns = [
      { title: "Location", key: "location", id: 1, visible: true },
      { title: "Type", key: "type", id: 2, visible: true },
      { title: "Cost", key: "cost", id: 8, visible: true },
      { title: "Campaign", key: "campaign_name", id: 4, visible: true },
      { title: "Clicks", key: "clicks", id: 5, visible: false },
      { title: "Avg Cpc", key: "average_cpc", id: 3, visible: false },
      {
        title: "Conversion Rate",
        key: "conversion_rate",
        id: 6,
        visible: false,
      },
      { title: "Conversions", key: "conversions", id: 7, visible: false },
      { title: "Cost/Conv", key: "cost_per_conversion", id: 9, visible: false },
      { title: "Ctr", key: "ctr", id: 10, visible: false },
      { title: "Impressions", key: "impressions", id: 11, visible: false },
      {
        title: "Interaction Rate",
        key: "interaction_rate",
        id: 12,
        visible: false,
      },
      { title: "Interactions", key: "interactions", id: 13, visible: false },
    ];

    setData([]);
    // setColumns(newColumns)
    setLoading(true);

    axios
      .post("https://api.confidanto.com/search-network-data", {
        customer_id: "4643036315",
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
      })
      .then((res) => {
        let data = res.data;
        if (data) {
          let structuredData = flattenCampaignData(data);

          setData(structuredData);
          setColumns(newColumns);
          //console.log(" search Location Data: ",res.data,structuredData)
        }

        setTotal({});

        Object.keys(total).forEach((key) => delete total[key]);
        setShowTotal(false);
        setShowTotal(true);
        setShowCheckBoxes(false);

        setLoading(false);
      })
      .catch((err) => {
        //console.log("Error in search Location", err)
        setLoading(false);
      });
  };

  const resetLocations = () => {
    setLocationType("country");
    setParentLocation("");
    setParentLocationType("none");
    setCurrentSegment("matched");

    setRandom(Math.floor(Math.random() * 100) + 1);
    setNarrowByArray([{ id: 0, locationType: null, locationParent: null }]);
    setSegmentShow(false);
  };

  const [currentSegment, setCurrentSegment] = useState("matched");
  const toggleSegmentChange = (type) => {
    setCurrentSegment(type);
    setSegmentShow(false);

    // setNarrowByArray([{id:0, locationType:null, locationParent:null}])

    setRandom(Math.floor(Math.random() * 100) + 1);
  };

  useEffect(() => {
    //console.log("useffect: ",locationType, parentLocation , "DatewiseType: ",selectDatewiseType)

    switch (currentSegment) {
      case "device":
        fetchDeviceData();
        break;

      case "datewise":
        fetchDatewiseData();
        break;

      case "search":
        fetchPatternwiseData();
        break;
      default:
        fetch_matched();
        break;
    }
  }, [random]);

  // Checkbox code
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showCheckBoxes, setShowCheckBoxes] = useState(true);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      const allSelectedRows = data.map((item, index) => ({
        id: index,
        campaign_name: item.name,
      }));
      setSelectedRows(allSelectedRows);
    } else {
      setSelectedRows([]);
    }
  };
  const handleCheckboxChange = (id, campaign_name) => {
    const isSelected = selectedRows.some((row) => row.id === id);

    //////console.log(id, campaign_name,isSelected,selectedRows);

    if (isSelected) {
      setSelectedRows(selectedRows.filter((row) => row.id !== id));
    } else {
      setSelectedRows([...selectedRows, { id, campaign_name }]);
    }
  };

  // Narrow by Drop Down
  let [narrowByDropDown, setNarrowByDropDown] = useState(false);

  const ColumnItem = ({ column, index, toggleVisibility }) => {
    return (
      <div className="flex items-center p-2 mb-1 rounded cursor-pointer bg-white shadow-sm">
        <input
          type="checkbox"
          checked={column.visible}
          onChange={() => toggleVisibility(column.key)}
          className="mr-2"
          disabled={column.locked}
        />
        <span>{column.title}</span>
      </div>
    );
  };

  const datePickerRef = useRef(null);
  const downloadData = (format) => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.title);
    const rows = data.map((item) => visibleColumns.map((col) => item[col.key]));

    if (format === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, { head: [headers], body: rows });
      doc.save("data.pdf");
    } else if (format === "csv" || format === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      if (format === "csv") {
        XLSX.writeFile(wb, "data.csv");
      } else {
        XLSX.writeFile(wb, "data.xlsx");
      }
    } else if (format === "xml") {
      const xmlContent = `
        <root>
          ${data
            .map(
              (item) => `
            <row>
              ${visibleColumns
                .map((col) => `<${col.key}>${item[col.key]}</${col.key}>`)
                .join("")}
            </row>
          `
            )
            .join("")}
        </root>
      `;
      const blob = new Blob([xmlContent], { type: "application/xml" });
      FileSaver.saveAs(blob, "data.xml");
    } else if (format === "google_sheets") {
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = `https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing`;
      window.open(url, "_blank");
      FileSaver.saveAs(blob, "data.csv");
    }

    setShowDownloadOptions(false);
  };
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
  };

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
  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const fetchAdGroupData = () => {
    setShowDatePicker(false);
    setRandom(Math.floor(Math.random() * 100) + 1);
  };

  // Buttons
  let [segmentShow, setSegmentShow] = useState(false);

  // Sorting function
  const sortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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
          {selectedRows.length >= 1 ? (
            <div
              className=" w-full   
            flex flex-row items-center justify-between
            p-4
            space-x-2 bg-gray-50 text-lg mb-4 rounded-md"
            >
              <div className="flex flex-row justify-start items-center space-x-4 ">
                <h2 className="self-start">{selectedRows.length} Selected</h2>

                <div className="relative  self-start ml-4">
                  <button
                    onClick={() => {
                      setNarrowByDropDown(!narrowByDropDown);
                    }}
                    className="flex flex-row justify-center items-center"
                  >
                    <h2>Narrow By </h2>
                    <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                  </button>

                  {narrowByDropDown && <NarrowLocationDropDown />}
                </div>
              </div>
              <div className="close self-end ml-auto ">
                <button
                  className="hover:text-white hover:bg-red-500 p-1 rounded-sm"
                  onClick={() => {
                    setSelectedRows([]);
                    setSelectAll(false);
                  }}
                >
                  <IoMdClose className="text-2xl" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-end items-center mb-4">
                <div className="flex space-x-2">
                  <div className="relative mt-2 items-center" ref={datePickerRef}>
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
                          maxDate={new Date()}
                        />
                        <button
                          onClick={fetchAdGroupData} // Call API when dates are selected
                          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button
                      className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                      onClick={() => {
                        setSegmentShow(!segmentShow);
                      }}
                    >
                      <MdOutlineSegment className="ml-5 text-2xl" /> Segment
                    </button>

                    {segmentShow && (
                      <div className="absolute z-20  w-40 bg-white shadow-lg rounded-md mt-2 p-2 border border-gray-200">
                        <button
                          className="reset w-full text-left  ml-1 hover:bg-slate-50 p-2 rounded-sm
                    "
                          onClick={resetLocations}
                        >
                          Reset
                        </button>
                        <button
                          className="device w-full text-left  ml-1 hover:bg-slate-50 p-2 rounded-sm
                    "
                          onClick={() => {
                            toggleSegmentChange("device");
                          }}
                        >
                          Device
                        </button>

                        <div
                          className="date relative w-full hover:bg-slate-50 p-2 rounded-sm 
                     cursor-pointer"
                        >
                          <div
                            className=" w-full  text-left  ml-1
                      flex flex-row  items-center"
                            onClick={() => {
                              setShowDatewiseType(!showDatewiseType);
                            }}
                          >
                            <h2 className="">Date</h2>
                            <p>
                              <FaCaretRight />
                            </p>
                          </div>
                          {showDatewiseType && (
                            <div
                              className="absolute -right-40 top-0 
                        flex flex-col justify-center  items-center 
                        w-36 bg-white shadow-lg rounded-md mt-2 p-2 border border-gray-200"
                            >
                              <button
                                className="device w-full text-left ml-2 mt-2 hover:bg-slate-50 p-2 rounded-sm"
                                onClick={() => {
                                  toggleDatewiseType("date");
                                }}
                              >
                                Date
                              </button>
                              <button
                                className="device w-full text-left  ml-2 hover:bg-slate-50 p-2 rounded-sm"
                                onClick={() => {
                                  toggleDatewiseType("week");
                                }}
                              >
                                Week
                              </button>
                              <button
                                className="device w-full text-left  ml-2 hover:bg-slate-50 p-2 rounded-sm"
                                onClick={() => {
                                  toggleDatewiseType("month");
                                }}
                              >
                                Month
                              </button>
                              <button
                                className="device w-full text-left  ml-2 hover:bg-slate-50 p-2 rounded-sm"
                                onClick={() => {
                                  toggleDatewiseType("quarter");
                                }}
                              >
                                Quarter
                              </button>
                              <button
                                className="device w-full text-left  ml-2 hover:bg-slate-50 p-2 rounded-sm"
                                onClick={() => {
                                  toggleDatewiseType("year");
                                }}
                              >
                                Year
                              </button>
                            </div>
                          )}
                        </div>
                        <button
                          className="device w-full text-left  ml-1 hover:bg-slate-50 p-2 rounded-sm
                    "
                          onClick={() => {
                            toggleSegmentChange("search");
                          }}
                        >
                          Search
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="relative">
                    <button className="bg-transparent text-gray-600 px-4 py-2  mt-1 rounded items-center hover:bg-slate-100">
                      <FaFilter className="ml-5 text-xl" />
                      Apply filter
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                      onClick={() =>
                        setShowDownloadOptions(!showDownloadOptions)
                      }
                    >
                      <MdOutlineFileDownload className="ml-5 text-2xl" />
                      Download
                    </button>
                    {showDownloadOptions && (
                      <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border border-gray-200">
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => downloadData("pdf")}
                        >
                          PDF
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => downloadData("csv")}
                        >
                          CSV
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => downloadData("excel")}
                        >
                          Excel
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => downloadData("xml")}
                        >
                          XML
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                          onClick={() => downloadData("google_sheets")}
                        >
                          Google Sheets
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative" ref={ColumnRef}>
                    <button
                      className="bg-transparent text-gray-600 px-4 py-2 mt-2 rounded items-center hover:bg-slate-100"
                      onClick={openColumnsMenu}
                      // onClick={()=>{closeModalBoxes("Column")}}
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

                  <div className="relative">
                    <button
                      className="bg-transparent text-gray-600 px-4 py-2 mt-1 rounded items-center hover:bg-slate-100"
                      onClick={toggleFullScreen}
                    >
                      {isFullScreen ? (
                        <FaCompress className="ml-5 text-xl" />
                      ) : (
                        <FaExpand className="ml-5 text-xl" />
                      )}{" "}
                      {isFullScreen ? "Collapse" : "Expand"}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {tableVisible && (
            <div className="overflow-x-auto">
              <div>
                {/* <p className="text-2xl font-semibold font-roboto">
                  {currentSegment == "matched"?"Locations":capitalizeFirstLetter(currentSegment)}
                </p> */}
                <div className="narrowByArray flex flex-col justify-center items-start p-2 text-xl ">
                  {/* {narrowByArray.length >= 2 && narrowByArray.map((item, index)=>{ */}
                  <div className="flex flex-row justify-start items-center">
                    {narrowByArray.length >= 1 &&
                      narrowByArray.map((item, index) => {
                        //console.log("locations items:", item, index, narrowByArray.length -1)
                        if (narrowByArray.length - 1 == index) {
                          return <></>;
                        }
                        return (
                          <>
                            <div className="flex flex-row space-x-1 justify-center items-center">
                              <p className="text-blue-500 text-lg">
                                {item.locationParent
                                  ? item.locationParent
                                  : "Location"}{" "}
                              </p>
                              {index != narrowByArray.length - 1 && (
                                <>
                                  <span>
                                    <FaAngleRight />
                                  </span>
                                </>
                              )}
                              {index == narrowByArray.length - 1 &&
                                index != 0 && (
                                  <button
                                    onClick={() => {
                                      removeFromsetNarrowByArrowFunc();
                                    }}
                                  >
                                    <IoMdClose />
                                  </button>
                                )}
                            </div>
                          </>
                        );
                      })}
                  </div>
                  {narrowByArray[narrowByArray.length - 1].locationParent !=
                    null && (
                    <div className="flex flex-col justify-center items-start w-52 ">
                      <div className="flex flex-row justify-between items-center  w-full">
                        <p className=" text-2xl">
                          {
                            narrowByArray[narrowByArray.length - 1]
                              .locationParent
                          }
                        </p>
                        <button
                          onClick={() => {
                            removeFromsetNarrowByArrowFunc();
                          }}
                          className="font-semibold text-3xl"
                        >
                          <IoMdClose />
                        </button>
                      </div>
                      <div className="w-full">
                        {/* <select name="" id="" className="w-full border-1 border-blue-100 p-2">
                        <option value="country">Country</option>
                        <option value="state">State</option>
                        <option value="city">City</option>
                      </select> */}
                        <NarrowLocationSelectOption />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <table className="min-w-full bg-white rounded-lg overflow-y-scroll shadow-md">
                <thead>
                  <tr className="bg-gray-200 text-sm leading-normal">
                    {showCheckBoxes && (
                      <th className=" py-3 px-6 text-left">
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />
                      </th>
                    )}
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <th
                          key={col.key}
                          onClick={() => handleSort(col.key)}
                          style={{ cursor: "pointer" }}
                          className="py-3 px-6 text-left"
                        >
                          {col.title}
                          {sortConfig.key === col.key && (
                            <span>
                              {sortConfig.direction === "asc" ? "🔼" : "🔽"}
                            </span>
                          )}
                        </th>
                      ))}
                  </tr>
                </thead>
                {data.length > 0 ? (
                  <>
                    <tbody className="text-gray-600 text-sm font-light">
                      {sortedData().map((item, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-200 hover:bg-gray-100 
                            ${
                              item["state"] != "Mobile" &&
                              item["state"] != "Desktop" &&
                              item["state"] != "Tablet"
                                ? ""
                                : "bg-slate-50"
                            }
                          `}
                        >
                          {showCheckBoxes && (
                            <td className="py-3 px-6 text-left">
                              <input
                                type="checkbox"
                                checked={selectedRows.some(
                                  (row) => row.id === index
                                )}
                                onChange={() =>
                                  handleCheckboxChange(index, item.name)
                                }
                              />
                            </td>
                          )}
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => (
                              <td key={col.key} className="py-3 px-6 text-left">
                                {col.key !== "status" &&
                                  (Array.isArray(item[col.key])
                                    ? item[col.key].join(", ")
                                    : item[col.key])}
                              </td>
                            ))}
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      {showTotal && (
                        <tr className="text-gray-700 font-semibold">
                          {currentSegment != "search" && (
                            <td className="px-4 py-2 ">Total</td>
                          )}
                          {() => {
                            Object.keys(total).forEach(
                              (key) => delete total[key]
                            );
                          }}
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => {
                              // //////console.log("KEY",col.key)
                              total[col.key] = 0;
                            })}
                          {data.map((d) => {
                            Object.keys(d).forEach((val) => {
                              Object.keys(total).forEach((totalVal) => {
                                if (totalVal == val) {
                                  if (val == "device") {
                                    if (d[val] == "TOTAL") {
                                      // if it's total of few rows, then dont count it in final total
                                      // only on device api
                                      ////console.log("TOTAL LOOP: ",totalVal, val,totalVal == val, d[val]);
                                      return;
                                    }
                                  }
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
                            ];
                            if (typeof t[1] == "number") {
                              if (ignoreColumns.indexOf(t[0]) == -1) {
                                tempval = numberWithCommas(t[1].toFixed(2));
                              }

                              // if (PercentColumns.indexOf(t[0]) != -1) {
                              //   tempval = String(tempval) + " %";
                              // }
                            }
                            return (
                              <td className="py-3 px-6 text-left">{tempval}</td>
                            );
                          })}
                        </tr>
                      )}
                    </tfoot>
                  </>
                ) : (
                  <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td
                      colSpan={columns.filter((col) => col.visible).length}
                      className="py-3 px-6 text-center"
                    >
                      {/* Display a message if no data matches the filters */}
                      {data.length === 0 && !loading ? (
                        <div className="py-10 text-gray-600">
                          No data available for the selected filters.
                        </div>
                      ) : (
                        <div className="flex justify-center items-center h-40 mt-3">
                          <LoadingAnimation />
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Locations3;
