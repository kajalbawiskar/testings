import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaColumns, FaCompress, FaExpand } from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import { MdOutlineFileDownload, MdOutlineSegment } from "react-icons/md";
import { AiOutlineFileSearch } from "react-icons/ai";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import axios from "axios";

const Locations2 = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isUserIntentView, setIsUserIntentView] = useState(false); // To toggle between views

  const [isFullScreen, setIsFullScreen] = useState(false);
  // Initialize state for totals
  // const [totalImpressions, setTotalImpressions] = useState(0);
  // const [totalClicks, setTotalClicks] = useState(0);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  // const [totalCost, setTotalCost] = useState(0);
  // const [converion, setConverion] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // const [ctr, setCtr] = useState(0);

  let today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: "selection",
    },
  ]);

  // const [defaultColumns] = useState([...columns]); // Keep a default columns state for resetting
  const [tableVisible, setTableVisible] = useState(true);
  // const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ brand: "All" }); // For brand and non-brand filtering
  const [showUserIntentMenu, setShowUserIntentMenu] = useState(false);

  const [userIntentTable, setUserIntentTable] = useState([]);

  const [loading, setLoading] = useState(true);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([
    {
      title: "Location",
      key: "name",
      visible: true,
      locked: true,
      isLocked: true,
    },
    {
      title: "Impressions",
      key: "impressions",
      visible: true,
      locked: true,
      isLocked: false,
    },
    { title: "Clicks", key: "clicks", visible: true, isLocked: false },
    {
      title: "Cost",
      key: "cost_micros",
      visible: true,
      locked: true,
      isLocked: false,
    },

    { title: "Avg Cost", key: "average_cost", visible: false, isLocked: false },
    { title: "Avg Cpc", key: "average_cpc", visible: false, isLocked: false },
    { title: "Avg Cpm", key: "average_cpm", visible: false, isLocked: false },
    {
      title: "Conversions",
      key: "conversions",
      visible: false,
      isLocked: false,
    },
    {
      title: "Conversions by Clicks",
      key: "conversions_from_interactions_rate",
      visible: false,
      isLocked: false,
    },
    {
      title: "Cost / Conversion",
      key: "cost_per_conversion",
      visible: false,
      isLocked: false,
    },
    { title: "Ctr", key: "ctr", visible: false, isLocked: false },
    {
      title: "Interactions",
      key: "interactions",
      visible: false,
      isLocked: false,
    },
  ]);

  const [cityData, setCityData] = useState([]);

  const [stateData, setStateData] = useState([]);

  const [countryData, setCountryData] = useState([]);

  const customer_id = 4643036315;

  useEffect(() => {
    setLoading(true);
    fetch("https://api.confidanto.com/get-available-locations-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: customer_id,
        target_type: "City",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const segmentData = data.map((i) => {
          let targetCity = Object.keys(i)[0];
          let targetData = Object.values(i)[0];

          targetData.name = targetCity;
          return targetData;
        });

        setCityData(segmentData);

        setData(segmentData);
        // setColumns(cityColumns)

        // setFilteredData(segmentedData);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));

    // States
    axios
      .post("https://api.confidanto.com/get-available-locations-total", {
        customer_id: customer_id,
        target_type: "State",
      })
      .then((res) => {
        console.log(res.data);
        const segmentData = res.data.map((i) => {
          let target = Object.keys(i)[0];
          let targetData = Object.values(i)[0];

          targetData.name = target;
          return targetData;
        });
        console.log("states:", segmentData);

        setStateData(segmentData);

        // setData(stateData)
        // setColumns(stateColumns)
      });

    // Countries
    axios
      .post("https://api.confidanto.com/get-available-locations-total", {
        customer_id: customer_id,
        target_type: "Country",
      })
      .then((res) => {
        console.log(res.data);
        const segmentData = res.data.map((i) => {
          let target = Object.keys(i)[0];
          let targetData = Object.values(i)[0];

          targetData.name = target;
          return targetData;
        });
        console.log("Country:", segmentData);

        setCountryData(segmentData);

        // setData(countryData)
        // setColumns(countryColumns)
      });
  }, []);

  const filterButtonRef = useRef(null);
  const [cityRadio, setCityRadio] = useState("City");
  const targetRadioChange = (e) => {
    setCityRadio(e.target.value);
  };

  const filterlocations = (e) => {
    switch (cityRadio) {
      case "State":
        setData(stateData);
        // setColumns(stateColumns)
        break;

      case "Country":
        setData(countryData);
        // setColumns(countryColumns)
        break;

      default:
        setData(cityData);
        // setColumns(cityColumns)
        break;
    }
  };

  let [totalClicks, settotalClicks] = useState(0);
  let [totalCost, settotalCost] = useState(0);
  let [totalImpressions, settotalImpressions] = useState(0);

  let [total, setTotal] = useState({});

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
  const datePickerRef = useRef(null);

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
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
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
    const { startDate, endDate } = state[0];

    // Check if start and end dates are in the same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      // Format as 'Nov 1 - 5, 2024'
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
    } else {
      // Format as 'Nov 1, 2024 - Dec 5, 2024' if they differ
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
  };
  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };
  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
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

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const fetchAdGroupData = () => {
    setLoading(false);
    setShowDatePicker(false);

    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    let requestBody = {
      customer_id: customer_id,
      target_type: cityRadio,
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
    fetch("https://api.confidanto.com/get-available-locations-total", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("Fetched data:", responseData); // Log response in console

        const segmentData = responseData.map((i) => {
          let targetCity = Object.keys(i)[0];
          let targetData = Object.values(i)[0];

          targetData.name = targetCity;
          return targetData;
        });

        setData(segmentData); // Update the table data
        setLoading(true);
      })
      .catch((error) => {
        console.error("Error fetching ad group data:", error);
      });
  };
  return (
    <div>
      <div
        className={`flex h-screen bg-white ${
          isFullScreen
            ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
            : "mb-16"
        }`}
      >
        <main className="flex-grow p-6 overflow-y-scroll">
          <div className="flex justify-end items-center mb-4">
            <div className="flex space-x-2">
              <div className="relative items-center" ref={datePickerRef}>
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
                      maxDate={new Date()}
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
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={() => setShowUserIntentMenu(!showUserIntentMenu)}
                ref={filterButtonRef}
              >
                <MdOutlineSegment className="ml-5 text-2xl" /> Segment
              </button>

              {showUserIntentMenu && (
                <div
                  className="absolute bg-white shadow-md rounded p-4 mt-12 z-20 border border-gray-200"
                  style={{
                    top:
                      filterButtonRef.current?.offsetTop +
                      filterButtonRef.current?.offsetHeight -
                      50,
                    left: filterButtonRef.current?.offsetLeft,
                  }}
                >
                  <div>
                    <h3>Select Time:</h3>
                    <div className="container">
                      <div className="timetype">
                        <div>
                          <input type="radio" name="time_type" />
                          <span>None</span>
                        </div>

                        <div>
                          <input type="radio" name="time_type" />
                          <span>Day over Day</span>
                        </div>
                        <div>
                          <input type="radio" name="time_type" />
                          <span>Week over Week</span>
                        </div>
                        <div>
                          <input type="radio" name="time_type" />
                          <span>Month over Month</span>
                        </div>
                      </div>
                    </div>

                    <div className="targettype">
                      <h3>Select Type:</h3>

                      <div>
                        <input
                          type="radio"
                          name="target_type"
                          value="City"
                          checked={cityRadio === "City"}
                          onChange={targetRadioChange}
                        />{" "}
                        <span>City</span>
                      </div>

                      <div>
                        <input
                          type="radio"
                          name="target_type"
                          value="State"
                          checked={cityRadio === "State"}
                          onChange={targetRadioChange}
                        />{" "}
                        <span>State</span>
                      </div>

                      <div>
                        <input
                          type="radio"
                          name="target_type"
                          value="Country"
                          checked={cityRadio === "Country"}
                          onChange={targetRadioChange}
                        />{" "}
                        <span>Country</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      onClick={(e) => {
                        filterlocations(e);
                      }}
                    >
                      Filter
                    </button>
                  </div>
                </div>
              )}

              <button className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100">
                <FaFilter className="ml-5 text-xl" />
                Apply filter
              </button>
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                >
                  <MdOutlineFileDownload className="ml-5 text-2xl" />
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
                onClick={openColumnsMenu}
              >
                <FaColumns className="ml-5 text-xl" /> Columns
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
              <div className="relative">
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={toggleFullScreen}
                >
                  {isFullScreen ? (
                    <FaCompress className="ml-5 text-xl" />
                  ) : (
                    <FaExpand className="ml-5 text-xl" />
                  )}{" "}
                  {isFullScreen ? "Collapse" : "Expand"}
                </button>
              </div>
            </div>
          </div>
          {tableVisible && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-y-scroll shadow-md">
                <thead>
                  <tr className="bg-gray-200 uppercase text-sm leading-normal">
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
                  {data.length > 0 ? (
                    <>
                      <>
                        {data.map((item, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 hover:bg-gray-100"
                          >
                            {columns
                              .filter((col) => col.visible)
                              .map((col) => (
                                <td
                                  key={col.key}
                                  className="py-3 px-6 text-left"
                                >
                                  {col.key !== "status" &&
                                    (Array.isArray(item[col.key])
                                      ? item[col.key].join(", ")
                                      : item[col.key])}
                                  {/* Render the status cell */}
                                  {col.key === "status" ? (
                                    <div className="flex items-center">
                                      {item.status === "ENABLED" && (
                                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                      )}
                                      {item.status === "PAUSED" && (
                                        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                      )}
                                      {item.status === "REMOVED" && (
                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                      )}
                                      {item.status.charAt(0).toUpperCase() +
                                        item.status.slice(1).toLowerCase()}
                                    </div>
                                  ) : null}
                                </td>
                              ))}
                          </tr>
                        ))}
                      </>
                    </>
                  ) : (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td
                        colSpan={columns.filter((col) => col.visible).length}
                        className="py-3 px-6 text-center"
                      >
                        {/* Display a message if no data matches the filters */}
                        {data.length === 0 && !loading ? (
                          <div className="py-10 text-gray-600">
                            No data available for the selected filters.
                          </div>
                        ) : (
                          <div className="flex justify-center items-center h-40 mt-3">
                            <LoadingAnimation />
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  {columns
                    .filter((col) => col.visible)
                    .map((col) => {
                      total[col.key] = 0;
                    })}
                  {
                    // map through data
                    data.map((d) => {
                      // //console.log("DD",d);
                      // map throught each objects key:val in data
                      Object.keys(d).forEach((val) => {
                        // map through total
                        Object.keys(total).forEach((totalVal) => {
                          // if total key == obj's key, add to total
                          if (totalVal == val) {
                            total[val] = total[val] + d[val];
                          }
                        });
                        // //console.log("DD",val,d[val])
                      });
                    })
                  }

                  {data.map((i) => {
                    // totalClicks = 0
                    // totalCost = 0
                    // totalImpressions = 0

                    totalClicks += totalClicks + i.clicks;
                    totalCost += totalClicks + i.cost_micros;
                    totalImpressions += totalClicks + i.impressions;
                  })}

                  <tr className="font-bold text-gray-700 bg-gray-100">
                    {Object.entries(total).map((t, k) => {
                      let tempval = "";
                      let ignoreColumns = ["date", "type"];
                      if (typeof t[1] == "number") {
                        if (ignoreColumns.indexOf(t[0]) == -1) {
                          tempval = numberWithCommas(t[1].toFixed(2));
                        }
                      }
                      if (t[0] == "name") {
                        tempval = "Total";
                      }
                      return <td className="py-3 px-6 text-left">{tempval}</td>;
                    })}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Locations2;
