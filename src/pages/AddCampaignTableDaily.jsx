import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { enUS } from "date-fns/locale";
import { DateRangePicker } from "react-date-range";
import { generateInsightsParagraph } from "./ReportInitialParagraph"; // Import the updated function
import { IoMdClose } from "react-icons/io";
import DonutChartGroups from "./Charts/DonutChartGroups";
import { FaColumns, FaFilter } from "react-icons/fa";

import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Checkbox,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { format, isYesterday, isToday } from "date-fns";
import ModifyColumns from "./Tools/ModifyColumns";
import LoadingAnimation from '../components/LoadingAnimation';

function CampaignPage() {
  const [insightsParagraph, setInsightsParagraph] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [metricsData, setMetricsData] = useState([]);
  const [tableVisible, setTableVisible] = useState()
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const datePickerRef = useRef(null);
  const [tableElementArray, setTableElementArray] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const [customColumns, setCustomColumns] = useState([])

  

  let [channels, setChannels] = useState([])
  let [subChannels, setSubChannels] = useState([])
  let [category, setCategory] = useState([])
  useEffect(async()=>{
    await fetchGroups()
    await fetchChannels()

    console.log("states Channels: ", channels, "Sub Channels: ", subChannels, "Category: ", category)

    await fetchColumns()
  },[])

  const fetchColumns = () => {
    axios.post("https://api.confidanto.com/custom_columns/get-custom-columns",{email:localStorage.getItem("email")})
    .then(res=>{setCustomColumns(res.data.data)})
    .catch(err=>{console.log(err)})
  }

  const fetchGroups = async () => {
    try {
      const response = await axios.post('https://api.confidanto.com/campaign-group/fetch-groups', {
        email: localStorage.getItem("email"),
        customer_id: localStorage.getItem("customer_id"),
      });
      setGroupData(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const formatDateDisplay = (date) => {
    if (isToday(date)) {
      return `Today ${format(date, "MMM dd, yyyy")}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };
  

  const fetchMetricsData = async () => {
    try {
      const groupNames = selectedGroups.map(id => {
        const group = groupData.find(g => g.group_id === id);
        return group ? group.group_name : '';
      }).filter(name => name);

      const startDate = "2025-03-25"
      // format(state[0].startDate, "yyyy-MM-dd");
      const endDate = "2025-03-26"
      // format(state[0].endDate, "yyyy-MM-dd");

      let requestBody = {
        customer_id:localStorage.getItem("customer_id"),
        group_names: groupNames,
        email: localStorage.getItem("email")
      };

      if (startDate === endDate) {
        requestBody = { ...requestBody, single_date: startDate };
      } else {
        requestBody = { ...requestBody, start_date: startDate, end_date: endDate };
      }

      setIsLoading(true)
      const response = await axios.post('https://api.confidanto.com/get-grouped-campaign-metrics', requestBody);

      console.log("Response: ",response.data);

      const summarizedMetrics = response.data.metrics.map(group => {

        let totalObj = group.metrics[1].totals
        
        console.log("Total obj: ",totalObj);

        
        return {
          group_name: group.group_name,
          metrics: [totalObj]
        };
      });

      console.log("summarizedMetrics: ",summarizedMetrics);


      setMetricsData(summarizedMetrics);

      let currMetrics = {
        metricsData:summarizedMetrics,
        type:"table",
        customColumns:customColumns
      }

      setIsLoading(false)
      setTableElementArray([...tableElementArray,currMetrics])
      console.log("Array: ",tableElementArray,"curr metric",currMetrics)

    } catch (error) {
      console.error("Error fetching metrics data:", error);
    }
  };

  
  const fetchChartMetricsData = async () => {
    
      const groupNames = selectedGroups.map(id => {
        const group = groupData.find(g => g.group_id === id);
        return group ? group.group_name : '';
      }).filter(name => name);

      const startDate = format(state[0].startDate, "yyyy-MM-dd");
      const endDate = format(state[0].endDate, "yyyy-MM-dd");

      let requestBody = {
        customer_id: localStorage.getItem("customer_id"),
        group_names: groupNames,
        email: localStorage.getItem("email")
      };

      if (startDate === endDate) {
        requestBody = { ...requestBody, single_date: startDate };
      } else {
        requestBody = { ...requestBody, start_date: startDate, end_date: endDate };
      }

      setIsLoading(true)

      axios.post("https://api.confidanto.com/campaign-group/fetch-groups-metric-percentage",requestBody)
      .then((res)=>{
        console.log("metric data",res.data);  

        let groupNameLabels = res.data.filter(i=> groupNames.indexOf(i.group_name) != -1).map(i=>i.group_name)
        let filteredData = res.data.filter(i=> groupNames.indexOf(i.group_name) != -1)
        // console.log(impressionData);
        let currMetrics = {
          type:"chart",
          labels:groupNameLabels,
          data:filteredData
        }
  
        setIsLoading(false)
        setTableElementArray([...tableElementArray,currMetrics])

        console.log("CHART: ",currMetrics, "ARRAY: ",tableElementArray )
      })

  };


  const fetchChannels = async () => {
    console.log("Channels, Sub Channels, Categories")

    let [channels, subChannels, categories] = await Promise.allSettled(
      [
        fetchChannelss(),
        fetchSubChannels(),
        fetchCategory() 
      ]
    )
    // await fetchChannelss()
    // await fetchSubChannels()
    // await fetchCategory() 
    console.log("out of loop Channels: ", channels, "Sub Channels: ", subChannels, "Category: ", categories)



    async function fetchChannelss(){
      let rdata = []
      await axios.post("https://api.confidanto.com/channel/channel-campaign-metrics",{
        "customer_id": localStorage.getItem("customer_id"),
        "start_date": "2024-09-01",
        "end_date": "2025-01-02",
        "email": "sagarwaghmare587@gmail.com"
      }).then(res=>{
        let data = getGroupsTotal(res.data)
        console.log("Channels: ",res,"Formated Data: ",data)
        setChannels(data)
        rdata = data
      })

      return rdata
    }
    async function fetchSubChannels(){
      let rdata = []
      await axios.post("https://api.confidanto.com/sub-channel/sub-channel-campaign-metrics",{
        "customer_id": localStorage.getItem("customer_id"),
        "start_date": "2024-09-01",
        "end_date": "2025-01-02",
        "email": "sagarwaghmare587@gmail.com"
      }).then(res=>{
        let data = getGroupsTotal(res.data)
        console.log("Sub Channels: ",res,"Formated Data: ",data)
        setSubChannels(data)
        rdata = data
      })

      return rdata
    }
    async function fetchCategory(){
      let rdata = []

      await axios.post("https://api.confidanto.com/category/category-campaign-metrics",{
        "customer_id": localStorage.getItem("customer_id"),
        "start_date": "2024-09-01",
        "end_date": "2025-01-02",
        "email": "sagarwaghmare587@gmail.com"
      }).then(res=>{
        let data = getGroupsTotal(res.data)
        console.log("Category Channels: ",res,"Formated Data: ",data)
        setCategory(data)
        rdata = data
      })
      
      return rdata
    }

    function getGroupsTotal(data){
      let var1 = data.channels || data.sub_channel || data.categories

      let var2 = var1.map(item=>{
        return {
          id:item.channel_id || item.sub_channel_id || item.category_id,
          name:item.channel_name || item.sub_channel_name || item.category_name,
          total:item.campaigns_total[0].metric,
        }
      })

      return var2
    }
  }
  


  
  const [groupType, setGroupType] = useState("none")
  const handleFormSelect = (e) => {

    console.log("current selected: ",e.target.value)
    setGroupType(e.target.value)

    // clear other groups when selecting another channel, sub channel etc
    setSelectedGroups([])
  }
  // const handleGroupSelect = () => {
  //   fetchGroups();
  // };

  const formatButtonLabel = () => {
    const startDateLabel = formatDateDisplay(state[0].startDate);
    const endDateLabel = formatDateDisplay(state[0].endDate);

    return startDateLabel === endDateLabel ? startDateLabel : `${startDateLabel} - ${endDateLabel}`;
  };

  const handleMultiSelectChange = (event) => {
    setSelectedGroups(event.target.value);
  };

  const handleFetchDataClick = () => {
    // fetchMetricsData();
    setCreateSelectType("Table")
    setShowCalendarGroup(!ShowCalendarGroup)

  };
  const handleFetchChartDataClick = () => {
    // fetchChartMetricsData()
    setCreateSelectType("Chart")
    setShowCalendarGroup(true)
  }

  const [ShowCalendarGroup, setShowCalendarGroup] = useState(false)
  const [selectCreateType, setCreateSelectType] = useState("None")

  const onClickCreate = () =>{

    if(selectedGroups.length <= 0){
      return 
    }
    
    if(groupType == "group"){
      if(selectCreateType == "Table"){
        fetchMetricsData();
      }else if(selectCreateType == "Chart"){
        fetchChartMetricsData() 
      }else{
        alert("Select a group")
      }
    }else{


      
      if(selectCreateType == "Table"){
        fetchChannelMetricData()
      }else if(selectCreateType == "Chart"){
        fetchChannelChartData()
      }

    }

  }

  const fetchChannelMetricData = () => {
    setIsLoading(true)

    console.log("Type: ", groupType, " Selected Fields: ", selectedGroups)
    let newArray = []

    switch (groupType) {
      case "channel":
         newArray = channels.filter(item=> selectedGroups.indexOf(item.id) != -1)

        break;
      case "subchannel":
         newArray = subChannels.filter(item=> selectedGroups.indexOf(item.id) != -1)
      
        break;
      case "category":
         newArray = category.filter(item=> selectedGroups.indexOf(item.id) != -1)
      
        break;
      default:
        break;
    }

    let summarizedMetrics = newArray.map(group => {

      let totalObj = group.total
      
      console.log("Total obj: ",totalObj);

      
      return {
        group_name: group.name,
        metrics: [totalObj]
      };
    });


    let currMetrics = {
      metricsData:summarizedMetrics,
      type:"table",
      customColumns:customColumns
    }

            
    setIsLoading(false)
    setTableElementArray([...tableElementArray,currMetrics])
    console.log("Array: ",tableElementArray,"curr metric",currMetrics)

  }

  const fetchChannelChartData = () => {
    setIsLoading(true)

    console.log("Type: ", groupType, " Selected Fields: ", selectedGroups)
    let newArray = []

    switch (groupType) {
      case "channel":
         newArray = channels.filter(item=> selectedGroups.indexOf(item.id) != -1)

        break;
      case "subchannel":
         newArray = subChannels.filter(item=> selectedGroups.indexOf(item.id) != -1)
      
        break;
      case "category":
         newArray = category.filter(item=> selectedGroups.indexOf(item.id) != -1)
      
        break;
      default:
        break;
    }
    
    // let groupNameLabels = res.data.filter(i=> groupNames.indexOf(i.group_name) != -1).map(i=>i.group_name)
    // let filteredData = res.data.filter(i=> groupNames.indexOf(i.group_name) != -1)
    let groupNameLabels = newArray.map(item=>item.name)
    let filteredData = newArray.map(item=>item)
    // console.log(impressionData);
    let currMetrics = {
      type:"chart",
      labels:groupNameLabels,
      data:filteredData
    }

            
    setIsLoading(false)
    setTableElementArray([...tableElementArray,currMetrics])
    console.log("Array: ",tableElementArray,"curr metric",currMetrics)

    console.log("CHART: ",currMetrics, "ARRAY: ",tableElementArray )

  }

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  function removeArrayIndex(id){
    let confirm = window.confirm("Delete this Table?")
    if(confirm){
      setTableElementArray((curr) =>
      curr.filter((obj, index) => {
        return index != id;
      })
      );
    }
  }

  useEffect(()=>{
    console.log("refresh")
  },[tableElementArray.length])

  return (
    <div className="py-8  w-full">
      {/* Date Picker Section */}
      <div className="flex  my-4 space-x-6">
        <button variant="contained" onClick={handleFetchDataClick} 
        className=
        "w-40 font-bold rounded  shadow-md py-2 "
         color="primary" style={{ backgroundColor: "#283593", color: "white" }} 
        >
          Add Table
        </button>
      </div>

      {ShowCalendarGroup &&  
        <>
          <div className="calendar-selectgroup">
            <div className="flex flex-col ">
              <div className="relative flex ">
              </div>
            </div>
            <div className="flex flex-col w-full  mt-10 space-y-6">
              <FormControl className="">
                <InputLabel>Select Option</InputLabel>
                <Select onChange={(e) => handleFormSelect(e)} defaultValue="">
                  <MenuItem value="group">Group</MenuItem>
                  {/* <MenuItem value="audience">Audience</MenuItem>
                  <MenuItem value="gender">Gender</MenuItem> */}
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Group Selection */}
          {groupType == "group" ? (
            <div className="flex flex-col w-full mt-10 space-y-6">
              <FormControl className="">
                <InputLabel>Select Groups</InputLabel>
                <Select
                  multiple
                  value={selectedGroups}
                  onChange={handleMultiSelectChange}
                  renderValue={(selected) =>
                    selected.map((id) => {
                      const group = groupData.find((g) => g.group_id === id);
                      return group ? group.group_name : "";
                    }).join(", ")
                  }
                >
                  {groupData.map((group) => (
                    <MenuItem key={group.group_id} value={group.group_id}>
                      <Checkbox checked={selectedGroups.indexOf(group.group_id) > -1} />
                      <ListItemText primary={group.group_name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
            </div>
          )
          :groupType == "audience" ? (
            <></>
          )
          :<></>}

          {groupType != "none" && 
          <div className="flex  mt-8 space-x-6">
            <button variant="contained" 
            onClick={onClickCreate}
            className="w-40 font-bold rounded  shadow-md py-2 "
            color="primary" style={{ backgroundColor: "#283593", color: "white" }}>
              Create
            </button>
          </div>
          }

      </>}

      

      <div className="data-container my-5">
        {
          isLoading ? 
          <LoadingAnimation />
          :

          tableElementArray.map((item, index)=>{
            if(item.type == "table"){
              return <>
                <TableElement 
                metricsData={item.metricsData} 
                arrayIndex={index}
                removeArrayIndex={removeArrayIndex}
                customColumns={item.customColumns}
                />
              </>
            }else{
              return <>

                <DonutChartGroups 
                labels={item.labels}
                data={item.data}
                arrayIndex={index}
                removeArrayIndex={removeArrayIndex}
                />

              </>
            }

          })
        }
      </div>
      
    </div>
  );
}

function TableElement(props){

  const [currencySymbol,setCurrencySymbol] = useState("Rs ")
  // console.log(props.metricsData);
  const [insightsParagraph, setInsightsParagraph] = useState("");
  
  const flags = {
    cost: true,
    impressions: true,
    clicks: true,
    ctr: true,
    conversions: true,
  };
  
  const reportData = {
    totalCost: 10000,
    totalCostPer: 5,
    impr_current: 5000,
    impr_previous: 4500,
    clicks_current: 200,
    clicks_previous: 180,
    totalCtr: 4,
    totalConversions: 50,
    totalCostPerConv: 200,
  };


  function getTotalMetricsForCampaigns(){
    console.log(props.metricsData);

    let totalObj = {
      "clicks": 0,
      "impressions": 0,
      "ctr": 0,
      "conversions": 0,
      "cost": 0,
      "avg_cpc": 0,
      "conversion_rate": 0,
      "cost_per_conversion": 0
    }

    let tempData = props.metricsData.map((item)=>{

      // let currMetric = 
      Object.entries(item.metrics[0]).map((k,v)=>{
        totalObj[k[0]] = totalObj[k[0]]+k[1]
        // console.log(k,v);
      })

      console.log(totalObj);
        
    
      // console.log(item,item.metrics[0])
    })

    return reportData
  }

  const handleGenerateInsights = () => {
    generateInsightsParagraph(getTotalMetricsForCampaigns(), setInsightsParagraph, flags);
  };

  const [columns, setColumns] = useState([
    {id:"0",title:"Group Name"         , key:"group_name",   visible:true, category: "Recommended"},
    {id:"1",title:"Clicks"       , key:"clicks",   visible:true, category: "Recommended"},
    {id:"2",title:"Impressions"  , key:"impressions",   visible:true, category: "Recommended"},
    {id:"3",title:"Avg CTR"            , key:"ctr",   visible:true, category: "Recommended"},
    {id:"4",title:"Conversions"  , key:"conversions",   visible:true, category: "Recommended"},
    {id:"5",title:"Cost"         , key:"costs",   visible:true, category: "Recommended"},
    {id:"6",title:"Avg CPC"            , key:"average_cpc",   visible:true, category: "Recommended"},
    {id:"7",title:"Conversion Rate"    , key:"conversion_rate",   visible:true, category: "Recommended"},
    {id:"8",title:"Cost per Conversion", key:"cost_per_conversion",   visible:true, category: "Recommended"}  
  ])

  useEffect(()=>{

    if(props.customColumns.length > 0){
      let customColumnsArr = props.customColumns.map(data=>{
        return {
          title:data.custom_column,
          key:data.custom_column,
          visible:false
        }
      })

      console.log("Custom COlumns: ",customColumnsArr);

      setColumns([...columns,...customColumnsArr])

    }

    console.log("Custom COlumns: ",props.customColumns,columns);
  },[])

  let fixedToColumns = ["ctr","costs","average_cpc","conversion_rate","cost_per_conversion"]
  let numberColumns = ['clicks','impressions']
  let currencyColumns = ['costs']

  const [showColumnsMenu,setShowColumnsMenu] = useState(false)
  const modifyColumnButtonRef = useRef(null)

  
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

  
  
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
    {/* Metrics Table */}
    <div className='flex items-center justify-between mt-10'>
              <h3></h3>
              <div className='flex space-x-2 relative'>
                {/* <button
                    className=" px-4 py-2 rounded "
                    style={{ backgroundColor: "#283593", color: "white" }}
                    onClick={()=>{setShowColumnsMenu(!showColumnsMenu)}}
                    ref={modifyColumnButtonRef}
                >
                  Edit Columns
                </button> */}
                {/* {
                  showColumnsMenu && 
                  <div className="absolute right-10 top-10  bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-800 max-w-3xl border border-gray-200">
                        <div className=" flex justify-between items-center">
                          <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700">
                            Modify columns for Campaigns
                          </div>
                        </div>

                        <div className="grid grid-rows-2 gap-6 max-h-screen">
                          <div className="">
                            <div>
                              <div className="font-semibold overflow-x-auto mb-2 text-gray-700">
                                Recommended columns
                              </div>
                              <div className="grid bg-scroll  grid-cols-5 space-x-3 space-y-2">
                                {columns
                                  .filter((col) => !col.locked && !col.section)
                                  .map((col, index) => (
                                    <ColumnItem
                                      key={col.key}
                                      column={col}
                                      index={index}
                                      toggleVisibility={toggleColumnVisibility}
                                    />
                                  ))}
                              </div>
                            </div>
                            
                            <div className="flex space-x-2 pt-1 mt-2">
                              <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={applyChanges}
                              >
                                Apply
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={cancelChanges}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                } */}
                <button
                                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                                // onClick={openColumnsMenu}
                                onClick={()=>{
                                  setShowColumnsMenu(!showColumnsMenu)
                                }}
                              >
                                <FaColumns className="ml-5" /> Columns
                              </button>
                
                              <div className=" absolute -top-2">
                                {showColumnsMenu && (
                                  <ModifyColumns
                                    columns={columns}
                                    setColumns={setColumns}
                                    // setTableVisible={setTableVisible}
                                    setShowColumnsMenu={setShowColumnsMenu}
                                  />
                                )}
                              </div>
                              
                <button className='p-2 text-lg text-bold bg-red-500 text-white rounded-sm hover:bg-red-600' 
                onClick={(e)=>props.removeArrayIndex(props.arrayIndex)}><IoMdClose /></button>
              </div>
          </div>
    {props.metricsData.length > 0 && (
        <TableContainer component={Paper} className="mt-10 rounded-lg shadow-lg overflow-auto">
          <Table>
            <TableHead className="bg-gray-200">
              <TableRow>
                {/* Table Header */}
                {
                  columns.filter(col=>col.visible).map((item)=>{
                    return(
                      <TableCell key={item.key} className="font-bold text-gray-700">
                      {item.title}
                    </TableCell>
                    )
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {props.metricsData.map((row) => (
                <TableRow key={row.group_name}>
                  {/* <TableCell>{row.group_name}</TableCell> */}

                  {
                    columns.filter(col=>col.visible).map((col)=>{

                      let key = Object.entries(col).filter((k,v)=>k[0] == 'key')[0][1]

                      // console.log("key: ",key)

                      let value = row.metrics[0][key]



                      // add . decimal
                      if(fixedToColumns.indexOf(key) != -1){
                        value = value.toFixed(2)   
                      }
                      
                      // add , comma
                      if(numberColumns.indexOf(key) != -1){
                        if(value > 1000000){
                          value = value /1000000
                        }
                        value = numberWithCommas(value)  
                      }

                      // add currency
                      if(currencyColumns.indexOf(key) != -1){
                        value = currencySymbol + String(value)
                      }


                      if(key == 'group_name'){
                        return <TableCell>{row.group_name}</TableCell>
                      }
                      return (
                        <TableCell>{value}</TableCell>
                      )


                    })
                  }
                  {/* <TableCell>{row.metrics[0].clicks}</TableCell>
                  <TableCell>{row.metrics[0].impressions}</TableCell>
                  <TableCell>{row.metrics[0].ctr.toFixed(2)}</TableCell>
                  <TableCell>{row.metrics[0].conversions}</TableCell>
                  <TableCell>{row.metrics[0].cost.toFixed(2)}</TableCell>
                  <TableCell>{row.metrics[0].avg_cpc.toFixed(2)}</TableCell>
                  <TableCell>{row.metrics[0].conversion_rate.toFixed(2)}</TableCell>
                  <TableCell>{row.metrics[0].cost_per_conversion.toFixed(2)}</TableCell> */}
                </TableRow>
              ))}
              {/* Total Row */}
              <TableRow className="bg-gray-100">
                {/* <TableCell className="font-bold text-gray-800">Total</TableCell> */}
                {/* Total Calculations */}
                {
                  columns.filter(col=>col.visible).map((col)=>{

                    let key = Object.entries(col).filter((k,v)=>k[0] == 'key')[0][1]

                    // console.log("key: ",key)

                    let total = props.metricsData.reduce((sum, row) => sum + row.metrics[0][key], 0)

                    
                    if(fixedToColumns.indexOf(key) != -1){
                      total = total.toFixed(2)   
                    }
                    
                    if(numberColumns.indexOf(key) != -1){
                      if(total > 1000000){
                        total = total /1000000
                      }
                      total = numberWithCommas(total)
                      // total = total.toFixed(2)
                    }

                  
                    // add currency
                    if(currencyColumns.indexOf(key) != -1){
                      total = currencySymbol + String(total)
                    }



                    if(key == 'group_name'){
                      return <TableCell className="font-bold text-gray-800">Total</TableCell>
                    }
                    return (
                      <TableCell 
                      key={key}
                      className="font-bold text-gray-800">
                    {total}
                  </TableCell>
                    )


                  })
                }
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Insights */}
      {/* <div className="mt-10 text-center">
        <button
          onClick={handleGenerateInsights}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-8 rounded-lg shadow-lg transition"
        >
          Generate Insights
        </button>
        <p className="mt-4 text-lg font-medium text-gray-700">{insightsParagraph}</p>
      </div> */}
    </>
  )
}


export default CampaignPage;  