/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineSegment } from "react-icons/md";
import ModifyColumns from "./Tools/ModifyColumns";
import { FaColumns } from "react-icons/fa";
import {
  IoIosArrowRoundDown,
  IoIosArrowRoundUp,
  IoMdClose,
} from "react-icons/io";
import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import { DailyCategoryColumns } from "./Components/Reporting/DailyColumns";

function CategoryReporting(props) {
  const [columns, setColumns] = useState(DailyCategoryColumns);
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState({});
  const [totalShow, setTotalShow] = useState(true);
  const [email, setEmail] = useState(localStorage.getItem("email")); // "santoshsakre21@gmail.com" localStorage.getItem("email")
  const [customer_id, setCustomerId] = useState(
	localStorage.getItem("customer_id")
  );

  const formatPercent = (value) => {
	return (
	  <span className="flex justify-center items-center ">
		{value > 0 ? (
		  <IoIosArrowRoundUp className="text-green-500 text-lg" />
		) : value < 0 ? (
		  <IoIosArrowRoundDown className="text-red-500 text-lg" />
		) : (
		  ""
		)}
		{`${value > 0 ? "+" + value : value}%`}
	  </span>
	);
  };

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [tableVisible, setTableVisible] = useState(false);

  // groups modal
  const [open, setOpen] = useState(false);

  // 2. Functions to handle opening and closing
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // groups
  const segmentButtonRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState([]); // groups would load in useeffect call
  const toggleSelectedCategory = (e) => {
	setSelectedCategory(e.target.value);
  };

  const filterByCategory = (item) => {
	if (selectedCategory.indexOf(item.group_id) > -1) {
	  return true;
	} else {
	  return false;
	}

	return false; //by default element is not visible
  };

  function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  let compareColumns = [
	"percentage_difference_clicks",
	"percentage_difference_impressions",
	"percentage_difference_cost",
	"percentage_difference_ctr",
	"percentage_difference_average_cpc",
	"percentage_difference_conversions",
	"percentage_difference_conversion_rate",
	"percentage_difference_cost_per_conversion",
	"percentage_difference_interactions",
	"percentage_difference_interaction_rate",
  ];
  let numberColumns = [
	"current_impressions",
	"previous_impressions",
	"current_cost", //commons
	"previous_cost", //commons
	"current_conversions",
	"previous_conversions",
	"current_interactions",
	"previous_interactions",
  ];
  let [currencySymbol, setCurrencySymbol] = useState("₹");
  let currencyColumns = [
	"current_cost", //commons
	"previous_cost", //commons
	"current_average_cpc",
	"previous_average_cpc",
	"current_cost_per_conversion",
	"previous_cost_per_conversion",
  ];

  useEffect(async () => {
	let fetchGroups = () => {
	  axios
		.post("https://api.confidanto.com/campaign-group/fetch-groups", {
		  email: email,
		  customer_id: customer_id,
		})
		.then((res) => {
		  let groupIds = res.data.groups.map((item) => item.group_id);
		  setSelectedCategory(groupIds);
		  setGroups(res.data.groups);
		  console.info("GROUPS: ", res.data.groups);
		})
		.catch((err) => {
		  console.error("Error Fetching Groups", err);
		});
	};
	let fetchGroupedMetrics = () => {
	  axios
		.post(
		  "https://api.confidanto.com/campaign-group/campaign-curr-prev-group-metrcis",
		  {
			customer_id: customer_id,
			email: email,
			start_date: props.previousDates.curr_start_date,
			end_date: props.previousDates.curr_end_date,
			previous_start_date: props.previousDates.prev_start_date,
			previous_end_date: props.previousDates.prev_end_date,
		  }
		)
		.then((res) => {
		  function flattenCampaignGroupData(groupData) {
			// Basic validation: Ensure input is a non-null object
			if (
			  !groupData ||
			  typeof groupData !== "object" ||
			  Array.isArray(groupData)
			) {
			  console.warn("Invalid input: Expected a non-array object.");
			  return {};
			}

			const flattenedData = {};

			// Define which keys contain objects to flatten and their desired prefixes
			const keysToFlatten = {
			  current_totals: "current",
			  previous_totals: "previous",
			  percentage_difference: "percentage_difference",
			};

			// Iterate over all keys in the input object
			for (const key in groupData) {
			  // Ensure we are iterating over own properties (good practice)
			  if (Object.hasOwnProperty.call(groupData, key)) {
				const value = groupData[key];

				// Check if the current key is one we need to flatten AND its value is an object
				if (
				  keysToFlatten.hasOwnProperty(key) &&
				  typeof value === "object" &&
				  value !== null &&
				  !Array.isArray(value)
				) {
				  const prefix = keysToFlatten[key]; // Get the prefix (e.g., "current")

				  // Iterate over the keys within the nested object (e.g., "average_cpc", "clicks")
				  for (const subKey in value) {
					if (Object.hasOwnProperty.call(value, subKey)) {
					  const newKey = `${prefix}_${subKey}`; // Create the new flattened key (e.g., "current_average_cpc")
					  flattenedData[newKey] = value[subKey]; // Assign the value to the new key in the result
					}
				  }
				} else {
				  // If the key is not one to flatten, copy it directly to the result
				  flattenedData[key] = value;
				}
			  }
			}

			return flattenedData;
		  }
		  let result = res.data.map((item) => flattenCampaignGroupData(item));
		  setData(result);
		  console.info("Grouped Metrics: ", result);
		})
		.catch((err) => {
		  console.error("Group Metrics Error: ", err);
		});
	};

	await fetchGroups();

	// await fetchCategoryInsights();

	await fetchGroupedMetrics();
  }, []);

	const [insight, setInsight] = useState("")
  useEffect(async () => {
	let fetchCategoryInsights = () => {
	  let requestBody = {
		customer_id: localStorage.getItem("customer_id"),
		email: localStorage.getItem("email"),
		group_ids: selectedCategory,
		start_date: props.previousDates.curr_start_date,
		end_date: props.previousDates.curr_end_date,
		previous_start_date: props.previousDates.prev_start_date,
		previous_end_date: props.previousDates.prev_end_date,
	  };
	  axios
		.post(props.categoryInsightUrl, requestBody)
		.then((res) => {
					setInsight(res.data.insights)
		})
		.catch((err) => {
		  console.error("Error Fetching Category Insight: ", err);
		});
	};
	await fetchCategoryInsights();
  }, [selectedCategory]);

  return (
	<div>
	  <div className="flex justify-between font-roboto font-medium">
		<h1 className="text-2xl font-semibold py-4">Category wise</h1>
		<div className="flex flex-row relative">
		  <button
			className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
			onClick={() => {
			  setShowColumnsMenu(!showColumnsMenu);
			}}
		  >
			<FaColumns className="ml-5" /> Columns
		  </button>
		  <div className=" absolute ">
			{showColumnsMenu && (
			  <ModifyColumns
				columns={columns}
				setColumns={setColumns}
				setTableVisible={setTableVisible}
				setShowColumnsMenu={setShowColumnsMenu}
				setTotal={setTotal}
				setTotalShow={setTotalShow}
			  />
			)}
		  </div>

		  <div className="relative">
			<button
			  ref={segmentButtonRef}
			  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
			  onClick={handleOpen}
			>
			  <MdOutlineSegment className="mr-2 font-bold" /> Segment
			</button>

			<Modal
			  open={open}
			  onClose={handleClose}
			  aria-labelledby="segment-modal-title"
			  aria-describedby="segment-modal-description"
			>
			  <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[450px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl rounded-lg p-6 outline-none">
				<Typography
				  id="segment-modal-title"
				  variant="h6"
				  component="h2"
				  className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100"
				>
				  Select Groups
				</Typography>

				<FormControl className="w-full mb-6">
				  <InputLabel id="group-select-label">Select Group</InputLabel>
				  <Select
					labelId="group-select-label"
					multiple
					value={selectedCategory}
					onChange={toggleSelectedCategory}
					label="Select Group"
					renderValue={(selected) =>
					  selected
						.map((id) => {
						  const group = groups.find(
							(g) => String(g.group_id) === String(id)
						  );
						  return group ? group.group_name : "";
						})
						.join(", ")
					}
					MenuProps={{
					  PaperProps: {
						style: {
						  maxHeight: 224,
						},
					  },
					}}
				  >
					{groups.map((group) => (
					  <MenuItem key={group.group_id} value={group.group_id}>
						<Checkbox
						  checked={
							selectedCategory.indexOf(group.group_id) > -1
						  }
						  size="small"
						/>
						<ListItemText primary={group.group_name} />
					  </MenuItem>
					))}
				  </Select>
				</FormControl>

				<div className="flex justify-end mt-6">
				  <button
					className="bg-[#2930a8] text-white px-5 py-2 rounded hover:shadow-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center"
					onClick={handleClose}
				  >
					Apply
				  </button>

				  <button
					className="ml-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 px-5 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
					onClick={handleClose}
				  >
					Cancel
				  </button>
				</div>
			  </Box>
			</Modal>
		  </div>
		</div>
	  </div>
	  <div className="overflow-x-auto mb-12">
		{/* <LinearProgress className='w-full bg-black text-red-300' /> */}
		<table className="w-full">
		  <thead>
			<tr className="bg-[#2930a8] text-white">
			  {columns
				.filter((col) => col.visible)
				.map((col, index) => {
				  const widthClass = "";
				  const textAlign =
					col.key == "group_name" ? "text-left" : "text-center";
				  return (
					<th
					  className={`p-2 border-b ${textAlign} whitespace-nowrap  ${widthClass}`}
					  key={col.key}
					>
					  {col.title}
					</th>
				  );
				})}
			</tr>
		  </thead>
		  {data.length > 0 ? (
			<tbody>
			  {data
				.filter((item) => filterByCategory(item))
				.map((item, index) => (
				  <tr key={index} className="border-t">
					{columns
					  .filter((col) => col.visible)
					  .map((col, indexCols) => {
						const textAlign =
						  col.key == "group_name" ? "text-left" : "text-center";
						let tempval = item[col.key];

						if (typeof item[col.key] == "number") {
						  tempval = item[col.key];

						  if (numberColumns.indexOf(col.key) != -1) {
							if (tempval > 1000000) {
							  tempval = tempval / 1000000;
							}
							tempval = numberWithCommas(tempval);
						  }

						  if (currencyColumns.indexOf(col.key) != -1) {
							tempval = currencySymbol + String(tempval);
						  }

						  if (compareColumns.indexOf(col.key) != -1) {
							tempval = formatPercent(tempval);
						  }
						}

						return (
						  <td
							className={`p-2 border-b ${textAlign}`}
							key={col.key}
						  >
							{tempval}
						  </td>
						);
					  })}
				  </tr>
				))}
			</tbody>
		  ) : (
			<tbody>
			  <tr>
				<td colSpan={columns.length} className="p-0 border-b">
				  <LinearProgress className="w-full" />
				</td>
			  </tr>
			</tbody>
		  )}

		  {data.length > 0 && totalShow && (
			<tfoot>
			  <tr className="font-bold text-gray-700 bg-gray-100 w-full">
				{() => {
				  Object.keys(total).forEach((key) => delete total[key]);
				}}
				{() => {
				  setTotal({});
				}}
				{() => {
				  Object.keys(total).forEach((key) => delete total[key]);
				}}
				{() => {
				  setTotal({});
				}}

				{columns
				  .filter((col) => col.visible)
				  .map((col) => {
					total[col.key] = 0;
				  })}
				{data
				  .filter((item) => filterByCategory(item))
				  .map((d) => {
					Object.keys(d).forEach((val) => {
					  Object.keys(total).forEach((totalVal) => {
						if (totalVal == val) {
						  total[val] = total[val] + d[val];
						}
					  });
					});
				  })}

				{Object.entries(total).map((t, k) => {
				  //console.log("type",typeof(t[1]))
				  let tempval = "";

				  if (t[0] == "group_name") {
					return <td className="p-2 text-left">Total</td>;
				  }
				  if (typeof t[1] == "number") {
					tempval = t[1];

					if (numberColumns.indexOf(t[0]) != -1) {
					  if (tempval > 1000000) {
						tempval = tempval / 1000000;
					  }
					  tempval = numberWithCommas(tempval);
					}

					if (currencyColumns.indexOf(t[0]) != -1) {
					  tempval = currencySymbol + String(tempval);
					}

					if (compareColumns.indexOf(t[0]) != -1) {
					  tempval = formatPercent(t[1]);
					}
				  }
				  return <td className="p-2 text-center">{tempval}</td>;
				})}
			  </tr>
			</tfoot>
		  )}
		</table>
		{insight != "" && (
		  <div className="bg-gray-100 my-4 rounded-lg shadow-md p-6">
			<p className="text-lg">{insight}</p>
		  </div>
		)}
	  </div>
	</div>
  );
}

export default CategoryReporting;
