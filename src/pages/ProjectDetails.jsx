/* eslint-disable no-eval */
/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import googleAdsImage from "../assets/googleads.png";
import { format } from "date-fns";
import { DateRangePicker } from "react-date-range";
import { ChatBox } from "../components";
import Bar from "./Charts/Bar";
import AddChart from "./ChartAdd";
import { PiCardsBold } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";
import ModifyCardsDrag from "./Tools/ModifyCardDrag";
import CampaignTable from "./AddTable/CampaignType"; // adjust path as needed

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

// import { FaAngleDown } from "react-icons/fa6";

import { Link } from "react-router-dom";
import AddTable from "./AddTable";

const ProjectDetails = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [campaignData, setCampaignData] = useState([]);
  const [tableVisible, setTableVisible] = useState(true); // New state
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State to manage chatbox visibility
  const [isGoogleAdsConnected, setIsGoogleAdsConnected] = useState(false);
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
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

  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  let d = new Date();
  let month = d.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [selectedMonth, setSelectedMonth] = useState(months[month]);
  const [isOpen, setIsOpen] = useState(false);
  let [columns, setColumns] = useState([
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
      // locked: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "2",
      title: `Total Budget for ${selectedMonth}`,
      key: `Total Budget for "this month"`,
      visible: true,
      // locked: true,
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

  const [expandedCategory, setExpandedCategory] = useState(null);
  const uniqueCategories = Array.from(
    new Set(columns.map((col) => col.category))
  );

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (columns[source.index].isLocked || destination.index === 0) return;

    const updatedColumns = Array.from(columns);
    const [movedColumn] = updatedColumns.splice(source.index, 1);
    updatedColumns.splice(destination.index, 0, movedColumn);
    setColumns(updatedColumns);
  };

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      key: "selection",
    },
  ]);
  const navigate = useNavigate();
  const datePickerRef = useRef(null);
  const [changePercentages, setChangePercentages] = useState({});

  const [isEditing, setIsEditing] = useState({});
  const [tempBudgets, setTempBudgets] = useState({});

  const [currencySymbol, setCurrencySymbol] = useState("₹ ");

  const [cardTotal, setCardTotal] = useState([]);
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

  const [cards, setCards] = useState([]);

  const [showCardColumns, setShowCardColumns] = useState(false);

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

  const changeCardCheckbox = (e) => {
    let value = e.target.checked;
    let key = e.target.getAttribute("data-key");

    let newCardObjArr = cardObjectArray.map((item) => {
      if (key == item.key) {
        item.visible = value;
      }
      return item;
    });

    setCardObjectArray(newCardObjArr);
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `https://api.confidanto.com/projects/${projectId}`
        );
        setProject(response.data);
        setIsGoogleAdsConnected(response.data.isGoogleAdsConnected);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };
    fetchProject();
  }, [projectId]);

  const email = localStorage.getItem("email");
  const projectIds = useParams().projectId;
  const customerId = localStorage.getItem("customer_id");

  useEffect(() => {
    const checkGoogleAdsConnection = async () => {
      try {
        const email = localStorage.getItem("email");
        if (!email || !projectId) {
          console.error("Missing email or project ID", { email, projectId });
          return;
        }
        const response = await axios.post(
          "https://api.confidanto.com/connect-google-ads/get-customer-id",
          {
            email,
            project_id: projectId,
          }
        );
        if (Array.isArray(response.data) && response.data.length > 0) {
          const customerData = response.data[0];
          localStorage.setItem("customer_id", customerData.customer_id);
          if (customerData.customer_id) {
            setIsGoogleAdsConnected(true);
          } else {
          }
        } else {
        }
      } catch (error) {
        console.error("Error fetching customer ID:", error);
        if (error.response && error.response.data) {
          console.error("API response:", error.response.data);
        }
      }
    };

    checkGoogleAdsConnection();
  }, [projectId]);

  const [customColumnsMain, setCustomColumnsMain] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const startDate = format(state[0].startDate, "yyyy-MM-dd");
      const endDate = format(state[0].endDate, "yyyy-MM-dd");

      const customerId = localStorage.getItem("customer_id");

      let requestBody = {
        customer_id: customerId,
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

  const calculateRemainingBudget = (cost, totalBudget) => {
    return (totalBudget - cost).toFixed(2);
  };
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
  const handleGoogleAdsClick = async (projectId) => {
    localStorage.setItem("project_id", projectId);
    navigate(`/Googledetails/${projectId}`, { state: { step: 2 } });
  };

  useEffect(() => {
    const savedCampaignData = localStorage.getItem("campaignData");

    if (savedCampaignData) {
      setCampaignData(JSON.parse(savedCampaignData));
      setData(JSON.parse(savedCampaignData));
      setIsLoading(false);
    }
  }, []);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="text-2xl text-blue-600">Loading...</div>
      </div>
    );
  }

  const fetchAdGroupData = async () => {
    const fetchCardTotal = () => {
      const startDate = format(state[0].startDate, "yyyy-MM-dd");
      const endDate = format(state[0].endDate, "yyyy-MM-dd");

      let requestBody = {
        customer_id: localStorage.getItem("customer_id"),
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      };

      axios
        .post(
          "https://api.confidanto.com/campaign-overall-metrics",
          requestBody
        )
        .then((res) => {
          setCardTotalFunction(res.data);
        })
        .catch((err) => {});
    };
    fetchCardTotal();

    setIsLoading(true);
    setShowDatePicker(false);

    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    let requestBody = {
      customer_id: localStorage.getItem("customer_id"),
    };
    if (startDate === endDate) {
      requestBody = { ...requestBody, single_date: startDate };
    } else {
      requestBody = {
        ...requestBody,
        start_date: startDate,
        end_date: endDate,
      };
    }

    const response = await fetch(
      "https://api.confidanto.com/get-overview-campaign-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );
    const data = await response.json();
    setCampaignData(data);
    setData(data);
    setIsLoading(false).catch((error) => {
      console.error("Error fetching ad group data:", error);
    });
  };
  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
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
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <>
        <div className="text-left flex top-0 left-0 pb-2 justify-between">
          <div>
            <h1 className="text-3xl flex font-extrabold text-gray-900 ml-7">
              <Link to="/projects">
                <IoIosArrowBack className="space-x-2 h-8 w-8  shadow-lg hover:bg-slate-200 rounded-lg mt-1 mr-2" />
              </Link>
              {project.name}
            </h1>
          </div>
        </div>

        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 min-h-screen">
          <div className="max-w-xl mx-auto "></div>

          <div className="relative">
            {isGoogleAdsConnected && (
              <div className="card-container-parent ">
                <div className="upperRow relative flex flex-row justify-between items-center">
                  <div className="calendar">
                    <div className="relative m-2" ref={datePickerRef}>
                      <button
                        onClick={toggleDatePicker}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold "
                      >
                        {formatButtonLabel()}
                      </button>
                      {showDatePicker && (
                        <div className="absolute z-10 mt-2 shadow-lg bg-white left-2">
                          <DateRangePicker
                            onChange={(item) => setState([item.selection])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            months={1}
                            ranges={state}
                            maxDate={new Date()}
                            direction="horizontal"
                          />
                          <button
                            onClick={fetchAdGroupData}
                            className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="cardcolumns">
                    <button
                      className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100
                    justify-center
                    "
                      onClick={() => {
                        setShowCardColumns(!showCardColumns);
                      }}
                    >
                      <PiCardsBold className="ml-5 text-xl" />
                    </button>

                    {showCardColumns && (
                      <div className="columns bg-white absolute right-0 top-16 z-10">
                        <div className="flex flex-col p-4 rounded-md ">
                          <ModifyCardsDrag
                            cards={cards}
                            setCards={setCards}
                            setTableVisible={setTableVisible}
                            setShowCardColumns={setShowCardColumns}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-4 grid grid-cols-5 relative z-0">
                  {cardTotal.map((item) => {
                    return (
                      <>
                        {cardObjectArray
                          .filter((col) => col.visible)
                          .map((col) => {
                            if (col.key == item.key) {
                              return (
                                <div className="card  flex flex-col items-start justify-center mr-2 my-2 p-6 bg-white rounded-md shadow-lg ">
                                  <div className="text m-2 font-bold text-2xl">
                                    {item.name}
                                  </div>
                                  <div
                                    className={`value m-2 font-bold text-2xl ${item.color}`}
                                  >
                                    {(() => {
                                      const percentFields = [
                                        "ctr",
                                        "conversion_rate",
                                        "interaction_rate",
                                      ];
                                      const rupeeFields = [
                                        "average_cost",
                                        "costs",
                                        "remaining_budget",
                                        "average_cpc",
                                        "cost_per_conv",
                                      ];

                                      let value = item.total;

                                      if (percentFields.includes(item.key)) {
                                        return value + "%";
                                      }

                                      if (rupeeFields.includes(item.key)) {
                                        return (
                                          "₹ " +
                                          Number(value).toLocaleString("en-IN")
                                        );
                                      }

                                      return Number(value).toLocaleString(
                                        "en-IN"
                                      );
                                    })()}
                                  </div>
                                </div>
                              );
                            }
                          })}
                      </>
                    );
                  })}
                </div>
              </div>
            )}
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg  mb-20 border">
              <div className="lg:w-1400 md:w-780 sm:w-400"></div>
              {isGoogleAdsConnected ? (
                <div className="mt-8 w-full ">
                  
                  <>
                    <CampaignTable
                      email={email}
                      uniqueCategories={uniqueCategories}
                      customerId={customerId}
                      initialDateRange={state}
                      CampaignTable={CampaignTable}
                      setCardTotalFunction={setCardTotalFunction}
                    />
                  </>
                  <div className="text-left mt-4 ">
                    <div className="py-5">
                      <AddTable
                        startDate={format(state[0].startDate, "yyyy-MM-dd")}
                        endDate={format(state[0].endDate, "yyyy-MM-dd")}
                        email={email}
                        uniqueCategories={uniqueCategories}
                        customerId={customerId}
                        initialDateRange={state}
                        CampaignTable={CampaignTable}
                        setCardTotalFunction={setCardTotalFunction}
                      />
                    </div>
                  </div>
                  <div className="flex justify-around items-center h-screen">
                    <div className="w-full  bg-gray-100">
                      <Bar
                        className="-mr-4"
                        startDate={format(state[0].startDate, "yyyy-MM-dd")}
                        endDate={format(state[0].endDate, "yyyy-MM-dd")}
                        customerId={localStorage.getItem("customer_id")}
                      />
                    </div>
                  </div>
                  <div className="text-left  mt-4 ">
                    <div className="w-full py-5">
                      <AddChart
                        previousDates={{
                          curr_start_date: format(
                            state[0].startDate,
                            "yyyy-MM-dd"
                          ),
                          curr_end_date: format(state[0].endDate, "yyyy-MM-dd"),
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src={googleAdsImage}
                    alt="Google Ads"
                    className="w-auto h-48"
                  />
                  <p className="text-xl text-blue-600 font-semibold mt-4">
                    Google Ads
                  </p>
                  <button
                    onClick={() => handleGoogleAdsClick(project.id)}
                    className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition w-60 text-center"
                  >
                    Connect with Google Ads
                  </button>
                </>
              )}
              {isChatOpen && <ChatBox />}
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default ProjectDetails;
