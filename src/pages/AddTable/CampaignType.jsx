// ... [imports remain unchanged]
import React, { useEffect, useState } from "react";
import { MdOutlineFileDownload, MdLockOutline } from "react-icons/md";
import { FaColumns, FaPencilAlt } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import LoadingAnimation from "../../components/LoadingAnimation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { format } from "date-fns";
import axios from "axios";

const CampaignTable = ({
  email,
  customerId,
  initialDateRange,
  uniqueCategories,
}) => {
  const [campaignData, setCampaignData] = useState([]); // <--- move this to the top
  const [customColumn, setCustomColumn] = useState({
    name: "",
    selectedColumns: [],
    selectedFormula: "",
    manualFormula: "",
  });
  const [cardTotal, setCardTotal] = useState([]);
  
    const [tableVisible, setTableVisible] = useState(true); // New state
  const [changePercentages, setChangePercentages] = useState({});
  // ... other hooks

  const toggleEditing = (id, currentBudget) => {
    setIsEditing((prev) => ({ ...prev, [id]: !prev[id] }));
    setTempBudgets((prev) => ({ ...prev, [id]: currentBudget }));
  };

  const [cardObjectArray, setCardObjectArray] = useState([
    {
      id: "0",
      title: "Clicks",
      key: "clicks",
      color: "text-[#75848B]",
      visible: true,
    },
    {
      id: "1",
      title: "Cost",
      key: "costs",
      color: "text-[#75848B]",
      visible: true,
    },
    {
      id: "2",
      title: "CTR",
      key: "ctr",
      color: "text-[#75848B]",
      visible: true,
    },
    {
      id: "3",
      title: "Conversion",
      key: "conversions",
      color: "text-[#75848B]", //#BA68C8
      visible: true,
    },
    {
      id: "4",
      title: "Avg Cost",
      key: "average_cost",
      color: "text-[#75848B]", //#03A9F4
      visible: true,
    },
    {
      id: "5",
      title: "Avg Cpc",
      key: "average_cpc",
      color: "text-[#75848B]", //#4CAF50
      visible: false,
    },
    {
      id: "6",
      title: "Avg Cpm",
      key: "average_cpm",
      color: "text-[#75848B]", //#FF5722
      visible: false,
    },
    {
      id: "7",
      title: "Impressions",
      key: "impressions",
      color: "text-[#75848B]",
      visible: false,
    },
    {
      id: "8",
      title: "Cost/Conv",
      key: "cost_per_conv",
      color: "text-[#75848B]",
      visible: false,
    },
    {
      id: "9",
      title: "Interaction Rate",
      key: "interaction_rate",
      color: "text-[#75848B]", //#4CAF50
      visible: false,
    },
    {
      id: "10",
      title: "Interactions",
      key: "interactions",
      color: "text-[#75848B]", //#FF5722
      visible: false,
    },
    {
      id: "11",
      title: "Budget",
      key: "remaining_budget",
      color: "text-[#75848B]", //#BA68C8
      visible: false,
    },
    {
      id: "12",
      title: "Conversion Rate",
      key: "conversion_rate",
      color: "text-[#75848B]", //#FF5722
      visible: false,
    },
  ]);
  const [data, setData] = useState([]);
  const numberWithCommas = (x) =>
    x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const calculateRemainingBudget = (cost, totalBudget) =>
    (totalBudget - cost).toFixed(2);
  useEffect(() => {
    console.log("campaignData:", campaignData);
  }, [campaignData]);

  const handleSaveClick = (id) => {
    const updatedData = campaignData.map((campaign) => {
      const campaignType = Object.keys(campaign)[0];
      const campaignStats = campaign[campaignType];

      if (campaignStats.id === id) {
        const newBudget = Number(tempBudgets[id]);
        return {
          [campaignType]: {
            ...campaignStats,
            totalBudget: newBudget,
            remainingBudget: calculateRemainingBudget(
              (campaignStats.cost / 1000000).toFixed(0),
              newBudget
            ),
          },
        };
      }

      return campaign;
    });
    
   
    setCampaignData(updatedData);
    localStorage.setItem("campaignData", JSON.stringify(updatedData));
    setIsEditing((prev) => ({ ...prev, [id]: false }));
  };
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };
  const setCardTotalFunction = (data) => {
    let cardObjArr = cardObjectArray.map((col) => {
      let total = data[col.key] || 0;

      return {
        name: col.title,
        total: total,
        color: col.color,
        key: col.key,
      };
    });

    let existingKeys = cardObjectArray.map((item) => item.key);
    let customKeys = Object.keys(data).filter(
      (key) => !existingKeys.includes(key)
    );

    let appendedCols = customKeys.map((key) => {
      return {
        id: -1,
        title: key,
        key: key,
        color: "text-[#4CAF50]",
        visible: false,
      };
    });

    setCardObjectArray((prev) => [...prev, ...appendedCols]);

    let appendedCardTotals = customKeys.map((key) => ({
      name: key,
      total: data[key],
      color: "text-[#4CAF50]",
      key: key,
    }));

    setCardTotal([...cardObjArr, ...appendedCardTotals]);
  };

  const [customColumnsMain, setCustomColumnsMain] = useState([]);

  useEffect(() => {
    console.log("campaignData:", campaignData);
  }, [campaignData]);

  useEffect(() => {
    const fetchData = async () => {
  const startDate = format(state[0].startDate, "yyyy-MM-dd");
  const endDate = format(state[0].endDate, "yyyy-MM-dd");

  const requestBody = {
    customer_id: customerId, // coming from props
    start_date: startDate,
    end_date: endDate,
  };

  try {
    let responseData;

    if (customerId === "7948821642") {
      const dummyResponse = await fetch(
        "https://auth.confidanto.com/fetch_dummy/overall_campaigns",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      const dummyData = await dummyResponse.json();

      responseData = dummyData.map((item) => ({
        [item.campaign_type]: {
          ...item,
          conversion: item.conversions,
          cost_per_conv: item.cost_per_conversion,
        },
      }));
    } else {
      const realResponse = await fetch(
        "https://api.confidanto.com/get-overview-campaign-data",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      responseData = await realResponse.json();
    }

    setCampaignData(responseData);
    setData(responseData);
    setSelectedMonth("October");
    setIsLoading(false);
  } catch (err) {
    console.error("Error fetching campaign data:", err);
    setIsLoading(false);
  }
};


    const fetchCardTotal = async () => {
      const startDate = format(state[0].startDate, "yyyy-MM-dd");
      const endDate = format(state[0].endDate, "yyyy-MM-dd");

      const customerId = localStorage.getItem("customer_id");

      let requestBody = {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      };

      try {
        let response;

        if (customerId === "7948821642") {
          response = await fetch(
            "https://auth.confidanto.com/fetch_dummy/total_campaigns",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );
          const dummyCardData = await response.json();
          setCardTotalFunction(dummyCardData[0]);
          setChangePercentages(dummyCardData[0]);
        } else {
          const realResponse = await axios.post(
            "https://api.confidanto.com/campaign-overall-metrics",
            requestBody
          );
          setCardTotalFunction(realResponse.data);
          setChangePercentages(realResponse.data);
        }
      } catch (error) {
        console.error("Error fetching card totals:", error);
      }
    };
    const fetchCustomColumns = () => {
      axios
        .post("https://api.confidanto.com/custom_columns/get-custom-columns", {
          email: localStorage.getItem("email"),
        })
        .then((res) => {
          setCustomColumnsMain(res.data);
        })
        .catch((err) => {});
    };
    fetchCustomColumns();
    fetchData();
    fetchCardTotal();
  }, []);
  
   const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
  };
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [currencySymbol] = useState("₹ ");
  const [columns, setColumns] = useState([
    {
      id: "0",
      title: "Campaign Type",
      key: "Campaign Type",
      visible: true,
      locked: true,
      category: "recommended",
      isLocked: true,
    },
    {
      id: "1",
      title: "Spend",
      key: "cost",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "2",
      title: `Total Budget for ${selectedMonth}`,
      key: `Total Budget for "this month"`,
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "3",
      title: "Remaining Budget",
      key: "Remaining Budget",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "4",
      title: "Avg. Cost",
      key: "avg_cost",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "5",
      title: "Avg. CPC",
      key: "avg_cpc",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "6",
      title: "Avg. CPM",
      key: "avg_cpm",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "7",
      title: "Budget",
      key: "budget_micros",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "8",
      title: "Conversion",
      key: "conversion",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "9",
      title: "Cost per Conversion",
      key: "cost_per_conv",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "10",
      title: "Impressions",
      key: "impressions",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "11",
      title: "Leads",
      key: "leads",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "12",
      title: "Interaction Rate",
      key: "interaction_rate",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "13",
      title: "Clicks",
      key: "clicks",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "14",
      title: "CTR",
      key: "ctr",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "15",
      title: "Spend to Date",
      key: "spend_to_date",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "16",
      title: "Yesterday Spend",
      key: "yesterday_spend",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
  ]);
   const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (columns[source.index].isLocked || destination.index === 0) return;

    const updatedColumns = Array.from(columns);
    const [movedColumn] = updatedColumns.splice(source.index, 1);
    updatedColumns.splice(destination.index, 0, movedColumn);
    setColumns(updatedColumns);
  };
  function downloadData(format) {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.title);
    const rows = campaignData.map((item) =>
      visibleColumns.map((col) => {
        let campaignTypeKey = Object.keys(item)[0];
        let campaignObjectValues = Object.values(item)[0];
        if (col.key === "Campaign Type") {
          return campaignTypeKey;
        }
        if (col.key === "cost") {
          return numberWithCommas(
            (campaignObjectValues[col.key] / 1000000).toFixed(0)
          );
        }

        if (col.key === "ctr") {
          return (
            numberWithCommas(campaignObjectValues[col.key].toFixed(2)) + "%"
          );
        }
        if (col.key === "leads") {
          return campaignObjectValues["conversion"];
        }

        if (col.key === 'Total Budget for "this month"') {
          if (item.totalBudget == undefined) {
            return String(0);
          } else {
            return String(item.totalBudget);
          }
        }

        if (col.key === "Remaining Budget") {
          let campaignStats = item[campaignTypeKey];
          let remainingBudgetTemp = numberWithCommas(
            campaignStats.remaining_budget.toFixed(0)
          );

          if (item.totalBudget != undefined) {
            if (String(item.totalBudget).length > 1) {
              remainingBudgetTemp = numberWithCommas(
                Number(item.remainingBudget).toFixed(0)
              );
            }
          }
          return remainingBudgetTemp;
        }
        return campaignObjectValues[col.key];
      })
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
      let obj = `<root>\n`;
      rows.map((i) => {
        obj += `\t<row>\n`;
        visibleColumns.map((j, index) => {
          obj += `\t\t<${j.title}>${i[index]}</${j.title}>\n`;
        });
        obj += `\t</row>\n`;
      });
      obj += `</root>\n`;
      const blob = new Blob([obj], { type: "application/xml" });
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
  }
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
    const navigate = useNavigate();
  const [state, setState] = useState(
    initialDateRange || [
      {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState({});
  const [tempBudgets, setTempBudgets] = useState({});
const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };
  const toTitleCase = (str) =>
    str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        {/* <h2 className="text-lg font-semibold">Campaign Overview</h2> */}
        <div className="flex space-x-3">
          <button className="bg-transparent  text-gray-600 px-4 py-2 rounded  hover:bg-slate-100">
            <IoMdShareAlt className="ml-5 h-4 text-xl" />
            Share
          </button>
          <button
            className="bg-transparent  text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
            onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          >
            <MdOutlineFileDownload className="ml-5 h-4 text-2xl" />
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
          <button
                                        className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                                        onClick={openColumnsMenu}
                                      >
                                        <FaColumns className="ml-5 h-3 text-xl" /> Columns
                                      </button>
                                      {showColumnsMenu && (
                                        <div className="absolute right-0 h-screen bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-800 max-w-3xl border border-gray-200">
                                          <div className="absolute right-0 h-max bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-max max-w-6xl border border-gray-200 overflow-auto mb-48">
                                            <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700 flex overflow-auto">
                                              <div className=" justify-between flex items-center border-b-1 w-[1100px] ">
                                                <div className=" flex border-r-1 justify-between p-4 w-3/4">
                                                  <div className="">
                                                    <h2 className="mr-11">
                                                      Modify columns
                                                    </h2>{" "}
                                                  </div>
                                                  <div
                                                    className=" text-blue-500 cursor-pointer"
                                                    onClick={() =>
                                                      navigate("/custom-column")
                                                    }
                                                  >
                                                    + Custom Column
                                                  </div>
                                                </div>
                                                <div className=" justify-start">
                                                  <h2 className="font-bold mb-4">
                                                    Your columns
                                                  </h2>
                                                </div>
                                              </div>
                                            </div>
                                            <div className="flex-grow overflow-auto">
                                              <div className="flex ">
                                                <div className="grid grid-rows-2 gap-6 max-h-screen w-3/4 border-r overflow-auto ">
                                                  <div className=" space-x-3 space-y-2">
                                                    {uniqueCategories.map((category) => (
                                                      <div key={category}>
                                                        <div
                                                          className=""
                                                          onClick={() =>
                                                            toggleCategory(category)
                                                          }
                                                        >
                                                          <span className="p-2 flex items-center hover:bg-gray-50 cursor-pointer w-full justify-between">
                                                            {category}{" "}
                                                            {expandedCategory ===
                                                            category ? (
                                                              <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                                                            ) : (
                                                              <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                                                            )}
                                                          </span>
                                                        </div>
                                                        {expandedCategory ===
                                                          category && (
                                                          <div className="grid grid-cols-3">
                                                            {columns
                                                              .filter(
                                                                (col) =>
                                                                  col.category ===
                                                                  category
                                                              )
                                                              .map((col) => (
                                                                <>
                                                                  <ColumnItem
                                                                    key={col.key}
                                                                    column={col}
                                                                    toggleVisibility={
                                                                      toggleColumnVisibility
                                                                    }
                                                                    category={
                                                                      col.category
                                                                    }
                                                                  />
                                                                </>
                                                              ))}
                                                          </div>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                                <div className="w-max p-4">
                                                  <p className="text-sm text-gray-500 mb-4">
                                                    Drag and drop to reorder
                                                  </p>
                                                  <DragDropContext onDragEnd={onDragEnd}>
                                                    <Droppable droppableId="columnsList">
                                                      {(provided) => (
                                                        <div
                                                          {...provided.droppableProps}
                                                          ref={provided.innerRef}
                                                          className="space-y-2 overflow-auto h-48 border rounded-md p-2"
                                                        >
                                                          {columns
                                                            .filter(
                                                              (column) => column.visible
                                                            )
                                                            .map((column, index) => (
                                                              <Draggable
                                                                key={column.id}
                                                                draggableId={column.id}
                                                                index={index}
                                                                isDragDisabled={
                                                                  column.isLocked
                                                                }
                                                              >
                                                                {(provided) => (
                                                                  <div
                                                                    ref={
                                                                      provided.innerRef
                                                                    }
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="flex items-center p-2 bg-gray-100 mb-1 rounded shadow"
                                                                  >
                                                                    <span className="flex items-center gap-4">
                                                                      {column.isLocked ==
                                                                        false && (
                                                                        <FaGripLines />
                                                                      )}
                                                                      {column.isLocked && (
                                                                        <MdLockOutline
                                                                          size={26}
                                                                          className="font-bold text-gray-700  "
                                                                        />
                                                                      )}{" "}
                                                                      {column.title}{" "}
                                                                    </span>
                                                                  </div>
                                                                )}
                                                              </Draggable>
                                                            ))}
                                                          {provided.placeholder}
                                                        </div>
                                                      )}
                                                    </Droppable>
                                                  </DragDropContext>
                                                  <div className="flex items-center mt-4">
                                                    <input
                                                      type="checkbox"
                                                      id="saveColumnSet"
                                                      className="mr-2"
                                                    />
                                                    <label
                                                      htmlFor="saveColumnSet"
                                                      className="text-sm"
                                                    >
                                                      Save your column set (name required)
                                                    </label>
                                                  </div>
                                                </div>
                                              </div>
                                              <div className="flex space-x-2 overflow-auto">
                                                <div className="">
                                                  <button
                                                    className=" bg-blue-500 text-white px-4  py-2 rounded hover:text-blue-600"
                                                    onClick={applyChanges}
                                                  >
                                                    Apply
                                                  </button>
                                                  <button
                                                    className="bg-gray-400 ml-3 text-white px-4 py-2 rounded hover:text-gray-600"
                                                    onClick={cancelChanges}
                                                  >
                                                    Cancel
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
        </div>
      </div>

      {isLoading ? (
        <LoadingAnimation />
      ) : campaignData.length === 0 ? (
        <div className="text-center text-gray-500">
          No campaign data available.
        </div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {columns
                .filter((col) => col.visible)
                .map((col, index) => (
                  <th key={index} className="border px-4 py-2">
                    {col.title}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            <>
              {campaignData.map((campaign, index) => {
                let campaignType = Object.keys(campaign)[0];
                let campaignStats = campaign[campaignType];
                const id = campaignStats.id;

                let remainingBudgetTemp =
                  currencySymbol +
                  numberWithCommas(
                    (campaignStats?.remaining_budget || 0).toFixed(0)
                  );

                if (campaign.totalBudget != undefined) {
                  if (String(campaign.totalBudget).length > 1) {
                    remainingBudgetTemp =
                      currencySymbol +
                      numberWithCommas(
                        (campaignStats?.remaining_budget || 0).toFixed(0)
                      );
                  }
                }
                return (
                  <tr key={index} className="hover:bg-gray-50 normal-case">
                    {columns
                      .filter((col) => col.visible)
                      .map((col, idx) => (
                        <td key={idx} className="border px-4 py-2">
                          {col.key === "Campaign Type" &&
                            toTitleCase(campaignType)}
                          {col.key === "cost" &&
                            currencySymbol +
                              numberWithCommas(
                                (campaignStats?.remaining_budget || 0).toFixed(
                                  0
                                )
                              )}
                          {col.key === 'Total Budget for "this month"' &&
                            (isEditing[campaignStats.id] ? (
                              <>
                                <input
                                  type="number"
                                  key={campaignStats.id}
                                  value={tempBudgets[campaignStats.id] || ""}
                                  onChange={(e) =>
                                    setTempBudgets((prev) => ({
                                      ...prev,
                                      [campaignStats.id]: e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md ml-1"
                                  onClick={() =>
                                    handleSaveClick(campaignStats.id)
                                  }
                                >
                                  Save
                                </button>
                              </>
                            ) : (
                              <div className="flex justify-center items-center">
                                {campaignStats.totalBudget}
                                <button
                                  onClick={() =>
                                    toggleEditing(
                                      campaignStats.id,
                                      campaignStats.totalBudget
                                    )
                                  }
                                  className="text-blue-500 ml-1"
                                >
                                  <FaPencilAlt />
                                </button>
                              </div>
                            ))}

                          {col.key === "Remaining Budget" &&
                            remainingBudgetTemp}

                          {col.key === "budget_micros" &&
                            currencySymbol +
                              numberWithCommas(
                                (campaignStats?.remaining_budget || 0).toFixed(
                                  0
                                )
                              )}

                          {col.key === "impressions" &&
                            numberWithCommas(campaignStats.impressions)}
                          {col.key === "clicks" &&
                            numberWithCommas(campaignStats.clicks)}
                          {col.key === "leads" &&
                            numberWithCommas(campaignStats.conversion)}
                          {col.key === "ctr" &&
                            numberWithCommas(campaignStats.ctr.toFixed(2)) +
                              "%"}

                          {col.key === "spend_to_date" &&
                            currencySymbol +
                              numberWithCommas(
                                (campaignStats?.remaining_budget || 0).toFixed(
                                  0
                                )
                              )}
                          {col.key === "yesterday_spend" &&
                            currencySymbol +
                              numberWithCommas(
                                (campaignStats?.remaining_budget || 0).toFixed(
                                  0
                                )
                              )}

                          {customColumn.length > 0 &&
                            customColumn.map((customCol, customIdx) => {
                              // Get values for selected columns
                              const column1Value =
                                campaignStats[customCol.selectedColumns[0]];
                              const column2Value =
                                campaignStats[customCol.selectedColumns[1]];

                              // Calculate based on selected formula
                              let calculatedValue = 0;
                              if (customCol.formula === "sum") {
                                calculatedValue = column1Value + column2Value;
                              } else if (customCol.formula === "subtract") {
                                calculatedValue = column1Value - column2Value;
                              } else if (customCol.formula === "divide") {
                                calculatedValue = column1Value / column2Value;
                              } else if (customCol.formula === "multiply") {
                                calculatedValue = column1Value * column2Value;
                              }

                              return (
                                <td
                                  key={customIdx}
                                  className="border px-4 py-2"
                                >
                                  {numberWithCommas(calculatedValue.toFixed(2))}
                                </td>
                              );
                            })}
                        </td>
                      ))}
                  </tr>
                );
              })}
            </>
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              {columns
                .filter((col) => col.visible)
                .map((col, index) => {
                  if (index === 0)
                    return (
                      <td key={col.key} className="border px-4 py-2">
                        Total
                      </td>
                    );

                  let total = 0;

                  campaignData.forEach((campaign) => {
                    const campaignType = Object.keys(campaign)[0];
                    const campaignStats = campaign[campaignType];

                    if (col.key === "leads") {
                      total += Number(campaignStats.conversion || 0);
                    } else if (col.key === "cost") {
                      total += Number((campaignStats.cost || 0) / 1000000);
                    } else if (
                      [
                        "avg_cost",
                        "avg_cpc",
                        "avg_cpm",
                        "budget_micros",
                        "cost_per_conv",
                        "interaction_rate",
                        "spend_to_date",
                        "yesterday_spend",
                      ].includes(col.key)
                    ) {
                      total += Number(campaignStats[col.key] || 0);
                    } else if (
                      ["clicks", "impressions", "conversion"].includes(col.key)
                    ) {
                      total += Number(campaignStats[col.key] || 0);
                    }
                  });

                  const percentFields = ["ctr", "interaction_rate"];
                  const rupeeFields = [
                    "avg_cost",
                    "avg_cpc",
                    "budget_micros",
                    "cost_per_conv",
                    "spend_to_date",
                    "yesterday_spend",
                    "cost",
                  ];

                  let formattedTotal = total;
                  if (percentFields.includes(col.key)) {
                    formattedTotal = total.toFixed(2) + "%";
                  } else if (rupeeFields.includes(col.key)) {
                    formattedTotal = "₹ " + total.toLocaleString("en-IN");
                  } else {
                    formattedTotal = total.toLocaleString("en-IN");
                  }

                  return (
                    <td key={col.key} className="border px-4 py-2">
                      {formattedTotal}
                    </td>
                  );
                })}
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default CampaignTable;
