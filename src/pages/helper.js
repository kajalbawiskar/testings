// export const weeklyReportInitialParagraph1 = (reportData, setInitialParagraph, flags, selectedTable) => {
//     if (reportData) {
//       // Use fallback values to avoid 'undefined' and 'NaN' issues
//       const costCurrWeek = reportData.totalCost || 0;
//       const costChangePercent = isNaN(reportData.totalCostPer) ? 0 : reportData.totalCostPer;
//       const imprCurrWeek = reportData.impr_curr_week || 0;
//       const imprPrevWeek = reportData.impr_prev_week || 0;
//       const clicksCurrWeek = reportData.clicks_curr_week || 0;
//       const clicksPrevWeek = reportData.clicks_prev_week || 0;
//       const ctr = reportData.totalCtr || 0;
//       const conversion = reportData.totalConversions || 0;
//       const costPerConv = reportData.totalCostPerConv || 0;

//       let initialParaText = "";

//       console.log(`User selected table: ${selectedTable}`);

//       // Cost insights
//       if (flags.cost) {
//         initialParaText += `This week, overall account spend was Rs.${costCurrWeek} which is ${Math.abs(costChangePercent)}% ${
//           costChangePercent > 0 ? "higher" : "lower"
//         } compared to last week.`;
//       }

//       // Impressions insights
//       if (flags.impr) {
//         if (imprCurrWeek > imprPrevWeek) {
//           initialParaText += ` Impressions increased by ${reportData.totalImpressionsPer}% compared to last week.`;
//         } else if (imprCurrWeek < imprPrevWeek) {
//           initialParaText += ` Impressions decreased by ${reportData.totalImpressionsPer}% compared to last week.`;
//         } else {
//           initialParaText += ` Impressions remained the same as last week.`;
//         }
//       }

//       // Clicks insights
//       if (flags.click) {
//         if (clicksCurrWeek > clicksPrevWeek) {
//           initialParaText += ` Clicks increased by ${reportData.totalClicksPer}% compared to last week.`;
//         } else if (clicksCurrWeek < clicksPrevWeek) {
//           initialParaText += ` Clicks decreased by ${reportData.totalClicksPer}% compared to last week.`;
//         } else {
//           initialParaText += ` Clicks remained the same as last week.`;
//         }
//       }

//       // CTR insights
//       if (flags.ctr) {
//         if (ctr > 0) {
//           initialParaText += ` The CTR is ${ctr}% for this week.`;
//         } else {
//           initialParaText += ` There was no CTR recorded for this week.`;
//         }
//       }

//       // Conversion and cost per conversion insights
//       if (flags.conversion) {
//         if (conversion > 0) {
//           initialParaText += ` We had ${conversion} conversions this week with a cost per conversion of Rs.${costPerConv}.`;
//         } else {
//           initialParaText += ` No conversions were recorded this week.`;
//         }
//       }

//       // Set the initial paragraph text
//       setInitialParagraph(initialParaText);
//     }
//   };

import { fetchInsights } from "./geminiDailyInsights";

export const weeklyReportInitialParagraph1 = async (
  reportData,
  setInitialParagraph,
  flags
) => {
  if (reportData) {
    // Gather variables from reportData
    const insightsData = {
      costCurrentWeek: reportData.totalCost || 0,
      costChangePercent: isNaN(reportData.totalCostPer)
        ? 0
        : reportData.totalCostPer,
      imprCurrentWeek: reportData.impr_curr_week || 0,
      imprPreviousWeek: reportData.impr_prev_week || 0,
      clicksCurrentWeek: reportData.clicks_curr_week || 0,
      clicksPreviousWeek: reportData.clicks_prev_week || 0,
      ctr: reportData.totalCtr || 0,
      conversion: reportData.totalConversions || 0,
      costPerConv: reportData.totalCostPerConv || 0,
    };

    // Create a prompt for Gemini
    const prompt = generateGeminiWeeklyPrompt(insightsData, flags); // Create a function to format the prompt

    try {
      const insights = await fetchInsights(prompt); // Call the Gemini API
      setInitialParagraph(insights); // Set the generated insights
    } catch (error) {
      console.error("Failed to fetch insights from Gemini:", error);
      setInitialParagraph("An error occurred while generating insights.");
    }
  }
};

// Function to create a prompt for Gemini based on insights data and flags
const generateGeminiWeeklyPrompt = (data, flags) => {
  let prompt =
    "You are a digital marketing expert. Based on the following weekly campaign data, provide insights in short:\n";

  if (flags.cost) {
    prompt += `Total Cost This Week: Rs.${data.costCurrentWeek}, Change: ${data.costChangePercent}%\n`;
  }
  if (flags.impr) {
    prompt += `Impressions This Week: ${data.imprCurrentWeek}, Impressions Previous Week: ${data.imprPreviousWeek}\n`;
  }
  if (flags.click) {
    prompt += `Clicks This Week: ${data.clicksCurrentWeek}, Clicks Previous Week: ${data.clicksPreviousWeek}\n`;
  }
  if (flags.ctr) {
    prompt += `CTR: ${data.ctr}%\n`;
  }
  if (flags.conversion) {
    prompt += `Total Conversions This Week: ${data.conversion}, Cost Per Conversion: Rs.${data.costPerConv}\n`;
  }

  return prompt;
};
