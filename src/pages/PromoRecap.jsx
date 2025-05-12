/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaColumns, FaExpand, FaCompress } from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import { MdOutlineFileDownload } from "react-icons/md";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FileSaver from "file-saver";
import ModifyColumns from "./Tools/ModifyColumns";

const PromoRecap = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [columns, setColumns] = useState([
    {id:"0", title: "Label", key: "label", visible: true, locked: true , category:"Recommended",isLocked:true},  // Label is correct here
    {id:"1", title: "Date", key: "date", visible: true, locked: true , category:"Recommended",isLocked:true},
    {id:"2",title: "Clicks", key: "clicks", visible: true , category:"Performance",isLocked:false},
    {id:"3", title: "Avg. CPC", key: "avg_cpc", visible: true , category:"Performance",isLocked:false},
    {id:"4",title: "Conversions", key: "conversion", visible: true , category:"Performance",isLocked:false},
    {id:"5", title: "Cost/conv", key: "cost_per_conv", visible: true , category:"Performance",isLocked:false},
    {id:"6", title: "Impressions", key: "impressions", visible: true , category:"Performance",isLocked:false},
    {id:"7", title: "CTR", key: "ctr", visible: true , category:"Performance",isLocked:false},
  ]);


  const [tableVisible, setTableVisible] = useState(true);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [data, setData] = useState([]);
  const datePickerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [state, setState] = useState([
    { startDate: new Date(), endDate: new Date(), key: "selection" },
  ]);

  const formatDateDisplay = (date) => {
    if (isToday(date)) return `Today ${format(date, "MMM dd, yyyy")}`;
    if (isYesterday(date)) return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    return format(date, "MMM dd, yyyy");
  };

  const formatButtonLabel = () => {
    const startDateLabel = formatDateDisplay(state[0].startDate);
    const endDateLabel = formatDateDisplay(state[0].endDate);
    return startDateLabel === endDateLabel
      ? startDateLabel
      : `${startDateLabel} - ${endDateLabel}`;
  };

  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
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
  const downloadData = (format) => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.title);
    const rows = data.map((item) => visibleColumns.map((col) => item[col.key]));

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
  const fetchAdGroupData = () => {
    const requestBody = {
      customer_id: 4643036315,
      total: 5,
      page: 1
    };
  
    fetch("https://api.confidanto.com/get-ads-label-day-by-day-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // Transform response data into a flat array with Label column first
        let transformedData = [];
        console.log("Promo Recap Res Data: ",responseData)
  
        // Loop through the objects (like "media" and "non brand")
        function transformDataFunc(data) {
          const transformedArray = [];
        
          data.forEach(item => {
            const key = Object.keys(item)[0]; // Get the label name ("media", "non brand", etc.)
            const labelData = item[key];
        
            labelData.forEach(dailyData => {
              const date = Object.keys(dailyData)[0]; // Get the date string
              const metrics = dailyData[date];
        
              const transformedObject = {
                label: key, // Assign the label name
                date: date,
                clicks: metrics.clicks,
                avg_cpc: metrics.avg_cpc / 1000000, // Divide by 1000000
                conversion: metrics.conversion,
                cost_per_conv: metrics.cost_per_conv / 1000000, // Divide by 1000000
                impressions: metrics.impressions,
                ctr: metrics.ctr,
              };
        
              transformedArray.push(transformedObject);
            });
          });
        
          return transformedArray;
        }

        transformedData = transformDataFunc(responseData)
  
        setData(transformedData); // Update table with transformed data
        setShowDatePicker(false);
      })
      .catch((error) => console.error("Error fetching ad group data:", error));
  };
  
  useEffect(() => {
    fetchAdGroupData(); // Fetch data on component mount
  }, []);

  const toggleDatePicker = () => setShowDatePicker(!showDatePicker);
  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };
  return (
    <div 
    className={`flex h-screen bg-white ${isFullScreen
      ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
      : "mb-16"
      }`}>
      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex justify-end items-center mb-4">
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
                    onClick={fetchAdGroupData}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
            <button className="bg-transparent text-gray-600 px-4 py-2 rounded hover:bg-slate-200">
              <FaFilter className="ml-5" /> Add filter
            </button>
            
            <div className="relative">
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              >
                <MdOutlineFileDownload className="ml-5 " />
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
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <FaCompress className="ml-5" />
                ) : (
                  <FaExpand className="ml-5" />
                )}{" "}
                {isFullScreen ? "Collapse" : "Expand"}
              </button>
              <div className="relative">
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                onClick={openColumnsMenu}
              >
                <FaColumns className="ml-5" /> Columns
              </button>
              {showColumnsMenu && (
                <ModifyColumns
                columns={columns}
                setColumns={setColumns}
                setTableVisible={setTableVisible}
                setShowColumnsMenu={setShowColumnsMenu} 
              />
              )}
            </div>
          </div>
        </div>
        {tableVisible && (
          <div className="overflow-x-auto max-w-full">
            {data.length > 0 ? (
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-indigo-900 text-white">
                    {columns
                      .filter((col) => col.visible)
                      .map((col) => (
                        <th key={col.key} className="py-3 px-6 text-left">
                          {col.title}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                      {columns.filter((col) => col.visible).map((col) => (
                        <td key={col.key} className="py-3 px-6">
                          {item[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>

                <tfoot className="bg-gray-100 font-semibold text-gray-700 border-t border-gray-300">
                    <tr>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-left text-sm "
                        >
                          <strong>
                            {typeof data[0]?.[col.key] === "number"&&
                                col.key !== "campaign_id"
                              ? col.key === "cost" ||
                                col.key === "average_cpc" ||
                                col.key === "cost_per_conversion"
                                ? `₹${data.reduce(
                                    (acc, item) => acc + (item[col.key] || 0),
                                    0
                                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : data.reduce(
                                    (acc, item) => acc + (item[col.key] || 0),
                                    0
                                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : ""}
                          </strong>
                        </td>
                      ))}
                    </tr>
                  </tfoot>

              </table>
            ) : (
              <div className="flex justify-center items-center h-40 mt-8">
                <LoadingAnimation />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default PromoRecap;