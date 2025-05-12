import React, { useState, useEffect } from "react";
import axios from "axios";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

function GoogleAdsAlerts() {
  const [reportData, setReportData] = useState(null);
  const [nonPerformingAdCopies, setNonPerformingAdCopies] = useState([]);
  const [nonSpendingCampaigns, setNonSpendingCampaigns] = useState([]);
  const [overSpendingCampaigns, setOverSpendingCampaigns] = useState([]);
  const [currency, setCurrency] = useState(null);
  const [userBudget, setUserBudget] = useState(0);

  const [viewNonPerforming, setViewNonPerforming] = useState(false);
  const [viewNonSpending, setViewNonSpending] = useState(false);
  const [viewOverSpending, setViewOverSpending] = useState(false);

  const toggleNonPerforming = () => {
    setViewNonPerforming(!viewNonPerforming);
  };

  const toggleNonSpending = () => {
    setViewNonSpending(!viewNonSpending);
  };

  const toggleOverSpending = () => {
    setViewOverSpending(!viewOverSpending);
  };

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/weekly-reporting")
      .then((response) => {
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the report data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/non-performing-ad-copies")
      .then((response) => {
        if (response.data[0].Currency_code === "USD") {
          setCurrency("$");
        }
        setNonPerformingAdCopies(response.data);
      })
      .catch((error) => {
        console.error(
          "Error fetching the non-performing ad copies data:",
          error
        );
      });
  }, []);

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/non-spending-campaigns")
      .then((response) => {
        setNonSpendingCampaigns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the non-spending campaigns data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/over-spending-campaigns")
      .then((response) => {
        setOverSpendingCampaigns(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the non-spending campaigns data:", error);
      });
  }, []);

  if (!reportData) {
    return <div>Loading...</div>;
  }

  if (reportData && reportData.Currency_code === "USD") {
    setCurrency("$");
  }

  const handleBudgetChange = (e) => {
    setUserBudget(e.target.value);
  };

  const monthToDateSpend = () => {
    const totalSpend = reportData.totalCostWeek2 + reportData.totalCostWeek1;
    const totalBudget =
      reportData.totalBudgetWeek2 + reportData.totalBudgetWeek1;

    if (userBudget !== 0) {
      const monthToDateSpendPercentage = (totalSpend / userBudget) * 100;
      return monthToDateSpendPercentage.toFixed(2);
    }

    const monthToDateSpendPercentage = (totalSpend / totalBudget) * 100;
    return monthToDateSpendPercentage.toFixed(2);
  };

  return (
    <div className="bg-white p-6 m-4 rounded-md font-helvetica mb-16">
      <div className="flex justify-between py-4 my-2">
        <h1 className="text-2xl text-gray-600 font-semibold ">
          Google Ads Alerts
        </h1>
        <TooltipComponent content="Custom budget" position="BottomCenter">
          <div className="flex justify-center items-center w-full border border-gray-400 ml-4">
            {currency && (
              <label className=" text-base text-center border-r border-gray-400 py-2 px-3">
                {currency}
              </label>
            )}
            <input
              type="text"
              id="spend"
              className="bg-white text-gray-900 text-base block w-full p-2"
              placeholder="Enter budget"
              onChange={handleBudgetChange}
              required
            />
          </div>
        </TooltipComponent>
      </div>
      {reportData && (
        <div className="flex-col p-4 text-[#4142dc] shadow-md shadow-[#d9d9ec] rounded-md">
          <p className="text-xl">Month to Date Spend</p>
          <h1 className="text-3xl py-1">{monthToDateSpend()}%</h1>
        </div>
      )}
      {nonPerformingAdCopies && (
        <div className="overflow-auto mt-6 p-4 shadow-md shadow-[#d9d9ec] rounded-md">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl text-gray-600 font-semibold">
              Non-performing Campaigns
            </h1>
            <button
              className="text-2xl text-gray-600 mr-2"
              onClick={toggleNonPerforming}
            >
             {viewNonPerforming ? "-" : "+"}
            </button>
          </div>
          {viewNonPerforming && (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Campaign Status</th>
                  <th className="py-2 px-4 border-b">Campaign</th>
                  <th className="py-2 px-4 border-b">Budget Name</th>
                  <th className="py-2 px-4 border-b">Currency Code</th>
                  <th className="py-2 px-4 border-b">Budget</th>
                  <th className="py-2 px-4 border-b">Budget Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy Type</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Status Reasons</th>
                  <th className="py-2 px-4 border-b">Campaign Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy</th>
                  <th className="py-2 px-4 border-b">Impressions</th>
                  <th className="py-2 px-4 border-b">Clicks</th>
                  <th className="py-2 px-4 border-b">CTR</th>
                  <th className="py-2 px-4 border-b">Cost</th>
                  <th className="py-2 px-4 border-b">Avg CPC</th>
                  <th className="py-2 px-4 border-b">Conversions</th>
                  <th className="py-2 px-4 border-b">Cost per Conversion</th>
                  <th className="py-2 px-4 border-b">Conversion Rate</th>
                  <th className="py-2 px-4 border-b">Impressions Abs Top</th>
                  <th className="py-2 px-4 border-b">Impressions Top</th>
                  <th className="py-2 px-4 border-b">eComm Revenue</th>
                </tr>
              </thead>
              <tbody>
                {nonPerformingAdCopies.map((campaign, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_status}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Campaign}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Currency_code}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Budget}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy_type}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Status}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Status_reasons}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr}</td>
                    <td className="py-2 px-4 border-b">{campaign.Clicks}</td>
                    <td className="py-2 px-4 border-b">{campaign.CTR}</td>
                    <td className="py-2 px-4 border-b">{campaign.Cost}</td>
                    <td className="py-2 px-4 border-b">{campaign.Avg_CPC}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Conversions}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Cost_per_conv}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Conv_rate}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Impr_Abs_Top}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr_Top}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.eComm_Revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {nonSpendingCampaigns && (
        <div className="overflow-auto mt-6 p-4 shadow-md shadow-[#d9d9ec] rounded-md">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl text-gray-600 font-semibold">
              Non-spending Campaigns
            </h1>
            <button
              className="text-2xl text-gray-600 mr-2"
              onClick={toggleNonSpending}
            >
              {viewNonSpending ? "-" : "+"}
            </button>
          </div>
          {viewNonSpending && (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Campaign Status</th>
                  <th className="py-2 px-4 border-b">Campaign</th>
                  <th className="py-2 px-4 border-b">Budget Name</th>
                  <th className="py-2 px-4 border-b">Currency Code</th>
                  <th className="py-2 px-4 border-b">Budget</th>
                  <th className="py-2 px-4 border-b">Budget Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy Type</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Status Reasons</th>
                  <th className="py-2 px-4 border-b">Campaign Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy</th>
                  <th className="py-2 px-4 border-b">Impressions</th>
                  <th className="py-2 px-4 border-b">Clicks</th>
                  <th className="py-2 px-4 border-b">CTR</th>
                  <th className="py-2 px-4 border-b">Cost</th>
                  <th className="py-2 px-4 border-b">Avg CPC</th>
                  <th className="py-2 px-4 border-b">Conversions</th>
                  <th className="py-2 px-4 border-b">Cost per Conversion</th>
                  <th className="py-2 px-4 border-b">Conversion Rate</th>
                  <th className="py-2 px-4 border-b">Impressions Abs Top</th>
                  <th className="py-2 px-4 border-b">Impressions Top</th>
                  <th className="py-2 px-4 border-b">eComm Revenue</th>
                </tr>
              </thead>
              <tbody>
                {nonSpendingCampaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_status}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Campaign}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Currency_code}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Budget}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy_type}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Status}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Status_reasons}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr}</td>
                    <td className="py-2 px-4 border-b">{campaign.Clicks}</td>
                    <td className="py-2 px-4 border-b">{campaign.CTR}</td>
                    <td className="py-2 px-4 border-b">{campaign.Cost}</td>
                    <td className="py-2 px-4 border-b">{campaign.Avg_CPC}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Conversions}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Cost_per_conv}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Conv_rate}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Impr_Abs_Top}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr_Top}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.eComm_Revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {overSpendingCampaigns && (
        <div className="overflow-auto mt-6 p-4 shadow-md shadow-[#d9d9ec] rounded-md">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl text-gray-600 font-semibold">
              Over-spending Campaigns
            </h1>
            <button
              className="text-2xl text-gray-600 mr-2 border-none"
              onClick={toggleOverSpending}
            >
              {viewOverSpending ? "-" : "+"}
            </button>
          </div>
          {viewOverSpending && (
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Campaign Status</th>
                  <th className="py-2 px-4 border-b">Campaign</th>
                  <th className="py-2 px-4 border-b">Budget Name</th>
                  <th className="py-2 px-4 border-b">Currency Code</th>
                  <th className="py-2 px-4 border-b">Budget</th>
                  <th className="py-2 px-4 border-b">Budget Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy Type</th>
                  <th className="py-2 px-4 border-b">Status</th>
                  <th className="py-2 px-4 border-b">Status Reasons</th>
                  <th className="py-2 px-4 border-b">Campaign Type</th>
                  <th className="py-2 px-4 border-b">Bid Strategy</th>
                  <th className="py-2 px-4 border-b">Impressions</th>
                  <th className="py-2 px-4 border-b">Clicks</th>
                  <th className="py-2 px-4 border-b">CTR</th>
                  <th className="py-2 px-4 border-b">Cost</th>
                  <th className="py-2 px-4 border-b">Avg CPC</th>
                  <th className="py-2 px-4 border-b">Conversions</th>
                  <th className="py-2 px-4 border-b">Cost per Conversion</th>
                  <th className="py-2 px-4 border-b">Conversion Rate</th>
                  <th className="py-2 px-4 border-b">Impressions Abs Top</th>
                  <th className="py-2 px-4 border-b">Impressions Top</th>
                  <th className="py-2 px-4 border-b">eComm Revenue</th>
                </tr>
              </thead>
              <tbody>
                {overSpendingCampaigns.map((campaign, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_status}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Campaign}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_name}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Currency_code}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Budget}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Budget_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy_type}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Status}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Status_reasons}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Campaign_type}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Bid_strategy}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr}</td>
                    <td className="py-2 px-4 border-b">{campaign.Clicks}</td>
                    <td className="py-2 px-4 border-b">{campaign.CTR}</td>
                    <td className="py-2 px-4 border-b">{campaign.Cost}</td>
                    <td className="py-2 px-4 border-b">{campaign.Avg_CPC}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Conversions}
                    </td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Cost_per_conv}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Conv_rate}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.Impr_Abs_Top}
                    </td>
                    <td className="py-2 px-4 border-b">{campaign.Impr_Top}</td>
                    <td className="py-2 px-4 border-b">
                      {campaign.eComm_Revenue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default GoogleAdsAlerts;
