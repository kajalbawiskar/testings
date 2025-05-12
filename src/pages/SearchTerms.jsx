import React, { useState, useEffect, useRef } from "react";
import { FaFilter,  FaColumns, FaCompress, FaExpand , FaLayerGroup} from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import { MdOutlineFileDownload, MdOutlineSegment } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { IoCaretForwardSharp } from "react-icons/io5";
import SearchTermsViewBy from "./SearchTermsViewBy";
import axios from "axios";
import { Link } from "react-router-dom"; 
import { IoIosArrowDown } from "react-icons/io";
import ModifyColumns from "./Tools/ModifyColumns";
import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

const SearchTerms = () => {

  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);
  // const [loading, setLoading] = useState(false);

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isUserIntentView, setIsUserIntentView] = useState(false); // To toggle between views
  const [columns, setColumns] = useState([
    { title: "Search Term", key: "search_term", visible: true, locked: true, category:"Recommended" },
    { title: "Ad Group", key: "ad_group_name", visible: true, locked: true, category:"Recommended" },
    { title: "Campaign", key: "campaign_name", visible: true, locked: true, category:"Recommended" },
    { title: "Clicks", key: "clicks", visible: true, category:"Metric" },
    { title: "Impression", key: "impressions", visible: true, category:"Metric" },
    { title: "Conversion", key: "conversions", visible: true, locked: true, category:"Metric" },
    { title: "CTR", key: "ctr", visible: true, category:"Metric" },
    { title: "User Intent Type", key: "segment", visible: false , category:"Recommended"}, 
    { title: "Cost", key: "costs", visible: false , category:"Metric"}, 
    { title: "Account", key: "account", visible: true, category:"Recommended" },
  ]);

  const [backupColumns, setBackupColumns] = useState(columns)


  const [isFullScreen, setIsFullScreen] = useState(false);
  // Initialize state for totals
  const [totalImpressions, setTotalImpressions] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const [converion, setConverion] = useState(0);
  const [ctr, setCtr] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalCtr, setTotalCtr] = useState(0);
  const [total, setTotal] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  
  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: 'selection',
    },
  ]);


  
  const fetchGroups = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id: localStorage.getItem("customer_id") == "Not Connected"|| localStorage.getItem("customer_id") == null
            ? "4643036315"
            : localStorage.getItem("customer_id"),
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

  const [isGroupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [savedGroups, setSavedGroups] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const [totalShow,setTotalShow] = useState(true)
  const [selectedGroupIds, SetSelectedGroupIds] = useState([]);


  const handleGroupCheckboxChange = (e) => {
    let checkedId = e.target.value;
    console.log(checkedId,selectedGroupIds )
    if (e.target.checked) {
      SetSelectedGroupIds([...selectedGroupIds, checkedId]);
    } else {
      SetSelectedGroupIds(selectedGroupIds.filter((id) => id !== checkedId));
    }
  };

  function FilterClickButton(){
    console.log("SOmething");
    console.log("selectedGroupIds",selectedGroupIds)

    
    axios.post("https://api.confidanto.com/searchterm-grouped-metrics",{
        customer_id: localStorage.getItem("customer_id") == "Not Connected"
        ? "4643036315"
        : localStorage.getItem("customer_id"),
        email: localStorage.getItem("email"),
        group_ids: selectedGroupIds,
        start_date:  format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd") 
    }).then(res=>{

      // cols
      let groupColumns = [
        {id:0, title:"Group Name", key:"group_name",visible:true},
        {id:0, title:"Avg Cpc", key:"average_cpc",visible:true},
        {id:0, title:"Costs", key:"costs",visible:true},
        {id:0, title:"Ctr", key:"ctr",visible:true},
        {id:0, title:"Clicks", key:"clicks",visible:true},
        {id:0, title:"Impressions", key:"impressions",visible:true},
        {id:0, title:"Conversion Rate", key:"conversion_rate",visible:true},
        {id:0, title:"Conversions", key:"conversions",visible:true},
        {id:0, title:"Cost/Conv", key:"cost_per_conv",visible:true},
        // {id:0, title:"Avg Cpm", key:"average_cpm",visible:true},
      ]
      // data


      let tempData = res.data 

      let groupData = tempData.map(item=>{

        // "average_cpc": 15.42,
        //     "clicks": 61,
        //     "conversion_rate": 3.28,
        //     "conversions": 2,
        //     "cost_per_conv": 470.45,
        //     "costs": 940.9,
        //     "ctr": 1.42,
        //     "impressions": 4308
        let obj = {
        "group_name":item.group_name,
        "average_cpc": item.group_totals.average_cpc,
        "clicks": item.group_totals.clicks,
        "conversion_rate": item.group_totals.conversion_rate,
        "conversions": item.group_totals.conversions,
        "cost_per_conv": item.group_totals.cost_per_conv,
        "costs": item.group_totals.costs,
        "ctr": item.group_totals.ctr,
        "impressions": item.group_totals.impressions,
        // "average_cpm": item.group_totals.average_cpm,
        }
        console.log(item);

        return obj

      })

      
      Object.keys(total).forEach(

        (key) => {delete total[key]
        // console.log(key,total[key])
        // console.log(key,total[key])
      }
      );
      
      Object.keys(total).forEach(

        (key) => {delete total[key]
        // console.log(key,total[key])
        // console.log(key,total[key])
      }
      );

      setFilteredData(groupData)
      setColumns(groupColumns)
      setTotal({})
      setTotalShow(false)
      setTotalShow(true)
      setGroupDropdownVisible(false)
      SetSelectedGroupIds([])

      console.log("TOtla: ",tempData);

    
    })
    .catch(err=>{
      console.log(err);
    })

  }
  
  

  const [defaultColumns] = useState([...columns]); // Keep a default columns state for resetting
  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ brand: "All" }); // For brand and non-brand filtering
  const [showUserIntentMenu, setShowUserIntentMenu] = useState(false);
  const [userIntentFilters, setUserIntentFilters] = useState({
    informational: false,
    navigational: false,
    transactional: false,
    commercial: false,
    local: false,
  });
  const [userIntentTable,setUserIntentTable] = useState([])

  const [loading, setLoading] = useState(true);
  const [tempUserIntentFilters, setTempUserIntentFilters] = useState({
    informational: false,
    navigational: false,
    transactional: false,
    commercial: false,
    local: false,
  });

  useEffect(() => {
    setLoading(true);
    fetchGroups();
  
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" || !localStorage.getItem("customer_id")
        ? "7948821642"
        : localStorage.getItem("customer_id");
  
    const dummyApiUrl = "https://auth.confidanto.com/fetch_dummy/search_terms";
    const realApiUrl = "https://api.confidanto.com/search-term-data";
  
    const requestBody =
      customerId === "7948821642"
        ? {
            customer_id: "7948821642",
            start_date: startDate,
            end_date: endDate,
            limit: 1000,
            offset: 1000,
          }
        : {
            customer_id: customerId,
          };
  
    fetch(customerId === "4643036315" ? dummyApiUrl : realApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        const transformedData = customerId === "4643036315"
          ? data.map((item) => ({
              search_term: item.search_term,
              ad_group_name: item.ad_group || "",
              campaign_name: item.campaign || "",
              clicks: Number(item.account) || 0,
              impressions: Number(item.impressions) || 0,
              conversions: Number(item.conversions) || 0,
              ctr: parseFloat(item.campaign_type.replace("%", "")) || 0,
              costs: Number(item.cost) || 0,
              segment: categorizeSearchTerm(item.search_term),
              brand: item.search_term.toLowerCase().includes("brand")
                ? "Brand"
                : "Non-Brand",
              account: item.account || ""
            }))
          : data.map((item) => ({
              ...item,
              segment: categorizeSearchTerm(item.search_term),
              brand: item.search_term.toLowerCase().includes("brand")
                ? "Brand"
                : "Non-Brand",
            }));
  
        setData(transformedData);
        setFilteredData(transformedData);
        setTotal({});
        setTotalShow(false);
        setTotalShow(true);
        setBackupColumns(columns);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);
  



  const categorizeSearchTerm = (term) => {
    const lowerTerm = term.toLowerCase();
    if (
      lowerTerm.includes("reviews") ||
      lowerTerm.includes("how") ||
      lowerTerm.includes("which") ||
      lowerTerm.includes("where") ||
      lowerTerm.includes("what") ||
      lowerTerm.includes("comparison") ||
      lowerTerm.includes("why") ||
      lowerTerm.includes("does") ||
      lowerTerm.includes("purpose") ||
      lowerTerm.includes("user guide") ||
      lowerTerm.includes("tips") ||
      lowerTerm.includes("steps") ||
      lowerTerm.includes("not") ||
      lowerTerm.includes("for") ||
      lowerTerm.includes("about")
    ) {
      return "Informational Queries";
    }
    if (
      lowerTerm.includes("blog") ||
      lowerTerm.includes("pricing page") ||
      lowerTerm.includes("page") ||
      lowerTerm.includes("login") ||
      lowerTerm.includes("sign up")
    ) {
      return "Navigational Queries";
    }
    if (
      lowerTerm.includes("buy") ||
      lowerTerm.includes("subscribe") ||
      lowerTerm.includes("book") ||
      lowerTerm.includes("reserve")
    ) {
      return "Transactional Queries";
    }
    if (
      lowerTerm.includes("comparison") ||
      lowerTerm.includes("reviews") ||
      lowerTerm.includes("vs") ||
      lowerTerm.includes("versus") ||
      lowerTerm.includes("best") ||
      lowerTerm.includes("specifications") ||
      lowerTerm.includes("information")
    ) {
      return "Commercial Investigation Queries";
    }
    if (
      lowerTerm.includes("restaurants near me") ||
      lowerTerm.includes("dentist in") ||
      lowerTerm.includes("24-hour pharmacies")
    ) {
      return "Local Queries";
    }
    return "Uncategorized";
  };

  const applyFilters = () => {
    let filtered = data;
    // Apply brand filtering
    if (filter.brand !== "All") {
      filtered = filtered.filter((item) => item.brand === filter.brand);
    }

    const activeUserIntentFilters = Object.entries(userIntentFilters)
      .filter(([_, value]) => value)
      .map(([key, _]) => {
        switch (key) {
          case "informational":
            return "Informational Queries";
          case "navigational":
            return "Navigational Queries";
          case "transactional":
            return "Transactional Queries";
          case "commercial":
            return "Commercial Investigation Queries";
          case "local":
            return "Local Queries";
          default:
            return null;
        }
      })
      .filter(Boolean);

    //console.log(filtered,"KJHBGVFCEXRTFVGBHJ",activeUserIntentFilters)

    // Apply user intent filters
    if (activeUserIntentFilters.length > 0) {
      filtered = filtered.filter((item) =>
      {
        //console.log(item.segment,"segment");
        return activeUserIntentFilters.includes(item.segment)
      }
      );
    }

    //console.log("Filreddeakckna:    ",filtered);

    
    let tempTotalImp = 0
    let tempTotalClick = 0
    let tempTotalConv = 0
    let tempTotalCtr = 0
    
    let objArr = []
    activeUserIntentFilters.map((i)=>{

      let newImpr = 0
      let newCost = 0
      let newCtr = 0
      let newClick = 0


      console.log("sasasasa",i,filtered[0]);
      filtered.map((item)=>{
        if(item.segment == i){
          newImpr = newImpr + item.impressions
          newCost = newCost + item.costs
          newCtr = newCtr + item.ctr
          newClick = newClick + item.clicks
          //console.log(item,i);
        }
      })

      let newobj = {
        title: i,
        impressions: newImpr,
        cost: newCost,
        ctr: newCtr,
        clicks: newClick
      }

      // clicks}</td>
      //               <td className="py-3 px-6 text-left">{total.impressions}</td>
      //               <td className="py-3 px-6 text-left">{total.ctr}</td>
      //               <td className="py-3 px-6 text-left">{total.cost}</td>

      tempTotalImp = tempTotalImp + newImpr
      tempTotalClick = tempTotalClick + newClick
      tempTotalConv = tempTotalConv + newCost
      tempTotalCtr = tempTotalCtr + newCtr
      newImpr = 0
      newCost = 0
      newCtr = 0
      newClick = 0

      objArr.push(newobj)
    })
    // setTotalImpressions(tempTotalImp)
    // setTotalClicks(tempTotalClick)
    // setConverion(tempTotalConv)
    // setCtr(tempTotalCtr)

    setUserIntentTable(objArr)
    //console.log(userIntentTable);

    // setFilteredData(filtered);
  };

  useEffect(() => {
    const calculateTotals = () => {
      const totalImpressions = filteredData.reduce((sum, item) => sum + (item.impressions || 0), 0);
      const totalClicks = filteredData.reduce((sum, item) => sum + (item.clicks || 0), 0);
      const totalCost = filteredData.reduce((sum, item) => sum + (item.cost || 0), 0);
      const totalConverion = filteredData.reduce((sum,item) => sum + (item.converion || 0),0);
      const totalCtr = filteredData.reduce((sum,item)=> sum + (item.ctr || 0), 0 )


      setTotalImpressions(totalImpressions);
      setTotalClicks(totalClicks);
      setTotalCost(totalCost);
      setTotalCtr(totalCtr)
      setConverion(totalConverion)
      setCtr(totalCtr)
    };


    calculateTotals();
  }, [filteredData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserIntentChange = (e) => {
    const { name, checked } = e.target;
    setTempUserIntentFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const handleUserIntentSubmit = () => {
    setUserIntentFilters(tempUserIntentFilters);
    setShowUserIntentMenu(false);

    // Switch to User Intent columns
    setColumns([
      { title: "User Intent Type", key: "segment", visible: true },
      { title: "Clicks", key: "clicks", visible: true },
      { title: "Impressions", key: "impressions", visible: true },
      { title: "Ctr", key: "ctr", visible: true },
      { title: "Cost", key: "cost", visible: true },
    ]);
    setIsUserIntentView(true); // Toggle to user intent view
  };

  const toggleUserIntentMenu = () => {
    setShowUserIntentMenu(!showUserIntentMenu);
    setTempUserIntentFilters(userIntentFilters);
  };

  const revertToDefaultColumns = () => {
    setColumns(defaultColumns);
    setIsUserIntentView(false); // Toggle back to default view
  };
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
  useEffect(() => {
    applyFilters();
  }, [filter, userIntentFilters]);

  
  const formatDateDisplay = (date) => {
    if (isToday(date)) {
      return `Today ${format(date, "MMM dd, yyyy")}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };
  const formatButtonLabel = () => {
    const { startDate, endDate } = state[0];

    // Check if start and end dates are in the same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      // Format as 'Nov 1 - 5, 2024'
      return `${format(startDate, 'MMM d')} - ${format(endDate, 'd, yyyy')}`;
    } else {
      // Format as 'Nov 1, 2024 - Dec 5, 2024' if they differ
      return `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`;
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

  const segmentButtonRef = useRef(null)
  const [isUserIntentFilter,setIsUserIntentFilter] = useState(false)
  const [showViewBy, setShowViewBy] = useState(false);
  const [showViewByTable, setShowViewByTable] = useState(false);


  
  today = new Date();
  let priorDate = new Date(today);
  priorDate.setDate(today.getDate() - 30);

  today = today.toJSON().slice(0, 10).replace(/-/g, '-')
  priorDate = priorDate.toJSON().slice(0, 10).replace(/-/g, '-')


  const [groupBy,setGroupBy] = useState('date')
  const [viewByStartDate,setviewByStartDate] = useState(priorDate)
  const [viewByEndDate,setviewByEndDate] = useState(today)

  const changeGroupbyView = (newGroupBy) => {

    if(newGroupBy == 'none'){
      setTableVisible(true)
      setShowViewByTable(false)
    }else{
      setGroupBy(newGroupBy)
      setTableVisible(false)
      setShowViewByTable(true)
    }
  }


  const fetchAdGroupData = () => {

    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    setviewByStartDate(startDate)
    setviewByEndDate(endDate)

    // //console.log("dates:",viewByEndDate,viewByStartDate);

    let requestBody = {
      // customer_id: 4643036315,
      customer_id: localStorage.getItem("customer_id"),

    };

    if (startDate === endDate) {
      // Single date request
      requestBody = { ...requestBody, single_date: startDate };
    } else {
      // Custom date range request
      requestBody = { ...requestBody, start_date: startDate, end_date: endDate };
    }

    // changeDatebyView(startDate, endDate)
    // Fetch data based on selected date range
    fetch("https://api.confidanto.com/get-datewise-searchterms-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log("Fetched data:", responseData); // Log response in console

        const segmentedData = responseData.map((item) => ({
          ...item,
          segment: categorizeSearchTerm(item.search_term),
          brand: item.search_term.toLowerCase().includes("brand")
            ? "Brand"
            : "Non-Brand",
        }));
        setData(segmentedData); // Update the table data
        setFilteredData(segmentedData);
        setColumns(backupColumns)

         
      Object.keys(total).forEach(

        (key) => {delete total[key]
        // console.log(key,total[key])
        // console.log(key,total[key])
      })
      
      setTotal({})

      setTotalShow(false)
      setTotalShow(true)

        setShowDatePicker(false);


        applyFilters()

        // Change Date Format
        // dateFormatFunction(startDate, endDate)
        // setDateChanged(true)
      })
      .catch((error) => {
        console.error("Error fetching ad group data:", error);
      });
  };

  
  const [PercentColumns, SetPercentColumns] = useState(
    [
      "average_cpc_percent_diff",
      "clicks_percent_diff",
      "conversion_rate_percent_diff",
      "conversions_percent_diff",
      "cost_per_conversion_percent_diff",
      "costs_percent_diff",
      "ctr_percent_diff",
      "impressions_percent_diff",
      "interaction_rate_percent_diff"
    ]
  )
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  
  
  // Asc Desc Buttons 
  // true=Asc, False = Desc
  const [currentOrderType, setCurrentOrderType] = useState(true)
  const [currentOrderVariable, setCurrentOrderVariable] = useState(null)

  const toggleOrderType = () => {
    setCurrentOrderType(!currentOrderType)
  }
  const toggleCurrentOrderVariable = (type) => {
    setCurrentOrderVariable(type)
  }

  const changeOrderTypeCampaign = (type) => {
    // arrow ui
    if(type != currentOrderVariable){
      toggleOrderType()
    }
    toggleOrderType()
    toggleCurrentOrderVariable(type)

    
    // sort data
    let temp = data 
    let tempDataValue = temp[0][type]
    
    console.log(type,currentOrderVariable,currentOrderType,tempDataValue,typeof( tempDataValue));
    if(currentOrderType){
      if(typeof(tempDataValue) == 'number'){
        temp = temp.sort((a,b)=> a[type] - b[type])
      }else{
        data.sort((a, b) => a[type].localeCompare(b[type]));
      }
    }else{
      if(typeof(tempDataValue) == 'number'){
        temp = temp.sort((a,b)=> b[type] - a[type])
      }else{
        data.sort((a, b) => b[type].localeCompare(a[type]));        
      }
    }
    setData(temp)
  }
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Get the current page data
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

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
      <div className={`flex h-screen bg-white ${isFullScreen
        ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
        : "mb-16"
        }`}>
        <main className="flex-grow p-6 overflow-y-scroll">
          <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4 mb-4">
            <label className="block font-medium text-gray-700">Brand/Non-Brand:</label>
            <select
              name="brand"
              value={filter.brand}
              onChange={handleFilterChange}
              className="bg-white border border-gray-300 rounded  px-4 py-2"
            >
              <option value="All">All</option>
              <option value="Brand">Brand</option>
              <option value="Non-Brand">Non-Brand</option>
            </select>
          </div>
            <div className="flex space-x-2">
            <div className="relative items-center" ref={datePickerRef}>
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
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={() => setShowUserIntentMenu(!showUserIntentMenu)}
                ref={segmentButtonRef}

              >
                <MdOutlineSegment className="ml-5 text-2xl" /> Segment
              </button>

              {showUserIntentMenu && (
                <div className="absolute bg-white shadow-md rounded p-4 mt-12 z-20 border border-gray-200"
                      style={{
                        top:
                          segmentButtonRef.current?.offsetTop +
                          segmentButtonRef.current?.offsetHeight - 50,
                        left: segmentButtonRef.current?.offsetLeft,
                      }}
                >  
                  <div className="container">
                    <p className="p-2 text-sm text-gray-400">By</p>

                    <div className="allSearchTerms px-4 py-1">
                      <button
                        className="bg-transparent p-2  rounded flex items-start justify-start hover:bg-slate-100 w-full"
                        onClick={revertToDefaultColumns} // Revert back to default columns
                      >
                        Search Terms
                      </button>
                    </div>
                      
                    <div className="userIntent px-4 py-1">
                        <button className="bg-transparent p-2  rounded flex items-center justify-start hover:bg-slate-100 w-full" 
                        onClick={() => setIsUserIntentFilter(!isUserIntentFilter)}
                        >
                          User Intent <IoCaretForwardSharp className="ml-2" />
                        </button>
                        {isUserIntentFilter && 
                          <div className="px-4 py-2">
                            {/* <div className="font-bold mb-2 text-lg text-gray-700">User Intent</div> */}
                            <div className="flex flex-col space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="informational"
                                  checked={tempUserIntentFilters.informational}
                                  onChange={handleUserIntentChange}
                                  className="mr-2"
                                />
                                Informational Queries
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="navigational"
                                  checked={tempUserIntentFilters.navigational}
                                  onChange={handleUserIntentChange}
                                  className="mr-2"
                                />
                                Navigational Queries
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="transactional"
                                  checked={tempUserIntentFilters.transactional}
                                  onChange={handleUserIntentChange}
                                  className="mr-2"
                                />
                                Transactional Queries
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="commercial"
                                  checked={tempUserIntentFilters.commercial}
                                  onChange={handleUserIntentChange}
                                  className="mr-2"
                                />
                                Commercial Investigation Queries
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  name="local"
                                  checked={tempUserIntentFilters.local}
                                  onChange={handleUserIntentChange}
                                  className="mr-2"
                                />
                                Local Queries
                              </label>
                            </div>
                            <button
                              onClick={handleUserIntentSubmit}
                              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 w-full"
                            >
                              Filters
                            </button>
                          </div>
                        }
                      </div>

                      <div className="viewBySearchTerms px-4 py-1">
                        <button className="bg-transparent p-2 rounded flex items-center justify-start hover:bg-slate-100 w-full" onClick={() => setShowViewBy(!showViewBy)}>
                          View By <IoCaretForwardSharp className="ml-2" />
                        </button>
                        {showViewBy && 
                          <ul className="mx-2">
                              <li className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                              onClick={(e)=>{changeGroupbyView("none")}}
                              >None</li>
                              <li className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                              onClick={(e)=>{changeGroupbyView("date")}}
                              >Day</li>
                              <li className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                              onClick={(e)=>{changeGroupbyView("week")}}
                              >Week</li>
                              <li className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                              onClick={(e)=>{changeGroupbyView("month")}}
                              >Month</li>
                          </ul>
                        }
                      </div>

                    </div>
                  </div>
              )}
              {/* <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={revertToDefaultColumns} // Revert back to default columns
              >
                <AiOutlineFileSearch className="ml-5 text-2xl"/>
                Search Terms
              </button> */}

              {/* <button className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100">
                <FaFilter className="ml-5 text-xl" />
                Apply filter
              </button> */}
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
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
                
              <div className="relative">
                <button
                    className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                    onClick={() => setGroupDropdownVisible(!isGroupDropdownVisible)}
                    // onClick={()=>{toggleDropDownTabs("Category")}}

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
                          onClick={()=>{FilterClickButton()}}
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
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
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
              <div className="relative">
                  <button
                    className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                    onClick={openColumnsMenu}
                  >
                    <FaColumns className="ml-5 text-xl" /> Columns
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
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-y-scroll shadow-md">
                <thead>
                <tr className="bg-gray-200  text-sm leading-normal">
                    {columns.filter(col => col.visible).map(col => (
                      <th key={col.key} className="py-3 px-6 text-left  w-auto">
                          <button className="flex flex-row justify-between items-center w-full h-full"
                            onClick={()=>{changeOrderTypeCampaign(col.key)}}
                            >
                              <h2 className=" font-bold">
                                {col.title}
                              </h2>
                              {currentOrderVariable==col.key && 
                                <>
                                  {currentOrderType?
                                  <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                                  :
                                  <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                                  }
                                </>
                              }
                            </button>
                        </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                
                  {filteredData.length > 0 ? (

                    <>
                      {isUserIntentView ? (
                        <>
                          {userIntentTable.map((item,index)=>
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                              <td  className="py-3 px-6 text-left">{item.title}</td>
                              <td  className="py-3 px-6 text-left">{item.clicks}</td>
                              <td  className="py-3 px-6 text-left">{item.impressions}</td>
                              <td  className="py-3 px-6 text-left">{item.ctr.toFixed(2)}</td>
                              <td  className="py-3 px-6 text-left">{(item.cost / 1000000).toFixed(2)}</td>
                            </tr>
                          )}
                        </>
                      ):(
                        <>
                        {currentData.map((item, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            {columns.filter(col => col.visible).map(col => (
                              <td key={col.key} className="py-3 px-6 text-left">
                                {col.key !== "status" && (
                                  Array.isArray(item[col.key]) ? item[col.key].join(', ') : item[col.key]
                                )}
                                {/* Render the status cell */}
                                {col.key === "status" ? (
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
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()}
                                  </div>
                                ) : null}
                              </td>
                            ))}
                          </tr>
                        ))}
                        </>

                      )}         
                    </>



                  ) : (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td
                        colSpan={columns.filter((col) => col.visible).length}
                        className="py-3 px-6 text-center"
                      >
                        {/* Display a message if no data matches the filters */}
                        {filteredData.length === 0 && !loading ? (
                          <div className="py-10 text-gray-600">No data available for the selected filters.</div>
                        ) : (
                          <div className="flex justify-center items-center h-40 mt-3">
                            <LoadingAnimation />
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {isUserIntentView ? (
                  <tr className="font-bold text-gray-700 bg-gray-100">
                    
                    {() => {
                        // //console.log("gvyfctdxrdctfvygbhjk: ", total);
                        Object.keys(total).forEach(
                          (key) => delete total[key]
                        );
                        // //console.log("gvyfctdxrdctfvygbhjk: ", total);
                      }}
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => {
                          // ////console.log("KEY",col.key)
                          total[col.key] = 0;
                        })}
                      {userIntentTable.map((d) => {
                        Object.keys(d).forEach((val) => {
                          Object.keys(total).forEach((totalVal) => {
                            if (totalVal == val) {
                              total[val] = total[val] + d[val];
                            }
                          });
                        });
                      })}

                      {console.log("TOTAK:",total)}

                    <td className="py-3 px-6 text-left">Total</td>
                    <td className="py-3 px-6 text-left">{total.clicks}</td>
                    <td className="py-3 px-6 text-left">{total.impressions}</td>
                    <td className="py-3 px-6 text-left">{total.ctr}</td>
                    <td className="py-3 px-6 text-left">{(total.cost / 1000000).toFixed(2)}</td>

                      {/* <td className="py-3 px-6 text-left">{total.click}0</td>
                      <td className="py-3 px-6 text-left">{total.impr}</td>
                      {/* <td className="py-3 px-6 text-left">{(totalCost/1000000).toFixed(2)}</td> */}
                      {/* <td className="py-3 px-6 text-left">{total.ctr}0</td> */}
                      {/* <td className="py-3 px-6 text-left">{total.costs}0</td> */}
                    {/* <td ></td> */}
                  </tr>
                  ) : (

                    <>{totalShow && 
                    
                      <tr className="font-bold text-gray-700 bg-gray-100">
                        {/* <td className="py-3 px-6 text-left">Total</td>
                        <td className="py-3 px-6 text-left"></td>
                        <td className="py-3 px-6 text-left"></td>
                        <td className="py-3 px-6 text-left">{totalClicks}</td>
                        <td className="py-3 px-6 text-left">{totalImpressions}</td>
                        <td className="py-3 px-6 text-left">{converion}</td>
                        <td className="py-3 px-6 text-left">{ctr}</td> */}

                        {
                        ()=>{
                          // console.log("gvyfctdxrdctfvygbhjk: ",total);
                          Object.keys(total).forEach(key => delete total[key]);
                          // console.log("gvyfctdxrdctfvygbhjk: ",total);

                        }
                        }
                        {
                          columns.filter(col => col.visible).map(col => {
                            // //console.log("KEY",col.key)
                            total[col.key] = 0
                          })

                        }
                        {
                          filteredData.map(d => {
                            Object.keys(d).forEach(val => {
                              Object.keys(total).forEach(totalVal => {
                                if (totalVal == val) {
                                  total[val] = total[val] + d[val]
                                }
                              })
                            })
                          })
                        }

                        {
                          Object.entries(total).map((t, k) => {
                            //console.log("type",typeof(t[1]))
                            let tempval = ""
                            let ignoreColumns = ['id', 'customer_id', 'amount_micros','campaign_id','keyword_id','ad_group_id','account']
                            if (typeof (t[1]) == "number") {
                              if (ignoreColumns.indexOf(t[0]) == -1) {
                                tempval = numberWithCommas(t[1].toFixed(2))
                              }

                              if(PercentColumns.indexOf(t[0]) != -1){
                                tempval = String(tempval) + " %"
                              }
                            }
                            return <td className="py-3 px-6 text-left">{tempval}</td>
                          }
                          )

                        }
                      </tr>
                    }
                    </>
                  )}
                </tfoot>
              </table>
            </div>
          )}

          {showViewByTable && 
            <SearchTermsViewBy
            
            startDate={viewByStartDate}
            endDate={viewByEndDate}
            groupBy={groupBy}
            
            />
          }
          <div className="flex justify-end items-center mt-4 font-serif p-3 rounded-lg">
              <div className="flex items-center space-x-2 mr-4">
                  <label className="text-gray-700">Rows per page:</label>
                    <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                    </select>
              </div>
                          
             {/* Pagination Controls */}
              <div className="flex items-center space-x-3">
                <button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={`px-1 py-1 text-gray-700 rounded ${currentPage === 1 ? " cursor-not-allowed" : " hover:bg-gray-100"}`}
                >
                    <FaChevronLeft />
                </button>
                    <span className="text-gray-700">
                     Page {currentPage} of {totalPages}
                    </span>
                <button
                    disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={`px-1 py-1 text-gray-700 font-bold rounded ${currentPage === totalPages ? " cursor-not-allowed" : " hover:bg-gray-100"}`}
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

export default SearchTerms;