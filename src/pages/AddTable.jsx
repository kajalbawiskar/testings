import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import AudienceDataComponent from "./AddTable/Audiences";
import GenderInfo from "./AddTable/Genderinfo";
import BidStrategyType from "./AddTable/BidStrategyType";
import CustomTable from "./AddTable/CustomTable";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";

const tableConfig = {
  audiences: {
    title: "Audience Data",
    component: AudienceDataComponent,
  },
  genderInfo: {
    title: "Gender Info",
    component: GenderInfo,
  },
  bidStrategy: {
    title: "Bid Strategy Type",
    component: BidStrategyType,
  },
  group: {
    title: "Group Metrics",
    component: CustomTable,
  },
};

const AddTable = ({ startDate, endDate, userId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [createdTables, setCreatedTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch saved tables from backend
  useEffect(() => {
    const fetchTables = async () => {
      if (!userId) {
        setCreatedTables([]); // Clear tables on logout
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/user-tables?userId=${userId}`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setCreatedTables(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error loading saved tables:", err);
        setError("Failed to load saved tables.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, [userId]);

  // Save tables to backend
  const saveTables = async (tables) => {
    if (!userId) return;
    try {
      await fetch("/api/user-tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, tables }),
      });
    } catch (err) {
      console.error("Failed to save tables:", err);
    }
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleOptionClick = (option) => {
    if (!createdTables.includes(option)) {
      setSelectedOption(option);
    }
    setShowDropdown(false);
  };

  const handleCreateClick = () => {
    if (selectedOption && !createdTables.includes(selectedOption)) {
      const updated = [...createdTables, selectedOption];
      setCreatedTables(updated);
      saveTables(updated);
      setSelectedOption("");
    }
  };

  const handleCloseTable = (table) => {
    const updated = createdTables.filter((t) => t !== table);
    setCreatedTables(updated);
    saveTables(updated);
  };

  return (
    <div className="text-left mt-4 flex flex-col items-start w-full">
      <button
        onClick={toggleDropdown}
        className="w-40 text-white py-2 font-bold rounded shadow-md"
        style={{ backgroundColor: "#283593" }}
      >
        Add Table
      </button>

      {showDropdown && (
        <FormControl sx={{ mt: 2, minWidth: 250 }}>
          <InputLabel id="add-table-select-label">Table Type</InputLabel>
          <Select
            labelId="add-table-select-label"
            value={selectedOption}
            label="Add Table"
            onChange={(e) => handleOptionClick(e.target.value)}
          >
            {Object.keys(tableConfig).map((key) => (
              <MenuItem
                key={key}
                value={key}
                disabled={createdTables.includes(key)}
              >
                {tableConfig[key].title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedOption && (
        <div className="mt-4">
          <button
            onClick={handleCreateClick}
            className="text-white py-2 px-6 rounded-lg font-semibold"
            style={{ backgroundColor: "#283593" }}
          >
            Create
          </button>
        </div>
      )}

      {loading ? (
        <div className="mt-6 flex items-center gap-2">
          <CircularProgress size={20} />
          <span>Loading saved tables...</span>
        </div>
      ) : error ? (
        <p className="text-red-500 mt-4">{error}</p>
      ) : (
        createdTables.map((tableKey) => {
          const TableComponent = tableConfig[tableKey].component;
          return (
            <div key={tableKey} className="mt-8 w-full max-w-9xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-blue-600">
                  {tableConfig[tableKey].title}
                </h2>
                <button
                  className="p-2 text-lg bg-red-600 text-white rounded-sm"
                  onClick={() => handleCloseTable(tableKey)}
                  aria-label={`Close ${tableConfig[tableKey].title}`}
                >
                  <IoMdClose />
                </button>
              </div>
              <TableComponent startDate={startDate} endDate={endDate} />
            </div>
          );
        })
      )}
    </div>
  );
};

export default AddTable;
