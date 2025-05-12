//import { fetchInsights } from './apiService'; // Import your fetch function
import { fetchInsights } from "./geminiDailyInsights";
export const dailyCampaignInitialParagraph = async (
  reportData,
  setInitialParagraph,
  flags
) => {
  if (reportData) {
    // Gather variables from reportData
    const insightsData = {
      costYesterday: reportData.totalCost || 0,
      costChangePercent: isNaN(reportData.totalCostPer)
        ? 0
        : reportData.totalCostPer,
      imprYesterday: reportData.impr_yesterday || 0,
      imprDayBeforeYesterday: reportData.impr_day_before_yesterday || 0,
      clicksYesterday: reportData.clicks_yesterday || 0,
      clicksDayBeforeYesterday: reportData.clicks_day_before_yesterday || 0,
      ctr: reportData.totalCtr || 0,
      conversion: reportData.totalConversions || 0,
      costPerConv: reportData.totalCostPerConv || 0,
    };

    // Create a prompt for Gemini
    const prompt = generateGeminiPrompt(insightsData, flags);

    try {
      const insights = await fetchInsights(prompt);
      setInitialParagraph(insights);
    } catch (error) {
      console.error("Failed to fetch insights from Gemini:", error);
      setInitialParagraph("An error occurred while generating insights.");
    }
  }
};

const generateGeminiPrompt = (data, flags) => {
  let prompt =
    "You are a digital marketing expert. Based on the following campaign data, provide insights in short:\n";

  if (flags.cost) {
    prompt += `Cost: Rs.${data.costYesterday}, Change: ${data.costChangePercent}%\n`;
  }
  if (flags.impr) {
    prompt += `Impressions Yesterday: ${data.imprYesterday}, Impressions Day Before: ${data.imprDayBeforeYesterday}\n`;
  }
  if (flags.click) {
    prompt += `Clicks Yesterday: ${data.clicksYesterday}, Clicks Day Before: ${data.clicksDayBeforeYesterday}\n`;
  }
  if (flags.ctr) {
    prompt += `CTR: ${data.ctr}%\n`;
  }
  if (flags.conversion) {
    prompt += `Conversions: ${data.conversion}, Cost Per Conversion: Rs.${data.costPerConv}\n`;
  }

  return prompt;
};

// // Function to create a prompt for Gemini based on insights data and flags
// const generateGeminiPrompt = (data, flags) => {
//   // Start with the expert context
//   let prompt = `You are a digital marketing expert. Based on the following data, please analyze and provide actionable insights:\n${data}`;

//   // Append insights data based on flags
//   if (flags.cost) {
//     prompt += `Cost: Rs.${data.costYesterday}, Change: ${data.costChangePercent}%\n`;
//   }
//   if (flags.impr) {
//     prompt += `Impressions Yesterday: ${data.imprYesterday}, Impressions Day Before: ${data.imprDayBeforeYesterday}\n`;
//   }
//   if (flags.click) {
//     prompt += `Clicks Yesterday: ${data.clicksYesterday}, Clicks Day Before: ${data.clicksDayBeforeYesterday}\n`;
//   }
//   if (flags.ctr) {
//     prompt += `CTR: ${data.ctr}%\n`;
//   }
//   if (flags.conversion) {
//     prompt += `Conversions: ${data.conversion}, Cost Per Conversion: Rs.${data.costPerConv}\n`;
//   }

//   return prompt;
// };
