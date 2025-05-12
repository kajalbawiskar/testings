/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaSearch, FaColumns } from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";

const Changehistory = () => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [columns, setColumns] = useState([
      { title: "User Date time", key: "datetime", visible: true, section: "changeHistory" },
      { title: "Budget", key: "budget", visible: true },
      { title: "Tool", key: "Tool", visible: true },
      { title: "Status", key: "status", visible: true, locked: true },
      { title: "Campaign", key: "campaign", visible: true, locked: true },
    { title: "Status changes", key: "statusChanges", visible: true, section: "changeHistory" },
    { title: "Budget changes Date", key: "budgetChanges", visible: true, section: "changeHistory" },
    { title: "Bid changes", key: "bidChanges", visible: true, section: "changeHistory" },
    { title: "Ad changes", key: "adChanges", visible: true, section: "changeHistory" },
    { title: "Ad group", key: "adgroup", visible: true, section: "changeHistory" },
  ]);
  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://api.confidanto.com/change-history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: localStorage.getItem("customer_id"),
        start_date: "2024-05-20",
        end_date: "2024-06-05",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data); // Log fetched data
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);


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

  return (
    <div>
      <div className="flex h-screen bg-gray-100">
        <main className="flex-grow p-6 overflow-y-visible">
          <div className="flex justify-between items-center mb-4">
            <div className="text-2xl font-bold text-gray-700">Change history</div>
            <div className="flex space-x-2">
              <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center hover:bg-blue-600">
                <FaFilter className="mr-2" /> Add filter
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded flex items-center hover:bg-gray-600">
                <FaSearch className="mr-2" /> Search
              </button>
              <div className="relative">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded flex items-center hover:bg-gray-600"
                  onClick={openColumnsMenu}
                >
                  <FaColumns className="mr-2" /> Columns
                </button>
                {showColumnsMenu && (
                  <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 overflow-visible w-full max-w-3xl border border-gray-200">
                    <div className="font-bold text-lg text-gray-700">Modify columns for campaigns</div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={applyChanges}>
                        Apply
                      </button>
                      <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={cancelChanges}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {tableVisible && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md">
                <thead>
                  <tr className="bg-gray-200 uppercase text-sm leading-normal">
                    {columns.filter(col => col.visible).map(col => (
                      <th key={col.key} className="py-3 px-6 text-left">{col.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                        {columns.filter(col => col.visible).map(col => (
                          <td key={col.key} className="py-3 px-6 text-left">
                            {col.key === "allChanges" ? item.change_date_time : null}
                            {col.key === "budget" ? item.new_resource.campaignBudget?.amountMicros : null}
                            {col.key === "Tool" ? item.new_resource.campaignBudget?.amountMicros : null}
                            {col.key === "status" ? item.new_resource.campaign?.status : null}
                            {col.key === "campaign" ? item.campaign : null}
                            {col.key === "datetime" ? item.changed_fields.includes("status") ? item.change_date_time : null : null}
                            {col.key === "budgetChanges" ? item.changed_fields.includes("amount_micros") ? item.change_date_time : null : null}
                            {col.key === "adChanges" ? item.changed_fields.includes("ad") ? item.change_date_time : null : null}
                            {col.key === "adgroup" ? item.changed_fields.includes("adgroup") ? item.change_date_time : null : null}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr className="border-b border-gray-200 hover:bg-gray-100">
                      <td
                        colSpan={columns.filter((col) => col.visible).length}
                        className="py-3 px-6 text-center"
                      >
                        <div className="flex justify-center items-center h-40 mt-3">
                          <LoadingAnimation />
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Changehistory;
