import React, { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { IoMdShareAlt } from "react-icons/io";
import { FaColumns } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import ModifyColumns from "./Reporting/ModifyColumns";

import AddChart from "./ChartAdd";
import AddCampaignTableReporting from "./AddCampaignTableReporting";
import CategoryReporting from "./CategoryReporting";

function getPreviousDays() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIndex = today.getMonth(); // 0-indexed (0=Jan, 11=Dec)

  const previousMonthStart = new Date(currentYear, currentMonthIndex - 1, 1);
  const previousMonthEnd = new Date(currentYear, currentMonthIndex, 0);

  const monthBeforePrevStart = new Date(currentYear, currentMonthIndex - 2, 1);

  const monthBeforePrevEnd = new Date(currentYear, currentMonthIndex - 1, 0);

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth is 0-indexed
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return {
    curr_start_date: formatDate(previousMonthStart),
    curr_end_date: formatDate(previousMonthEnd),
    prev_start_date: formatDate(monthBeforePrevStart),
    prev_end_date: formatDate(monthBeforePrevEnd),
  };
}

export default function GoogleAdsMonthlyReporting() {
  const [monthlyCompareData, setMonthlyCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState("");

  const [previousDates, setPreviousDates] = useState(getPreviousDays());
  const [categoryInsightUrl, setCategoryInsightUrl] = useState(
    "https://api.confidanto.com/gemini-insights/category-monthly-insights"
  );

  const defaultMetrics = [
    {
      key: "cost",
      label: "Cost",
      prefix: "₹",
      visible: true,
      category: "performance",
    },
    { key: "clicks", label: "Clicks", visible: true, category: "performance" },
    {
      key: "impressions",
      label: "Impressions",
      visible: true,
      category: "performance",
    },
    {
      key: "ctr",
      label: "CTR",
      suffix: "%",
      visible: true,
      category: "performance",
    },
    {
      key: "average_cpc",
      label: "Avg CPC",
      prefix: "₹",
      visible: true,
      category: "performance",
    },
    {
      key: "interactions",
      label: "Interactions",
      visible: false,
      category: "performance",
    },
    {
      key: "interaction_rate",
      label: "Interaction Rate",
      suffix: "%",
      visible: true,
      category: "performance",
    },
    {
      key: "conversions",
      label: "Conversions",
      visible: true,
      category: "conversions",
    },
    {
      key: "cost_per_conversion",
      label: "Cost/Conv.",
      prefix: "₹",
      visible: true,
      category: "conversions",
    },
    {
      key: "conversion_rate",
      label: "Conv. Rate",
      suffix: "%",
      visible: true,
      category: "conversions",
    },
  ];

  const [metricsConfig, setMetricsConfig] = useState(defaultMetrics);

  useEffect(() => {
    const fetchMonthlyComparison = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.confidanto.com/monthly-reporting/last-month-before-last-month-compare",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: localStorage.getItem("customer_id"),
              email: localStorage.getItem("email"),
            }),
          }
        );

        const result = await response.json();
        setMonthlyCompareData(result);
      } catch (err) {
        console.error("Error fetching monthly comparison data:", err);
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    const fetchInsights = async () => {
      try {
        const response = await fetch(
          "https://api.confidanto.com/generate-insights/last-month-vs-before-last-month-insights",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: localStorage.getItem("customer_id"),
              email: localStorage.getItem("email"),
              selectedMetrics: defaultMetrics.map((m) => m.key),
            }),
          }
        );

        const result = await response.json();
        if (result?.insights) setInsights(result.insights);
      } catch (err) {
        console.error("Error fetching insights:", err);
      }
    };

    fetchMonthlyComparison().then(fetchInsights);
  }, []);

  const formatDateRange = (start, end) => {
    try {
      const options = { day: "numeric", month: "short" };
      return `${new Date(start).toLocaleDateString(
        "en-GB",
        options
      )} - ${new Date(end).toLocaleDateString("en-GB", options)}`;
    } catch {
      return "Invalid Date";
    }
  };

  const visibleMetrics = metricsConfig.filter((m) => m.visible);

  return (
    <div className="font-roboto text-[#202124] bg-white rounded-xl border border-gray-200 overflow-auto p-4 sm:p-6 mt-6 shadow-sm">
      <div className="w-full flex items-start p-4 m-4 justify-between">
        <h2 className="text-xl font-medium mb-4">
          Monthly Performance Comparison
        </h2>
        <div className="flex gap-2">
          <button className="bg-transparent text-gray-600 px-4 py-2 rounded hover:bg-slate-100">
            <IoMdShareAlt className="inline-block mr-1 text-xl" /> Share
          </button>
          <button className="bg-transparent text-gray-600 px-4 py-2 rounded hover:bg-slate-100">
            <MdOutlineFileDownload className="inline-block mr-1 text-xl" />{" "}
            Download
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {showColumnsMenu ? (
        <ModifyColumns
          metricsConfig={metricsConfig}
          setMetricsConfig={setMetricsConfig}
          expandedCategory={expandedCategory}
          setExpandedCategory={setExpandedCategory}
          onClose={() => setShowColumnsMenu(false)}
        />
      ) : (
        <>
          {!loading && !error && monthlyCompareData.length === 3 && (
            <>
              <div className="p-6 mt-4 rounded-lg border border-gray-200 bg-white relative">
                <div className="justify-end flex">
                  <button
                    className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                    onClick={() => setShowColumnsMenu(true)}
                  >
                    <FaColumns className="inline-block mr-2" /> Columns
                  </button>
                </div>

                <table className="min-w-full table-fixed border border-gray-200 text-sm mt-4">
                  <thead className="bg-[#1f2ba1] text-white font-medium">
                    <tr>
                      <th className="p-3 text-left">Month</th>
                      {visibleMetrics.map(({ label }) => (
                        <th key={label} className="p-3 text-center">
                          {label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {[0, 1].map((i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="p-3 font-medium text-left whitespace-nowrap">
                          {formatDateRange(
                            monthlyCompareData[i].start_date,
                            monthlyCompareData[i].end_date
                          )}
                        </td>
                        {visibleMetrics.map(
                          ({ key, prefix = "", suffix = "" }) => (
                            <td key={key} className="p-3 text-center">
                              {Number.isFinite(monthlyCompareData[i][key])
                                ? `${prefix}${monthlyCompareData[i][key]}${suffix}`
                                : "-"}
                            </td>
                          )
                        )}
                      </tr>
                    ))}
                    <tr className="border-t bg-gray-50 text-sm">
                      <td className="p-3 font-semibold text-left">
                        Difference
                      </td>
                      {visibleMetrics.map(({ key }) => {
                        const change = monthlyCompareData[2][key];
                        const percent = Array.isArray(change) ? change[0] : 0;
                        const tooltip = Array.isArray(change) ? change[1] : "";
                        const isUp = percent > 0;
                        const isDown = percent < 0;
                        const isZero = percent === 0;

                        const color = isZero
                          ? "text-gray-600"
                          : isUp
                          ? "text-green-600"
                          : "text-red-600";
                        const icon = isZero ? null : isUp ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        );
                        const display = `${Math.abs(percent).toFixed(2)}%`;

                        return (
                          <td key={key} className="p-3 text-center">
                            <div
                              title={tooltip}
                              className={`flex items-center justify-center gap-1 ${color}`}
                            >
                              {icon}
                              <span>{display}</span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>

              {insights && (
                <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-[#202124] mb-2">
                    Insights Summary
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                    {insights}
                  </p>
                </div>
              )}

              <div className="flex flex-col">
                <CategoryReporting
                  previousDates={previousDates}
                  categoryInsightUrl={categoryInsightUrl}
                />
              </div>
              <div className="flex flex-col ">
                <AddCampaignTableReporting previousDates={previousDates} />
              </div>
              <div className="flex flex-col mb-20">
                <AddChart previousDates={previousDates} />
              </div>
            </>
          )}

          {!loading && !error && monthlyCompareData.length !== 3 && (
            <p className="text-sm text-gray-500">
              No comparison data available.
            </p>
          )}
        </>
      )}
    </div>
  );
}
