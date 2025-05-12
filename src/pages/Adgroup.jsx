import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaCompress, FaColumns, FaExpand } from "react-icons/fa";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import { MdOutlineFileDownload } from "react-icons/md";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
const Adgroup = () => {
  const [customColumn, setCustomColumn] = useState({
    name: "",
    column1: "",
    column2: "",
    formula: "",
  });
  const [showCustomColumnForm, setShowCustomColumnForm] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [columns, setColumns] = useState([
    { title: "Adgroup", key: "ad_group_name", visible: true, locked: true },
    { title: "Status", key: "status", visible: true, locked: true },
    { title: "Campaign", key: "campaign", visible: true },
    { title: "Impr.", key: "impressions", visible: true },
    { title: "CTR", key: "ctr", visible: true },
    { title: "Cost", key: "cost", visible: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Conv. rate", key: "conversion", visible: true },
    { title: "Conversions", key: "conversion", visible: true },
    { title: "Avg. CPC", key: "avg_cpc", visible: true },
    { title: "Cost/conv.", key: "cost_per_conv", visible: true },
  ]);
  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]); // State to store fetched data
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  
  const addCustomColumn = () => {
    const { name, column1, column2, formula } = customColumn;
    if (!name || !column1 || !column2 || !formula) return;

    const newColumnData = data.map((row) => {
      const value1 = parseFloat(row[column1]) || 0;
      const value2 = parseFloat(row[column2]) || 0;
      let result = 0;

      switch (formula) {
        case "sum":
          result = value1 + value2;
          break;
        case "difference":
          result = value1 - value2;
          break;
        case "average":
          result = (value1 + value2) / 2;
          break;
        case "product":
          result = value1 * value2;
          break;
        default:
          result = 0;
      }
      return { ...row, [name]: result };
    });

    setColumns([
      ...columns,
      { title: name, key: name, visible: true },
    ]);
    setData(newColumnData);

    setShowCustomColumnForm(false);
    setCustomColumn({ name: "", column1: "", column2: "", formula: "" });
  };
  const datePickerRef = useRef(null);
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
  // Fetch initial data on first render
  useEffect(() => {
    fetch("https://api.confidanto.com/get-ad-groups-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: 4643036315,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

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

  // Function to handle API call based on selected date range
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
    fetch("https://api.confidanto.com/get-datewise-ad-groups-data", {
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

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
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
  const totals = data.reduce(
    (acc, row) => {
      acc.impressions += row.impressions || 0;
      acc.ctr += row.ctr || 0;
      acc.cost += parseFloat(row.cost) || 0;
      acc.clicks += row.clicks || 0;
      acc.conversion_rate += row.conversion_rate || 0;
      acc.conversions += row.conversions || 0;
      acc.avg_cpc += parseFloat(row.avg_cpc) || 0;
      return acc;
    },
    {
      impressions: 0,
      ctr: 0,
      cost: 0,
      clicks: 0,
      conversion_rate: 0,
      conversions: 0,
      avg_cpc: 0,
    }
  );
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
  const handleCustomColumnChange = (e) => {
    const { name, value } = e.target;
    setCustomColumn((prev) => ({ ...prev, [name]: value }));
  };
  const formatButtonLabel = () => {
    const startDateLabel = formatDateDisplay(state[0].startDate);
    const endDateLabel = formatDateDisplay(state[0].endDate);

    if (startDateLabel === endDateLabel) return startDateLabel;

    return `${startDateLabel} - ${endDateLabel}`;
  };
  const averageCtr = totals.ctr / data.length || 0;
  const averageConvRate = totals.conversion_rate / data.length || 0;
  const averageCpc = totals.avg_cpc / data.length || 0;
  return (
    <div>
      <div
        className={`flex h-screen bg-white ${isFullScreen
            ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
            : "mb-16"
          }`}
      >
        <main className="flex-grow p-6 overflow-auto">
          <div className="flex justify-end items-center mb-4">
            {/* <div className="text-2xl font-bold text-gray-700">Ad Groups</div> */}
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
              <button className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100">
                <FaFilter className="ml-5" /> Add filter
              </button>
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={openColumnsMenu}
                >
                  <FaColumns className="ml-5" /> Columns
                </button>
                {showColumnsMenu && (
                  <div className="absolute right-0 h-screen bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-800 max-w-3xl border border-gray-200">
                    <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700 flex">
                      <h2 className="mr-11">Modify columns</h2>
                      <button
                        className="text-blue-400"
                        onClick={() => setShowCustomColumnForm(true)}
                      >
                        + Custom column
                      </button>
                    </div>

                    {/* Show Custom Column Form if active */}
                    {showCustomColumnForm ? (
                      <div className="mt-4 p-4 border rounded bg-gray-50">
                        <div className="mb-2">
                          <label className="block font-semibold">Column Name:</label>
                          <input
                            type="text"
                            name="name"
                            value={customColumn.name}
                            onChange={handleCustomColumnChange}
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block font-semibold">Select Column 1:</label>
                          <select
                            name="column1"
                            value={customColumn.column1}
                            onChange={handleCustomColumnChange}
                            className="w-full border rounded p-2"
                          >
                            <option value="">Select a column</option>
                            {columns.map((col) => (
                              <option key={col.key} value={col.key}>
                                {col.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block font-semibold">Select Column 2:</label>
                          <select
                            name="column2"
                            value={customColumn.column2}
                            onChange={handleCustomColumnChange}
                            className="w-full border rounded p-2"
                          >
                            <option value="">Select a column</option>
                            {columns.map((col) => (
                              <option key={col.key} value={col.key}>
                                {col.title}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mb-2">
                          <label className="block font-semibold">Select Formula:</label>
                          <select
                            name="formula"
                            value={customColumn.formula}
                            onChange={handleCustomColumnChange}
                            className="w-full border rounded p-2"
                          >
                            <option value="">Select a formula</option>
                            <option value="sum">Sum</option>
                            <option value="difference">Difference</option>
                            <option value="average">Average</option>
                            <option value="product">Product</option>
                          </select>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            onClick={addCustomColumn}
                          >
                            Add Column
                          </button>
                          <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() => setShowCustomColumnForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Show checkboxes if Custom Column Form is not active
                      <div className="grid grid-rows-2 gap-6 max-h-screen">
                        <div>
                          <div className="font-semibold overflow-x-auto mb-2 text-gray-700">
                            Recommended columns
                          </div>
                          <div className="grid grid-cols-5 space-x-3 space-y-2">
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
                        <div className="font-semibold mb-2 text-gray-700 py-2">Locked</div>
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
                    )}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
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
            </div>
          </div>
          {tableVisible && columns.length > 0 && (
            <table className="min-w-full bg-white rounded-lg overflow-y-auto shadow-md">
              <thead
              // className="bg-gray-200 text-xs font-semibold text-gray-700 uppercase border border-gray-300"
              >
                <tr className="bg-gray-200 normal-case text-sm leading-normal">
                  {columns.map(
                    (column) =>
                      column.visible && (
                        <th
                          key={column.key}
                          className="py-3 px-6 text-left"
                        >
                          {column.title}
                        </th>
                      )
                  )}
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {data.map((row, index) => (
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
                              {row[col.key]}
                            </span>
                          ) : null}
                          {col.key === "campaign" ? (
                            <span className="text-blue-500 cursor-pointer ">
                              {row[col.key]}
                            </span>
                          ) : null}
                          {col.key !== "status" && col.key !== "ad_group_name" && col.key !== "campaign" && row[col.key]}
                          {col.key === "status" ? (
                            <div className="flex items-center">
                              {row.status === "ENABLED" && (
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                              )}
                              {row.status === "PAUSED" && (
                                <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                              )}
                              {row.status === "REMOVED" && (
                                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                              )}
                              {row.status.charAt(0).toUpperCase() +
                                row.status.slice(1).toLowerCase()}
                            </div>

                          ) : null}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-bold text-gray-700 bg-gray-100">
                  <td>Total: Account</td>
                  <td></td> {/* Status column */}
                  <td></td> {/* Campaign column */}
                  <td>{totals.impressions}</td>
                  <td>{averageCtr.toFixed(2)}%</td>
                  <td>₹{totals.cost.toFixed(2)}</td>
                  <td>{totals.clicks}</td>
                  <td>{averageConvRate.toFixed(2)}%</td>
                  <td>{totals.conversions}</td>
                  <td>₹{averageCpc.toFixed(2)}</td>
                  <td></td> {/* Cost/conv column */}
                </tr>
              </tfoot>
            </table>
          )}
        </main>
      </div>
    </div>
  );
};

export default Adgroup;
