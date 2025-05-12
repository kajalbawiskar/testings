import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  IoIosArrowDown,
  IoIosArrowRoundDown,
  IoIosArrowRoundUp,
} from "react-icons/io";
import LoadingAnimation from "../components/LoadingAnimation";
import { weeklyReportInitialParagraph } from "./weeklyReportHelper";
import AddCampaignTableReporting from "./AddCampaignTableReporting";
import AddChart from "./ChartAdd";

import { IoMdShareAlt } from "react-icons/io";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaColumns, FaFilter } from "react-icons/fa";
import ModifyColumns from "./Tools/ModifyColumns";
import CategoryReporting from "./CategoryReporting";

function GoogleAdsWeeklyReporting() {
  const [reportData, setReportData] = useState(null);
  const [reportDataDetailed, setReportDataDetailed] = useState(null);
  const [receiverEmail, setReceiverEmail] = useState("");
  const [initialParagraph, setInitialParagraph] = useState("");
  const [insight, setInsight] = useState("");

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [tableVisible, setTableVisible] = useState(true);

  const componentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const customerId = localStorage.getItem("customer_id");
      const email =
        customerId === "7948821642"
          ? "malisanket882@gmail.com"
          : localStorage.getItem("email");
  
      try {
        const response = await fetch(
          "https://api.confidanto.com/generate-insights/this-week-vs-last-week-insights",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
              customer_id: customerId,
              selectedMetrics: [
                "totalCTRLastWeek",
                "totalCTRThisWeek",
                "totalInteractionsLastWeek",
                "totalInteractionsThisWeek",
                "totalInteractionsRateLastWeek",
                "totalInteractionsRateThisWeek",
                "totalAverageCostLastWeek",
                "totalAverageCostThisWeek",
                "totalConvRateLastWeek",
                "totalConvRateThisWeek",
                "totalClicksLastWeek",
                "totalClicksThisWeek",
                "totalImpressionsLastWeek",
                "totalImpressionsThisWeek",
                "totalCostLastWeek",
                "totalCostThisWeek",
                "totalAvgCPCLastWeek",
                "totalAvgCPCThisWeek",
                "totalCostPerConvLastWeek",
                "totalCostPerConvThisWeek",
                "totalConversionsLastWeek",
                "totalConversionsThisWeek",
              ],
            }),
          }
        );
  
        const result = await response.json();
        setInsight(result.insights);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  // Call the function inside useEffect to avoid infinite re-renders
  useEffect(() => {
    if (reportData) {
      weeklyReportInitialParagraph(reportData, setInitialParagraph);
    }
  }, [reportData]); // This effect will run only when reportData changes

  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    const isDummy = customerId === "7948821642";
  
    const fetchUrl = isDummy
      ? "https://auth.confidanto.com/fetch_dummy/weekly_reporting"
      : "https://api.confidanto.com/weekly-reporting-google-ads/week-curr-prev-compare";
  
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        function transformReportDataWithOrdinalDates(reportData) {
          function addOrdinalSuffix(day) {
            if (day > 3 && day < 21) return day + "th";
            switch (day % 10) {
              case 1: return day + "st";
              case 2: return day + "nd";
              case 3: return day + "rd";
              default: return day + "th";
            }
          }
  
          const formatRangeWithOrdinal = (startDateString, endDateString) => {
            if (!startDateString || !endDateString) return "";
            try {
              const startDate = new Date(startDateString + "T00:00:00");
              const endDate = new Date(endDateString + "T00:00:00");
  
              const startDay = startDate.getDate();
              const endDay = endDate.getDate();
  
              const startMonth = startDate.toLocaleString("en-US", { month: "long" });
              const endMonth = endDate.toLocaleString("en-US", { month: "long" });
  
              const startDayWithSuffix = addOrdinalSuffix(startDay);
              const endDayWithSuffix = addOrdinalSuffix(endDay);
  
              if (startMonth === endMonth) {
                return `${startDayWithSuffix} - ${endDayWithSuffix} ${endMonth}`;
              } else {
                return `${startDayWithSuffix} ${startMonth} - ${endDayWithSuffix} ${endMonth}`;
              }
            } catch (e) {
              console.error("Error parsing/formatting dates:", startDateString, endDateString, e);
              return "";
            }
          };
  
          if (
            !reportData ||
            !reportData.additionalFieldsThisWeek ||
            !reportData.additionalFieldsLastWeek
          ) {
            console.error("Invalid report data structure: Missing required fields.");
            return [];
          }
  
          const structuredData = [];
  
          structuredData.push({
            rowType: "This Week",
            date: formatRangeWithOrdinal(reportData.thisWeekStartDate, reportData.thisWeekEndDate),
            cost: reportData.additionalFieldsThisWeek.total_cost,
            clicks: reportData.additionalFieldsThisWeek.total_clicks,
            impressions: reportData.additionalFieldsThisWeek.total_impressions,
            ctr: reportData.additionalFieldsThisWeek.total_ctr,
            avgCpc: reportData.additionalFieldsThisWeek.total_avg_cpc,
            conversions: reportData.additionalFieldsThisWeek.total_conversions,
            costPerConv: reportData.additionalFieldsThisWeek.total_cost_per_conv,
            convRate: reportData.additionalFieldsThisWeek.total_conv_rate,
            _source: reportData.additionalFieldsThisWeek,
          });
  
          structuredData.push({
            rowType: "Last Week",
            date: formatRangeWithOrdinal(reportData.lastWeekStartDate, reportData.lastWeekEndDate),
            cost: reportData.additionalFieldsLastWeek.total_cost,
            clicks: reportData.additionalFieldsLastWeek.total_clicks,
            impressions: reportData.additionalFieldsLastWeek.total_impressions,
            ctr: reportData.additionalFieldsLastWeek.total_ctr,
            avgCpc: reportData.additionalFieldsLastWeek.total_avg_cpc,
            conversions: reportData.additionalFieldsLastWeek.total_conversions,
            costPerConv: reportData.additionalFieldsLastWeek.total_cost_per_conv,
            convRate: reportData.additionalFieldsLastWeek.total_conv_rate,
            _source: reportData.additionalFieldsLastWeek,
          });
  
          structuredData.push({
            rowType: "Difference",
            date: "Difference",
            cost: reportData.changePercentCost,
            clicks: reportData.changePercentClicks,
            impressions: reportData.changePercentImpressions,
            ctr: reportData.changePercentCTR,
            avgCpc: reportData.changePercentAvgCPC,
            conversions: reportData.changePercentConversions,
            costPerConv: reportData.changePercentCostPerConv,
            convRate: reportData.changePercentConvRate,
            _source: {
              changePercentCost: reportData.changePercentCost,
              changePercentClicks: reportData.changePercentClicks,
              // add others if needed
            },
          });
  
          return structuredData;
        }
  
        const structuredData = transformReportDataWithOrdinalDates(data);
        setWeeklyHeader(structuredData[0].date);
        setData(structuredData);
        setReportData(data);
      } catch (error) {
        console.error("Error fetching the report data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const [weeklyHeader, setWeeklyHeader] = useState("");

  const [columns, setColumns] = useState([
    // Attributes / Time (Fundamental dimension)
    {
      id: "1",
      title: "Date",
      key: "date",
      visible: true,
      category: "Attributes",
      isLocked: true // Or sometimes just fundamental / Time
    },

    // Performance Metrics
    {
      id: "2",
      title: "Cost",
      key: "cost",
      visible: true,
      isLocked: false,
      category: "Performance",
    },
    {
      id: "3",
      title: "Clicks",
      key: "clicks",
      visible: true,
      isLocked: false,
      category: "Performance",
    },
    {
      id: "4",
      title: "Impressions",
      key: "impressions",
      visible: true,
      isLocked: false,
      category: "Performance",
    },
    {
      id: "5",
      title: "CTR",
      key: "ctr",
      visible: true,
      isLocked: false,
      category: "Performance",
    },
    {
      id: "6",
      title: "Avg CPC",
      key: "avgCpc",
      visible: true,
      isLocked: false,
      category: "Performance",
    },

    // Conversion Metrics
    {
      id: "7",
      title: "Conversions",
      key: "conversions",
      visible: true,
      isLocked: false,
      category: "Conversions",
    },
    {
      id: "8",
      title: "Cost Per Conversion",
      key: "costPerConv",
      visible: true,
      isLocked: false,
      category: "Conversions",
    },
    {
      id: "9",
      title: "Conversion Rate",
      key: "convRate",
      visible: true,
      isLocked: false,
      category: "Conversions",
    },
  ]);
  const [data, setData] = useState([]);
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  // previous dates

  function getPreviousWeeksSunSat(referenceDate) {
    // 1. Determine the reference date (use today if none provided)
    //    Clone the date to avoid modifying the original object if passed in.
    const today = referenceDate ? new Date(referenceDate) : new Date();

    // Optional: Set to midnight to avoid potential DST issues with time comparisons,
    // though setDate usually handles day calculations correctly.
    today.setHours(0, 0, 0, 0);

    // 2. Find the start of the *current* week (the most recent Sunday)
    //    getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ...
    const currentWeekStart = new Date(today);
    // Subtract the day number to get back to Sunday
    currentWeekStart.setDate(today.getDate() - dayOfWeek);

    // 3. Calculate the end of the *last* week (Saturday)
    //    This is one day before the start of the current week.
    const lastWeekEnd = new Date(currentWeekStart);
    lastWeekEnd.setDate(currentWeekStart.getDate() - 1);

    // 4. Calculate the start of the *last* week (Sunday)
    //    This is 6 days before the end of the last week (or 7 days before currentWeekStart).
    const lastWeekStart = new Date(lastWeekEnd);
    lastWeekStart.setDate(lastWeekEnd.getDate() - 6);

    // 5. Calculate the end of the *last last* week (Saturday)
    //    This is one day before the start of the last week.
    const lastLastWeekEnd = new Date(lastWeekStart);
    lastLastWeekEnd.setDate(lastWeekStart.getDate() - 1);

    // 6. Calculate the start of the *last last* week (Sunday)
    //    This is 6 days before the end of the last last week.
    const lastLastWeekStart = new Date(lastLastWeekEnd);
    lastLastWeekStart.setDate(lastLastWeekEnd.getDate() - 6);

    // 7. Return the results

    function formatDate(date) {
      const year = date.getFullYear();
      // getMonth() is 0-indexed (0=Jan, 11=Dec), so add 1
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return {
      curr_start_date: formatDate(lastWeekStart),
      curr_end_date: formatDate(lastWeekEnd),
      prev_start_date: formatDate(lastLastWeekStart),
      prev_end_date: formatDate(lastLastWeekEnd),
    };
  }
  const [previousDates, setPreviousDates] = useState(getPreviousWeeksSunSat());
  const [categoryInsightUrl, setCategoryInsightUrl] = useState(
    "https://api.confidanto.com/gemini-insights/category-weekly-insights"
  );

  useEffect(() => {
    const customerId = localStorage.getItem("customer_id");
    const isDummy = customerId === "7948821642";
  
    const fetchUrl = isDummy
      ? "https://auth.confidanto.com/fetch_dummy/weekly_reporting"
      : "https://api.confidanto.com/weekly-reporting-google-ads/week-curr-prev-compare";
  
    const fetchData = async () => {
      try {
        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        function transformReportDataWithOrdinalDates(reportData) {
          function addOrdinalSuffix(day) {
            if (day > 3 && day < 21) return day + "th";
            switch (day % 10) {
              case 1: return day + "st";
              case 2: return day + "nd";
              case 3: return day + "rd";
              default: return day + "th";
            }
          }
  
          const formatRangeWithOrdinal = (startDateString, endDateString) => {
            if (!startDateString || !endDateString) return "";
            try {
              const startDate = new Date(startDateString + "T00:00:00");
              const endDate = new Date(endDateString + "T00:00:00");
  
              const startDay = startDate.getDate();
              const endDay = endDate.getDate();
  
              const startMonth = startDate.toLocaleString("en-US", { month: "long" });
              const endMonth = endDate.toLocaleString("en-US", { month: "long" });
  
              const startDayWithSuffix = addOrdinalSuffix(startDay);
              const endDayWithSuffix = addOrdinalSuffix(endDay);
  
              if (startMonth === endMonth) {
                return `${startDayWithSuffix} - ${endDayWithSuffix} ${endMonth}`;
              } else {
                return `${startDayWithSuffix} ${startMonth} - ${endDayWithSuffix} ${endMonth}`;
              }
            } catch (e) {
              console.error("Error parsing/formatting dates:", startDateString, endDateString, e);
              return "";
            }
          };
  
          if (
            !reportData ||
            !reportData.additionalFieldsThisWeek ||
            !reportData.additionalFieldsLastWeek
          ) {
            console.error("Invalid report data structure: Missing required fields.");
            return [];
          }
  
          return [
            {
              rowType: "This Week",
              date: formatRangeWithOrdinal(reportData.thisWeekStartDate, reportData.thisWeekEndDate),
              cost: reportData.additionalFieldsThisWeek.total_cost,
              clicks: reportData.additionalFieldsThisWeek.total_clicks,
              impressions: reportData.additionalFieldsThisWeek.total_impressions,
              ctr: reportData.additionalFieldsThisWeek.total_ctr,
              avgCpc: reportData.additionalFieldsThisWeek.total_avg_cpc,
              conversions: reportData.additionalFieldsThisWeek.total_conversions,
              costPerConv: reportData.additionalFieldsThisWeek.total_cost_per_conv,
              convRate: reportData.additionalFieldsThisWeek.total_conv_rate,
              _source: reportData.additionalFieldsThisWeek,
            },
            {
              rowType: "Last Week",
              date: formatRangeWithOrdinal(reportData.lastWeekStartDate, reportData.lastWeekEndDate),
              cost: reportData.additionalFieldsLastWeek.total_cost,
              clicks: reportData.additionalFieldsLastWeek.total_clicks,
              impressions: reportData.additionalFieldsLastWeek.total_impressions,
              ctr: reportData.additionalFieldsLastWeek.total_ctr,
              avgCpc: reportData.additionalFieldsLastWeek.total_avg_cpc,
              conversions: reportData.additionalFieldsLastWeek.total_conversions,
              costPerConv: reportData.additionalFieldsLastWeek.total_cost_per_conv,
              convRate: reportData.additionalFieldsLastWeek.total_conv_rate,
              _source: reportData.additionalFieldsLastWeek,
            },
            {
              rowType: "Difference",
              date: "Difference",
              cost: reportData.changePercentCost,
              clicks: reportData.changePercentClicks,
              impressions: reportData.changePercentImpressions,
              ctr: reportData.changePercentCTR,
              avgCpc: reportData.changePercentAvgCPC,
              conversions: reportData.changePercentConversions,
              costPerConv: reportData.changePercentCostPerConv,
              convRate: reportData.changePercentConvRate,
              _source: {
                changePercentCost: reportData.changePercentCost,
                changePercentClicks: reportData.changePercentClicks,
                // Add more if needed
              },
            },
          ];
        }
  
        const structuredData = transformReportDataWithOrdinalDates(data);
        setWeeklyHeader(structuredData[0].date);
        setData(structuredData);
        setReportData(data);
      } catch (error) {
        console.error("Error fetching the report data:", error);
      }
    };
  
    fetchData();
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
  ////console.log(filterSignificantChanges);

  const brandDrops = filterSignificantChanges(
    reportData.brandCampaigns,
    "down"
  );
  const nonBrandDrops = filterSignificantChanges(
    reportData.nonBrandCampaigns,
    "down"
  );
  ////console.log(nonBrandDrops);

  const brandIncreases = filterSignificantChanges(
    reportData.brandCampaigns,
    "up"
  );
  const nonBrandIncreases = filterSignificantChanges(
    reportData.nonBrandCampaigns,
    "up"
  );

  // Generate the result message
  const numberOfSignificantDrops = brandDrops.length + nonBrandDrops.length;
  ////console.log(numberOfSignificantDrops);
  const numberOfSignificantIncreases =
    brandIncreases.length + nonBrandIncreases.length;

  let resultMessage = `Spend was \$${reportData.totalCostThisWeek} ${reportData.statusCost} from ${reportData.thisWeekStartDate} ${reportData.thisWeekStartDay} due to `;
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

  const cancelChanges = () => {
    setShowColumnsMenu(false);
  };

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
  };

  return (
    <div>
      <div className="w-full flex items-start p-4 m-4 justify-between">
        <div>
          <h1 className="text-2xl mt-2 text-gray-600 font-semibold">
            Week: {weeklyHeader}
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
        {/* Horizontal Table for additional fields */}
        <div className="bg-white my-4 rounded-md  mb-8">
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
          <table className="min-w-full bg-gray-100 border border-gray-200 mt-4">
            <thead>
              <tr className="bg-[#2930a8] text-white text-center">
                {columns
                  .filter((col) => col.visible)
                  .map((col) => {
                    return <td className="p-2 border-b">{col.title}</td>;
                  })}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr
                    className={
                      index == data.length - 1
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
                          ["cost", "avgCpc", "costPerConv"].indexOf(col.key) !=
                          -1
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
                          index == data.length - 1 &&
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
                );
              })}
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

export default GoogleAdsWeeklyReporting;
