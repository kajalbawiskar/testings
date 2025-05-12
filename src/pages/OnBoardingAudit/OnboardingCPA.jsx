import React, { useState, useEffect, useRef } from "react";
import { FaColumns } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import { format } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { FaAngleDown } from "react-icons/fa6";

import { FaChevronRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";

import ModifyColumns from "./../Tools/ModifyColumns";

const OnboardingCPA = () => {
  // const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [columns, setColumns] = useState([
    {
      id: "17",
      title: "Keyword Text",
      key: "keyword_text",
      visible: false,
      category: "Recommended",
    },
    {
      id: "18",
      title: "Match Type",
      key: "match_type",
      visible: false,
      category: "Recommended",
    },
    {
      id: "19",
      title: "Status",
      key: "status",
      visible: false,
      category: "Recommended",
    },
    {
      id: "20",
      title: "Bid Strategy",
      key: "bid_strategy_type",
      visible: true,
      category: "Strategy",
    },
    {
      id: "4",
      title: "Campaign Name",
      key: "name",
      visible: true,
      category: "Recommended",
    },
    {
      id: "5",
      title: "Clicks",
      key: "clicks",
      visible: true,
      category: "Metric",
    },
    {
      id: "6",
      title: "Conv rate",
      key: "conversions_rate",
      visible: true,
      category: "Metric",
    },
    {
      id: "7",
      title: "Conversions",
      key: "conversions",
      visible: true,
      category: "Metric",
    },
    {
      id: "8",
      title: "Cost/conv",
      key: "cost_per_conversion",
      visible: true,
      category: "Metric",
    },
    { id: "9", title: "Costs", key: "cost", visible: true, category: "Metric" },
    { id: "10", title: "Ctr", key: "ctr", visible: true, category: "Metric" },
    {
      id: "2",
      title: "Avg Cpc",
      key: "average_cpc",
      visible: true,
      category: "Metric",
    },
    {
      id: "11",
      title: "Final urls",
      key: "final_urls",
      visible: false,
      category: "Recommended",
    },
    {
      id: "12",
      title: "Impressions",
      key: "impressions",
      visible: true,
      category: "Metric",
    },
    {
      id: "13",
      title: "Interaction rate",
      key: "interaction_rate",
      visible: true,
      category: "Metric",
    },
    {
      id: "14",
      title: "Interactions",
      key: "interactions",
      visible: true,
      category: "Metric",
    },
    {
      id: "15",
      title: "Negative",
      key: "is_negative",
      visible: false,
      category: "Metric",
    },
    { id: "0", title: "id", key: "id", visible: true, category: "Recommended" },
    {
      id: "1",
      title: "Name",
      key: "ad_group_name",
      visible: false,
      category: "Recommended",
    },
    {
      id: "3",
      title: "Campaign Id",
      key: "campaign_id",
      visible: false,
      category: "Recommended",
    },
    {
      id: "16",
      title: "Keyword id",
      key: "keyword_id",
      visible: false,
      category: "Recommended",
    },
  ]);

  const [tableVisible, setTableVisible] = useState(true);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [data, setData] = useState([]);

  const [total, setTotal] = useState({});

  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();

  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: "selection",
    },
  ]);

  const [isGroupDropdownVisible, setGroupDropdownVisible] = useState(false);
  const [totalShow, setTotalShow] = useState(true);

  function handleSelectDateRanges(ranges) {
    let key = Object.keys(ranges)[0];
    let values = Object.values(ranges)[0];

    for (const i of state) {
      if (i.key == key) {
        i.startDate = values.startDate;
        i.endDate = values.endDate;
      }
    }
    setState(state);
  }

  function compareDateRanges() {
    let tempStates = state;

    if (state.length > 1) {
      setState([tempStates[0]]);
    } else {
      let newState = {
        startDate: new Date(year, month - 1, 1),
        endDate: new Date(year, month, 0),
        key: "compare",
      };

      setState([...tempStates, newState]);
    }

    console.log(state);
  }
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
  const datePickerRef = useRef(null);

  let DownloadRef = useRef(null);
  let ColumnRef = useRef(null);

  useEffect(() => {
    // Handle clicks outside of the datepicker
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }

      if (DownloadRef.current && !DownloadRef.current.contains(event.target)) {
        setShowDownloadOptions(false);
      }

      if (ColumnRef.current && !ColumnRef.current.contains(event.target)) {
        setShowColumnsMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function closeModalBoxes(type) {
    setShowColumnsMenu(false);
    setShowDownloadOptions(false);
    setGroupDropdownVisible(false);
    // setShowFilterMenu(false)
    setFilterBoxToggle(false);
    // setIsGroupListVisible(false)
    setShowDatePicker(false);

    if (type == "Date") {
      setShowDatePicker(!showDatePicker);
    } else if (type == "Segment") {
      // setIsGroupListVisible(!isGroupListVisible)
    } else if (type == "Filter") {
      // setShowFilterMenu(!showFilterMenu)
      setFilterBoxToggle(!filterBoxToggle);
    } else if (type == "Category") {
      setGroupDropdownVisible(!isGroupDropdownVisible);
    } else if (type == "Download") {
      setShowDownloadOptions(!showDownloadOptions);
    } else if (type == "Column") {
      setShowColumnsMenu(!showColumnsMenu);
    }
  }
  const [sortedData, setSortedData] = useState([]);
  const formatButtonLabel = () => {
    const { startDate, endDate } = state[0];

    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
    } else {
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
  };
  const fetchAdGroupData = () => {
    const requestBody = {
      customer_id: localStorage.getItem("customer_id"),
      start_date: "2024-09-01",
      end_date: "2025-03-19",
    };

    fetch("https://api.confidanto.com/get-campaign-cpa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData);
        setData(responseData);
        setSortedData(responseData); // Update table data
        setColumns([
          {
            id: "1",
            title: "Campaign Name",
            key: "campaign_name",
            visible: true,
            category: "Recommended",
            isLocked:true,
          },
          {
            id: "2",
            title: "Bid Strategy",
            key: "bid_strategy_type",
            visible: true,
            category: "Strategy",
            isLocked:false,
          },
          {
            id: "3",
            title: "campaign_id",
            key: "campaign_id",
            visible: true,
            category: "Performance",
            isLocked:false,
          },
          {
            id: "4",
            title: "Avg. cpc",
            key: "average_cpc",
            visible: true,
            category: "Performance",
            isCurrency: true,
            isLocked:false,
          },
          {
            id: "5",
            title: "Cost",
            key: "cost",
            visible: true,
            category: "Performance",
            isCurrency: true,
            isLocked:false,
          },
          {
            id: "6",
            title: "Impr.",
            key: "impressions",
            visible: true,
            category: "Performance",
            isLocked:false,
          },
          {
            id: "7",
            title: "Interaction rate",
            key: "interaction_rate",
            visible: true,
            category: "Performance",
            isLocked:false,
          },
          {
            id: "8",
            title: "Interactions",
            key: "interactions",
            visible: true,
            category: "Performance",
            isLocked:false,
          },
          {
            id: "9",
            title: "Conversions",
            key: "conversions",
            visible: true,
            category: "Conversions",
            isLocked:false,
          },
          {
            id: "10",
            title: "CPA.",
            key: "cpa",
            visible: true,
            category: "Conversions",
            isLocked:false,
          },
          {
            id: "11",
            title: "Conv. rate",
            key: "conversions_rate",
            visible: true,
            category: "Conversions",
            isLocked:false,
          },
          {
            id: "13",
            title: "CTR",
            key: "ctr",
            visible: true,
            category: "Conversions",
            isLocked:false,
          },
          {
            id: "14",
            title: "Clicks",
            key: "clicks",
            visible: true,
            category: "Conversions",
            isLocked:false,
          },
          
        ]);
      })
      .catch((error) => {
        console.error("Error fetching bid strategy data:", error);
      });
  };

  useEffect(() => {
    fetchAdGroupData();
  }, []);

  const [filterBoxToggle, setFilterBoxToggle] = useState(false);
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  const [currentOrderType, setCurrentOrderType] = useState(true);
  const [currentOrderVariable, setCurrentOrderVariable] = useState(null);

  const toggleOrderType = () => {
    setCurrentOrderType(!currentOrderType);
  };
  const toggleCurrentOrderVariable = (type) => {
    setCurrentOrderVariable(type);
  };

  const changeOrderTypeCampaign = (type) => {
    // arrow ui
    if (type != currentOrderVariable) {
      toggleOrderType();
    }
    toggleOrderType();
    toggleCurrentOrderVariable(type);

    // sort data
    let temp = data;
    let tempDataValue = temp[0][type];

    console.log(
      type,
      currentOrderVariable,
      currentOrderType,
      tempDataValue,
      typeof tempDataValue
    );
    if (currentOrderType) {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => a[type] - b[type]);
      } else {
        data.sort((a, b) => a[type].localeCompare(b[type]));
      }
    } else {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => b[type] - a[type]);
      } else {
        data.sort((a, b) => b[type].localeCompare(a[type]));
      }
    }
    setData(temp);
  };
  const [isOpen, setIsOpen] = useState(false);

  // const totalPages = Math.ceil(data.length / rowsPerPage);

  // // Get the current page data
  // const indexOfLastRow = currentPage * rowsPerPage;
  // const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  // const currentData = data.slice(indexOfFirstRow, indexOfLastRow);

  // // Handle Rows Per Page Change
  // const handleRowsPerPageChange = (event) => {
  //   setRowsPerPage(Number(event.target.value));
  //   setCurrentPage(1); // Reset to first page
  // };

  // // Handle Page Change
  // const handlePageChange = (newPage) => {
  //   setCurrentPage(newPage);
  // };

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...data].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortConfig({ key, direction });
    setSortedData(sorted);
    // setCurrentPage(0); // Reset to first page
  };

  const paginatedData = sortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  // // Sorting function
  // const sortedData = () => {
  //   if (!sortConfig.key) return data;

  //   return [...currentData].sort((a, b) => {
  //     if (a[sortConfig.key] < b[sortConfig.key])
  //       return sortConfig.direction === "asc" ? -1 : 1;
  //     if (a[sortConfig.key] > b[sortConfig.key])
  //       return sortConfig.direction === "asc" ? 1 : -1;
  //     return 0;
  //   });
  // };

  // // Handle sorting
  // const handleSort = (key) => {
  //   let direction = "asc";
  //   if (sortConfig.key === key && sortConfig.direction === "asc") {
  //     direction = "desc";
  //   }
  //   setSortConfig({ key, direction });
  // };

  // Currency formatting function
  const formatCurrency = (amount, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="mx-10 bg-white">
      <div
        className={`rounded-lg border border-gray-300 shadow-sm p-4 ${
          isFullScreen ? "fixed inset-0 z-50 overflow-x-auto bg-white" : "mb-16"
        }`}
      >
        <div className="flex items-center">
          <span className="font-semibold text-lg">CPA</span>
        </div>
        <hr className="border-t border-gray-300 mt-5" />

        <div className="mt-4 text-gray-600 cursor-pointer flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-white text-gray-700 text-2xl py-2 rounded-md font-semibold flex items-center "
          >
            <FaAngleDown
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
            <span className="text-base ml-2">
              {isOpen ? "Hide Table" : "Show Table"}
            </span>
          </button>
        </div>
        {isOpen && (
          <main className="flex-grow text-lg -ml-8 -mt-5 overflow-y-scroll">
            <div className="flex justify-end items-center mb-4">
              <div className="flex space-x-2">
                <div className="relative" ref={DownloadRef}>
                  <button
                    className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                    onClick={() => {
                      closeModalBoxes("Download");
                    }}
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

                <div className="relative" ref={ColumnRef}>
                  <button
                    className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                    // onClick={openColumnsMenu}
                    onClick={() => {
                      closeModalBoxes("Column");
                    }}
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
              <div className="overflow-auto rounded-lg shadow-md border border-gray-300 ml-9">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100 border-b border-gray-300">
                    <tr className="text-gray-700 text-sm  tracking-wider">
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => (
                          <th
                            key={col.key}
                            className="py-3 px-4 text-left border border-gray-300 whitespace-nowrap"
                            onClick={() => handleSort(col.key)}
                            style={{ cursor: "pointer" }}
                          >
                            {col.title}
                            {sortConfig.key === col.key && (
                              <span>
                                {sortConfig.direction === "asc" ? "🔼" : "🔽"}
                              </span>
                            )}
                          </th>
                        ))}
                    </tr>
                  </thead>

                  <tbody className="text-gray-700 text-sm">
                    {data.length > 0 ? (
                      paginatedData.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-300 even:bg-gray-50 hover:bg-gray-100 transition"
                        >
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => {
                              const value = item[col.key];
                              // If the column is marked as currency, format it
                              const displayValue = col.isCurrency
                                ? formatCurrency(value, item.currency)
                                : value;

                              // <td
                              //   key={col.key}
                              //   className="py-3 px-4 border border-gray-300"
                              // >
                              //   ₹{item[col.key] ?? "--"}
                              // </td>

                              if (col.key !== "campaign_id") {
                                return (
                                  <td
                                    className="py-3 px-4 border border-gray-300"
                                    key={col.key}
                                  >
                                    {displayValue.toLocaleString("en-IN")}
                                  </td>
                                );
                              } else {
                                return (
                                  <td
                                    className="py-3 px-4 border border-gray-300"
                                    key={col.key}
                                  >
                                    {displayValue}
                                  </td>
                                );
                              }
                              // <td
                              //   className="py-3 px-4 border border-gray-300"
                              //   key={col.key}
                              // >
                              //   if()
                              //   {displayValue.toLocaleString('en-IN')}
                              // </td>
                            })}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length}
                          className="py-6 px-4 text-center text-gray-500"
                        >
                          No data available
                        </td>
                      </tr>
                    )}
                  </tbody>

                  <tfoot className="bg-gray-100 font-semibold text-gray-700 border-t border-gray-300">
                    <tr>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="py-3 px-4 text-left text-sm border border-gray-300"
                        >
                          <strong>
                            {typeof data[0]?.[col.key] === "number" &&
                            col.key !== "campaign_id"
                              ? col.key === "cost" ||
                                col.key === "average_cpc" ||
                                col.key === "cost_per_conversion"
                                ? `₹${data
                                    .reduce(
                                      (acc, item) => acc + (item[col.key] || 0),
                                      0
                                    )
                                    .toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })}`
                                : data
                                    .reduce(
                                      (acc, item) => acc + (item[col.key] || 0),
                                      0
                                    )
                                    .toLocaleString(undefined, {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    })
                              : ""}
                          </strong>
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
            <div className="flex justify-end items-center mt-4 font-serif p-3 rounded-lg">
              <div className="flex items-center space-x-2 mr-4">
                {/* <label className="text-gray-700">Rows per page:</label>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="border border-gray-300 rounded px-2 py-1"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                </select>
              </div>

              {/* Pagination Controls */}
                {/* <div className="flex items-center space-x-3">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-1 py-1 text-gray-700 rounded ${
                    currentPage === 1
                      ? " cursor-not-allowed"
                      : " hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft />
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-1 py-1 text-gray-700 font-bold rounded ${
                    currentPage === totalPages
                      ? " cursor-not-allowed"
                      : " hover:bg-gray-100"
                  }`}
                >
                  <FaChevronRight />
                </button> */}
                <div className="flex items-center space-x-2 mr-4">
                  Rows per page:
                  <select
                    className="border border-gray-300 rounded px-2 py-1 space-x-2"
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                  >
                    {[5, 10, 20, 50].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                  <button
                    className="flex cursor-pointer"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 0))
                    }
                    disabled={currentPage === 0}
                  >
                    <FaChevronLeft className="mt-1" />
                    Prev
                  </button>
                  <button
                    className="flex cursor-pointer"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        prev + 1 < Math.ceil(sortedData.length / rowsPerPage)
                          ? prev + 1
                          : prev
                      )
                    }
                    disabled={
                      currentPage + 1 >=
                      Math.ceil(sortedData.length / rowsPerPage)
                    }
                  >
                    Next
                    <FaChevronRight className="mt-1" />
                  </button>
                </div>
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default OnboardingCPA;
