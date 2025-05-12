import React, { useState, useEffect } from "react";

function BudgetModal({
  isOpen,
  onClose,
  onSave,
  currency,
  initialBudget,
  projectName,
  platform
}) {
  const [budget, setBudget] = useState("");

  // Update the budget state when the modal opens
  useEffect(() => {
    if (isOpen) {
      setBudget(initialBudget || "");
    }
  }, [isOpen, initialBudget]);

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      const response = await fetch(
        "https://api.confidanto.com/update-project-budget",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_name: projectName,
            project_budget: budget,
            platform: platform,
          }),
        }
      );

      if (response.ok) {
        // Call the onSave prop function to update the parent state if the API call is successful
        onSave(budget);
        onClose(); // Close the modal
      } else {
        console.error("Failed to update the budget.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Budget</h2>
        <div className="mb-4">
          <div className="flex mt-1">
            <span className="inline-flex items-center py-2 px-3 text-gray-900 border border-r-0 border-gray-400">
              {currency}
            </span>
            <input
              type="text"
              className="focus:outline-none p-2 border border-gray-400 flex-1 block w-full sm:text-sm "
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="Enter budget"
            />
          </div>
        </div>
        <p className="text-gray-600 mb-4 mt-6 mr-2 text-sm">
          You are entering the budget approved by the client on monthly basis.
          This will help us to calculate the Month-to-Date Spend rate. You can
          always edit it
        </p>
        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 text-blue-500 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 text-blue-500 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default BudgetModal;
