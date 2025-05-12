export const DailyCategoryColumns = [
  // Group Name
  {
    "id": "15",
    "title": "Group Name",
    "key": "group_name",
    "visible": true, // 1st visible: true
    "category": "Attributes",
    "compare": false // Added compare key
  },
  // Clicks
  {
    "id": "4",
    "title": "Clicks",
    "key": "current_clicks",
    "visible": true, // 2nd visible: true
    "category": "Performance",
    "compare": false // Added compare key
  },
  {
    "id": "28",
    "title": "Clicks (Previous)",
    "key": "previous_clicks",
    "visible": false,
    "category": "Performance Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "18",
    "title": "Clicks % Δ",
    "key": "percentage_difference_clicks",
    "visible": true, // 3rd visible: true
    "category": "Performance Comparison",
    "compare": true // Kept compare key as true
  },
  // Impressions
  {
    "id": "11",
    "title": "Impressions",
    "key": "current_impressions",
    "visible": true, // 4th visible: true
    "category": "Performance",
    "compare": false // Added compare key
  },
  {
    "id": "35",
    "title": "Impressions (Previous)",
    "key": "previous_impressions",
    "visible": false,
    "category": "Performance Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "24",
    "title": "Impressions % Δ",
    "key": "percentage_difference_impressions",
    "visible": true, // 5th visible: true
    "category": "Performance Comparison",
    "compare": true // Kept compare key as true
  },
  // Cost
  {
    "id": "7",
    "title": "Cost",
    "key": "current_cost",
    "visible": true,
    "category": "Performance",
    "compare": false // Added compare key
  },
  {
    "id": "31",
    "title": "Cost (Previous)",
    "key": "previous_cost",
    "visible": false,
    "category": "Performance Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "21",
    "title": "Cost % Δ",
    "key": "percentage_difference_cost",
    "visible": true,
    "category": "Performance Comparison",
    "compare": true // Kept compare key as true
  },
  // CTR
  {
    "id": "9",
    "title": "CTR",
    "key": "current_ctr",
    "visible": true,
    "category": "Performance",
    "compare": false // Added compare key
  },
  {
    "id": "33",
    "title": "CTR (Previous)",
    "key": "previous_ctr",
    "visible": false,
    "category": "Performance Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "23",
    "title": "CTR % Δ",
    "key": "percentage_difference_ctr",
    "visible": true,
    "category": "Performance Comparison",
    "compare": true // Kept compare key as true
  },
  // Avg. CPC
  {
    "id": "3",
    "title": "Avg. CPC",
    "key": "current_average_cpc",
    "visible": false,
    "category": "Performance",
    "compare": false // Added compare key
  },
  {
    "id": "27",
    "title": "Avg. CPC (Previous)",
    "key": "previous_average_cpc",
    "visible": false,
    "category": "Performance Comparison",
    "compare": false // Kept compare key as false
  },
  {
    "id": "17",
    "title": "Avg. CPC % Δ",
    "key": "percentage_difference_average_cpc",
    "visible": false,
    "category": "Performance Comparison",
    "compare": true // Kept compare key as true
  },
  // Conversions
  {
    "id": "6",
    "title": "Conversions",
    "key": "current_conversions",
    "visible": false,
    "category": "Conversions",
    "compare": false // Added compare key
  },
  {
    "id": "30",
    "title": "Conversions (Previous)",
    "key": "previous_conversions",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "20",
    "title": "Conversions % Δ",
    "key": "percentage_difference_conversions",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": true // Kept compare key as true
  },
  // Conv. Rate
  {
    "id": "5",
    "title": "Conv. Rate",
    "key": "current_conversion_rate",
    "visible": false,
    "category": "Conversions",
    "compare": false // Added compare key
  },
  {
    "id": "29",
    "title": "Conv. Rate (Previous)",
    "key": "previous_conversion_rate",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "19",
    "title": "Conv. Rate % Δ",
    "key": "percentage_difference_conversion_rate",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": true // Kept compare key as true
  },
  // Cost / Conv.
  {
    "id": "8",
    "title": "Cost / Conv.",
    "key": "current_cost_per_conversion",
    "visible": false,
    "category": "Conversions",
    "compare": false // Added compare key
  },
  {
    "id": "32",
    "title": "Cost / Conv. (Previous)",
    "key": "previous_cost_per_conversion",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "22",
    "title": "Cost / Conv. % Δ",
    "key": "percentage_difference_cost_per_conversion",
    "visible": false,
    "category": "Conversions Comparison",
    "compare": true // Kept compare key as true
  },
  // Interactions
  {
    "id": "13",
    "title": "Interactions",
    "key": "current_interactions",
    "visible": false,
    "category": "Interactions",
    "compare": false // Added compare key
  },
  {
    "id": "37",
    "title": "Interactions (Previous)",
    "key": "previous_interactions",
    "visible": false,
    "category": "Interactions Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "26",
    "title": "Interactions % Δ",
    "key": "percentage_difference_interactions",
    "visible": false,
    "category": "Interactions Comparison",
    "compare": true // Kept compare key as true
  },
  // Interaction Rate
  {
    "id": "12",
    "title": "Interaction Rate",
    "key": "current_interaction_rate",
    "visible": false,
    "category": "Interactions",
    "compare": false // Added compare key
  },
  {
    "id": "36",
    "title": "Interaction Rate (Previous)",
    "key": "previous_interaction_rate",
    "visible": false,
    "category": "Interactions Comparison",
    "compare": false // Changed from true
  },
  {
    "id": "25",
    "title": "Interaction Rate % Δ",
    "key": "percentage_difference_interaction_rate",
    "visible": false,
    "category": "Interactions Comparison",
    "compare": true // Kept compare key as true
  },
];