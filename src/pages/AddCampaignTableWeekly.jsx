import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Button, Select, MenuItem, Checkbox, Dialog, DialogTitle, DialogContent, 
  DialogActions, FormControl, InputLabel, ListItemText, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Paper 
} from '@mui/material';

function AddCampaignTable2() {
  const [GroupNames, setGroupNames] = useState([]);
  const [campaignData, setCampaignData] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [selectOptionInput, setSelectOptionInput] = useState("groups");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch Group Names from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsRes = await axios.post(
          "https://api.confidanto.com/campaign-group/fetch-groups",
          { email: localStorage.getItem("email"), customer_id: localStorage.getItem("customer_id"),}
        );
        setGroupNames(groupsRes.data.groups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch Initial Campaign Data
  useEffect(() => {
    axios.post(
      "https://api.confidanto.com/weekly-reporting-google-ads/compare-campaigns-data",
      { customer_id: localStorage.getItem("customer_id") }
    ).then((res) => {
      console.log("Campaign Data: ", res.data);
      setCampaignData(res.data);
    }).catch(e => console.log(e));
  }, []);

  const openFormButton = () => {
    setFormVisible(!formVisible);
  };

  const handleCategoryChange = (event) => {
    const selectedValues = event.target.value;
    setSelectedCategories(selectedValues);
    setSelectedGroups(selectedValues); // Ensure selectedGroups updates properly
  };

  // Fetch campaign data based on selected groups
  const addToTable = async () => {
    if (!selectedGroups.length) {
      console.error("No groups selected!");
      return;
    }
  
    const selectedGroupIds = GroupNames
      .filter(group => selectedGroups.includes(group.group_name))
      .map(group => group.group_id);
  
    console.log("Selected Group IDs:", selectedGroupIds);
  
    try {
      const response = await axios.post(
        "https://api.confidanto.com/weekly-reporting-google-ads/curr-week-prev-week-gropued-campaign-data",
        {
          customer_id: localStorage.getItem("customer_id"),
          email: localStorage.getItem("email"),
          group_ids: selectedGroupIds
        }
      );
  
      console.log("API Response:", response.data);
  
      if (response.data && Array.isArray(response.data.groups)) {
        setCampaignData(response.data.groups);
      } else {
        console.error("Unexpected API response format:", response.data);
        setCampaignData([]); // Clear table if response is unexpected
      }
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      setCampaignData([]); // Clear table in case of an error
    }
  
    setFormVisible(false);
  };
  useEffect(() => {
    if (selectedGroups.length > 0) {
      addToTable();
    }
  }, [selectedGroups]); 
  

  return (
    <>
      <button className="w-40 font-bold rounded shadow-md py-2" variant="contained" color="primary" style={{ backgroundColor: "#283593", color: "white" }} onClick={openFormButton}>
        {formVisible ? "Close Form" : "Add Table"}
      </button>

      {/* MUI Dialog for Form */}
      <Dialog open={formVisible} onClose={openFormButton}>
        <DialogTitle>Select Table Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel>Select Type</InputLabel>
            <Select value={selectOptionInput} onChange={(e) => setSelectOptionInput(e.target.value)}>
              <MenuItem value="groups">Groups</MenuItem>
              <MenuItem value="device">Device</MenuItem>
              <MenuItem value="audience">Audience</MenuItem>
            </Select>
          </FormControl>

          {/* Multi-Select Category Dropdown */}
          <FormControl fullWidth className="mt-4">
            <InputLabel>Select Categories</InputLabel>
            <Select
              multiple
              value={selectedCategories}
              onChange={handleCategoryChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {selectOptionInput === 'groups' &&
                GroupNames.map((group) => (
                  <MenuItem key={group.group_id} value={group.group_name}>
                    <Checkbox checked={selectedGroups.includes(group.group_name)} />
                    <ListItemText primary={group.group_name} />
                  </MenuItem>
                ))}
              
              {selectOptionInput === 'audience' && (
                <>
                  <MenuItem value="audience">
                    <Checkbox checked={selectedCategories.includes("audience")} />
                    <ListItemText primary="Age" />
                  </MenuItem>
                  <MenuItem value="gender">
                    <Checkbox checked={selectedCategories.includes("gender")} />
                    <ListItemText primary="Gender" />
                  </MenuItem>
                </>
              )}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={openFormButton} color="secondary">Cancel</Button>
          <Button onClick={addToTable} color="primary" variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Table Display */}
      <TableContainer component={Paper} className="mt-4 mb-4">
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "#283593", color: "white" }}>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Group Name</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Clicks (This Week)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Clicks (Last Week)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Impressions (This Week)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Impressions (Last Week)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Cost (This Week)</TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>Cost (Last Week)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campaignData.length > 0 ? (
              campaignData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.group_name}</TableCell>
                  <TableCell>{row.totalClicksThisWeek}</TableCell>
                  <TableCell>{row.totalClicksLastWeek}</TableCell>
                  <TableCell>{row.totalImpressionsThisWeek}</TableCell>
                  <TableCell>{row.totalImpressionsLastWeek}</TableCell>
                  <TableCell>{row.totalCostThisWeek}</TableCell>
                  <TableCell>{row.totalCostLastWeek}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} style={{ textAlign: "center" }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    
    </>
  );
}

export default AddCampaignTable2;
