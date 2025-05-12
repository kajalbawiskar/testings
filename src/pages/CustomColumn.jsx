import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Menu,
  MenuItem,
  Typography,
  Grid,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateCustomColumn = () => {
  const [anchorEl, setAnchorEl] = useState(null); // For main dropdown
  const [subAnchorEl, setSubAnchorEl] = useState(null); // For sub-options dropdown
  const [selectedCategory, setSelectedCategory] = useState(null); // Selected main category
  const [manualFormula, setManualFormula] = useState(""); // Formula input
  const [columnName, setColumnName] = useState("");
  const [description, setDescription] = useState("");
  const [dataFormat, setDataFormat] = useState("Number (123)"); // Default selected option

  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Column categories with options
  const columnCategories = {
    Performance: [
      { name: "Clicks", key: "clicks" },
      { name: "Impr.", key: "impressions" },
      { name: "Agv. cpc", key: "average_cpc" },
    ],
    Conversions: [
      { name: "Conversions", key: "conversions" },
      { name: "Cost / conv", key: "cost_per_conv" },
    ],
  };

  // Open main dropdown
  const handleColumnClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close all menus
  const handleClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
    setSelectedCategory(null);
  };

  // Handle main category selection
  const handleCategorySelect = (event, category) => {
    setSelectedCategory(category);
    setSubAnchorEl(event.currentTarget); // Open the sub-options dropdown
  };

  // Add selected option to formula
  const handleOptionSelect = (columnKey) => {
    setManualFormula((prev) => prev + columnKey);
    setSubAnchorEl(null);
    setSelectedCategory(null);
    handleClose();
  };

  // Validation logic
  const isFormulaValid = () => {
    // Check if the formula contains at least one valid column key
    const validKeys = Object.values(columnCategories).flat().map((item) => item.key);
    return validKeys.some((key) => manualFormula.includes(key));
  };

  const isSaveDisabled = () => {
    // Check if column name and formula are valid
    return !(columnName.trim() && isFormulaValid());
  };

  const handleSave = async () => {
    const requestBody = {
      formula: manualFormula,
      customColumn: columnName,
      // email: "exampleuser@gmail.com",
      email: localStorage.getItem("email"),
    };

    try {
      const response = await fetch("https://api.confidanto.com/custom_columns/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        console.log("Column Saved Successfully");
        navigate("/google-ads/campaigns");
      } else {
        console.error("Failed to save column");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/google-ads/campaigns");
  };
  return (
    <Box className="p-8 bg-white shadow-md rounded-lg h-5/6 w-full max-w-6xl mx-auto">
      <div className="h-full w-full">
        <Typography variant="h6" className="mb-6 text-gray-700">
          Create a Custom Column
        </Typography>

        <div className="mb-6 flex w-full gap-8">
          <Grid item xs={9} sm={6}>
            <TextField
              fullWidth
              required
              label="Name"
              placeholder="Enter a name"
              variant="outlined"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              inputProps={{ maxLength: 40 }}
              className="bg-white rounded-lg max-w-md"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Description"
              placeholder="Enter a description (optional)"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{ maxLength: 180 }}
              className="bg-white rounded-lg w-60"
            />
          </Grid>

          <Grid item xs={9} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Data Format</InputLabel>
              <Select
                value={dataFormat}
                onChange={(e) => setDataFormat(e.target.value)}
                label="Data Format"
                className="bg-white rounded-lg"
              >
                <MenuItem value="Number (123)">Number (123)</MenuItem>
                <MenuItem value="Percent (%)">Percent (%)</MenuItem>
                <MenuItem value="Money (₹)">Money (₹)</MenuItem>
                <MenuItem value="Text (abc)">Text (abc)</MenuItem>
                <MenuItem value="True/False">True/False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </div>

        <div className="flex items-center gap-4 border-y-1 py-2 my-2">
          {/* Main dropdown */}
          <Button
            variant="outlined"
            className="text-blue-600 font-semibold"
            onClick={handleColumnClick}
          >
            + Column
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            {Object.keys(columnCategories).map((category) => (
              <MenuItem
                key={category}
                onClick={(event) => handleCategorySelect(event, category)}
              >
                {category}
              </MenuItem>
            ))}
          </Menu>

          {/* Sub-options dropdown */}
          {selectedCategory && (
            <Menu
              anchorEl={subAnchorEl}
              open={Boolean(subAnchorEl)}
              onClose={() => setSubAnchorEl(null)}
            >
              <Typography
                variant="subtitle1"
                className="px-4 py-2 text-gray-600"
              >
                {selectedCategory} Options
              </Typography>
              {columnCategories[selectedCategory].map((option) => (
                <MenuItem
                  key={option.key}
                  onClick={() => handleOptionSelect(option.key)}
                >
                  {option.name}
                </MenuItem>
              ))}
            </Menu>
          )}

          {/* Formula operators */}
          {["+", "-", "*", "/", "%", "(", ")"].map((symbol) => (
            <Button
              key={symbol}
              onClick={() => setManualFormula((prev) => prev + symbol)}
              variant=""
              size="small"
              className="text-sm bg-gray-100 hover:bg-gray-200 rounded text-black"
            >
              {symbol}
            </Button>
          ))}
        </div>

        {/* Formula input field */}
        <div className="h-1/2 mb-4">
          <TextField
            label="Manual Formula"
            fullWidth
            variant="outlined"
            value={manualFormula}
            onChange={(e) => setManualFormula(e.target.value)}
            placeholder="e.g., impressions + clicks"
            className="mb-4 text-lg bg-white border border-gray-300 rounded-lg p-4"
            multiline
            rows={9}
          />
        </div>

        {/* Save and Cancel buttons */}
        <Box className="flex justify-end items-center gap-4">
          <Button
            variant="outlined"
            color="secondary"
            className="text-gray-600 hover:bg-gray-100"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSave}
            disabled={isSaveDisabled()} // Disable Save button based on validation
          >
            Save
          </Button>
        </Box>
      </div>
    </Box>
  );
};

export default CreateCustomColumn;
