import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const DonutChart = (props) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [metric, setMetric] = useState("cost");

  const allmetrics = [
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

  useEffect(() => {
    let isMounted = true;

    const fetchData = () => {
      setError(null);
      setLoading(true);

      const startDate = props.previousDates?.curr_start_date;
      const endDate = props.previousDates?.curr_end_date;

      if (!startDate || !endDate) {
        if (isMounted) {
          setError("Invalid date range provided.");
          setLoading(false);
        }
        return;
      }

      fetch("https://api.confidanto.com/age_chart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: "4643036315",
          metric: metric,
          start_date: startDate,
          end_date: endDate,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.age_chart_data || !Array.isArray(data.age_chart_data)) {
            throw new Error("Invalid API response");
          }

          const ageCounts = data.age_chart_data.reduce((acc, curr) => {
            const ageRange = curr.age_range
              .replace("AGE_RANGE_", "")
              .replace("_", "-")
              .replace("UP", "+");
            acc[ageRange] = (acc[ageRange] || 0) + curr[metric];
            return acc;
          }, {});

          const formattedData = Object.entries(ageCounts).map(
            ([label, value], index) => ({
              id: index,
              label,
              value,
            })
          );

          if (isMounted) {
            setChartData(formattedData);
          }
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          if (isMounted) {
            setError("Error fetching chart data");
          }
        })
        .finally(() => {
          if (isMounted) {
            setLoading(false);
          }
        });
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [metric, props.previousDates]);

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
          {allmetrics.map((item) => (
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
          />
        )}
      </div>
    </div>
  );
};

export default DonutChart;
