import axios from 'axios';
import React, { useEffect, useLayoutEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation';
import { CiEdit } from "react-icons/ci";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";


function CampaignsGroupBy(props) {

    
    const [data, setData] = useState([]);
    const [toEditGroupId,setToEditGroupId] = useState(null)
    const [campaignData, setCampaignData] = useState([]);
    const [CampaignColumns, setCampaignColumns] = useState([
      { id: "1", title: "Campaign", key: "name", visible: true, locked: true, category: "Recommended" },
      { id: "2", title: "Budget", key: "budget_micros", visible: true, category: "Recommended" },
      { id: "3", title: "Status", key: "status", visible: true, locked: true, category: "Recommended" },
      { id: "4", title: "Interaction rate", key: "interaction_rate", visible: true, category: "Performance" },
      { id: "5", title: "Avg. cost", key: "avg_cost", visible: true, category: "Performance" },
      { id: "6", title: "Cost", key: "cost", visible: true, category: "Performance" },
      { id: "7", title: "Clicks", key: "clicks", visible: true, category: "Performance" },
      { id: "8", title: 'Invalid Clicks', key: 'invalid_clicks', visible: false },
      { id: "9", title: "Avg. CPC", key: "avg_cpc", visible: true, category: "Performance" },
      { id: "10", title: 'Impr.(Abs.Top)%', key: 'absolute_top_impression_percentage', visible: false, category: "Performance" },
      { id: "11", title: 'Invalid click rate', key: 'invalid_click_rate', visible: false, category: "Performance" },
      { id: "12", title: 'Impr. (Top) %', key: 'top_impression_percentage', visible: false, category: "Performance" },
      { id: "13", title: 'Avg. Target Roas', key: 'average_target_roas', visible: false, category: "Performance" },
      { id: "14", title: 'CTR', key: 'ctr', visible: false, category: "Performance" },
      { id: "15", title: 'Avg.target CPA', key: 'average_target_cpa_micros', visible: false, category: "Performance" },
      { id: "16", title: 'Interactions', key: 'interactions', visible: false, category: "Performance" },
      { id: "17", title: "Conversions", key: "conversion", visible: true, category: "Conversions" },
      { id: "18", title: "Cost/conv.", key: "cost_per_conv", visible: true, category: "Conversions" },
      { id: "19", title: 'New Customer Lifetime Value', key: 'new_customer_lifetime_value', visible: false, category: "Conversions" },
      { id: "20", title: 'All New Customer Lifetime Value', key: 'all_new_customer_lifetime_value', visible: false, category: "Conversions" },
      { id: "21", title: 'Cross Sell Cost Of Goods Sold', key: 'cross_sell_cost_of_goods_sold_micros', visible: false, category: "Conversions" },
      { id: "22", title: 'Lead Cost Of Goods Sold ', key: 'lead_cost_of_goods_sold_micros', visible: false, category: "Conversions" },
      { id: "23", title: 'Cross Sell Revenue Micros', key: 'cross_sell_revenue_micros', visible: false, category: "Conversions" },
      { id: "24", title: 'Lead Gross Profit Micros', key: 'lead_gross_profit_micros', visible: false, category: "Conversions" },
      { id: "25", title: 'Lead Revenue Micros', key: 'lead_revenue_micros', visible: false, category: "Conversion" },
      { id: "26", title: 'Conv.value', key: 'conversions_value', visible: false, category: "Conversion" },
      { id: "27", title: 'Revenue', key: 'revenue_micros', visible: false, category: "Conversion" },
      { id: "28", title: 'all Conv.value', key: 'all_conversions_value', visible: false },
      { id: "29", title: 'Cost Of Goods Sold', key: 'cost_of_goods_sold_micros', visible: false, category: "Conversion" },
      { id: "30", title: 'Gross Profit Margin', key: 'gross_profit_margin', visible: false, category: "Conversion" },
      { id: "31", title: 'Cost/Conv.', key: 'cost_per_conversion', visible: false, category: "Conversion" },
      { id: "32", title: 'Cross-sell Gross Profit ', key: 'cross_sell_gross_profit_micros', visible: false, category: "Conversion" },
      { id: "33", title: 'Cross-device Conversions Value ', key: 'cross_device_conversions_value_micros', visible: false, category: "Conversion" },
      { id: "34", title: 'Conv.rate', key: 'conversions_from_interactions_rate', visible: false, category: "Conversion" },
      { id: "35", title: 'All Conversions Value By Conversion Date', key: 'all_conversions_value_by_conversion_date', visible: false, category: "Conversion" },
      { id: "36", title: 'Cross-device Conv.', key: 'cross_device_conversions', visible: false, category: "Conversion" },
      { id: "37", title: 'Cost/all Conv.', key: 'cost_per_all_conversions', visible: false, category: "Conversion" },
      { id: "38", title: 'Cross-sell Units Sold', key: 'cross_sell_units_sold', visible: false, category: "Conversion" },
  
      { id: "39", title: 'View-through Conv.', key: 'view_through_conversions', visible: false, category: "Conversion" },
      { id: "40", title: 'Lead Units Sold', key: 'lead_units_sold', visible: false, category: "Conversion" },
      { id: "41", title: 'Units Sold', key: 'units_sold', visible: false, category: "Conversion" },
      { id: "42", title: 'Value/Conv.', key: 'value_per_conversion', visible: false, category: "Conversion" },
      { id: "43", title: 'Search Budget Lost Absolute Top Impression Share', key: 'search_budget_lost_absolute_top_impression_share', visible: false, category: "Attribution" },
      { id: "44", title: 'Current Model Attributed Conversions Value Per Cost', key: 'current_model_attributed_conversions_value_per_cost', visible: false, category: "Attribution" },
      { id: "45", title: "Bid strategy", key: "bidding_strategy", visible: false, category: "Attributes" },
      { id: "46", title: 'Target Roas', key: 'target_roas', visible: false, category: "Attributes" },
      { id: "47", title: 'Bidding Strategy Type', key: 'bidding_strategy_type', visible: false, category: "Attributes" },
      { id: "48", title: ' Conv./Value(Current Model)', key: 'current_model_attributed_conversions_from_interactions_value_per_interaction', visible: false, category: "Attributes" },
  
      { id: "49", title: 'Target CPA', key: 'target_cpa_micros', visible: false, category: "Attributes" },
      { d: "50", title: 'Search exact match IS ', key: 'search_exact_match_impression_share', visible: false, category: "Competitive metrics" },
      { id: "51", title: "Impressions", key: "impressions", visible: true, category: "Competitive metrics" },
      { id: "52", title: 'Search Lost IS (Rank)', key: 'search_rank_lost_impression_share', visible: false, category: "Competitive metrics" },
      { id: "53", title: 'Search lost top IS (Rank)', key: 'search_rank_lost_top_impression_share', visible: false, category: "Competitive metrics" },
      { id: "54", title: 'Search lost top IS(Budget)', key: 'search_budget_lost_top_impression_share', visible: false, category: "Competitive metrics" },
  
      { id: "55", title: 'Search Impr. Share', key: 'search_impression_share', visible: false, category: "Competitive metrics" },
      { id: "56", title: 'Click Share', key: 'search_click_share', visible: false, category: "Competitive metrics" },
      { id: "57", title: 'Search lost Abs top IS (Rank)', key: 'search_rank_lost_absolute_top_impression_share', visible: false, category: "Competitive metrics" },
      { id: "58", title: 'Search Top IS', key: 'search_top_impression_share', visible: false, category: "Competitive metrics" },
      { id: "59", title: 'Search lost IS (Budget)', key: 'search_budget_lost_impression_share', visible: false, category: "Competitive metrics" },
      { id: "60", title: 'Search Abs top IS', key: 'search_absolute_top_impression_share', visible: false, category: "Competitive metrics" },
      { id: "61", title: 'Phone Calls', key: 'phone_calls', visible: false, category: "Call details" },
      { id: "62", title: 'Phone Impressions', key: 'phone_impressions', visible: false, category: "Call details" },
      { id: "63", title: 'Phone Through Rate', key: 'phone_through_rate', visible: false, category: "Call details" },
      { id: "64", title: 'Avg. Cpm', key: 'avg_cpm', visible: false },
      { id: "64", title: 'Group Name', key: 'group_name', visible: false },
      { id: "65", title: 'Value/All Conversions By Conversion Date', key: 'value_per_all_conversions_by_conversion_date', visible: false },
      { id: "66", title: 'Advertising Channel Sub Type', key: 'advertising_channel_sub_type', visible: false },
      { id: "67", title: 'Advertising Channel Type', key: 'advertising_channel_type', visible: false },
      { id: "68", title: 'Optimization Score', key: 'optimization_score', visible: false },
      { id: "69", title: 'Conversions By Conversion Date', key: 'conversions_by_conversion_date', visible: false },
      // {id: "1", title: 'Group Id', key: 'group_id', visible: false },
      { id: "70", title: 'Average Cart Size', key: 'average_cart_size', visible: false },
      // {id: "1", title: 'Amount Micros', key: 'amount_micros', visible: false },
      { id: "70", title: 'Id', key: 'id', visible: false },
      { id: "71", title: 'Customer Id', key: 'customer_id', visible: false },
      { id: "72", title: 'Channel Type', key: 'channel_type', visible: false },
  
    ]);
  
    const [columns, setColumns] = useState([
        {id:0 , title:"Group Name",     key:"group_name", visible:true},
        {id:1 , title:"Campaign Names", key:"campaign_names", visible:true},
        {id:2 , title:"Total Campaigns", key:"total_campaigns", visible:true},
        // {id:2 , title:"Campaign Ids", key:"campaign_ids", visible:true},
        {id:3 , title:"Edit", key:"edit", visible:true},
        {id:4 , title:"Delete", key:"delete", visible:true},
    ]);

    // const [groupNames, setGroupNames] = useState([]);
    const [savedGroups, setSavedGroups] = useState([]);

    const [groupsVisible,    setGroupsVisible] = useState(true)
    const [campaignsVisible, setCampaignsVisible] = useState(false)
    const [updateCounter, setUpdateCounter] = useState(false)
    
    const [random, setRandom] = useState(Math.random());
  
    useEffect(() => {

        axios.post("https://api.confidanto.com/campaign-group/fetch-groups",{
          email:localStorage.getItem("email"),
          customer_id: localStorage.getItem("customer_id")
        }).then(res=>{
          let objVal = Object.values(res.data)[0]
          let tempData = objVal.map(i=>{

            return {
              "group_name":i.group_name,
              "campaign_names":i.campaign_names,
              "campaign_ids":i.campaign_ids,
              "group_id":i.group_id,
              "total_campaigns":i.number_of_campaigns
            }
          })
          setSavedGroups(objVal)
          setData(tempData)
          console.log("GROUPS:",objVal, tempData,res);

        })
        axios.post("https://api.confidanto.com/get-datewise-campaign-data",{
          customer_id: localStorage.getItem("customer_id"),
          email:localStorage.getItem("email"),
          single_date: "2024-10-09",  // curr date
          previous_single_date: "2024-10-08",  
          order_by_direction: "DESC"
        }).then(res=>{
          console.log("Campaigns:",res.data);
          setCampaignData(res.data)
        })
        console.log(campaignData, savedGroups);
        // calculateGroupData()

    }, [updateCounter,random]);
    
    const calculateGroupData = () => {
        console.log("groupby: ",
            campaignData,
            savedGroups);
        let groups = savedGroups.map(i=>{

            let campaignIds = i.campaign_ids

            let campaigns = campaignData.filter(i=>
                campaignIds.indexOf(String(i.id)) != -1
            )

            let totals = {}
            campaigns.map(i=>{
                let keys = Object.keys(i)
                keys.map(j=>{
                    if(typeof(i[j]) == 'number'){
                        totals[j] = 0
                    }
                })
            })
            campaigns.map(i=>{
                let keys = Object.keys(i)
                keys.map(j=>{
                    if(typeof(i[j]) == 'number'){
                        totals[j] = totals[j] + i[j]
                    }
                })
            })
            // console.log("totals ",totals)

            let dataSet = {
                "group_id":i.group_id,
                "group_name": i.group_name,
                "campaign_ids":campaignIds,
                "campaign_names":campaigns,
                "total":totals
            }
            return dataSet
        })
        setData(groups)
        console.log(
            "calc", groups
        );
    }

    const deleteCampaignsGroup = (val) => {

      let id = val['group_id']
      let name = val['group_name']

      let con = window.confirm(`Delete ${name} Group?`)

      if(con){
        axios.post("https://api.confidanto.com/campaign-group/delete",{
          email:localStorage.getItem("email"),
          group_id:id
        }).then(res=>{
          console.log("Group Deleted with id and name: ",id, name);
          setUpdateCounter(!updateCounter)
          setRandom(Math.random())
        })
      }

    }

    const fetchCampaignsForGroup = (val) => {

      let ids_arr = val['campaign_ids']
      let names_arr = val['campaign_names']

      setGroupName(val['group_name'])
      setToEditGroupId(val['group_id'])
      let finObj = []
      for (const iterator in ids_arr) {

        let obj = {
          id: Number(ids_arr[iterator]),
          campaign_name:names_arr[iterator]
        }

        finObj.push(obj)
      }
      
      console.log(finObj,toEditGroupId); 

      setSelectedRows(finObj)

      setGroupsVisible(false)
      setCampaignsVisible(true)
    }


    const cancelGroupEdit = () => {
      setSelectedRows([])
      setGroupName("")

      
      // alert("Group edited")
      setGroupsVisible(true)
      setCampaignsVisible(false)
    }

    const editSavedGroup = () => {
      

      const groupData = {
        group_name: groupName,
        group_id:toEditGroupId,
        campaign_ids: selectedRows.map((row) => row.id),
        campaign_names: selectedRows.map((row) => row.campaign_name),
        number_of_campaigns: selectedRows.length,
        email: localStorage.getItem("email"), // or any other way to get the email
      };
      console.log("groupData",groupData);

      axios.post("https://api.confidanto.com/campaign-group/edit",groupData)
      .then(res=>{
        console.log("Updated: ",res);
        
        alert("Group Updated")
        setGroupsVisible(true)
        setCampaignsVisible(false)
  
        setUpdateCounter(!updateCounter)
        setRandom(Math.random())
      })


    }

// Campaign Data
        const [total,setTotal] = useState({})
        const [selectedRows, setSelectedRows] = useState([]);
        const [selectAll, setSelectAll] = useState(false);
        const [tableVisible, setTableVisible] = useState(true);
        const [selectedGroup, setSelectedGroup] = useState(null);
        const [isVisibleGroupInput, setIsVisibleGroupInput] = useState(false);
        const [groupNames, setGroupNames] = useState([]);
        const [groupName, setGroupName] = useState("");
        const [isDialogOpenCreateGroup, setIsDialogOpenCreateGroup] = useState(false);        

        const PercentColumns = ["impressions_percent_diff",
        "costs_percent_diff",
        "clicks_percent_diff",
        "conversion_percent_diff",
        "ctr_percent_diff",
        "cost_per_conv_percent_diff",
        "average_cpc_percent_diff"]

        // functions
        function numberWithCommas(x) {
          return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }        
        const handleCreateGroup = async () => {
          setIsVisibleGroupInput(true);
        };

        const fetchGroups = async () => {
          try {
            const response = await axios.post(
              "https://api.confidanto.com/campaign-group/fetch-groups",
              {
                email: localStorage.getItem("email"),
                customer_id: localStorage.getItem("customer_id")
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
          
        const handleGroupSave = async () => {
          const groupData = {
            group_name: groupName,
            campaign_ids: selectedRows.map((row) => row.id),
            campaign_names: selectedRows.map((row) => row.campaign_name),
            number_of_campaigns: selectedRows.length,
            email: localStorage.getItem("email"), // or any other way to get the email
          };

        try {
          const response = await axios.post(
            "https://api.confidanto.com/campaign-group/create",
            groupData
          );
          if (response.status === 200) {
            // Success: group created
            setIsDialogOpenCreateGroup(true);
            setIsVisibleGroupInput(false);
            setSelectedRows([]);
            fetchGroups();
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            alert("Group name already exists. Please choose a different name.");
          } else {
            // Other errors
            console.error("Error inserting data:", error);
            alert("Failed to insert data");
          }
        }
        };


        const handleCheckboxChange = (id, campaign_name) => {
          const isSelected = selectedRows.some((row) => row.id === id);
          console.log(selectedRows);
      
          if (isSelected) {
            setSelectedRows(selectedRows.filter((row) => row.id !== id));
          } else {
            setSelectedRows([...selectedRows, { id, campaign_name }]);
          }
        };  
        const handleSelectAll = () => {
          setSelectAll(!selectAll);
          if (!selectAll) {
            const allSelectedRows = data.map((item) => ({
              id: item.id,
              campaign_name: item.name,
            }));
            setSelectedRows(allSelectedRows);
          } else {
            setSelectedRows([]);
          }
        };
// Campaign Data
  return (
    <div className='mx-4'>
        <h2
        className="text-2xl font-semibold capitalize py-4" 
        >Groups</h2>
        <div>
          {groupsVisible && <div className="flex-grow overflow-auto mb-12">
              {data.length > 0 ? (
                <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
                  <thead>
                    <tr className="bg-gray-200 normal-case text-sm leading-normal">
                      
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => (
                          <th
                            key={col.key}
                            className="py-3 px-6 text-left font-medium"
                          >
                            {col.title}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light font-roboto">
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b  hover:bg-gray-100 border-gray-200`}
                      >
                        {columns.filter(col => col.visible).map(col => (
                          <td key={col.key} className="py-3 px-6 text-left">
                            
                            {col.key == "group_name"?<>
                            <span>{item[col.key]}</span>
                            </>:null}

                            
                            {col.key == "campaign_names"?<>
                            <span>{item[col.key].join(", ")}</span>
                            </>:null}

                            
                            {col.key == "total_campaigns"?<>
                            <span>{item[col.key]}</span>
                            </>:null}

                            
                            {col.key == "campaign_ids"?<>
                            <span>{item[col.key].join(", ")}</span>
                            </>:null}
                            
                            {col.key == "edit"?<>
                            <span>
                              <button className=' text-2xl'
                              onClick={()=>{fetchCampaignsForGroup(item)}}
                              >
                                <MdEdit />
                              </button>
                            </span>
                            </>:null}

                            
                            {col.key == "delete"?<>
                            <span>
                              <button className=' text-2xl'
                              onClick={()=>{deleteCampaignsGroup(item)}}
                              >
                                <RiDeleteBin6Line />
                              </button>
                            </span>
                            </>:null}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex justify-center items-center h-40 mt-8">
                  <LoadingAnimation />
                </div>
              )}
          </div>}

        {campaignsVisible && <div className="flex-grow overflow-auto mb-12">
                    {selectedRows.length >= 2 && (
                  <div className="p-2 w-full bg-[#4142dc] flex items-center">
                    <p className="text-lg text-white font-normal p-2 my-4 pr-4 border-r-1 border-white">
                      {selectedRows.length} selected
                    </p>
                    {/* <button
                      className="bg-transparent text-white text-lg p-2 m-4 font-semibold"
                      onClick={handleCreateGroup}
                    >
                      Edit Group
                    </button> */}
                    {/* {isVisibleGroupInput && ( */}
                    <div className="flex justify-center items-center">
                      <input
                        type="text"
                        className="text-lg text-white bg-transparent border-b-1 border-white p-2 focus:outline-none"
                        placeholder="Group Name"

                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                      />
                      <button
                        className="bg-white text-[#4142dc] text-lg  m-4 font-semibold px-4 py-1.5"
                        onClick={editSavedGroup}
                      >
                        Save
                      </button>
                      <button
                        className="bg-white text-[#4142dc] text-lg  m-4 font-semibold px-4 py-1.5"
                        onClick={cancelGroupEdit}
                      >
                        Cancel
                      </button>
                    </div>
                    {/* )} */}
                  </div>
                )}
                
                  <>
                    {tableVisible && (
                      <div className="flex-grow overflow-auto mb-12">
                        {campaignData.length > 0 ? (
                          <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
                            <thead>
                              <tr className="bg-gray-200 normal-case text-sm leading-normal">
                                <th className="py-3 px-6 text-left font-medium">
                                  {/* <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAll}
                                  /> */}
                                </th>
                                {CampaignColumns
                                  .filter((col) => col.visible)
                                  .map((col) => (
                                    <th
                                      key={col.key}
                                      className="py-3 px-6 text-left font-medium"
                                    >
                                      {col.title}
                                    </th>
                                  ))}
                              </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light font-roboto">
                              {campaignData.map((item, index) => (
                                <tr
                                  key={index}
                                  className={`border-b   ${selectedRows.some((row) => row.id === item.id)
                                    ? "bg-blue-100 border-gray-300"
                                    : "hover:bg-gray-100 border-gray-200"
                                    }`}
                                >
                                  <td className="py-3 px-6 text-left">
                                    <input
                                      type="checkbox"
                                      checked={selectedRows.some(
                                        (row) => row.id === item.id
                                      )}
                                      onChange={() =>
                                        handleCheckboxChange(item.id, item.name)
                                      }
                                    />
                                  </td>

                                  {CampaignColumns.filter(col => col.visible).map(col => (
                                    <td key={col.key} className="py-3 px-6 text-left">
                                      {col.key !== "status" && (
                                        Array.isArray(item[col.key]) ? item[col.key].join(', ') : item[col.key]
                                      )}
                                      {/* Render the status cell */}
                                      {
                                        PercentColumns.indexOf(col.key) != -1 ? (
                                          <span> %</span>
                                        ) : null
                                      }
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
                                          {/* {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()} */}
                                        </div>
                                      ) : null}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-gray-100">
                              <tr className="text-gray-700 font-semibold">
                                <td className="px-4 py-2 ">Total</td>
                                {
                                  () => {
                                    console.log("gvyfctdxrdctfvygbhjk: ", total);
                                    Object.keys(total).forEach(key => delete total[key]);
                                    console.log("gvyfctdxrdctfvygbhjk: ", total);

                                  }
                                }
                                {
                                  CampaignColumns.filter(col => col.visible).map(col => {
                                    // //console.log("KEY",col.key)
                                    total[col.key] = 0
                                  })

                                }
                                {
                                  campaignData.map(d => {
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
                                    let ignoreColumns = ['id', 'customer_id', 'amount_micros', 'campaign_id']
                                    if (typeof (t[1]) == "number") {
                                      if (ignoreColumns.indexOf(t[0]) == -1) {
                                        tempval = numberWithCommas(t[1].toFixed(2))
                                      }

                                      if (PercentColumns.indexOf(t[0]) != -1) {
                                        tempval = String(tempval) + " %"
                                      }
                                    }
                                    return <td className="py-3 px-6 text-left">{tempval}</td>
                                  }
                                  )

                                }


                              </tr>
                            </tfoot>
                          </table>
                        ) : (
                          <div className="flex justify-center items-center h-40 mt-8">
                            <LoadingAnimation />
                          </div>
                        )}
                      </div>
                    )}
                  </>

          </div>}
        </div>
    </div>
  )
}

export default CampaignsGroupBy