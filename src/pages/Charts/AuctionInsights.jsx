import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { IoMdClose } from "react-icons/io";

// Helpers
const normalize = (str) => str?.toString().trim().toLowerCase();
const getValue = (row, key) => {
  const match = Object.keys(row).find((k) => normalize(k) === normalize(key));
  return row[match];
};

const AuctionInsightsUploadChart = ({ arrayIndex, removeArrayIndex }) => {
  const [chartData, setChartData] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.match(/\.(xlsx|xls)$/)) {
      alert("Please upload a valid Excel file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      setLoading(true);
      try {
        const workbook = XLSX.read(evt.target.result, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);

        if (!data.length) {
          alert("No data found in the uploaded file.");
          setLoading(false);
          return;
        }

        const headers = Object.keys(data[0]).map(normalize);
        const hasRequiredHeaders =
          headers.includes("day") && headers.includes("impression share");

        if (!hasRequiredHeaders) {
          alert("Missing required columns: Day, Impression Share");
          setLoading(false);
          return;
        }

        const labels = data.map((row) => {
          const rawDate = getValue(row, "Day");
          const date = new Date(rawDate);
          return isNaN(date) ? rawDate : date.toLocaleDateString();
        });

        const impressionShare = data.map((row) =>
          parseFloat(getValue(row, "Impression Share")) || 0
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Impression Share",
              data: impressionShare,
              borderColor: "#42a5f5",
              backgroundColor: "#42a5f5",
              tension: 0.3,
              fill: false,
            },
          ],
        });

        setOriginalData(data);
      } catch (err) {
        alert("Failed to read file. Please make sure it's a valid Excel file.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  const exportChartData = () => {
    const ws = XLSX.utils.json_to_sheet(originalData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Auction Insights");
    XLSX.writeFile(wb, "auction_insights_export.xlsx");
  };

  return (
    <div className="mt-8 border border-gray-200 rounded-xl p-4 shadow-sm bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-blue-600">Auction Insights</h2>
        <button
          className="p-2 text-lg bg-red-600 text-white rounded-sm"
          onClick={() => removeArrayIndex(arrayIndex)}
        >
          <IoMdClose />
        </button>
      </div>

      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {loading && <p className="text-gray-500">Loading chart...</p>}

      {chartData && (
        <>
          <div className="overflow-x-auto">
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}%`,
                    },
                  },
                },
              }}
            />
          </div>

          <button
            onClick={exportChartData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Data
          </button>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm border border-gray-200">
              <thead className="bg-gray-100 font-semibold">
                <tr>
                  <th className="p-2 border">Day</th>
                  <th className="p-2 border">Domain Name</th>
                  <th className="p-2 border">Impression Share</th>
                  <th className="p-2 border">Avg. CPC</th>
                </tr>
              </thead>
              <tbody>
                {originalData.map((row, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 border">{getValue(row, "Day")}</td>
                    <td className="p-2 border">{getValue(row, "Domain Name")}</td>
                    <td className="p-2 border">{getValue(row, "Impression Share")}</td>
                    <td className="p-2 border">{getValue(row, "Avg. CPC")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AuctionInsightsUploadChart;
