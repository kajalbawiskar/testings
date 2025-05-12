import React, { useState, useEffect } from "react";
import { Header } from "../components/index";
import { useStateContext } from "../contexts/ContextProvider";

const KeywordAnalysis = () => {
  const [keywords, setKeywords] = useState([]);
  const [error, setError] = useState("");
  const { currentColor } = useStateContext();
  const handleKeyword = (e) => {
    generate();
  };

  const API_URL = process.env.REACT_API_URL;
  const API_KEY = process.env.REACT_API_KEY;
  const generate = async () => {
    const prompt =
      "Can you suggest 20 non-brand keywords that an e-commerce sustainable luxury clothing brand could consider targeting for their Google search ads to attract potential customers who may not be familiar with their brand";
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      // Remove numbers, dots, and spaces before each keyword
      const formattedResult = generatedText.replace(/^\d+\.\s*/gm, "");
      // Split the formatted result into an array of keywords
      const keywordsArray = formattedResult
        .split("\n")
        .filter((keyword) => keyword.trim() !== "");
      // Assuming each keyword has the structure { text: 'keyword', vol: volume, cpc: costPerClick, competition: competition }
      const generatedKeywords = keywordsArray.map((keyword) => ({
        text: keyword,
        vol: "", // add volume data here if available
        cpc: "", // add cost per click data here if available
        competition: "", // add competition data here if available
      }));
      setKeywords(generatedKeywords);
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to generate keywords");
    }
  };

  useEffect(() => {
    generate();
  }, []);

  return (
    <div className="m-2 md:m-10  p-2 md:p-2 bg-white rounded-3xl">
      <Header title="Keyword Analysis" />
      <div className="w-full md:col-span-1">
        <div className="relative z-0 mb-5 group">
          <input
            type="text"
            id="budget"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter Budget"
            onChange={handleKeyword}
            required
          />
        </div>
      </div>
      {error && <p>Error: {error}</p>}
      <div className="overflow-auto mb-28">
        <div className="flex flex-wrap">
          {keywords.map((keyword, index) => (
            <p
              key={index}
              className="p-4 m-3 text-white rounded-full"
              style={{ backgroundColor: currentColor }}
            >
              {keyword.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordAnalysis;
