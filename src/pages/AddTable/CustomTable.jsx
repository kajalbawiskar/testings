import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormControl,
  InputLabel,
} from "@mui/material";
import { FaColumns } from "react-icons/fa";
import ModifyColumns from "../Tools/ModifyColumns";

const CustomTable = ({ startDate, endDate }) => {
  const [data, setData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupNames, setGroupNames] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [columns, setColumns] = useState([
    {
      id: "0",
      title: "Group Name",
      key: "groupName",
      visible: "true",
      category: "recommended",
    },
    {
      id: "1",
      title: "Clicks",
      key: "clicks",
      visible: "true",
      category: "performance",
    },
    {
      id: "2",
      title: "Conv.",
      key: "conversions",
      visible: "true",
      category: "performance",
    },
    {
      id: "3",
      title: "CTR",
      key: "ctr",
      visible: "true",
      category: "performance",
    },
    {
      id: "4",
      title: "Cost",
      key: "cost",
      visible: "true",
      category: "recommended",
    },
    {
      id: "5",
      title: "Impr",
      key: "impressions",
      visible: "true",
      category: "performance",
    },
    {
      id: "6",
      title: "Avg.cost",
      key: "average_cost",
      visible: "true",
      category: "recommended",
    },
    {
      id: "7",
      title: "Avg.cpc",
      key: "average_cpc",
      visible: "true",
      category: "recommended",
    },
    {
      id: "8",
      title: "Invalid Clicks",
      key: "invalid_clicks",
      visible: "true",
      category: "performance",
    },
    {
      id: "9",
      title: "Impr.(Top) %",
      key: "top_impression_percentage",
      visible: "true",
      category: "performance",
    },
  ]);
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);

  useEffect(() => {
    fetchGroupNames();
  }, []);

  const fetchGroupNames = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id: localStorage.getItem("customer_id"),
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

  const extractTotalsWithGroupName = (data) => {
    const totalsList = [];
    if (!data || !data.metrics || !Array.isArray(data.metrics))
      return totalsList;

    for (const group of data.metrics) {
      const groupName = group.group_name;
      const metrics = group.metrics;
      if (Array.isArray(metrics)) {
        const lastMetric = metrics[metrics.length - 1];
        if (
          lastMetric &&
          typeof lastMetric === "object" &&
          "totals" in lastMetric
        ) {
          const totals = lastMetric.totals;
          totals.group_name = groupName;
          totalsList.push(totals);
        }
      }
    }
    return totalsList;
  };

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert("Please select a valid date range.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.confidanto.com/get-grouped-campaign-metrics",
        {
          group_names: selectedGroups,
          customer_id: localStorage.getItem("customer_id"),
          email: localStorage.getItem("email"),
          start_date: startDate,
          end_date: endDate,
        }
      );

      const groupsData = extractTotalsWithGroupName(response.data);
      setData(groupsData);
      calculateTotals(groupsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (campaignData) => {
    const totals = campaignData.reduce(
      (acc, campaign) => {
        acc.clicks += campaign.clicks || 0;
        acc.conversions += campaign.conversions || 0;
        acc.ctr += parseFloat(campaign.ctr) || 0;
        acc.cost += campaign.cost || 0;
        acc.impressions += campaign.impressions || 0;
        acc.average_cost += campaign.average_cost || 0;
        acc.average_cpc += campaign.average_cpc || 0;
        acc.invalid_clicks += campaign.invalid_clicks || 0;
        acc.top_impression_percentage +=
          parseFloat(campaign.top_impression_percentage) || 0;
        return acc;
      },
      {
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cost: 0,
        impressions: 0,
        average_cost: 0,
        average_cpc: 0,
        invalid_clicks: 0,
        top_impression_percentage: 0,
      }
    );

    const length = campaignData.length || 1;
    totals.ctr /= length;
    totals.top_impression_percentage /= length;
    setTotals(totals);
  };

  const handleGroupChange = (event) => {
    setSelectedGroups(event.target.value);
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <div className="">
        <h3 className="text-gray-800 font-semibold mb-4">Select Groups</h3>
        <FormControl className="w-full">
          <InputLabel>Groups</InputLabel>
          <Select
            multiple
            value={selectedGroups}
            onChange={handleGroupChange}
            renderValue={(selected) => selected.join(", ")}
            className="border border-gray-300 rounded-md mt-2 bg-white"
          >
            {groupNames.map((group) => (
              <MenuItem key={group.id} value={group.name}>
                <Checkbox checked={selectedGroups.includes(group.name)} />
                <ListItemText primary={group.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedGroups.length > 0 && (
          <button
            onClick={fetchData}
            className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded shadow-md"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create"}
          </button>
        )}
      </div>

      {data.length > 0 && (
        <div className="mt-6 ">
          <div className="flex justify-end mt-10">
            <button
              className="bg-transparent text-gray-600 px-4 py-2 rounded hover:bg-slate-100"
              onClick={() => setShowColumnsMenu(!showColumnsMenu)}
            >
              <FaColumns className="ml-5" /> Columns
            </button>

            {showColumnsMenu && (
              <div className="absolute z-10">
                <ModifyColumns
                  columns={columns}
                  setColumns={setColumns}
                  setShowColumnsMenu={setShowColumnsMenu}
                />
              </div>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="inline-block  align-middle">
              <table className=" table-fixed max-w-9xl divide-y divide-gray-200 bg-white border rounded shadow-md">
                <thead className="bg-gray-100">
                  <tr>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className="px-4 py-3 text-left text-sm font-medium text-gray-700 border"
                      >
                        {col.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                  {selectedGroups.map((groupName, index) => {
                    const campaign =
                      data.find((c) => c.group_name === groupName) || {};
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{groupName}</td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.clicks || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.conversions || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.ctr || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          ₹{campaign.cost || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.impressions || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          ₹{campaign.average_cost || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          ₹{campaign.average_cpc || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.invalid_clicks || 0}
                        </td>
                        <td className="px-4 py-2 border text-right">
                          {campaign.top_impression_percentage || 0}%
                        </td>
                      </tr>
                    );
                  })}
                  {totals && (
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-4 py-2 border">Total</td>
                      <td className="px-4 py-2 border text-right">
                        {totals.clicks}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {totals.conversions}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {totals.ctr.toFixed(2)}%
                      </td>
                      <td className="px-4 py-2 border text-right">
                        ₹{totals.cost}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {totals.impressions}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        ₹{totals.average_cost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        ₹{totals.average_cpc.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {totals.invalid_clicks}
                      </td>
                      <td className="px-4 py-2 border text-right">
                        {totals.top_impression_percentage.toFixed(2)}%
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;
