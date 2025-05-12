import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const DeviceChart = (props) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState("cost");
  const [allmetrics, setAllMetrics] = useState([
    {title:"Clicks", key:"clicks"}, //
    {title:"Impressions", key:"impressions"}, //
    {title:"Ctr", key:"ctr"}, //
    {title:"Conversions", key:"conversions"}, // (Note: Your example had key:"conversion", using the provided list key "conversions")
    {title:"Cost", key:"cost"}, //
    {title:"Avg Cpc", key:"average_cpc"}, // (Note: Your example had key:"avg_cpc", using the provided list key "average_cpc")
    {title:"Conv rate", key:"conversion_rate"}, //
    {title:"Cost/Conv", key:"cost_per_conversion"}, //
    {title:"Revenue", key:"revenue"}, //
    {title:"ROAS", key:"roas"}, //
    {title:"Interaction Rate", key:"interaction_rate"}, //
    {title:"Interactions", key:"interactions"} //
  ])


  const fetchData = () => {
    setLoading(true);
    fetch("https://api.confidanto.com/device-chart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: "4643036315",
        metric: metric,
        start_date: props.previousDates.curr_start_date,
        end_date: props.previousDates.curr_end_date,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.device_chart_data || !Array.isArray(data.device_chart_data)) {
          throw new Error("Invalid API response");
        }

        

        // {id: 0, label: '18-24', value: 3} this format
        let formattedData = data.device_chart_data.map((item,index)=>{
          return {
            id:index,
            value:item[metric],
            label:item.device,
          }
        })

        setChartData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching chart data");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [metric]);

  const handleMetricChange = (e) => {
    setMetric(e.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <label className="mr-2">Metric:</label>
        <select
          value={metric}
          onChange={handleMetricChange}
          className="border border-gray-300 rounded-md p-2"
        >
          {allmetrics.map(item=>{
            return <option value={item.key}>{item.title}</option>
          })}
          {/* <option value="cost">Cost</option>
          <option value="ctr">CTR</option>
          <option value="clicks">Clicks</option> */}
        </select>
      </div>

      <div className="w-full h-auto bg-white shadow-lg rounded-lg p-6">
        {loading ? (
          <div className="text-center text-gray-600 py-10">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10">{error}</div>
        ) : chartData.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No data available</div>
        ) : (
          <PieChart
            series={[
              {
                data: chartData,
                highlightScope: { fade: "global", highlight: "item" },
                faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
              },
            ]}
            height={300}
          />
        )}
      </div>
    </div>
  );
};

export default DeviceChart;
