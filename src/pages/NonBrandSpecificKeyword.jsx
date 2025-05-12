import React, { useState, useEffect } from "react";
import { Header, LoadingSpinner } from "../components";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";
import Chart from "chart.js/auto";
import { useStateContext } from "../contexts/ContextProvider";

const NonBrandSpecificKeyword = () => {
  const [keywordIdeas, setKeywordIdeas] = useState([]);
  const [error, setError] = useState("");
  const [keywordString, setKeywordString] = useState("");
  const [urlString, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [chartInstances, setChartInstances] = useState({});
  const { currentColor } = useStateContext();

  const handleKeyword = (e) => {
    setKeywordString(e.target.value);
  };

  const handleUrl = (e) => {
    setUrl(e.target.value);
  };

  const fetchKeywordIdeas = async () => {
    setLoading(true);
    //clearCanvas();
    const data = {
      customer_id: "4643036315",
      location_ids: ["2356"],
      language_id: "1000",
      keyword_texts: keywordString.split(","),
      page_url: urlString,
    };

    try {
      const response = await axios.post(
        "https://api.confidanto.com/generate-keyword-ideas",
        data
      );
      setKeywordIdeas(response.data.keyword_ideas);
      setError("");
    } catch (error) {
      setError("Error fetching keyword ideas");
      console.error("Error fetching keyword ideas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (keywordIdeas.length > 0) {
      destroyCharts();
      drawLineCharts();
    }
  }, [keywordIdeas]);

  const destroyCharts = () => {
    Object.values(chartInstances).forEach((chart) => {
      chart.destroy();
    });
    setChartInstances({});
  };
  const clearCanvas = () => {
    // Destroy existing Chart instances
    Object.values(chartInstances).forEach((chart) => {
      chart.destroy();
    });
  
    // Clear canvas elements
    keywordIdeas.forEach((keyword) => {
      const canvasId = keyword.text.replace(/\s+/g, "-").toLowerCase();
      const canvas = document.getElementById(canvasId);
      if (canvas) {
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        const canvasParent = canvas.parentElement;
        const existingCaption = canvasParent.querySelector(".chart-caption");
        if (existingCaption) {
          canvasParent.removeChild(existingCaption);
        }
      }
    });
  };
  

  const drawLineCharts = () => {
    const instances = {};
    keywordIdeas.forEach((keyword) => {
      const canvasId = keyword.text.replace(/\s+/g, "-").toLowerCase();
      const ctx = document.getElementById(canvasId);
  
      if (ctx) {
        const labels = keyword.monthly_search_volumes.map(
          (volume) => `${volume.month}`
        );
  
        const data = {
          labels: labels,
          datasets: [
            {
              label: keyword.text,
              data: keyword.monthly_search_volumes.map(
                (volume) => volume.monthly_searches
              ),
              borderColor: "rgba(65, 105, 225, 1)",
              fill: false,
            },
          ],
        };
  
        instances[keyword.text] = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false, // Hide the y-axis grid lines
                },
              },
              x: {
                grid: {
                  display: false, // Hide the x-axis grid lines
                },
              },
            },
          },
        });
        
        // Remove existing caption
        const canvasParent = ctx.parentElement;
        const existingCaption = canvasParent.querySelector(".chart-caption");
        if (existingCaption) {
          canvasParent.removeChild(existingCaption);
        }
        
        // Add caption below the canvas
        const caption = document.createElement("div");
        caption.className = "chart-caption";
        caption.textContent = "April 2023 - March 2024"; // Replace with your caption
        canvasParent.appendChild(caption);
      }
    });
    setChartInstances(instances);
  };

  const renderMonths = (monthlyVolumes) => {
    const sortedVolumes = monthlyVolumes.sort((a, b) => {
      // Compare years
      if (a.year !== b.year) {
        return a.year - b.year;
      }
      // If years are equal, compare months
      return a.month - b.month;
    });

    return sortedVolumes.map((volume, index) => (
      <td key={index} className="px-2 py-4">
        {volume.monthly_searches}
      </td>
    ));
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl font-roboto">
      <Header title="Non-Brand Specific Keyword Analysis" />
      <div className="flex flex-col lg:flex-row my-5 items-center">
        <input
          type="text"
          id="keyword"
          className="bg-transparent border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 my-2 lg:my-0"
          placeholder="Enter keywords to search"
          onChange={handleKeyword}
          required
        />
        <input
          type="text"
          id="urlText"
          className="bg-transparent border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-3 my-2 lg:my-0 ml-4"
          placeholder="Enter search url"
          onChange={handleUrl}
          required
        />
        <button
          className="group relative w-fit lg:w-fit text-white items-center flex justify-center py-1 lg:py-1.5 px-8 lg:px-12 border-2 border-black hover:border-black text-lg font-medium hover:text-black bg-black hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 lg:ml-6 my-2 lg:my-0"
          onClick={fetchKeywordIdeas}
        >
          Extract
        </button>
      </div>
      {loading && (
        <div>
          <LoadingAnimation />
        </div>
      )}
      {keywordIdeas.length > 0 && !loading && (
        <table className="table-auto mb-12 w-full lg:mb-32 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead
            className="text-xs text-white uppercase bg-black dark:bg-gray-700 dark:text-gray-400"
            style={{ backgroundColor: currentColor }}
          >
            <tr>
              <th className="pl-2 pr-6 py-4" style={{ width: "60%" }}>
                Keyword
              </th>
              <th className="pr-6 py-4">Avg Monthly Searches</th>
              {keywordIdeas[0].monthly_search_volumes.map((volume, index) => (
                <th key={index} className="px-2 py-4">
                  <div>{volume.month}</div>
                  <div>{volume.year}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {keywordIdeas.map((keyword, index) => (
              <tr
                key={index}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-3 py-4">{keyword.text}</td>
                <td className="px-3 py-4">{keyword.avg_monthly_searches}</td>
                {renderMonths(keyword.monthly_search_volumes)}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex flex-wrap justify-center">
        {keywordIdeas.map((keyword, index) => (
          <div key={index} className="m-4">
            <canvas
              id={keyword.text.replace(/\s+/g, "-").toLowerCase()}
              width="400"
              height="200"
            ></canvas>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NonBrandSpecificKeyword;
