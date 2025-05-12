import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaSearch,
  FaColumns,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import { MdOutlineFileDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import LoadingAnimation from "../components/LoadingAnimation";

const Locations = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [columns, setColumns] = useState([
    {
      title: "Targeted Location",
      key: "location_details.name",
      visible: true,
      locked: true,
    },
    { title: "Campaign", key: "campaign_name", visible: true, locked: true },
    { title: "Bid adj.", key: "headlines", visible: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Impr.", key: "impressions", visible: true },
    { title: "CTR", key: "ctr", visible: true },
    { title: "Avg CPC", key: "average_cpc", visible: true },
    { title: "Cost", key: "cost_micros", visible: true },
    {
      title: "conv.rate",
      key: "conversions_from_interactions_rate",
      visible: true,
    },
    { title: "Cost/Conv.", key: "cost_per_conversion", visible: true },
  ]);
  const [tableVisible, setTableVisible] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState([]);const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [error, setError] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

   // Sorting state
   const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.confidanto.com/get-campaign-locations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              customer_id: 4643036315,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!Array.isArray(result)) {
          throw new Error("Received data is not an array");
        }

        // Combine the Final URLs, Descriptions, and Headlines into the Headlines field with styling
        const combinedData = result.map((item) => ({
          ...item,
          headlines: [
            ...(item.headlines || []).map(
              (headline) =>
                `<span class="text-blue-800 cursor-pointer"> ${headline} |</span> `
            ),
            ...(item.final_urls || []).map(
              (url) =>
                `<br/> <span class="text-green-500 cursor-pointer"> ${url}</span> <br/>`
            ),
            ...(item.descriptions || []).map(
              (description) =>
                `<span class="cursor-pointer"> ${description} </span>`
            ),
          ].join(" "),
        }));

        setData(combinedData);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  const ColumnItem = ({ column, index, toggleVisibility }) => {
    return (
      <div className="flex items-center p-2 mb-1 rounded cursor-pointer bg-white shadow-sm">
        <input
          type="checkbox"
          checked={column.visible}
          onChange={() => toggleVisibility(column.key)}
          className="mr-2"
          disabled={column.locked}
        />
        <span>{column.title}</span>
      </div>
    );
  };
  // Calculate totals for relevant columns
  const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
  const totalImpressions = data.reduce(
    (sum, item) => sum + (item.impressions || 0),
    0
  );
  const totalCTR = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
  const totalCost = data.reduce(
    (sum, item) => sum + (item.cost_micros || 0),
    0
  ) / 1e6; // Convert micros to regular currency
  const totalConvRate = data.reduce(
    (sum, item) =>
      sum + (item.conversions_from_interactions_rate || 0) / data.length,
    0
  );
  const totalConversions = data.reduce(
    (sum, item) => sum + (item.conversions || 0),
    0
  );
  const avgCPC = totalClicks ? totalCost / totalClicks : 0;
  const costPerConversion = totalConversions
    ? totalCost / totalConversions
    : 0;
  const downloadData = (format) => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.title);
    const rows = data.map((item) =>
      visibleColumns.map((col) =>
        col.key.split(".").reduce((o, i) => o?.[i], item)
      )
    );

    if (format === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, { head: [headers], body: rows });
      doc.save("data.pdf");
    } else if (format === "csv" || format === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      if (format === "csv") {
        XLSX.writeFile(wb, "data.csv");
      } else {
        XLSX.writeFile(wb, "data.xlsx");
      }
    } else if (format === "xml") {
      const xmlContent = `
        <root>
          ${data
            .map(
              (item) => `
            <row>
              ${visibleColumns
                .map((col) => `<${col.key}>${item[col.key]}</${col.key}>`)
                .join("")}
            </row>
          `
            )
            .join("")}
        </root>
      `;
      const blob = new Blob([xmlContent], { type: "application/xml" });
      FileSaver.saveAs(blob, "data.xml");
    } else if (format === "google_sheets") {
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = `https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing`;
      window.open(url, "_blank");
      FileSaver.saveAs(blob, "data.csv");
    }

    setShowDownloadOptions(false);
  };
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };
  
  const datePickerRef = useRef(null);
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  const formatDateDisplay = (date) => {
    if (isToday(date)) {
      return `Today ${format(date, "MMM dd, yyyy")}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };
  const formatButtonLabel = () => {
    const startDateLabel = formatDateDisplay(state[0].startDate);
    const endDateLabel = formatDateDisplay(state[0].endDate);

    if (startDateLabel === endDateLabel) return startDateLabel;

    return `${startDateLabel} - ${endDateLabel}`;
  };
  useEffect(() => {
    // Handle clicks outside of the datepicker
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const fetchAdGroupData = () => {
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    let requestBody = {
      customer_id: 4643036315,
    };

    if (startDate === endDate) {
      // Single date request
      requestBody = { ...requestBody, single_date: startDate };
    } else {
      // Custom date range request
      requestBody = { ...requestBody, start_date: startDate, end_date: endDate };
    }

    // Fetch data based on selected date range
    fetch("https://api.confidanto.com/get-location-datewise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData); // Log response in console
        setData(responseData); // Update the table data
        setShowDatePicker(false);
      })
      .catch((error) => {
        console.error("Error fetching ad group data:", error);
      });
  };
  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };


  // Sorting function
  const sortedData = () => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div
      className={`flex h-screen bg-white ${
        isFullScreen
          ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
          : "mb-32"
      }`}
    >
      <main className="flex-grow p-6 overflow-auto font-roboto ">
        <div className="flex justify-between items-center mb-4">
          <div className="text-2xl font-bold text-gray-700">Locationslear</div>
          <div className="flex space-x-2">
          <div className="relative" ref={datePickerRef}>
                <button
                  onClick={toggleDatePicker}
                  className="text-base border mr-2 border-gray-400 p-2 w-60"
                >
                  {formatButtonLabel()}
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 shadow-lg bg-white right-2">
                    <DateRangePicker
                      onChange={(item) => setState([item.selection])}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={state}
                      direction="horizontal"
                    />
                    <button
                      onClick={fetchAdGroupData} // Call API when dates are selected
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
            <span className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600">
              <FaFilter className="mr-2" /> Add filter
            </span>
            
            <div className="relative">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600"
                onClick={openColumnsMenu}
              >
                <FaColumns className="mr-2 h-4" /> Columns
              </button>
              {showColumnsMenu && (
                  <div className="absolute right-0 h-screen bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-800 max-w-3xl border border-gray-200">
                    <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700">
                      Modify columns for ad groups
                    </div>
                    <div className="grid grid-rows-2 gap-6 max-h-screen">
                      <div className="">
                        <div>
                          <div className="font-semibold overflow-x-auto mb-2 text-gray-700">
                            Recommended columns
                          </div>
                          <div className="grid bg-scroll  grid-cols-5 space-x-3 space-y-2">
                            {columns
                              .filter((col) => !col.locked && !col.section)
                              .map((col, index) => (
                                <ColumnItem
                                  key={col.key}
                                  column={col}
                                  index={index}
                                  toggleVisibility={toggleColumnVisibility}
                                />
                              ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold mb-2 text-gray-700 py-2">
                            Recommended
                          </div>
                          <div className="flex flex-row space-x-2">
                            {columns
                              .filter((col) => col.locked)
                              .map((col, index) => (
                                <ColumnItem
                                  key={col.key}
                                  column={col}
                                  index={index}
                                  toggleVisibility={toggleColumnVisibility}
                                />
                              ))}
                          </div>
                        </div>
                        <div className="flex space-x-2 pt-1 mt-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={applyChanges}
                          >
                            Apply
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={cancelChanges}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
            <div className="relative">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center hover:bg-gray-600"
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              >
                <MdOutlineFileDownload className="mr-2" />
                Download
              </button>
              {showDownloadOptions && (
                <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border border-gray-200">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => downloadData("pdf")}
                  >
                    PDF
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => downloadData("csv")}
                  >
                    CSV
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => downloadData("excel")}
                  >
                    Excel
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => downloadData("xml")}
                  >
                    XML
                  </button>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => downloadData("google_sheets")}
                  >
                    Google Sheets
                  </button>
                </div>
              )}
            </div>
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded flex items-center hover:bg-gray-600"
              onClick={toggleFullScreen}
            >
              {isFullScreen ? (
                <FaCompress className="mr-2" />
              ) : (
                <FaExpand className="mr-2" />
              )}{" "}
              {isFullScreen ? "Collapse" : "Expand"}
            </button>
          </div>
        </div>
        {tableVisible && (
          <div className="overflow-auto h-full">
            {error ? (
              <div className="text-red-500 text-center">
                Error fetching data: {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                {data.length > 0 ? (
                  <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                    <thead >
                      <tr className="bg-gray-200 normal-case text-sm leading-normal">
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <th key={col.key} onClick={() => handleSort(col.key)} className="py-3 px-6 text-left">
                              {col.title}
                              {sortConfig.key === col.key && (
                                <span>{sortConfig.direction === "asc" ? "🔼" : "🔽"}</span>
                              )}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {sortedData().map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            {columns
                              .filter((col) => col.visible)
                              .map((col) => (
                                <td
                                  key={col.key}
                                  className={`py-3 px-6 text-left ${
                                    col.key === "campaign" ||
                                    col.key === "ad_group_name"
                                      ? "text-blue-500"
                                      : ""
                                  }`}
                                >
                                  {col.key === "headlines" ? (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: item[col.key],
                                      }}
                                    />
                                  ) : col.key === "status" ? (
                                    <span className="flex items-center justify-center">
                                      <span
                                        className={`w-2.5 h-2.5 rounded-full ${
                                          item[col.key] === "ENABLED"
                                            ? "bg-green-500"
                                            : item[col.key] === "PAUSED"
                                            ? "bg-gray-500"
                                            : ""
                                        }`}
                                      ></span>
                                    </span>
                                  ) : Array.isArray(item[col.key]) ? (
                                    item[col.key].join(", ")
                                  ) : (
                                    col.key
                                      .split(".")
                                      .reduce((o, i) => o?.[i], item)
                                  )}
                                </td>
                              ))}
                          </tr>
                        ))
                      }
                      <tr className="bg-gray-100 font-bold">
                    <td colSpan="3" className="py-2 px-4 border-b border-gray-200">
                      Totals:
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">{totalClicks}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{totalImpressions}</td>
                    <td className="py-2 px-4 border-b border-gray-200">{totalCTR.toFixed(2)}%</td>
                    <td className="py-2 px-4 border-b border-gray-200">{avgCPC.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">${totalCost.toFixed(2)}</td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      {totalConvRate.toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 border-b border-gray-200">
                      ${costPerConversion.toFixed(2)}
                    </td>
                  </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="flex justify-center items-center h-40 mt-8">
                    <LoadingAnimation />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Locations;
