import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Typography,
  Button,
  Box,
} from "@mui/material";

export default function SettingsPage() {
  const { id: projectId } = useParams();
  const [projectName, setProjectName] = useState("My Project");
  const [category, setCategory] = useState("Apparels");
  const [website, setWebsite] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [clientType, setClientType] = useState("Lead Generation");

  const currencies = [
    "USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD", "INR"
  ];

  const clientTypes = ["Lead Generation", "Revenue Based"];

  return (
    <Box className="max-w-3xl mx-auto px-6 py-10 mt-12 bg-white rounded-3xl shadow-xl border border-gray-100">
      <Typography
        variant="h4"
        className="font-bold text-gray-800 mb-6 text-center"
      >
        Project Settings
      </Typography>

      <div className="space-y-6">
        {/* Project Name */}
        <TextField
          fullWidth
          label="Project Name"
          variant="outlined"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="bg-gray-50 rounded-xl"
        />

        {/* Category Dropdown */}
        <TextField
          select
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-gray-50 rounded-xl"
        >
          {["Apparels", "Beauty and Personal Care", "Travel and Tourism"].map(
            (option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            )
          )}
        </TextField>

        {/* Website/Domain Name */}
        <TextField
          fullWidth
          label="Website / Domain Name"
          variant="outlined"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://yourdomain.com"
          className="bg-gray-50 rounded-xl"
        />

        {/* Currency Dropdown */}
        <TextField
          select
          fullWidth
          label="Currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="bg-gray-50 rounded-xl"
        >
          {currencies.map((curr) => (
            <MenuItem key={curr} value={curr}>
              {curr}
            </MenuItem>
          ))}
        </TextField>

        {/* Client Type Dropdown */}
        <TextField
          select
          fullWidth
          label="Client Type"
          value={clientType}
          onChange={(e) => setClientType(e.target.value)}
          className="bg-gray-50 rounded-xl"
        >
          {clientTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        {/* Save Button */}
        <div className="pt-4">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className="rounded-xl py-3 text-lg bg-blue-600 hover:bg-blue-700 transition duration-200"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Box>
  );
}
