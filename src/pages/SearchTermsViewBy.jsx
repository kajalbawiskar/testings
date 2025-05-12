import axios from 'axios'
import React, { useEffect, useState } from 'react'
import LoadingAnimation from "../components/LoadingAnimation";


function SearchTermsViewBy(props) {

  const [data, setData] = useState([])
  const [columns, setColumns] = useState([
    
    {title: "Date", key:"date", visible: true },
    {title: "Type", key:"type", visible: true },
    {title: "Impressions", key:"impressions", visible: true },
    {title: "Clicks", key:"clicks", visible: true },
    {title: "Cost", key:"cost", visible: true },
    {title: "Cost / Conv", key:"cost_per_conversion", visible: true },
    {title: "Avg Cpc", key:"average_cpc", visible: true },
    {title: "Conv Rate", key:"conversion_rate", visible: true },
    {title: "Conversions", key:"conversions", visible: true },
    {title: "Ctr", key:"ctr", visible: true },
  ])

  let [total,setTotal] = useState({})

  let [hasLoaded, setHasLoaded] = useState(false)

  useEffect(()=>{

    setHasLoaded(false)

    axios.post("https://api.confidanto.com/get-searchterm-segment-data",{
      customer_id :4643036315,
      start_date : props.startDate,
      end_date : props.endDate,
      group_by : props.groupBy 
    }).then((res)=>{
      
      function SortData(data) {
        let finalArr = [];
        for (const i of data) {
          let date = Object.keys(i)[0];
          let queryList = Object.values(i)[0];

          for (const j of queryList) {
            let queryName = Object.keys(j)[0];
            let queryValues = Object.values(j)[0];
            Object.assign(queryValues, { date: date, name: queryName });
            finalArr.push(queryValues);
          }
        }
        // console.log(finalArr);
        return finalArr;
      }

      let newData = SortData(res.data)
      setData(newData)
      // console.log("SERACH TERM DATE SEG:",newData, data)
      setHasLoaded(true)
    })

  },[props.groupBy, props.startDate, props.endDate])

  let prevItem = ""
  let tempDate = ""
  return (
    <>

      <div className="Table">
        <div className="flex-grow overflow-auto mb-12">

            {hasLoaded ?(
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
                <thead>
                  <tr className="bg-gray-200 normal-case text-sm leading-normal">
                    {columns.filter(val=>val.visible).map(val=>{

                      return (
                        <th
                        key={val.key}
                        className='py-3 px-6 text-left font-medium'>
                        {val.title}
                        </th>
                      )

                    })}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light font-roboto">
                  
                  {data.map((item, index)=>{

                    if(prevItem == item.date){
                      tempDate = ""
                    }else{
                      tempDate = item.date
                    }

                    prevItem = item.date

                    return (
                      <tr>
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                          <td
                              key={col.key}
                              className="py-3 px-6 text-left "
                          >                              
                              {(col.key === "date" || col.key === "week" ||col.key === "month")? (
                              <span className=" ">
                                  {tempDate}
                              </span>
                              ) : null}                              

                              {col.key === "type" ? (
                              <span>{item.name}</span>
                              ) : null}

                              {col.key === "cost" ? (
                              <span>{+((item.cost).toFixed(0))}</span>
                              ) : null}

                              {col.key === "clicks" ? (
                              <span>{(item.clicks)}</span>
                              ) : null}

                              {col.key === "impressions" ? (
                              <span>{(item.impressions)}</span>
                              ) : null}

                              
                              {col.key === "conversions" ? (
                              <span>{(item.conversions)}</span>
                              ) : null}
                              
                              {col.key === "cost_per_conversion" ? (
                              <span>{item.cost_per_conversion}</span>
                              ) : null}

                              {col.key === "ctr" ? (
                              <span>{item.ctr}</span>
                              ) : null}

                              {col.key === "average_cpc" ? (
                              <span>{item.average_cpc}</span>
                              ) : null}

                              {col.key === "conversion_rate" ? (
                              <span>{item.conversion_rate}</span>
                              ) : null}

                          </td>
                        ))}
                      </tr>
                      )

                  })}

                </tbody>
              <tfoot className='bg-gray-100'>
              {
                columns.filter(col=>col.visible).map(col=>{
                  // //console.log("KEY",col.key)
                  total[col.key] = 0
                })

              }
              {
                // map through data
                data.map(d=>{

                  // //console.log("DD",d);
                  // map throught each objects key:val in data
                  Object.keys(d).forEach(val=>{

                    // map through total 
                    Object.keys(total).forEach(totalVal=>{

                      // if total key == obj's key, add to total
                      if(totalVal == val){
                        total[val] = total[val] + d[val]
                      }
                    })
                    // //console.log("DD",val,d[val])
                  })
                })
              }
                <tr className="text-gray-700 font-semibold">
                  
                  {
                    Object.entries(total).map((t,k) => 

                    {
                      //console.log("type",typeof(t[1]))
                      let tempval = ""
                      let ignoreColumns = ['date','type']
                      if(typeof(t[1]) == "number"){
                        if(ignoreColumns.indexOf(t[0]) == -1){
                          tempval = (t[1].toFixed(2))
                        }
                      }
                      if(t[0] == "date"){
                        tempval = "Total"
                      }
                      return <td className="py-3 px-6 text-left">{tempval}</td>
                    }
                    )       

                }
                </tr>
              </tfoot>
              </table>)
              :
              <div>
                <LoadingAnimation/>
              </div>
            }

        </div>
      </div>

    </>
  )
}

export default SearchTermsViewBy