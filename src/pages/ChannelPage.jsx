import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'
import { useCampaigns } from '../hooks/useFetch'


function ChannelPage() {

  const [groupColumns, setGroupColumns] = useState([
    { title: "Id", key: "id", category: "Metric", visible: true },
    { title: "Name", key: "name", category: "Metric", visible: true },
    { title: "Campaign IDs", key: "campaign_ids", category: "Metric", visible: true },
    { title: "Campaign Names", key: "campaign_names", category: "Metric", visible: true },
    { title: "Number of Campaigns", key: "number_of_campaigns", category: "Metric", visible: true },
    { title: "Average CPC", key: "average_cpc", category: "Metric", visible: false },
    { title: "Average CPM", key: "average_cpm", category: "Metric", visible: false },
    { title: "Clicks", key: "clicks", category: "Metric", visible: false },
    { title: "Conversion Rate", key: "conversion_rate", category: "Metric", visible: false },
    { title: "Conversions", key: "conversions", category: "Metric", visible: false },
    { title: "Cost Per Conversion", key: "cost_per_conversion", category: "Metric", visible: false },
    { title: "Costs", key: "costs", category: "Metric", visible: false },
    { title: "CTR", key: "ctr", category: "Metric", visible: false },
    { title: "Impressions", key: "impressions", category: "Metric", visible: false },
    { title: "Interaction Rate", key: "interaction_rate", category: "Metric", visible: false },
    { title: "Interactions", key: "interactions", category: "Metric", visible: false },
    { title: "Show", key: "show", category: "Edit", visible: true },
    { title: "Delete", key: "delete", category: "Edit", visible: true }
  ])

  const [data, setData] = useState([])
  const [loading, setLoading] = useState([])
  const [random, setRandom] = useState([])
  const [random2, setRandom2] = useState([])

  const [total, setTotal] = useState({})
  const [showTotal, setShowTotal] = useState({})

  const [currentSegment, setCurrentSegment] = useState("channel")


  useEffect(async()=>{
    setData([])
    // setLoading(true)
    switch (currentSegment) {
        case "channel":
            fetchChannels()
        break;
        case "subchannel":
            fetchSubChannels()
        break;
        case "category":
            fetchCategory()
        break;
    
        default:
            break;
    }

    // setLoading(false)

  },[random])
  const fetchChannels = () => {
    axios.post("https://api.confidanto.com/channel/channel-campaign-metrics", {
        customer_id: localStorage.getItem("customer_id"),
        email: "user2@example.com",
        start_date: "2024-10-01",
        end_date: "2024-11-30"
    }).then(res=> {
        //console.log(res)
        let data = res.data
        if(data){

            let structuredData = data.channels.map(item=> { 
                
                let obj = {
                    campaigns_metrics: item.campaigns_metrics,

                    campaign_names: item.campaign_names,
                    campaign_ids: item.campaign_ids, 

                    name: item.channel_name, 
                    id:   item.channel_id, 
                    number_of_campaigns: item.number_of_campaigns, 


                    average_cpc:         item.campaigns_total[0].metric.average_cpc,
                    average_cpm:         item.campaigns_total[0].metric.average_cpm,
                    clicks:              item.campaigns_total[0].metric.clicks,
                    conversion_rate:     item.campaigns_total[0].metric.conversion_rate,
                    conversions:         item.campaigns_total[0].metric.conversions,
                    cost_per_conversion: item.campaigns_total[0].metric.cost_per_conversion,
                    costs:               item.campaigns_total[0].metric.costs,
                    ctr:                 item.campaigns_total[0].metric.ctr,
                    impressions:         item.campaigns_total[0].metric.impressions,
                    interaction_rate:    item.campaigns_total[0].metric.interaction_rate,
                    interactions:        item.campaigns_total[0].metric.interactions
                }
                return obj
            })

            setData(structuredData)
            setTotal({})
            //console.log(data, structuredData)
        }
    })
    .catch(err=> {
         //console.log(err)
    })
  }
  const fetchSubChannels = () => {
    axios.post("https://api.confidanto.com/sub-channel/sub-channel-campaign-metrics", {
        customer_id: localStorage.getItem("customer_id"),
        email: "user2@example.com",
        start_date: "2024-10-01",
        end_date: "2024-11-30"
    }).then(res=> {
        //console.log(res)
        let data = res.data
        if(data){
            let structuredData = data.sub_channel.map(item=> { 
                
                let obj = {
                    campaigns_metrics: item.campaigns_metrics,

                    campaign_names: item.campaign_names,
                    campaign_ids: item.campaign_ids, 

                    name: item.sub_channel_name, 
                    id:   item.sub_channel_id, 
                    number_of_campaigns: item.number_of_campaigns, 


                    average_cpc:         item.campaigns_total[0].metric.average_cpc,
                    average_cpm:         item.campaigns_total[0].metric.average_cpm,
                    clicks:              item.campaigns_total[0].metric.clicks,
                    conversion_rate:     item.campaigns_total[0].metric.conversion_rate,
                    conversions:         item.campaigns_total[0].metric.conversions,
                    cost_per_conversion: item.campaigns_total[0].metric.cost_per_conversion,
                    costs:               item.campaigns_total[0].metric.costs,
                    ctr:                 item.campaigns_total[0].metric.ctr,
                    impressions:         item.campaigns_total[0].metric.impressions,
                    interaction_rate:    item.campaigns_total[0].metric.interaction_rate,
                    interactions:        item.campaigns_total[0].metric.interactions
                }
                return obj
            })

            setData(structuredData)
            setTotal({})
            //console.log(data, structuredData)
        }
    })
    .catch(err=> {
         //console.log(err)
    })
  }
  const fetchCategory = () => {
    axios.post("https://api.confidanto.com/category/category-campaign-metrics", {
        customer_id:localStorage.getItem("customer_id"),
        email: "user2@example.com",
        start_date: "2024-10-01",
        end_date: "2024-11-30"
    }).then(res=> {
        //console.log(res)
        let data = res.data
        if(data){

            let structuredData = data.categories.map(item=> { 
                
                let obj = {
                    campaigns_metrics: item.campaigns_metrics,
                    campaign_names: item.campaign_names,
                    campaign_ids: item.campaign_ids, 

                    name: item.category_name, 
                    id:   item.category_id, 
                    number_of_campaigns: item.number_of_campaigns, 


                    average_cpc:         item.campaigns_total[0].metric.average_cpc,
                    average_cpm:         item.campaigns_total[0].metric.average_cpm,
                    clicks:              item.campaigns_total[0].metric.clicks,
                    conversion_rate:     item.campaigns_total[0].metric.conversion_rate,
                    conversions:         item.campaigns_total[0].metric.conversions,
                    cost_per_conversion: item.campaigns_total[0].metric.cost_per_conversion,
                    costs:               item.campaigns_total[0].metric.costs,
                    ctr:                 item.campaigns_total[0].metric.ctr,
                    impressions:         item.campaigns_total[0].metric.impressions,
                    interaction_rate:    item.campaigns_total[0].metric.interaction_rate,
                    interactions:        item.campaigns_total[0].metric.interactions
                }
                return obj
            })

            setData(structuredData)
            setTotal({})
            //console.log(data, structuredData)
        }
    })
    .catch(err=> {
         //console.log(err)
    })
  }

  const  toggleCurrentSegment = (segment) => {
    setCurrentSegment(segment)
    setCurrentGroupId(null)


    setRandom(Math.random())
  }

  // Select Group
  const [currentGroupId,setCurrentGroupId] = useState(null)
  const toggleGroupId = (id) => {
    setCurrentGroupId(id)

    setRandom2(Math.random())
  }



  //Helper Function
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  

  return (
    <div>
        <main className="flex-grow p-6 overflow-y-scroll">
            <div className="relative">
                <button
                className={`${currentSegment == "channel"?"bg-slate-100":"bg-transparent"} text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100`}
                onClick={()=>{toggleCurrentSegment("channel")}}
                >
                    Channel
                </button>
                <button
                
                className={`${currentSegment == "subchannel"?"bg-slate-100":"bg-transparent"} text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100`}
                onClick={()=>{toggleCurrentSegment("subchannel")}}
                >
                    Sub Channel
                </button>
                <button
                    className={`${currentSegment=="category"?"bg-slate-100":"bg-transparent"} text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100`}
                    onClick={()=>{toggleCurrentSegment("category")}}
                >
                    Category
                </button>

                <p>Current Group Id: {currentGroupId}</p>
                <p>Current Segment: {currentSegment}</p>
                <button 
                onClick={()=> {
                    setCurrentGroupId(null)
                    setCurrentSegment("channel")
                    setRandom(Math.random())
                    setRandom2(Math.random())
                }}>Show Campaigns</button>
                
            </div>

        
            <table className="min-w-full bg-white rounded-lg  shadow-md">
                <thead>
                    <tr className="bg-gray-200 text-sm leading-normal">

                    {groupColumns.filter(col => col.visible).map(col => (
                        <th key={col.key} className="py-3 px-6 text-left">{col.title}</th>
                    ))}
                    </tr>
                </thead>
                {data.length > 0 ? (
                <>
                <tbody className="text-gray-600 text-sm font-light">
                    {data.map((item, index) => (
                        <tr key={index} className={`border-b border-gray-200 hover:bg-gray-100`}>
                            {groupColumns.filter(col => col.visible).map(col => (
                            <td key={col.key} className="py-3 px-6 text-left">
                                {col.key !== "status" && (
                                Array.isArray(item[col.key]) ? item[col.key].join(', ') : item[col.key]
                                )}
                                {col.key == "show" && 
                                <button 
                                onClick={()=> {
                                    toggleGroupId(item.id)
                                }}
                                >Set Id</button>
                                }
                                
                            </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-gray-100">
                    {showTotal && <tr className="text-gray-700 font-semibold">
                        {/* {currentSegment != "search" && (
                        <td className="px-4 py-2 ">Total</td>
                        )} */}
                        {() => {
                        Object.keys(total).forEach(
                            (key) => delete total[key]
                        );
                        }}
                        {groupColumns
                        .filter((col) => col.visible)
                        .map((col) => {
                            // ////////console.log("KEY",col.key)
                            total[col.key] = 0;
                        })}
                        {data.map((d) => {
                        Object.keys(d).forEach((val) => {
                            Object.keys(total).forEach((totalVal) => {

                            if (totalVal == val) {
                                if(val == "device"){
                                if(d[val] == "TOTAL"){
                                    // if it's total of few rows, then dont count it in final total
                                    // only on device api
                                    //////console.log("TOTAL LOOP: ",totalVal, val,totalVal == val, d[val]);
                                    return
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

                        }
                        return (
                            <td className="py-3 px-6 text-left">{tempval}</td>
                        );
                        })}
                    </tr>}
                    </tfoot>
                </>


                ) : (
                <tr className="border-b border-gray-200 hover:bg-gray-100">
                    <td
                    colSpan={groupColumns.filter((col) => col.visible).length}
                    className="py-3 px-6 text-center"
                    >
                    {/* Display a message if no data matches the filters */}
                    {data.length === 0 && !loading ? (
                        <div className="py-10 text-gray-600">No data available for the selected filters.</div>
                    ) : (
                        <div className="flex justify-center items-center h-40 mt-3">
                        <LoadingAnimation />
                        </div>
                    )}
                    </td>
                </tr>
                )}
                        
            </table>
            
            {true &&
                <CampaignsTable data={data} groupId={currentGroupId} random={random2} currentSegment={currentSegment} /> 
            }
        </main>


        
    </div>
  )
}


const CampaignsTable = (props) => {
    const [total, setTotal] = useState({})
    const [metricColumns, setMetricColumns] = useState([
        { title: "Campaign ID", key: "campaign_id", category: "Metric", visible: true },
        { title: "Campaign Name", key: "campaign_name", category: "Metric", visible: true },
        { title: "Average CPC", key: "average_cpc", category: "Metric", visible: true },
        { title: "Average CPM", key: "average_cpm", category: "Metric", visible: true },
        { title: "Clicks", key: "clicks", category: "Metric", visible: true },
        { title: "Conversion Rate", key: "conversion_rate", category: "Metric", visible: false },
        { title: "Conversions", key: "conversions", category: "Metric", visible: false },
        { title: "Cost Per Conversion", key: "cost_per_conversion", category: "Metric", visible: false },
        { title: "Costs", key: "costs", category: "Metric", visible: false },
        { title: "CTR", key: "ctr", category: "Metric", visible: false },
        { title: "Impressions", key: "impressions", category: "Metric", visible: false },
        { title: "Interaction Rate", key: "interaction_rate", category: "Metric", visible: false },
        { title: "Interactions", key: "interactions", category: "Metric", visible: false }
    ])
  const [loading, setLoading] = useState([])
  const [showTotal, setShowTotal] = useState({})

  let [data, setData] = useState([])

  useEffect(()=>{
    fetchAllCampaings()
  },[])
  
  useEffect(()=>{
    console.log("GROUP ID",props.groupId)
    
    setData([])
    if(props.groupId == null){
        // setData(campaigns)
        fetchAllCampaings()
    }else{
        getCampaigns()
    }
  },[props.random])
  //Fetch Campaigns from Groups 
  const getCampaigns = () => {
    let groupData = props.data.filter(item=>item.id == props.groupId)

    console.log("structured Data", groupData ,props.groupId)
    if(groupData.length > 0){


        let structuredData = groupData[0].campaigns_metrics.map(item=>{
            let obj = {
                campaign_id:item.campaign_id,
                campaign_name:item.campaign_name,
                
                
                // clicks:item.metrics.clicks,
    
                average_cpc:         item.metrics.average_cpc,
                average_cpm:         item.metrics.average_cpm,
                clicks:              item.metrics.clicks,
                conversion_rate:     item.metrics.conversion_rate,
                conversions:         item.metrics.conversions,
                cost_per_conversion: item.metrics.cost_per_conversion,
                costs:               item.metrics.costs,
                ctr:                 item.metrics.ctr,
                impressions:         item.metrics.impressions,
                interaction_rate:    item.metrics.interaction_rate,
                interactions:        item.metrics.interactions
            }
    
            return obj
        })
        setData(structuredData)
        console.log("structured Data", groupData, structuredData, props.groupId)
    }
  }      

  // All Campaigns.
  const [campaigns, setCampaings] = useState([])   
  const fetchAllCampaings = () => {
    axios.post("https://api.confidanto.com/get-campaigns-list",{
        customer_id : localStorage.getItem("customer_id"),
        start_date  : "2024-01-01",
        end_date    : "2024-12-16",
    })
    .then(res=>{
        console.log("CAMPAINGS: ",res)
        setCampaings(res.data)
        let structuredData = res.data.map(item=>{
            let obj = {
                campaign_id:item.id,
                campaign_name:item.name,
                // clicks:item.metrics.clicks,
    
                average_cpc:         item.avg_cpc,
                average_cpm:         item.avg_cpm,
                clicks:              item.clicks,
                conversion_rate:     item.conversion_rate,
                conversions:         item.conversions,
                cost_per_conversion: item.cost_per_conversion,
                costs:               item.costs,
                ctr:                 item.ctr,
                impressions:         item.impressions,
                interaction_rate:    item.interaction_rate,
                interactions:        item.interactions
            }
    
            return obj
        })
        setData(structuredData)
    }).catch(err=>{
        // setError(err);
    }).finally(fin=>{
        // setLoading(false)
    })
  }

  //CheckBox
  let [checkBoxShow, setCheckBoxShow] = useState(true)
  //Select Rows
  const [selectedRows, setSelectedRows] = useState([
    // {
        // id: 1,
        // name:"Something"
    // }
    // 1
  ])
  const toggleRowSelection = (id) => {
    setSelectedRows(
        // True or false
        (prevSelectedRows)=>prevSelectedRows.includes(id)?
            // True, Deselect
            prevSelectedRows.filter((rowIds=>rowIds !== id))
            :
            // False 
            [...prevSelectedRows, id] 
    )

    console.log("SelectedRows: ",selectedRows)
  }
  const isRowSelected = (id) => selectedRows.includes(id)
   // Toggle all rows
   const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]); // Deselect all
    } else {
      setSelectedRows(data.map((row) => row.campaign_id)); // Select all
    }
  };

  
  //   Create Groups
  let groupNameRef = useRef(null)
  const createGroup = () => {
    // Conditions, name is not empty, segment is not null or category, 
    // check if channel, create sub channel, if sub channel, create category
    console.log(groupNameRef.current.value, selectedRows)
  }
  const returnCreateType = (type, groupId) => {
    // if(groupId == null){
    //     return "Channel"
    // }
    switch (type) {
        case "channel":
            return "Sub Channel"
            break;
        case "subchannel":
            return "Category"
        break;
    
        default:
            return null
            break;
    }
  }




  //Helper Function
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }  

    return <>
    
        {selectedRows.length > 0 && props.currentSegment != "category" &&
        <div className="createGroups">
            Make Groups
            <input type="text" placeholder='Group Name' ref={groupNameRef}
            
            />
            <button 
            onClick={createGroup}>
                Create {returnCreateType(props.currentSegment, props.groupId)}
            </button>
        </div>}
        <table className="min-w-full bg-white rounded-lg  shadow-md">
            <thead>
                <tr className="bg-gray-200 text-sm leading-normal">

                {props.currentSegment != "category" && <td className='py-3 px-6 text-left'>
                    <input type="checkbox" name="checkAll" id="checkAll" 
                    onChange={()=>toggleSelectAll()}
                    checked={selectedRows.length === data.length}
                    />
                </td>}

                {metricColumns.filter(col => col.visible).map(col => (
                    <th key={col.key} className="py-3 px-6 text-left">{col.title}</th>
                ))}
                </tr>
            </thead>
            {data.length > 0  ? (
            <>
            <tbody className="text-gray-600 text-sm font-light">
                {data.map((item, index) => (
                    <tr key={index} className={`border-b border-gray-200 hover:bg-gray-100`}>
                        {(props.currentSegment != "category") && <td className='py-3 px-6 text-left'>
                            <input type="checkbox" name="checkthis" id="checkthis" 
                            onChange={()=>toggleRowSelection(item.campaign_id)}
                            checked={isRowSelected(item.campaign_id)}
                            />
                        </td>}
                        {metricColumns.filter(col => col.visible).map(col => (
                        <td key={col.key} className="py-3 px-6 text-left">
                            {col.key !== "status" && (
                            Array.isArray(item[col.key]) ? item[col.key].join(', ') : item[col.key]
                            )}
                            
                        </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot className="bg-gray-100">
                {showTotal && <tr className="text-gray-700 font-semibold">
                    {() => {
                    Object.keys(total).forEach(
                        (key) => delete total[key]
                    );
                    }}
                    {metricColumns
                    .filter((col) => col.visible)
                    .map((col) => {
                        // ////////console.log("KEY",col.key)
                        total[col.key] = 0;
                    })}
                    {data.map((d) => {
                    Object.keys(d).forEach((val) => {
                        Object.keys(total).forEach((totalVal) => {

                        if (totalVal == val) {
                            if(val == "device"){
                            if(d[val] == "TOTAL"){
                                // if it's total of few rows, then dont count it in final total
                                // only on device api
                                //////console.log("TOTAL LOOP: ",totalVal, val,totalVal == val, d[val]);
                                return
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
                </tr>}
                </tfoot>
            </>


            ) : (
            <tr className="border-b border-gray-200 hover:bg-gray-100">
                <td
                colSpan={metricColumns.filter((col) => col.visible).length}
                className="py-3 px-6 text-center"
                >
                {/* Display a message if no data matches the filters */}
                {data.length === 0 && !loading ? (
                    <div className="py-10 text-gray-600">No data available for the selected filters.</div>
                ) : (
                    <div className="flex justify-center items-center h-40 mt-3">
                    <LoadingAnimation />
                    </div>
                )}
                </td>
            </tr>
            )}
                    
        </table>
    </>
}

export default ChannelPage