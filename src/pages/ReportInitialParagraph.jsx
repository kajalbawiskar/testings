import { fetchInsights } from "./geminiDailyInsights";

export const generateInsightsParagraph = async (
  reportData,
  setInsightsParagraph,
  flags
) => {
  if (reportData) {
    // Gather variables from reportData
    const insightsData = {
      cost: reportData.totalCost || 0,
      costChangePercent: isNaN(reportData.totalCostPer) ? 0 : reportData.totalCostPer,
      impressionsCurrent: reportData.impr_current || 0,
      impressionsPrevious: reportData.impr_previous || 0,
      clicksCurrent: reportData.clicks_current || 0,
      clicksPrevious: reportData.clicks_previous || 0,
      ctr: reportData.totalCtr || 0,
      conversions: reportData.totalConversions || 0,
      costPerConversion: reportData.totalCostPerConv || 0,
    };

    // Create a prompt for Gemini
    const prompt = generatePrompt(insightsData, flags); // Create a function to format the prompt

    try {
      const insights = await fetchInsights(prompt); // Call the Gemini API
      setInsightsParagraph(insights); // Set the generated insights
    } catch (error) {
      console.error("Failed to fetch insights from Gemini:", error);
      setInsightsParagraph("An error occurred while generating insights.");
    }
  }
};

// Function to create a prompt for Gemini based on insights data and flags
const generatePrompt = (data, flags) => {
  let prompt =
    "You are a digital marketing expert. Based on the following campaign data, provide insights in short:\n";

  if (flags.cost) {
    prompt += `Total Cost: Rs.${data.cost}, Change: ${data.costChangePercent}%\n`;
  }
  if (flags.impressions) {
    prompt += `Impressions: Current: ${data.impressionsCurrent}, Previous: ${data.impressionsPrevious}\n`;
  }
  if (flags.clicks) {
    prompt += `Clicks: Current: ${data.clicksCurrent}, Previous: ${data.clicksPrevious}\n`;
  }
  if (flags.ctr) {
    prompt += `CTR: ${data.ctr}%\n`;
  }
  if (flags.conversions) {
    prompt += `Conversions: ${data.conversions}, Cost Per Conversion: Rs.${data.costPerConversion}\n`;
  }

  return prompt;
};
