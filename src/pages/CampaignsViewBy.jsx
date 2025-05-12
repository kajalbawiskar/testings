import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingAnimation from '../components/LoadingAnimation'

function CampaignsViewBy(props) {
    const [viewByData,setViewByData] = useState([])
    
    const [currencySymbol, setCurrencySymbol] = useState("Rs ")  

    let [total, setTotal] = useState({
        "impressions":0,
        "cost":0,
        "clicks":0,

        "impressions":0,
        "conversions":0,
        "cost_per_conversion":0,
        "ctr":0,
        "average_cpc":0,
        "conversion_rate":0
    })
    
    useEffect(()=>{
        axios.post("https://api.confidanto.com/get-segment-campaign-data",{
            customer_id: localStorage.getItem("customer_id"),
            start_date: props.startDate,
            end_date: props.endDate,
            group_by:props.groupBy
        }).then((res)=>{


            let unqArr = []

            // console.log("CAMPAIGN VIEW BYL",res)
            let result = res.data.map((i)=>{
                let isElementInArr = false
                for (const j of unqArr) {

                    if(j[props.groupBy] == i[props.groupBy]){
                        isElementInArr = true
                        j["average_cpc"] = j["average_cpc"] + i["average_cpc"]
                        j["clicks"] = j["clicks"] + i["clicks"]
                        j["conversion_rate"] = j["conversion_rate"] + i["conversion_rate"]
                        j["conversions"] = j["conversions"] + i["conversions"]
                        j["cost"] = j["cost"] + i["cost"]
                        j["cost_per_conversion"] = j["cost_per_conversion"] + i["cost_per_conversion"]
                        j["ctr"] = j["ctr"] + i["ctr"]
                        j["impressions"] = j["impressions"] + i["impressions"]
                        // j["campaign_id"] = j["campaign_id"] + i["campaign_id"]
                        // j["campaign_name"] = j["campaign_name"] + i["campaign_name"]
                        // j["month"] = j["month"] + i["month"]
                    }
                }

                if(!isElementInArr){
                    unqArr.push(i)
                }
                console.log(i);
            })
            setViewByData(unqArr)
            setViewByData(unqArr)
            
            console.log(`View BY ${props.groupBy}:`,viewByData,res.data);
        })
    },[props.groupBy,props.startDate,props.endDate])

    
    useEffect(()=>{
        
        // set columns
        let newColumns = props.columns
        newColumns[0].title = capitalizeFirstLetter(props.groupBy)
        newColumns[0].key = props.groupBy

        props.setColumns(newColumns)




    },[props.groupBy,props.startDate,props.endDate])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  
    return (
    <div>
        <div className=' flex flex-row justify-between items-center'>
            <h2 className="text-2xl font-semibold capitalize py-4">
                {capitalizeFirstLetter(props.groupBy)+"-By-"+capitalizeFirstLetter(props.groupBy)} Campaigns
            </h2>
            {/* <button className='bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold w-fit'>
                Columns
            </button> */}
        </div>

    
    <div className="flex-grow overflow-auto mb-12">
        {/* <p>{props.startDate} / {props.endDate}</p> */}
        {viewByData.length > 0 ? (
        <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
            <thead>
            <tr className="bg-gray-200 normal-case text-sm leading-normal">
                
                {props.columns
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
            {viewByData.map((item, index) => (
                <tr
                key={index}
                >
                {props.columns
                    .filter((col) => col.visible)
                    .map((col) => (
                    <td
                        key={col.key}
                        className="py-3 px-6 text-left "
                    >

                        
                        {(col.key === "date" || col.key === "week" ||col.key === "month")? (
                        <span className=" ">
                            {item.date}
                            {item.week}
                            {item.month}
                        </span>
                        ) : null}

                        

                        {col.key === "cost" ? (
                        <span>{currencySymbol+numberWithCommas((item.cost).toFixed(0))}</span>
                        ) : null}

                        {col.key === "clicks" ? (
                        <span>{numberWithCommas(item.clicks)}</span>
                        ) : null}

                        {col.key === "impressions" ? (
                        <span>{numberWithCommas(item.impressions)}</span>
                        ) : null}

                        
                        {col.key === "conversions" ? (
                        <span>{numberWithCommas(item.conversions)}</span>
                        ) : null}
                        
                        {col.key === "cost_per_conversion" ? (
                        <span>{currencySymbol+numberWithCommas((item.cost_per_conversion / 1000000).toFixed(0))}</span>
                        ) : null}

                        {col.key === "ctr" ? (
                        <span>{numberWithCommas(item.ctr.toFixed(2))}</span>
                        ) : null}

                        {col.key === "average_cpc" ? (
                        <span>{numberWithCommas((item.average_cpc / 1000000).toFixed(2))}</span>
                        ) : null}

                        {col.key === "conversion_rate" ? (
                        <span>{numberWithCommas(item.conversion_rate.toFixed(2))}</span>
                        ) : null}

                    </td>
                    ))}
                </tr>
            ))}
            </tbody>
                {
                    viewByData.map(i=>{
                        total.clicks = 0
                        total.impressions = 0
                        total.cost = 0
                        total.impressions = 0
                        total.conversions = 0
                        total.cost_per_conversion = 0
                        total.ctr = 0
                        total.average_cpc = 0
                        total.conversion_rate = 0
                    })
                }
                {
                    viewByData.map(i=>{
                        total.clicks = total.clicks + i.clicks 
                        total.impressions = total.impressions + i.impressions 
                        total.cost = total.cost + i.cost 

                        total.conversions = total.conversions + i.conversions
                        total.cost_per_conversion = total.cost_per_conversion + i.cost_per_conversion
                        total.ctr = total.ctr + i.ctr
                        total.average_cpc = total.average_cpc + i.average_cpc
                        total.conversion_rate = total.conversion_rate + i.conversion_rate
                    })
                }
                <tfoot className="bg-gray-100">
                  <tr className="text-gray-700 font-semibold">
                  <td className="px-4 py-2 ">Total</td>
                  {props.columns[1].visible && <td className="py-3 px-6 text-left">{currencySymbol + numberWithCommas((total.cost).toFixed(0))}</td>}
                  {props.columns[2].visible && <td className="py-3 px-6 text-left">{numberWithCommas(total.clicks)}</td>}
                  {props.columns[3].visible && <td className="py-3 px-6 text-left">{numberWithCommas(total.impressions)}</td>}
                  {props.columns[4].visible && <td className="py-3 px-6 text-left">{numberWithCommas(total.conversions)}</td>}
                  {props.columns[5].visible && <td className="py-3 px-6 text-left">{currencySymbol + numberWithCommas((total.cost_per_conversion / 1000000).toFixed(0))}</td>}
                  {props.columns[6].visible && <td className="py-3 px-6 text-left">{numberWithCommas(total.ctr.toFixed(2))}</td>}
                  {props.columns[7].visible && <td className="py-3 px-6 text-left ">{numberWithCommas((total.average_cpc / 1000000).toFixed(2))}</td>}
                  {props.columns[8].visible && <td className="py-3 px-6 text-left">{numberWithCommas(total.conversion_rate.toFixed(2))}</td>}
                    
                   
                  </tr>
                </tfoot>
        </table>
        ) : (
        <div className="flex justify-center items-center h-40 mt-8">
            <LoadingAnimation />
        </div>
        )}
    </div>
    
    </div>
    )    
  
}

export default CampaignsViewBy