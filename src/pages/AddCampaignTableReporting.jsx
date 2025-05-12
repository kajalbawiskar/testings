import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";
import { FaColumns, FaFilter } from "react-icons/fa";
import {
  AddTableAgeColumns,
  AddTableGenderColumns,
  AddTableDeviceColumns,
  AddbidStrategyColumns,
} from "./Reporting/AddTableColumns";

import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  Checkbox,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ModifyColumns from "./Tools/ModifyColumns";
import LoadingAnimation from "../components/LoadingAnimation";

function CampaignPage(props) {
  const [groupData, setGroupData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [tableElementArray, setTableElementArray] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [customColumns, setCustomColumns] = useState([]);

  useEffect(async () => {
    await fetchGroups();

    await fetchColumns();
  }, []);

  const fetchColumns = () => {
    axios
      .post("https://api.confidanto.com/custom_columns/get-custom-columns", {
        email: localStorage.getItem("email"),
      })
      .then((res) => {
        setCustomColumns(res.data.data);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id: localStorage.getItem("customer_id"),
        }
      );
      setGroupData(response.data.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const [groupType, setGroupType] = useState("none");
  const handleFormSelect = (e) => {
    //console.log("current selected: ", e.target.value);
    setGroupType(e.target.value);
    setSelectedGroups([]);
  };

  const handleMultiSelectChange = (event) => {
    setSelectedGroups(event.target.value);
  };

  const handleFetchDataClick = () => {
    setCreateSelectType("Table");
    setShowCalendarGroup(!ShowCalendarGroup);
  };

  const [ShowCalendarGroup, setShowCalendarGroup] = useState(false);
  const [selectCreateType, setCreateSelectType] = useState("None");

  const onClickCreate = () => {
    switch (groupType) {
      case "group":
        if (selectedGroups.length > 0) {
          fetchMetricsData();
        }
        break;
      case "age":
      case "gender":
      case "device":
      case "bid_strategy": // <-- add this line
        fetchMetricsDevice(); // <-- will internally call fetchBidStrategyData
        break;
      default:
        break;
    }
    setShowCalendarGroup(false);
  };

  // groups, audience, gender, device

  const fetchMetricsData = async () => {
    try {
      const groupNames = selectedGroups
        .map((id) => {
          const group = groupData.find((g) => g.group_id === id);
          return group ? group.group_name : "";
        })
        .filter((name) => name);

      const startDate = props.previousDates.curr_start_date;
      const endDate = props.previousDates.curr_end_date;

      let requestBody = {
        customer_id: localStorage.getItem("customer_id"),
        group_names: groupNames,
        email: localStorage.getItem("email"),
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

      setIsLoading(true);
      const response = await axios.post(
        "https://api.confidanto.com/get-grouped-campaign-metrics",
        requestBody
      );

      //console.log("Response: ", response.data);

      const summarizedMetrics = response.data.metrics.map((group) => {
        let totalObj = group.metrics[1].totals;

        //console.log("Total obj: ", totalObj);

        return {
          group_name: group.group_name,
          metrics: [totalObj],
        };
      });

      let currMetrics = {
        metricsData: summarizedMetrics,
        type: "table",
        customColumns: customColumns,
      };

      setIsLoading(false);
      setTableElementArray([...tableElementArray, currMetrics]);
    } catch (error) {
      console.error("Error fetching metrics data:", error);
    }
  };

  const fetchMetricsDevice = async () => {
    let tempColumns = AddTableAgeColumns;
    let url = "https://api.confidanto.com/get-audience-data";

    switch (groupType) {
      case "age":
        url = "https://api.confidanto.com/get-audience-data";
        tempColumns = AddTableAgeColumns;
        break;
      case "gender":
        url = "https://api.confidanto.com/get-gender-data";
        tempColumns = AddTableGenderColumns;
        break;
      case "device":
        url = "https://api.confidanto.com/device-metrics";
        tempColumns = AddTableDeviceColumns;
        break;
      case "bid_strategy":
        url = "https://api.confidanto.com/bid-strategy-used";
        tempColumns = AddbidStrategyColumns;
        break;

      default:
        break;
    }

    let requestBody = {
      customer_id: localStorage.getItem("customer_id"),
      start_date: props.previousDates.curr_start_date,
      end_date: props.previousDates.curr_end_date,
    };

    setIsLoading(true);
    await axios
      .post(url, requestBody)
      .then((res) => {
        let currMetrics = {
          type: groupType,
          data: res.data,
          columns: tempColumns,
          groupType: groupType,
        };
        setTableElementArray([...tableElementArray, currMetrics]);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error Add table: ", err);
        setIsLoading(false);
      });
  };

  function removeArrayIndex(id) {
    let confirm = window.confirm("Delete this Table?");
    if (confirm) {
      let newArray = tableElementArray
        .filter((item, index) => id != index)
        .map((item) => item);
      setTableElementArray(newArray);

      setIsLoading(true);

      setTimeout(function () {
        setIsLoading(false);
      }, 2000);
    }
  }

  useEffect(() => {
    //console.log("refresh");
  }, [tableElementArray.length]);

  return (
    <div className="py-4 w-full">
      <div className="data-container my-5 flex flex-col ">
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          tableElementArray.map((item, index) => {
            if (item.type == "table") {
              return (
                <>
                  <TableElement
                    metricsData={item.metricsData}
                    arrayIndex={index}
                    removeArrayIndex={removeArrayIndex}
                    customColumns={item.customColumns}
                  />
                </>
              );
            } else if (item.type == "age") {
              return (
                <DeviceAgeGenderTable
                  columns={item.columns}
                  data={item.data}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  groupType={groupType}
                />
              );
            } else if (item.type == "gender") {
              return (
                <DeviceAgeGenderTable
                  columns={item.columns}
                  data={item.data}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  groupType={groupType}
                />
              );
            } else if (item.type == "device") {
              return (
                <DeviceAgeGenderTable
                  columns={item.columns}
                  data={item.data}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  groupType={groupType}
                />
              );
            } else if (item.type == "bid_strategy") {
              return (
                <DeviceAgeGenderTable
                  columns={item.columns}
                  data={item.data}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  groupType={groupType}
                />
              );
            }
          })
        )}
      </div>

      <div className="form flex flex-col w-full">
        <div className="flex  my-4 space-x-6">
          <button
            variant="contained"
            onClick={handleFetchDataClick}
            className="w-40 font-bold rounded  shadow-md py-2 "
            color="primary"
            style={{ backgroundColor: "#283593", color: "white" }}
          >
            Add Table
          </button>
        </div>

        {ShowCalendarGroup && (
          <>
            <div className="calendar-selectgroup">
              <div className="flex flex-col ">
                <div className="relative flex "></div>
              </div>
              <div className="flex flex-col w-full  mt-10 space-y-6">
                <FormControl className="w-full">
                  <InputLabel>Select Table</InputLabel>

                  <Select
                    onChange={(e) => handleFormSelect(e)}
                    defaulstValue=""
                    label="Select Table"
                  >
                    <MenuItem value="group">Group</MenuItem>
                    <MenuItem value="age">Audience</MenuItem>
                    <MenuItem value="gender">Gender</MenuItem>
                    <MenuItem value="device">Device</MenuItem>
                    <MenuItem value="bid_strategy">Bid Strategy Type</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Group Selection */}
            {groupType == "group" ? (
              <div className="flex flex-col w-full mt-10 space-y-6">
                <FormControl className="">
                  <InputLabel>Select Groups</InputLabel>
                  <Select
                    multiple
                    value={selectedGroups}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) =>
                      selected
                        .map((id) => {
                          const group = groupData.find(
                            (g) => g.group_id === id
                          );
                          return group ? group.group_name : "";
                        })
                        .join(", ")
                    }
                  >
                    {groupData.map((group) => (
                      <MenuItem key={group.group_id} value={group.group_id}>
                        <Checkbox
                          checked={selectedGroups.indexOf(group.group_id) > -1}
                        />
                        <ListItemText primary={group.group_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            ) : groupType == "age" ? (
              <></>
            ) : groupType == "gender" ? (
              <></>
            ) : groupType == "device" ? (
              <></>
            ) : groupType == "bid_strategy" ? (
              <></>
            ) : (
              <></>
            )}

            {groupType != "none" && (
              <div className="flex  mt-8 space-x-6">
                <button
                  variant="contained"
                  onClick={onClickCreate}
                  className="w-40 font-bold rounded  shadow-md py-2 "
                  color="primary"
                  style={{ backgroundColor: "#283593", color: "white" }}
                >
                  Create
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function TableElement(props) {
  const [currencySymbol, setCurrencySymbol] = useState("Rs ");

  const [columns, setColumns] = useState([
    {
      id: "0",
      title: "Group Name",
      key: "group_name",
      visible: true,
      category: "Recommended",
    },
    {
      id: "1",
      title: "Clicks",
      key: "clicks",
      visible: true,
      category: "Recommended",
    },
    {
      id: "2",
      title: "Impressions",
      key: "impressions",
      visible: true,
      category: "Recommended",
    },
    {
      id: "3",
      title: "Avg CTR",
      key: "ctr",
      visible: true,
      category: "Recommended",
    },
    {
      id: "4",
      title: "Conversions",
      key: "conversions",
      visible: true,
      category: "Recommended",
    },
    {
      id: "5",
      title: "Cost",
      key: "costs",
      visible: true,
      category: "Recommended",
    },
    {
      id: "6",
      title: "Avg CPC",
      key: "average_cpc",
      visible: true,
      category: "Recommended",
    },
    {
      id: "7",
      title: "Conversion Rate",
      key: "conversion_rate",
      visible: true,
      category: "Recommended",
    },
    {
      id: "8",
      title: "Cost per Conversion",
      key: "cost_per_conversion",
      visible: true,
      category: "Recommended",
    },
  ]);

  useEffect(() => {
    if (props.customColumns.length > 0) {
      let customColumnsArr = props.customColumns.map((data) => {
        return {
          title: data.custom_column,
          key: data.custom_column,
          visible: false,
          category: "Custom Columns",
        };
      });

      setColumns([...columns, ...customColumnsArr]);
    }
  }, []);

  let fixedToColumns = [
    "ctr",
    "costs",
    "average_cpc",
    "conversion_rate",
    "cost_per_conversion",
  ];
  let numberColumns = ["clicks", "impressions"];
  let currencyColumns = ["costs"];

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      {/* Metrics Table */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex w-full flex-row justify-end items-start relative space-x-2">
          <button
            className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
            // onClick={openColumnsMenu}
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
                // setTableVisible={setTableVisible}
                setShowColumnsMenu={setShowColumnsMenu}
              />
            )}
          </div>

          <button
            className="p-2  text-2xl text-bold bg-red-500 text-white rounded-sm hover:bg-red-600"
            onClick={(e) => props.removeArrayIndex(props.arrayIndex)}
          >
            <IoMdClose />
          </button>
        </div>
      </div>
      {props.metricsData.length > 0 && (
        <TableContainer
          component={Paper}
          className="mt-5 rounded-lg shadow-lg overflow-auto"
        >
          <Table>
            <TableHead className="bg-[#2930a8]">
              <TableRow>
                {/* Table Header */}
                {columns
                  .filter((col) => col.visible)
                  .map((item) => {
                    return (
                      <TableCell
                        key={item.key}
                        className="font-bold !text-white"
                      >
                        {item.title}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableHead>
            <TableBody>
              {props.metricsData.map((row) => (
                <TableRow key={row.group_name} className="hover:bg-gray-50">
                  {/* <TableCell>{row.group_name}</TableCell> */}

                  {columns
                    .filter((col) => col.visible)
                    .map((col) => {
                      let key = Object.entries(col).filter(
                        (k, v) => k[0] == "key"
                      )[0][1];

                      // //console.log("key: ",key)

                      let value = row.metrics[0][key];

                      // add . decimal
                      if (fixedToColumns.indexOf(key) != -1) {
                        value = value.toFixed(2);
                      }

                      // add , comma
                      if (numberColumns.indexOf(key) != -1) {
                        if (value > 1000000) {
                          value = value / 1000000;
                        }
                        value = numberWithCommas(value);
                      }

                      // add currency
                      if (currencyColumns.indexOf(key) != -1) {
                        value = currencySymbol + String(value);
                      }

                      if (key == "group_name") {
                        return <TableCell>{row.group_name}</TableCell>;
                      }
                      return <TableCell>{value}</TableCell>;
                    })}
                </TableRow>
              ))}
              <TableRow className="font-bold  bg-gray-100">
                {columns
                  .filter((col) => col.visible)
                  .map((col) => {
                    let key = Object.entries(col).filter(
                      (k, v) => k[0] == "key"
                    )[0][1];

                    // //console.log("key: ",key)

                    let total = props.metricsData.reduce(
                      (sum, row) => sum + row.metrics[0][key],
                      0
                    );

                    if (fixedToColumns.indexOf(key) != -1) {
                      total = total.toFixed(2);
                    }

                    if (numberColumns.indexOf(key) != -1) {
                      if (total > 1000000) {
                        total = total / 1000000;
                      }
                      total = numberWithCommas(total);
                      // total = total.toFixed(2)
                    }

                    // add currency
                    if (currencyColumns.indexOf(key) != -1) {
                      total = currencySymbol + String(total);
                    }

                    if (key == "group_name") {
                      return (
                        <TableCell className="font-bold !text-gray-700">
                          Total
                        </TableCell>
                      );
                    }
                    return (
                      <TableCell key={key} className="font-bold !text-gray-700">
                        {total}
                      </TableCell>
                    );
                  })}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

function DeviceAgeGenderTable(props) {
  const [currencySymbol, setCurrencySymbol] = useState("Rs ");

  const [columns, setColumns] = useState(props.columns);

  useEffect(() => {
    //console.info("ADD TABLE INFO: ", props);
  }, []);

  let fixedToColumns = [
    "costs",
    "cost",

    "cost_per_conversion",
    "average_cpc",
    "ctr",
    "interaction_rate",
    "conversion_rate",
    "conversions_rate",
  ];
  let percentColumns = [
    "cost_per_conversion",
    "average_cpc",
    "ctr",
    "interaction_rate",
    "conversion_rate",
    "conversions_rate",
  ];
  let numberColumns = [
    "clicks",
    "impressions",
    "interactions",
    "conversions",
    "cost",
  ];
  let currencyColumns = ["costs", "cost"];

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      {/* Metrics Table */}
      <div className="flex items-center justify-between mt-10">
        <div className="flex w-full flex-row justify-end items-start relative space-x-2">
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
                setShowColumnsMenu={setShowColumnsMenu}
              />
            )}
          </div>

          <button
            className="p-2  text-2xl text-bold bg-red-500 text-white rounded-sm hover:bg-red-600"
            onClick={(e) => props.removeArrayIndex(props.arrayIndex)}
          >
            <IoMdClose />
          </button>
        </div>
      </div>
      <TableContainer
        component={Paper}
        className="mt-5 rounded-lg shadow-lg overflow-auto"
        style={{ maxHeight: "80vh" }}
      >
        <Table
          style={{
            tableLayout: "fixed",
            width: "100%",
          }}
        >
          <TableHead className="bg-[#2930a8]">
            <TableRow>
              {columns
                .filter((col) => col.visible)
                .map((col) => (
                  <TableCell
                    key={col.key}
                    className="font-bold !text-white px-4 py-2"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      minWidth: "120px",
                    }}
                  >
                    {col.title}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns
                  .filter((col) => col.visible)
                  .map((col) => {
                    let value = item[col.key];

                    if (fixedToColumns.includes(col.key)) {
                      value = value.toFixed(2);
                    }

                    if (numberColumns.includes(col.key)) {
                      if (value > 1000000) value = value / 1000000;
                      value = numberWithCommas(value);
                    }

                    if (currencyColumns.includes(col.key)) {
                      value = currencySymbol + String(value);
                    }

                    if (percentColumns.includes(col.key)) {
                      value = `${value}%`;
                    }

                    return (
                      <TableCell
                        key={col.key}
                        className="text-gray-800 font-medium px-4 py-2"
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {value}
                      </TableCell>
                    );
                  })}
              </TableRow>
            ))}

            {/* Totals Row */}
            <TableRow className="font-bold bg-gray-100">
              {columns
                .filter((col) => col.visible)
                .map((col) => {
                  const key = col.key;
                  let total = 0;

                  if (typeof props.data[0][key] === "number") {
                    total = props.data.reduce((sum, row) => sum + row[key], 0);

                    if (fixedToColumns.includes(key)) total = total.toFixed(2);
                    if (numberColumns.includes(key)) {
                      if (total > 1000000) total = total / 1000000;
                      total = numberWithCommas(total);
                    }
                    if (currencyColumns.includes(key)) {
                      total = currencySymbol + String(total);
                    }
                    if (percentColumns.includes(key)) {
                      total = `${total}%`;
                    }
                  } else {
                    total = [
                      "gender",
                      "device",
                      "age_range",
                      "bid_strategy",
                      "campaign_name",
                    ].includes(key)
                      ? "Total"
                      : "—";
                  }

                  return (
                    <TableCell
                      key={key}
                      className="font-bold !text-gray-700 px-4 py-2"
                    >
                      {total}
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CampaignPage;
