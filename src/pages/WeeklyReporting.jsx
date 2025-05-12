import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  IoIosArrowDown,
  IoIosArrowRoundDown,
  IoIosArrowRoundUp,
} from "react-icons/io";
import { Tooltip } from "chart.js";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

// Function to get the current day of the week
const getCurrentDay = () => {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  return daysOfWeek[today.getDay()];
};

function WeeklyReporting() {
  const currentDay = getCurrentDay();

  const [reportData, setReportData] = useState(null);
  const [reportDataDetailed, setReportDataDetailed] = useState(null);


  useEffect(() => {
    axios
      .post("http://localhost:3001/weekly-reporting")
      .then((response) => {
        console.log(response.data);
        setReportData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the report data:", error);
      });
  }, []);
  console.log(reportData);

  useEffect(() => {
    axios
      .post(
        "http://localhost:3001/weekly-reporting/compare-campaigns-data-weekly"
      )
      .then((response) => {
        console.log(response.data);
        setReportDataDetailed(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the report data:", error);
      });
  }, []);

  if (!reportData || !reportDataDetailed.length) {
    return <div>Loading...</div>;
  }

  const monthToDateSpend = () => {
    const totalSpend = reportData.totalCostWeek2 + reportData.totalCostWeek1;
    const totalBudget = reportData.totalBudgetWeek2 + reportData.totalBudgetWeek1;

    const monthToDateSpendPercentage = (totalSpend / totalBudget) * 100;
    return monthToDateSpendPercentage.toFixed(2);
  }

  console.log(monthToDateSpend());

  const formatPercent = (value) => {
    const formattedValue = value.toFixed(2);
    const icon = value >= 0 ? "fa-arrow-up" : "fa-arrow-down";
    return (
      <span className="flex text-base">
        {value >= 0 ? (
          <IoIosArrowRoundUp className="text-green-500 text-lg" />
        ) : (
          <IoIosArrowRoundDown className="text-red-500 text-lg" />
        )}
        {value >= 0 ? `+${formattedValue}%` : `${formattedValue}%`}
      </span>
    );
  };
  console.log(reportDataDetailed.length);
  // Filter significant drops and increases
  const filterSignificantChanges = (campaigns, status) => {
    return campaigns.filter(
      (campaign) =>
        campaign.status === status && parseFloat(campaign.changePercent) < -10
    );
  };

  function convertToK(value) {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + "k";
    }
    return value.toString();
  }
  return (
    <div className="bg-white p-6 m-4 rounded-md font-helvetica mb-16">
      <div className="flex justify-between py-4">
        <h1 className="text-2xl text-gray-600 font-semibold ">
          Weekly Reporting
        </h1>
        <TooltipComponent content="Custom budget" position="BottomCenter">
          <input
            type="text"
            placeholder="Enter budget"
            className="px-2 py-1.5 text-base border border-gray-400 w-52"
          />
        </TooltipComponent>
      </div>
      <section>
        <h2 className="text-lg text-gray-600 py-2 font-semibold">Overview</h2>
        <p className="text-lg text-gray-600 py-2 font-semibold">Hi Team,</p>
        <p className="text-lg text-gray-600 py-2 font-semibold">
          Happy {currentDay}!
        </p>

        {reportData && (
          <div className="bg-white my-4 rounded-md  mb-8">
            <h2 className="text-xl font-semibold text-gray-600">
              Metrics Comparison
            </h2>
            <table className="min-w-full bg-white border border-gray-200 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border-b">Week</th>
                  <th className="p-2 border-b">Cost</th>
                  <th className="p-2 border-b">Clicks</th>
                  <th className="p-2 border-b">Impressions</th>
                  <th className="p-2 border-b">CTR</th>
                  <th className="p-2 border-b">Avg CPC</th>
                  <th className="p-2 border-b">Conversions</th>
                  <th className="p-2 border-b">Cost/Conv</th>
                  <th className="p-2 border-b">Conv. Rate</th>
                  <th className="p-2 border-b">Impr. Abs Top</th>
                  <th className="p-2 border-b">Impr. Top %</th>
                  <th className="p-2 border-b">EComm Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.data_name}
                  </td>
                  <td className="p-2 border-b">
                    ${reportData.additionalFieldsWeek1.total_cost.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_clicks.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_impressions.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_ctr.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    ${reportData.additionalFieldsWeek1.total_avg_cpc.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_conversions}
                  </td>
                  <td className="p-2 border-b">
                    $
                    {reportData.additionalFieldsWeek1.total_cost_per_conv.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_conv_rate.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_impr_abs_top.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_impr_top.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek1.total_ecomm_revenue.toFixed(
                      2
                    )}
                  </td>
                </tr>
                <tr className="border-t bg-gray-50">
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.data_name}
                  </td>
                  <td className="p-2 border-b">
                    ${reportData.additionalFieldsWeek2.total_cost.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_clicks.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_impressions.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_ctr.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    ${reportData.additionalFieldsWeek2.total_avg_cpc.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_conversions}
                  </td>
                  <td className="p-2 border-b">
                    $
                    {reportData.additionalFieldsWeek2.total_cost_per_conv.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_conv_rate.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_impr_abs_top.toFixed(
                      2
                    )}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_impr_top.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {reportData.additionalFieldsWeek2.total_ecomm_revenue.toFixed(
                      2
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-600">Category wise</h1>
          {reportDataDetailed.length > 0 && (
            <table className="mb-12 w-full mt-4">
              <thead>
                <tr className=" bg-[#2930a8] text-white">
                  <th className="p-2 border-b text-left">Campaign</th>
                  <th className="p-2 border-b text-left">Impressions</th>
                  <th className="p-2 border-b text-left">% Δ</th>
                  <th className="p-2 border-b text-left">Clicks</th>
                  <th className="p-2 border-b text-left">% Δ</th>
                  <th className="p-2 border-b text-left">Cost</th>
                  <th className="p-2 border-b text-left">% Δ</th>
                </tr>
              </thead>
              <tbody>
                {reportDataDetailed.map((campaign) => (
                  <tr key={campaign.campaign} className="border-t">
                    <td className="p-2 border-b">{campaign.campaign}</td>
                    <td className="p-2 border-b">{campaign.impr_23_july}</td>
                    <td className="p-2 border-b">
                      {formatPercent(campaign.impr_change_percent)}
                    </td>
                    <td className="p-2 border-b">{campaign.clicks_23_july}</td>
                    <td className="p-2 border-b">
                      {formatPercent(campaign.clicks_change_percent)}
                    </td>
                    <td className="p-2 border-b">
                      ${campaign.cost_23_july.toFixed(2)}
                    </td>
                    <td className="p-2 border-b">
                      {formatPercent(campaign.cost_change_percent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="flex">
          <h1 className="my-4 text-base"><b>Month To Date spend</b>: {monthToDateSpend()}</h1>
        </div>

        <ol className="list-decimal ml-4">
          {reportData && (
            <li>
              <p className="py-2">
                When reviewing the account over the weekend, we spent{" "}
                <span className="font-semibold text-green-500 text-lg">
                  ${convertToK(reportData.totalCostWeek1)}
                </span>{" "}
                and generated{" "}
                <span className="font-semibold text-blue-600 text-lg">
                  $
                  {convertToK(
                    reportData.additionalFieldsWeek1.total_ecomm_revenue
                  )}
                </span>{" "}
                in eComm revenue, resulting in an estimated Omni ROAS of{" "}
                <span className="font-semibold text-yellow-500 text-lg">
                  $10.52
                </span>{" "}
                with a{" "}
                <span className="font-semibold text-purple-500 text-lg">
                  2.27%
                </span>{" "}
                eComm CVR.
              </p>
            </li>
          )}
          <li>
            <p className="py-2">
              The promotions running this weekend included 25% off the entire
              purchase, 60% off Outdoor SUT, a storewide stockroom sale, and
              BOPIS 20/10. Compared to last weekend, we had two additional
              promotions running, which accounts for a slight decline in WoW
              (Weekend over Weekend) performance. Additionally, we faced
              increased competition from Wayfair and other competitors, who were
              running significant sales, contributing to some metric declines.
            </p>
          </li>
          <li>
            <p className="py-2">
              Additionally, we faced increased competition from Wayfair and
              other competitors, who were running significant sales,
              contributing to some metric declines.
            </p>
          </li>
          <li>
            <p className="py-2">
              On Saturday, we adjusted our target for living furniture from
              $7.50 to $7.25, and on Sunday, we adjusted our target for outdoor
              furniture from $6.75 to $6.50. These changes helped us get closer
              to our spending goal over the weekend. We are currently 90%
              through the month and 92% through the budget. For today and the
              rest of July, our spending guidance is $30.5K per day.
            </p>
          </li>
        </ol>
      </section>

      <section>
        <h1 className="text-xl py-2 font-semibold text-gray-600">
          BRAND: (WoW = weekend over weekend)
        </h1>
        <p className="py-2">
          When reviewing the Brand performance, the cost is relatively flat WoW
          showing a slight increase of 0.86%. eComm revenue is down by 13%,
          which is expected due to having two fewer promotions this weekend and
          facing significant sales from competitors. However, we saw a 12% spike
          in BOPIS revenue and a 4% increase in BOPIS orders WoW.
        </p>
        <p className="py-2">
          The Brand Core|Exact and Brand PLA campaigns generated a combined
          total of $265.4K in eComm revenue, with both campaigns achieving an
          estimated Omni ROAS above $12. Additionally, these two brand campaigns
          were the primary drivers of our BOPIS orders, contributing a total of
          852 orders, marking a 10% increase WoW.
        </p>
      </section>

      <section>
        <h2 className="text-xl py-2 font-semibold text-gray-600">
          NON-BRAND: (WoW = weekend over weekend)
        </h2>
        <p className="py-2">
          Non-brand spend decreased by 33%, leading to a corresponding 33% drop
          in eComm revenue compared to last weekend. Despite this, our ROAS
          improved by 6% WoW, indicating stronger efficiency. These declines are
          due to adjusting our spend to align with our daily spend guidance and
          avoid over pacing.
        </p>
        <p className="py-2">
          Please note that when comparing this weekend's spend and metrics, we
          spent 33% more last weekend due to the multiple promotions we had
          running.
        </p>
        <ul className="py-2">
          <li>Last weekend at $53.8K</li>
          <li>This weekend at $36.2K</li>
        </ul>
        <h3 className="text-lg py-2 font-semibold text-gray-600">
          Non-Brand Category Weekend Callouts:
        </h3>
        <ul className="py-2 list-disc ml-4">
          <li>
            Living Furniture: +138% eComm Revenue WoW with Est. Omni ROAS $7.65
            at 1.30% CVR
          </li>
          <li>
            Dining Furniture: +143% eComm Revenue DoD with Est. Omni ROAS $7.69
            at 1.09% CVR
          </li>
          <li>
            Outdoor Furniture: -45% eComm Revenue DoD with Est. Omni ROAS $8.02
            at 2.46% CVR
          </li>
        </ul>
      </section>

      <section>
        <p className="py-2 ">
          <h2 className="font-semibold text-red-500 underline">
            Action Items:{" "}
          </h2>
          After implementing changes at the beginning of last week and over the
          weekend, we are in a strong position. We will monitor performance
          today and will notify you of any opportunities in our outdoor or
          furniture categories to maximize our promotions.
        </p>
      </section>

      <section>
        <h2 className="text-lg py-2 font-semibold text-gray-600">
          Non-eCommerce Brand Data
        </h2>
        <ul className="ml-4 list-disc">
          <li>
            <p className="py-2">
              <b>Search:</b> While impressions were down by 14%, clicks
              decreased by 26% WoW. This led to a CTR decrease of 14% (down to
              19%). CPCs increased by 23% and were at $0.96. Budgets were
              reduced, which led to lower spend overall (an 8% decrease).
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>Masterpiece USA:</b> Impressions and clicks decreased by 34%
              and 41% respectively, with CPCs falling by 45%. This, together
              with budget pullbacks, led to a 68% spend decrease.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>General Channel Campaigns (LF/MF):</b> Click volume for the MF
              campaign decreased by 40%, while click volume for the LF campaign
              decreased by 43%. Overall CTR was at 22% for the MF campaign and
              at 32% for the LF campaign.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>RFDS S2:</b> This show drove a total of 80 impressions and 5
              clicks across both LF and MF campaigns. All 5 clicks were on the
              MF campaign. CTR was at 7%. All the impressions for the MF
              campaign (67) were driven by the keyword [Royal Flying Doctor
              Service].
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>Masterpiece Canada:</b> Impressions and clicks decreased by 68%
              and 60% respectively WoW. Avg. CPCs decreased by 17% (down to
              $0.52), with CTR increasing by 25% (up to 41%).
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>General Channel MF:</b> This campaign was the top traffic
              driver despite a 56% decrease in impressions and a 61% decrease in
              clicks. CPCs were down by 10%, and ended at $0.45 for the week.
              Spend was down 65%.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>KIDS:</b> Due to an increase in budgets, impressions increased
              by 83%, while clicks increased by 54%. This led to a 16% decrease
              in CTR (down to 16%). Spend increased by 92%, with a 24% increase
              in CPCs.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>Bluey UF:</b> This campaign got the second highest amount of
              impressions for the channel, with the fourth highest amount of
              clicks. The keyword [Bluey] drove most of the impressions and
              clicks.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>Documentaries:</b> Impressions fell by 51%, with clicks falling
              by 50% WoW. Spend was down 25% following a 48% increase in CPCs.
              CTR was at 19%, which was a 2% increase.
            </p>
          </li>
          <li>
            <p className="py-2">
              <b>20 Days in Mariupol (LF/MF):</b> Overall impressions were
              2,077, with 283 overall clicks, and a CTR at 14%. CPCs were $1.29
              for the MF campaign, and $2.09 for the LF campaign.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default WeeklyReporting;
