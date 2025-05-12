/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaColumns } from "react-icons/fa";
import LoadingAnimation from "../../components/LoadingAnimation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { MdOutlineFileDownload } from "react-icons/md";

const Audience = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [columns, setColumns] = useState([
    { title: "Age Range", key: "age_range", visible: true, locked: true },
    { title: "Adgroup", key: "ad_group_name", visible: true },
    {
      title: "Status",
      key: "ad_group_primary_status",
      visible: true,
      locked: true,
    },
    { title: "Campaign", key: "campaign_name", visible: true },
    { title: "Impr.", key: "impressions", visible: true },
    { title: "CTR", key: "ctr", visible: true },
    { title: "Cost", key: "cost", visible: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Conv. rate", key: "conversions_rate", visible: true },
    { title: "Conversions", key: "conversions", visible: true },
    { title: "Avg. CPC", key: "average_cpc", visible: true },
  ]);
  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]);
  const datePickerRef = useRef(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false); // State to store fetched data
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
    fetch("https://api.confidanto.com/audience-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: "4643036315",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Log fetched data
        setData(data.age_data); // Set the specific "age_data" in state
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
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
      requestBody = {
        ...requestBody,
        start_date: startDate,
        end_date: endDate,
      };
    }

    // Fetch data based on selected date range
    fetch("https://api.confidanto.com/audience-data", {
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
  return (
    <div>
      <div className="flex h-screen bg-gray-100 font-roboto">
        <main className="flex-grow p-6 overflow-y-auto">
          <div className="flex justify-end items-center mb-4">
            {/* <div className="text-2xl font-bold text-gray-700">Age Groups</div> */}
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
                      className="bg-blue-500 text-white px-4 py-2 rounded text-center mt-2"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                // onClick={toggleFilterDropdown}
              >
                <FaFilter className="ml-5" /> Add filter
              </button>
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                >
                  <MdOutlineFileDownload className="ml-5" />
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
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
                  onClick={openColumnsMenu}
                >
                  <FaColumns className="ml-5" /> Columns
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
            </div>
          </div>
          {tableVisible && columns.length > 0 && (
            <div className="overflow-x-auto max-w-full overflow-y-auto">
              {data.length > 0 ? (
                <table className="min-w-full bg-white rounded-lg overflow-y-auto shadow-md">
                  <thead>
                    <tr className="bg-gray-200 normal-case text-sm leading-normal">
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => (
                          <th key={col.key} className="py-3 px-6 text-left">
                            {col.title}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100"
                      >
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <td key={col.key} className="py-3 px-6 text-left">
                              {col.key === "ad_group_name" ? (
                                <span className="text-blue-500 cursor-pointer ">
                                  {item[col.key]}
                                </span>
                              ) : null}
                              {col.key === "campaign_name" ? (
                                <span className="text-blue-500 cursor-pointer ">
                                  {item[col.key]}
                                </span>
                              ) : null}
                              {col.key !== "ad_group_primary_status" &&
                                col.key !== "ad_group_name" &&
                                col.key !== "campaign_name" &&
                                item[col.key]}
                              {col.key === "ad_group_primary_status" ? (
                                <div className="flex items-center">
                                  {item.ad_group_primary_status ===
                                    "ELIGIBLE" && (
                                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                  )}
                                  {item.ad_group_primary_status
                                    .charAt(0)
                                    .toUpperCase() +
                                    item.ad_group_primary_status
                                      .slice(1)
                                      .toLowerCase()}
                                </div>
                              ) : null}
                            </td>
                          ))}
                      </tr>
                    ))}
                  </tbody>
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
    </div>
  );
};

export default Audience;
