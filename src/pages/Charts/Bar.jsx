import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
} from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const metricOptions = [
  "clicks",
  "average_cpc",
  "ctr",
  "cost",
  "interaction_rate",
  "avg_cost",
  "conversions",
  "cost_per_conv",
  "cost_per_conversion",
  "impressions",
];

const ChartPage = ({ customerId, startDate, endDate }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedMetrics, setSelectedMetrics] = useState([
    "clicks",
    "average_cpc",
    "ctr",
    "cost",
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDataAvailable, setIsDataAvailable] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    setIsLoading(true);
  
    const isDummy = customerId === "7948821642";
  
    const requestBody = {
      customer_id: customerId,
      metrics: selectedMetrics, // ✅ Use selected metrics for both dummy & real
      start_date: isDummy ? "2020-10-10" : startDate,
      end_date: isDummy ? "2034-10-12" : endDate,
    };
  
    const apiUrl = isDummy
      ? "https://auth.confidanto.com/fetch_dummy/chart_campaigns"
      : "https://api.confidanto.com/campaign-chart";
  
    axios
      .post(apiUrl, requestBody)
      .then((response) => {
        const responseData = response.data;
  
        if (responseData && responseData.length > 0) {
          setIsDataAvailable(true);
  
          const normalizedData = isDummy
            ? responseData.map((item) => ({
                ...item,
                date: new Date(item.day).toISOString().split("T")[0],
              }))
            : responseData;
  
          formatChartData(normalizedData);
        } else {
          setIsDataAvailable(false);
        }
      })
      .catch(() => setIsDataAvailable(false))
      .finally(() => setIsLoading(false));
  }, [selectedMetrics, customerId, startDate, endDate]);
  
  const formatChartData = (data) => {
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = { date: item.date };
        selectedMetrics.forEach((metric) => {
          acc[item.date][metric] = 0;
        });
      }
      selectedMetrics.forEach((metric) => {
        acc[item.date][metric] += item[metric] || 0;
      });
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedData).sort();
    const labels = sortedDates.map((date) => date);
    const datasets = selectedMetrics.map((metric, index) => ({
      label: metric.replace(/_/g, " ").toUpperCase(),
      data: sortedDates.map((date) => groupedData[date][metric]),
      borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
      backgroundColor: `hsl(${(index * 60) % 360}, 70%, 70%)`,
      pointBackgroundColor: hoveredIndex !== null ? `hsl(${(index * 60) % 360}, 100%, 40%)` : "",
      pointRadius: (ctx) => (ctx.dataIndex === hoveredIndex ? 6 : 3),
      borderWidth: 2,
      hoverBorderWidth: 4,
    }));

    setChartData({ labels, datasets });
  };

  return (
    <div className="w-1700 md:w-11/12 h-screen ml-16 flex flex-col bg-gray-100 p-4">
      <div className="flex justify-center items-center  gap-4 p-4  bg-white shadow-md">
        <FormControl sx={{ minWidth: 300 }}>
          <InputLabel>Select Metrics</InputLabel>
          <Select
            multiple
            value={selectedMetrics}
            onChange={(e) => setSelectedMetrics(e.target.value)}
            input={<OutlinedInput label="Select Metrics" />}
            renderValue={(selected) => (
              <div className="flex flex-wrap gap-1">
                {selected.map((value) => (
                  <Chip key={value} label={value.replace(/_/g, " ")} />
                ))}
              </div>
            )}
          >
            {metricOptions.map((metric) => (
              <MenuItem key={metric} value={metric}>
                {metric.replace(/_/g, " ")}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div className="flex-grow flex items-center  justify-center bg-white p-4 shadow-md w-full h-full">
        {isLoading ? (
          <p className="text-gray-500">Loading chart...</p>
        ) : isDataAvailable ? (
          <div className="w-full h-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  tooltip: {
                    mode: "index",
                    intersect: false,
                    callbacks: {
                      label: function (tooltipItem) {
                        setHoveredIndex(tooltipItem.dataIndex);
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
                onHover: (event, chartElements) => {
                  if (chartElements.length > 0) {
                    setHoveredIndex(chartElements[0].index);
                  }
                },
                elements: {
                  line: {
                    borderWidth: 2,
                    hoverBorderWidth: 4,
                  },
                },
              }}
            />
          </div>
        ) : (
          <p className="text-gray-500 font-bold">No Data Available</p>
        )}
      </div>
    </div>
  );
};

export default ChartPage;
