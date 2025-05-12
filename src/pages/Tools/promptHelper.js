import axios from "axios";

const fetchCampaignData = async (dateRange) => {
  try {
    const response = await axios.post(
      "https://api.confidanto.com/get-campaign-level-data",
      {
        customer_id: "4643036315",
        date_range: dateRange,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching campaign data:", error);
    return [];
  }
};

const generateCampaignTable = (data) => {
  if (!data || Object.keys(data).length === 0) {
    return <p>No campaign data available for the selected period.</p>;
  }

  return (
    <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
      <h2 className="mb-3 text-lg font-semibold">Campaign Overview</h2>
      <table className="w-full border-collapse text-center bg-gray-200">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-2 border border-gray-600">Start Date</th>
            <th className="p-2 border border-gray-600">End Date</th>
            <th className="p-2 border border-gray-600">Impressions</th>
            <th className="p-2 border border-gray-600">Clicks</th>
            <th className="p-2 border border-gray-600">CTR (%)</th>
            <th className="p-2 border border-gray-600">Conversions</th>
            <th className="p-2 border border-gray-600">Cost (USD)</th>
            <th className="p-2 border border-gray-600">CPC (USD)</th>
            <th className="p-2 border border-gray-600">ROAS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2 border border-gray-600">{data.start_date}</td>
            <td className="p-2 border border-gray-600">{data.end_date}</td>
            <td className="p-2 border border-gray-600">{data.impressions}</td>
            <td className="p-2 border border-gray-600">{data.clicks}</td>
            <td className="p-2 border border-gray-600">
              {data.ctr.toFixed(2)}
            </td>
            <td className="p-2 border border-gray-600">
              {data.costs > 0
                ? (data.conversions / data.costs).toFixed(2)
                : "N/A"}
            </td>

            <td className="p-2 border border-gray-600">
              ${data.costs.toFixed(2)}
            </td>
            <td className="p-2 border border-gray-600">
              ${data.average_cpc.toFixed(2)}
            </td>
            <td className="p-2 border border-gray-600">
              {(data.conversions / (data.costs || 1)).toFixed(2)}
            </td>
            <td className="p-2 border border-gray-600">
              {data.ctr ? data.ctr.toFixed(2) : "N/A"}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Report Section */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-lg font-semibold">Performance Report</h3>
        <p>
          Total Impressions:{" "}
          <span className="font-bold">{data.impressions.toLocaleString()}</span>
        </p>
        <p>
          Total Clicks:{" "}
          <span className="font-bold">{data.clicks.toLocaleString()}</span>
        </p>
        <p>
          Average CTR: <span className="font-bold">{data.ctr.toFixed(2)}%</span>
        </p>
        <p>
          Total Conversions:{" "}
          <span className="font-bold">{data.conversions.toLocaleString()}</span>
        </p>
        <p>
          Total Cost:{" "}
          <span className="font-bold">${data.costs.toFixed(2)}</span>
        </p>
        <p>
          Average CPC: <span className="font-bold">${data.average_cpc}</span>
        </p>
        <p>
          Overall ROAS:{" "}
          <span className="font-bold">
            {(data.conversions / (data.costs || 1)).toFixed(2)}
          </span>
        </p>
      </div>
    </div>
  );
};

const processPromptChatBox = async (text) => {
  text = text.toLowerCase().trim();

  const dateRanges = {
    today: "TODAY",
    yesterday: "YESTERDAY",
    "last 7 days": "LAST_7_DAYS",
    "last 14 days": "LAST_14_DAYS",
    "last 30 days": "LAST_30_DAYS",
    "this month": "THIS_MONTH",
    "last month": "LAST_MONTH",
  };

  let foundKey = Object.keys(dateRanges).find((key) => text.includes(key));
  if (foundKey) {
    const campaignData = await fetchCampaignData(dateRanges[foundKey]);
    return { answer: generateCampaignTable(campaignData) };
  }

  return { answer: <p>No matching response found.</p> };
};

export { processPromptChatBox };
