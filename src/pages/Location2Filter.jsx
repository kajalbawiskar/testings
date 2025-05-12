import React from 'react'
import LoadingAnimation from "../components/LoadingAnimation";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { MdOutlineSegment } from "react-icons/md";



function Location2Filter(props) {

  const [locationTableVisible,setLocationTableVisible] = useState(true)
  const [currencySymbol, setCurrencySymbol] = useState("Rs ")  

   // Sorting state
   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [data,setData] = useState([])
  const [columns,setColumns] = useState([
    { title: "City", key: "name", visible: true, locked: true },
    { title: "Impressions", key: "impressions", visible: true, locked: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Cost", key: "cost_micros", visible: true, locked: true },
  ])

  const [cityData,setCityData] = useState([])
  const [cityColumns, setCityColumns] = useState([
    { title: "City", key: "name", visible: true, locked: true },
    { title: "Impressions", key: "impressions", visible: true, locked: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Cost", key: "cost_micros", visible: true, locked: true },
  ]);

  const [stateData,setStateData] = useState([])
  const [stateColumns, setStateColumns] = useState([
    { title: "State", key: "name", visible: true, locked: true },
    { title: "Impressions", key: "impressions", visible: true, locked: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Cost", key: "cost_micros", visible: true, locked: true },
  ]);

  const [countryData,setCountryData] = useState([])
  const [countryColumns, setCountryColumns] = useState([
    { title: "Country", key: "name", visible: true, locked: true },
    { title: "Impressions", key: "impressions", visible: true, locked: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Cost", key: "cost_micros", visible: true, locked: true },
  ]);

  const [loading, setLoading] = useState(true);

  let totalClicks = 0
  let totalCost = 0
  let totalImpressions = 0

  let [total, setTotal] = useState({
    "impressions":0,
    "cost":0,
    "clicks":0 
})

  

  const filterButtonRef = useRef(null)
  const [cityRadio,setCityRadio] = useState(props.targetType)
  const targetRadioChange = (e) =>{
    setCityRadio(e.target.value)
  }

  const filterlocations = (e)=>{
    switch (cityRadio) {
      case 'State':
        setData(stateData)
        setColumns(stateColumns)
        break;

      case 'Country':
        setData(countryData)
        setColumns(countryColumns)
        break;
    
      default:
        setData(cityData)
        setColumns(cityColumns)
        break;
        
      }
    //console.log(data)
    setShowUserIntentMenu(false)
  }

  
  const customer_id = localStorage.getItem("customer_id")
    
  useEffect(() => {
    setLoading(true);
    fetch("https://api.confidanto.com/get-available-locations-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customer_id,
        target_type:"City"
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        
        const segmentData = data.map((i)=>{
              let targetCity = Object.keys(i)[0]
              let targetData = Object.values(i)[0]

              targetData.name = targetCity
              return targetData
        })

        setCityData(segmentData)

        setData(segmentData)
        setColumns(cityColumns)

        // setFilteredData(segmentedData);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));

      // States
      axios.post("https://api.confidanto.com/get-available-locations-total",
      {
          customer_id: customer_id,
          target_type:"State"
      }
      ).then((res)=>{
        //console.log(res.data)
        const segmentData = res.data.map((i)=>{
          let target = Object.keys(i)[0]
          let targetData = Object.values(i)[0]

          targetData.name = target
          return targetData
        })
        //console.log("states:",segmentData)
        
        setStateData(segmentData)

        // setData(stateData)
        // setColumns(stateColumns)

      })
      
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));

      // Countries
      axios.post("https://api.confidanto.com/get-available-locations-total",
      {
          customer_id: customer_id,
          target_type:"Country"
      }
      ).then((res)=>{
        //console.log(res.data)
        const segmentData = res.data.map((i)=>{
          let target = Object.keys(i)[0]
          let targetData = Object.values(i)[0]

          targetData.name = target
          return targetData
        })
        //console.log("Country:",segmentData)

        
        setCountryData(segmentData)
        
        // setData(countryData)
        // setColumns(countryColumns)
      })
      
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  const [showUserIntentMenu, setShowUserIntentMenu] = useState(false);


  
  useEffect(()=>{    
    //console.log("changessss");
    filterlocations("")
    filterlocations("")
    
    console.log(data);

    

  },[data,columns, cityData, stateData, countryData, cityRadio, total])



  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  // Sorting function
  const sortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
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
    <>
    
        {/* <button
            className="bg-blue-500 text-white px-4 py-2 my-2 rounded hover:bg-blue-600 flex items-center justify-center"
            onClick={() => setLocationTableVisible(!locationTableVisible)}
         
        >Location Level
        </button> */}
        
        {locationTableVisible && 
        <>
          <div className=" flex justify-start align-top">
                {/* <button
                    className="bg-blue-500 text-white px-4 py-2 my-2 rounded hover:bg-blue-600 flex items-center justify-center"
                    onClick={() => setShowUserIntentMenu(!showUserIntentMenu)}
                    ref={filterButtonRef}
                >Filter
                </button> */}

                <select name="targetType" id="targetType" 
                    className='px-4 py-2 my-2  flex items-center justify-center'
                    onChange={targetRadioChange}
                    value={cityRadio}>
                  <option value="City"    >City</option>
                  <option value="State"   >State</option>
                  <option value="Country" >Country</option>
                </select>

                {showUserIntentMenu && (
                    <div className="absolute bg-white shadow-md rounded p-4 mt-12 z-20 border border-gray-200"
                    style={{
                    top:
                        filterButtonRef.current?.offsetTop +
                        filterButtonRef.current?.offsetHeight - 50,
                    left: filterButtonRef.current?.offsetLeft,
                    }}>
                    <div className='flex flex-col justify-start items-start '>
                        <div className="flex flex-col justify-start items-start w-full">
                        <h3>Select Type:</h3>

                            <div>
                            <input type="radio" name="target_type"
                            value="City"
                            checked={cityRadio === 'City'}
                            onChange={targetRadioChange}
                                /> <span>City</span>
                            </div>
                            
                            <div>
                            <input type="radio"  name="target_type" 
                            value="State"
                            checked={cityRadio === 'State'}
                            onChange={targetRadioChange}
                            /> <span>State</span>
                            </div>
                            
                            <div>
                                <input type="radio" name="target_type"  
                                value="Country"
                                checked={cityRadio === 'Country'}
                                onChange={targetRadioChange}
                                /> <span>Country</span>
                            </div>
                        </div>

                        <button className='bg-blue-500 text-white px-4 py-2 my-2 rounded hover:bg-blue-600 flex items-center justify-center' type="submit" onClick={(e)=>{filterlocations(e)}}>Apply</button>
                    </div>
                    </div>
                )}
            </div>
            

        <div className="overflow-x-auto">

        {data.length > 0 ? (
              <table className="min-w-full bg-white rounded-lg overflow-y-scroll shadow-md mb-10">
              <thead>
            <tr className="bg-[#2930a8] text-white normal-case text-sm leading-normal">
                
                {columns
                .filter((col) => col.visible)
                .map((col) => (
                    <th
                    key={col.key}
                    onClick={() => handleSort(col.key)} style={{ cursor: "pointer" }}
                    className="py-3 px-6 text-left font-medium"
                    >
                    {col.title}
                    {sortConfig.key === col.key && (
                    <span>{sortConfig.direction === "asc" ? "🔼" : "🔽"}</span>
              )}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light font-roboto">
            {sortedData().map((item, index) => (
                <tr
                key={index}
                >
                {columns
                    .filter((col) => col.visible)
                    .map((col) => (
                    <td
                        key={col.key}
                        className="py-3 px-6 text-left "
                    >
                        {col.key === "name" ? (
                        <span>{numberWithCommas(item.name)}</span>
                        ) : null}
                          
                        {col.key === "clicks" ? (
                        <span>{numberWithCommas(item.clicks)}</span>
                        ) : null}

                        {col.key === "impressions" ? (
                        <span>{numberWithCommas(item.impressions)}</span>
                        ) : null}
                        
                        {col.key === "cost_micros" ? (
                        <span>{currencySymbol + numberWithCommas((item.cost_micros / 1000000).toFixed(0))}</span>
                        ) : null}                     

                    </td>
                    ))}
                </tr>
            ))}
                </tbody>
                <tfoot>

                  {
                    data.map((i)=>{
                      total.impressions = 0
                      total.clicks = 0
                      total.cost = 0
                  })
                  }
                  {
                    data.map((i)=>{
                      total.impressions = total.impressions + i.impressions 
                      total.clicks = total.clicks + i.clicks 
                      total.cost = total.cost + i.cost_micros 
                  })

                  }

                    <tr className="font-bold text-gray-700 bg-[#f7f7f7] ">
                      <td className="py-3 px-6 text-left">Total</td>
                      <td className="py-3 px-6 text-left">{numberWithCommas(total.impressions)}</td>
                      <td className="py-3 px-6 text-left">{numberWithCommas(total.clicks)}</td>
                      <td className="py-3 px-6 text-left">{currencySymbol + numberWithCommas((total.cost / 1000000).toFixed(0))}</td>
                    </tr>
                </tfoot>
              </table>
              ) : (
            <div className="flex justify-center items-center h-40 mt-8">
              <LoadingAnimation />
            </div>
            )}
        </div>
        </>
        }

    </>
  )
}

export default Location2Filter