import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import LoadingAnimation from "../components/LoadingAnimation";
import AddCampaignTableReporting from "./AddCampaignTableReporting";
import { dailyReportInitalParagraph } from "./dailyReportHelper";
import AddChart from "./ChartAdd";

import { IoMdShareAlt } from "react-icons/io";
import { FaColumns, FaFilter } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import ModifyColumns from "./Tools/ModifyColumns";
import CategoryReporting from "./CategoryReporting";

function GoogleAdsDailyReporting() {
  const [reportData, setReportData] = useState(null);
  const [reportDataDetailed, setReportDataDetailed] = useState(null);
  const [initialParagraph, setInitialParagraph] = useState("");
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [data, setData] = useState("");
  const [insight, setInsight] = useState("");
  const [visibleColumns, setVisibleColumns] = useState({
    date: true,
    cost: true,
    clicks: true,
    impressions: true,
    ctr: true,
    avgCpc: true,
    conversions: true,
    costPerConv: true,
    convRate: true,
  });
  const [reportDataArray, setReportDataArray] = useState([]);
  const [tableVisible, setTableVisible] = useState();
  const [columns, setColumns] = useState([
    {
      id: "1",
      title: "Date",
      key: "date",
      visible: true,
      category: "Attributes",
      isLocked: true, 
    },
    {
      id: "2",
      title: "Cost",
      key: "cost",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "3",
      title: "Clicks",
      key: "clicks",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "4",
      title: "Impressions",
      key: "impressions",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "5",
      title: "CTR",
      key: "ctr",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "6",
      title: "Avg CPC",
      key: "avgCpc",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "7",
      title: "Conversions",
      key: "conversions",
      visible: true,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "8",
      title: "Cost Per Conversion",
      key: "costPerConv",
      visible: true,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "9",
      title: "Conversion Rate",
      key: "convRate",
      visible: true,
      category: "Conversions",
      isLocked: false,
    },
  ]);
  // perc: ctr, avgCpc, (diffall)
  const [currencySymbol, setCurrencySymbol] = useState("₹");
  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
  
    if (customerId === "7948821642") {
      setCurrencySymbol("$");
    } else {
      setCurrencySymbol("₹");
    }
  }, []);
  
  // prvious dates
  function getPreviousDays() {
    const today = new Date(); // Get the current date and time

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const dayBeforeYesterday = new Date(today);
    dayBeforeYesterday.setDate(today.getDate() - 2);

    function formatDate(date) {
      const year = date.getFullYear();
      // getMonth() is 0-indexed (0=Jan, 11=Dec), so add 1
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return {
      curr_start_date: formatDate(yesterday),
      curr_end_date: formatDate(yesterday),
      prev_start_date: formatDate(dayBeforeYesterday),
      prev_end_date: formatDate(dayBeforeYesterday),
    };
  }
  const [previousDates, setPreviousDates] = useState(getPreviousDays());
  const [categoryInsightUrl, setCategoryInsightUrl] = useState(
    "https://api.confidanto.com/gemini-insights/category-daily-insights"
  );

  const componentRef = useRef(null);

  useEffect(() => {
    const fetchInsightData = async () => {
      const customerId = localStorage.getItem("customer_id");
      const email = localStorage.getItem("email");
  
      try {
        const selectedMetrics = [
          "totalCTRDayBeforeYesterday", "totalCTRYesterday",
          "totalClicksDayBeforeYesterday", "totalClicksYesterday",
          "totalImpressionsDayBeforeYesterday", "totalImpressionsYesterday",
          "totalCostDayBeforeYesterday", "totalCostYesterday",
          "totalAvgCPCDayBeforeYesterday", "totalAvgCPCYesterday",
          "totalCostPerConvDayBeforeYesterday", "totalCostPerConvYesterday",
          "totalConversionsDayBeforeYesterday", "totalConversionsYesterday",
          "totalInteractionsYesterday", "totalInteractionsDayBeforeYesterday",
          "totalInteractionRateYesterday", "totalInteractionRateDayBeforeYesterday",
          "totalAverageCostYesterday", "totalAverageCostDayBeforeYesterday",
          "totalConvRateYesterday", "totalConvRateDayBeforeYesterday"
        ];
  
        const response = await fetch(
          "https://api.confidanto.com/generate-insights/yesterday-vs-day-before-insights",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: customerId,
              email: email,
              selectedMetrics: selectedMetrics,
            }),
          }
        );
  
        const result = await response.json();
        console.log("Insight data:", result);
        setInsight(result.insights); // unified handling
      } catch (error) {
        console.error("Error fetching insights:", error);
      }
    };
  
    fetchInsightData();
  }, []);
  
  useEffect(() => {
    if (reportData) {
      dailyReportInitalParagraph(reportData, setInitialParagraph);
    }
  }, [reportData]); // This effect will run only when reportData changes

  useEffect(() => {
    const fetchReportData = async () => {
      const customerId = localStorage.getItem("customer_id");
      const email = localStorage.getItem("email");
  
      try {
        let response, data;
  
        if (customerId === "7948821642") {
          response = await fetch(
            "https://auth.confidanto.com/fetch_dummy/daily_reporting",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customer_id: "7948821642",
                start_date: "2024-10-10",
                end_date: "2025-02-12",
              }),
            }
          );
          data = await response.json();
        } else {
          response = await fetch(
            "https://api.confidanto.com/daily-reporting/yesterday-day-before-yesterday-compare",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                customer_id: customerId,
                email: email,
              }),
            }
          );
          data = await response.json();
        }
  
        function transformDataForTable(data) {
          if (!data) return [];
  
          const transformedData = [
            {
              date: data.yesterdayDate,
              cost: data.additionalFieldsYesterday.total_cost,
              clicks: data.additionalFieldsYesterday.total_clicks,
              impressions: data.additionalFieldsYesterday.total_impressions,
              ctr: data.additionalFieldsYesterday.total_ctr,
              avgCpc: data.additionalFieldsYesterday.total_avg_cpc,
              conversions: data.additionalFieldsYesterday.total_conversions,
              costPerConv: data.additionalFieldsYesterday.total_cost_per_conv,
              convRate: data.additionalFieldsYesterday.total_conv_rate,
              type: "yesterday",
            },
            {
              date: data.dayBeforeYesterdayDate,
              cost: data.additionalFieldsDayBeforeYesterday.total_cost,
              clicks: data.additionalFieldsDayBeforeYesterday.total_clicks,
              impressions: data.additionalFieldsDayBeforeYesterday.total_impressions,
              ctr: data.additionalFieldsDayBeforeYesterday.total_ctr,
              avgCpc: data.additionalFieldsDayBeforeYesterday.total_avg_cpc,
              conversions: data.additionalFieldsDayBeforeYesterday.total_conversions,
              costPerConv: data.additionalFieldsDayBeforeYesterday.total_cost_per_conv,
              convRate: data.additionalFieldsDayBeforeYesterday.total_conv_rate,
              type: "dayBeforeYesterday",
            },
            {
              date: "Difference",
              cost: data.changePercentCost,
              clicks: data.changePercentClicks,
              impressions: data.changePercentImpressions,
              ctr: data.changePercentCTR,
              avgCpc: data.changePercentAvgCPC,
              conversions: data.changePercentConversions,
              costPerConv: data.changePercentCostPerConv,
              convRate: data.changePercentConvRate,
              type: "difference",
            },
          ];
  
          return transformedData;
        }
  
        const transformedData = transformDataForTable(data);
        console.info("Transformed Data: ", transformedData);
        setReportDataArray(transformedData);
        setReportData(data);
        dailyReportInitalParagraph(data);
      } catch (error) {
        console.error("Error fetching the report data:", error);
      }
    };
  
    fetchReportData();
  }, []);
  

  useEffect(() => {
    axios
      .post("https://api.confidanto.com/daily-reporting/compare-campaigns-data")
      .then((response) => {
        setReportDataDetailed(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the report data:", error);
      });
  }, []);

  if (!reportData || !reportDataDetailed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  // Filter significant drops and increases
  const filterSignificantChanges = (campaigns, status) => {
    return campaigns.filter(
      (campaign) =>
        campaign.status === status &&
        parseFloat(Math.abs(campaign.changePercent)) > 10
    );
  };

  const brandDrops = filterSignificantChanges(
    reportData.brandCampaigns,
    "down"
  );
  const nonBrandDrops = filterSignificantChanges(
    reportData.nonBrandCampaigns,
    "down"
  );

  const brandIncreases = filterSignificantChanges(
    reportData.brandCampaigns,
    "up"
  );
  const nonBrandIncreases = filterSignificantChanges(
    reportData.nonBrandCampaigns,
    "up"
  );

  const numberOfSignificantDrops = brandDrops.length + nonBrandDrops.length;
  const numberOfSignificantIncreases =
    brandIncreases.length + nonBrandIncreases.length;

  let resultMessage = `Spend was Rs.${reportData.totalCostYesterday} ${reportData.statusCost} from ${reportData.dayBeforeYesterdayDayName} due to `;
  if (numberOfSignificantDrops > 0) {
    resultMessage += `a huge drop seen in the following campaigns:`;
  } else if (numberOfSignificantIncreases > 0) {
    resultMessage += `a huge increase seen in the following campaigns:`;
  } else {
    resultMessage += "no significant changes in campaigns.";
  }

  const formatPercent = (value) => {
    const formattedValue = value;
    return (
      <span className="flex flex-row justify-center items-center text-center">
        {value > 0 ? (
          <IoIosArrowRoundUp className="text-green-500 text-lg" />
        ) : value === 0 ? (
          ""
        ) : (
          <IoIosArrowRoundDown className="text-red-500 text-lg" />
        )}
        {value > 0
          ? `+${formattedValue}%`
          : value === 0
          ? `${formattedValue}%`
          : `${formattedValue}%`}
      </span>
    );
  };
  const percentage = (value) => {
    return `${value}%`;
  };
  const currency = (value) => {
    return `${currencySymbol}${value}`;
  };

  return (
    <div>
      <div className="w-full flex items-start p-4 m-4 justify-between ">
        <div>
          <h1 className="text-2xl text-gray-600 mt-5 font-semibold">
            Yesterday:{" "}
            {reportData.yesterdayDayName && reportData.yesterdayDayName}
          </h1>
        </div>
        <div className="">
          <button
            className="bg-transparent  text-gray-600 px-4 py-2 rounded  hover:bg-slate-100"
            // onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          >
            <IoMdShareAlt className="ml-5 text-2xl" />
            Share
          </button>
          <button
            className="bg-transparent  text-gray-600 px-4 py-2 rounded  hover:bg-slate-100"
            // onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          >
            <MdOutlineFileDownload className="ml-5 text-2xl" />
            Download
          </button>
        </div>
      </div>
      <div
        className="bg-white m-4 rounded-md p-6 font-roboto"
        ref={componentRef}
      >
        <div className="bg-white my-4 rounded-md  mb-6">
          <div className="flex justify-end">
            <div className="relative flex flex-row-reverse justify-around items-center">
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={() => {
                  setShowColumnsMenu(!showColumnsMenu);
                }}
              >
                <FaColumns className="ml-5" /> Columns
              </button>

              <div className=" absolute -top-2">
                {showColumnsMenu && (
                  <ModifyColumns
                    columns={columns}
                    setColumns={setColumns}
                    setTableVisible={setTableVisible}
                    setShowColumnsMenu={setShowColumnsMenu}
                  />
                )}
              </div>

              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                // onClick={toggleFilterMenu}
              >
                <FaFilter className="ml-5" /> Add filter
              </button>
            </div>
          </div>
          <table className="min-w-full bg-[#2930a8] border border-gray-200 mt-4">
            <thead>
              <tr className="bg-[#2930a8] text-white text-center">
                {/* {visibleColumns.date && <th className="p-2 border-b">Date</th>} */}
                {columns
                  .filter((col) => col.visible)
                  .map((ele) => {
                    return <th className="p-2 border-b">{ele.title}</th>;
                  })}
              </tr>
            </thead>
            <tbody>
              {reportDataArray.map((item, index) => (
                <tr
                  className={
                    index == reportDataArray.length - 1
                      ? "border-t bg-[#eff0f0] text-center"
                      : "border-t bg-white text-center"
                  }
                >
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => {
                      let value = item[col.key];
                      // null check
                      if (value == null) {
                        value = 0;
                      }
                      // fix
                      if (
                        ["ctr", "avgCpc", "convRate"].indexOf(col.key) != -1
                      ) {
                        value = value.toFixed(2);
                      }
                      // currency
                      if (
                        ["cost", "avgCpc", "costPerConv"].indexOf(col.key) != -1
                      ) {
                        if (value > 1000000) {
                          value = value / 1000000;
                        }
                        value = currency(value);
                      }
                      // percentage
                      if (["ctr"].indexOf(col.key) != -1) {
                        value = percentage(value);
                      }
                      if (
                        index == reportDataArray.length - 1 &&
                        ["date"].indexOf(col.key) == -1
                      ) {
                        // value = formatPercent(value)
                        return (
                          <td className="p-2 border-b ">
                            {formatPercent(item[col.key])}
                          </td>
                        );
                      }
                      return <td className="p-2 border-b">{value}</td>;
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {insight != "" && (
          <div className="bg-gray-100 my-4 rounded-lg shadow-md p-6">
            <p className="text-lg">{insight}</p>
          </div>
        )}

        <div className="flex flex-col">
          <CategoryReporting
            previousDates={previousDates}
            categoryInsightUrl={categoryInsightUrl}
          />
        </div>
        <div className="flex flex-col">
          <AddCampaignTableReporting previousDates={previousDates} />
        </div>
        <div className="flex flex-col mb-20">
          <AddChart previousDates={previousDates} />
        </div>
      </div>
    </div>
  );
}
export default GoogleAdsDailyReporting;
