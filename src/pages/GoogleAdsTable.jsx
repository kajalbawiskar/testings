import React, { useState } from "react";
import BudgetModal from "./BudgetModal";
import { GoPencil } from "react-icons/go";
import LoadingAnimation from "../components/LoadingAnimation";

function GoogleAdsTable({ projectData, columns , error, clientType, tableData, currency, onSaveBudget }) {
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

      {error?<>
            <h1 className="p-4 text-xl text-center text-[#4142dc]">No budget allocation found</h1>      
      </>:
        <>
          {projectData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-[#4142dc] text-white">
                    {/* <th className="py-3 px-6 text-left text-sm font-medium uppercase tracking-wider">
                      Project
                    </th> */}
                    {columns.filter(col=>col.visible).map(col=>{
                      return (<th
                      key={col.key} 
                      className="py-3 px-6 text-left text-sm font-medium  tracking-wider">
                      {col.title}
                    </th>)
                    })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {projectData.filter(item=> item.client_type == clientType || clientType == "All").map((item, index) => (
                      <tr
                        key={index}
                      >
                        {columns
                          .filter((col) => col.visible)
                          .map((col) => (
                            <td
                              key={col.key}
                              className="py-3 px-6 text-sm font-medium text-gray-900 whitespace-nowrap"
                            >
                              {col.key !== "status" &&
                                (Array.isArray(item[col.key])
                                  ? item[col.key].join(", ")
                                  : item[col.key])}
                              {/* Render the status cell */}
                            </td>
                          ))}
                      </tr>
                    ))}
                </tbody>

                <tfoot className=" font-semibold text-gray-700 border-t">
                    <tr>
                      {columns
                          .filter((col) => col.visible)
                          .map((col) =>  (
                        <td
                          key={col.key}
                          className="py-3 px-6 text-left text-sm font-medium  tracking-wider "
                        >
                          <strong>
                            {typeof projectData[0]?.[col.key] === "number"&&
                                col.key !== "id"
                              ? col.key === "cost" ||
                                col.key === "average_cpc" ||
                                col.key === "cost_per_conversion"
                                ? `₹${projectData.reduce(
                                    (acc, item) => acc + (item[col.key] || 0),
                                    0
                                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                : projectData.reduce(
                                    (acc, item) => acc + (item[col.key] || 0),
                                    0
                                  ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                              : ""}
                          </strong>
                        </td>
                      ))}
                    </tr>
                  </tfoot>

              </table>
            </div>
          ) : (
            <>
            {/* <h1 className="p-4 text-xl text-center text-[#4142dc]">No budget allocation found</h1> */}
            <LoadingAnimation/>

            </>
          )}
        </>
      }
      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBudget}
        currency={currency}
        initialBudget={userBudget[editableRowIndex] || tableData[editableRowIndex]?.budget}
        projectName={tableData[editableRowIndex]?.project}
        platform="Google Ads"
      />
    </div>
  );
}

export default GoogleAdsTable;
