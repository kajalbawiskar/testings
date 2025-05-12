import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import GenderChat from "./Charts/GenderChat";
import Agechart from "./Charts/Agechart";
import DeviceChart from "./Charts/DeviceChart";
import AuctionInsightsUploadChart from "./Charts/AuctionInsights";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import DonutChartGroups from "./Charts/DonutChartGroups";

const AddChart = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [chartArray, setChartArray] = useState([]);

  const handleAddTable = () => setShowOptions(!showOptions);

  const fetchGroupNames = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id:localStorage.getItem("customer_id"),
        }
      );
      const groups = response.data.groups.map((group) => ({
        id: group.group_id,
        name: group.group_name,
      }));
      setGroupNames(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleGroupChange = (event) => setSelectedGroups(event.target.value);

  useEffect(() => {
    fetchGroupNames();
  }, []);

  const fetchChartMetricsData = async () => {
    const groupIds = groupNames
      .filter((item) => selectedGroups.includes(item.name))
      .map((item) => item.name);

    const { curr_start_date: startDate, curr_end_date: endDate } =
      props.previousDates;

    let requestBody = {
      customer_id: localStorage.getItem("customer_id"),
      group_names: groupIds,
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

    axios
      .post(
        "https://api.confidanto.com/campaign-group/fetch-groups-metric-percentage",
        requestBody
      )
      .then((res) => {
        let currMetrics = {
          type: "chart",
          labels: groupIds,
          data: res.data.filter((res) => groupIds.includes(res.group_name)),
        };
        setChartArray((prev) => [...prev, currMetrics]);
      });
  };

  const addTable = () => {
    if (selectedOption === "group") {
      if (selectedGroups.length < 1) return;
      fetchChartMetricsData();
    } else {
      const chartTypes = {
        age: "age",
        gender: "gender",
        device: "device",
        auction_insights: "auction_insights",
      };
      setChartArray((prev) => [...prev, { type: chartTypes[selectedOption] }]);
    }

    setSelectedGroups([]);
    setShowOptions(false);
  };

  const removeArrayIndex = (id) => {
    if (window.confirm("Delete this Table?")) {
      setChartArray((curr) => curr.filter((_, index) => index !== id));
    }
  };

  return (
    <>
      <div className="chart-list">
        {chartArray.map((item, index) => {
          switch (item.type) {
            case "chart":
              return (
                <DonutChartGroups
                  key={index}
                  labels={item.labels}
                  data={item.data}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                />
              );
            case "age":
              return (
                <AudienceElement
                  key={index}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  previousDates={props.previousDates}
                />
              );
            case "gender":
              return (
                <GenderElement
                  key={index}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  previousDates={props.previousDates}
                />
              );
            case "device":
              return (
                <DeviceElement
                  key={index}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                  previousDates={props.previousDates}
                />
              );
            case "auction_insights":
              return (
                <AuctionInsightsUploadChart
                  key={index}
                  arrayIndex={index}
                  removeArrayIndex={removeArrayIndex}
                />
              );
            default:
              return null;
          }
        })}
      </div>
      <div className="justify-start py-3 my-4">
        <button
          onClick={handleAddTable}
          style={{ backgroundColor: "#283593", color: "white" }}
          className="w-40 text-white py-2 font-bold rounded shadow-md"
        >
          Add Chart
        </button>

        {showOptions && (
          <div className="flex flex-col items-start gap-6 mt-10">
            <FormControl className="w-1/3">
              <InputLabel>Chart Type</InputLabel>


              <Select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full bg-white"
                label="Select Chart"
              >
                <MenuItem value="group">Group</MenuItem>
                <MenuItem value="age">Audience</MenuItem>
                <MenuItem value="gender">Gender</MenuItem>
                <MenuItem value="device">Device</MenuItem>
                <MenuItem value="auction_insights">
                  Auction Insights Upload
                </MenuItem>
              </Select>

              {selectedOption === "group" && (
                <div className="w-full my-4">
                  <FormControl className="w-full">
                    <InputLabel id="select-groups-label" shrink={true}>
                      Select Groups
                    </InputLabel>
                    <Select
                      multiple
                      value={selectedGroups}
                      onChange={handleGroupChange}
                      renderValue={(selected) => selected.join(", ")}
                      label="Select Groups"
                      className="bg-white"
                    >
                      {groupNames.map((group) => (
                        <MenuItem key={group.id} value={group.name}>
                          <Checkbox
                            checked={selectedGroups.includes(group.name)}
                          />
                          <ListItemText primary={group.name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              {selectedOption && (
                <div className="flex mt-8 space-x-6">
                  <button
                    onClick={addTable}
                    className="w-40 font-bold rounded shadow-md py-2"
                    style={{ backgroundColor: "#283593", color: "white" }}
                  >
                    Create
                  </button>
                </div>
              )}
            </FormControl>
          </div>
        )}
      </div>
    </>
  );
};

export default AddChart;

const AudienceElement = ({ arrayIndex, removeArrayIndex, previousDates }) => (
  <div className="mt-8">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-blue-600">Audience</h2>
      <button
        className="p-2 text-lg bg-red-600 text-white rounded-sm"
        onClick={() => removeArrayIndex(arrayIndex)}
      >
        <IoMdClose />
      </button>
    </div>
    <Agechart previousDates={previousDates} />
  </div>
);

const GenderElement = ({ arrayIndex, removeArrayIndex, previousDates }) => (
  <div className="mt-8">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-blue-600">Gender</h2>
      <button
        className="p-2 text-lg bg-red-600 text-white rounded-sm"
        onClick={() => removeArrayIndex(arrayIndex)}
      >
        <IoMdClose />
      </button>
    </div>
    <GenderChat previousDates={previousDates} />
  </div>
);

const DeviceElement = ({ arrayIndex, removeArrayIndex, previousDates }) => (
  <div className="mt-8">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-blue-600">Device</h2>
      <button
        className="p-2 text-lg bg-red-600 text-white rounded-sm"
        onClick={() => removeArrayIndex(arrayIndex)}
      >
        <IoMdClose />
      </button>
    </div>
    <DeviceChart previousDates={previousDates} />
  </div>
);
