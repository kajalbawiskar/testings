// apiService.js
export const fetchInsights = async (prompt) => {
  const response = await fetch("https://api.confidanto.com/generate-insights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch insights from Gemini");
  }

  const data = await response.json();
  return data.insights; // Adjust this based on the actual response structure
};
