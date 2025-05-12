import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const GenderChart = ({ previousDates }) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState("impressions");

  const allMetrics = [
    { title: "Clicks", key: "clicks" },
    { title: "Impressions", key: "impressions" },
    { title: "Ctr", key: "ctr" },
    { title: "Conversions", key: "conversions" },
    { title: "Cost", key: "cost" },
    { title: "Avg Cpc", key: "average_cpc" },
    { title: "Conv rate", key: "conversion_rate" },
    { title: "Cost/Conv", key: "cost_per_conversion" },
    { title: "Revenue", key: "revenue" },
    { title: "ROAS", key: "roas" },
    { title: "Interaction Rate", key: "interaction_rate" },
    { title: "Interactions", key: "interactions" },
  ];

  const fetchData = () => {
    setLoading(true);
    fetch("https://api.confidanto.com/gender_chart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: "4643036315",
        metric,
        start_date: previousDates.curr_start_date,
        end_date: previousDates.curr_end_date,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const genderData = data.gender_chart_data || [];

        // Normalize and group by gender
        const genderCounts = genderData.reduce((acc, curr) => {
          const gender =
            curr.gender?.trim().toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) || "Undetermined";
          acc[gender] = (acc[gender] || 0) + curr[metric];
          return acc;
        }, {});

        const formattedData = Object.entries(genderCounts).map(([label, value], idx) => ({
          id: idx,
          label,
          value,
        }));

        setChartData(formattedData);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching gender chart:", err);
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
      {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">Gender Segmentation</h2> */}

      <div className="mb-4">
        <label className="mr-2">Metric:</label>
        <select
          value={metric}
          onChange={handleMetricChange}
          className="border border-gray-300 rounded-md p-2"
        >
          {allMetrics.map((item) => (
            <option key={item.key} value={item.key}>
              {item.title}
            </option>
          ))}
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
            slotProps={{
              legend: {
                direction: "column",
                position: { vertical: "top", horizontal: "right" },
                itemGap: 20,
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default GenderChart;
