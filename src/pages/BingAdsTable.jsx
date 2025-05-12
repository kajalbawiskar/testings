import React, { useState } from "react";
import BudgetModal from "./BudgetModal";
import { GoPencil } from "react-icons/go";

function BingAdsTable({ tableData, currency, onSaveBudget }) {
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userBudget, setUserBudget] = useState({});

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveBudget = (newBudget) => {
    setUserBudget((prevBudget) => ({
      ...prevBudget,
      [editableRowIndex]: newBudget,
    }));
    onSaveBudget(editableRowIndex, newBudget);
    setIsModalOpen(false);
  };

  return (
    <div>
      {tableData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border-collapse border border-gray-200">
            <thead>
            <tr className="bg-[#4142dc] text-white">
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Project
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Spend
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Budget
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Daily Spend Rate
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Impressions
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  Clicks
                </th>
                <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                  CPC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((row, index) => (
                <tr key={index}>
                  <td className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap">
                    {row.project}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {currency}
                    {row.spend}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap flex items-center">
                    <div className="flex justify-center w-full">
                      <p>
                        {currency}
                        {row.budget}
                      </p>
                      <button
                        className="mx-4 text-blue-500 hover:text-blue-700"
                        onClick={() => {
                          setEditableRowIndex(index);
                          handleOpenModal();
                        }}
                      >
                        <GoPencil />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {row.daily_spend_rate}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {row.impressions}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {row.clicks}
                  </td>
                  <td className="py-3 px-6 text-sm text-gray-500 whitespace-nowrap">
                    {currency}
                    {row.cpc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h1 className="p-4 text-xl text-center text-[#4142dc]">No budget allocation found</h1>
      )}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBudget}
        currency={currency}
        initialBudget={userBudget[editableRowIndex] || tableData[editableRowIndex]?.budget}
        projectName={tableData[editableRowIndex]?.project}
        platform="Bing Ads"
      />
    </div>
  );
}

export default BingAdsTable;
