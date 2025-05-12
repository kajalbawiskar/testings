import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "../components";
import { useStateContext } from "../contexts/ContextProvider";

const StrategyIdeas = () => {
  const [planData, setPlanData] = useState(null);
  const { currentMode } = useStateContext();
  const API_URL = process.env.REACT_API_URL;
  const API_KEY = process.env.REACT_API_KEY;
  const [result, setResult] = useState("");
  const generate = async () => {
    const prompt =
      "share marketing plan for clothing brand for the month of april till june";
    //console.log(prompt)
    try {
      // Fetch the response from the OpenAI API with the signal from AbortController
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
      const formattedResult = formatResult(data.choices[0].message.content);
      setResult(formattedResult);
      setResult(data.choices[0].message.content);
      console.log(data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const formatResult = (text) => {
    // Splitting the text into paragraphs by newline characters
    const paragraphs = text.split("\n");
  
    // Return the formatted result
    return (
      <div>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  };
  
  return (
    <div
      className="m-2 md:m-10 mt-24 p-2 md:p-10 mb-16 bg-white rounded-3xl overflow-y-auto"
      style={{}}
    >
      <Header title="Strategy Ideas" />
      {planData && (
        <div>
          <p>Category: {planData[0].category}</p>
          <p>Subcategory: {planData[0].sucategory}</p>
          <p>Start Date: {planData[0].start_date}</p>
          <p>End Date: {planData[0].end_date}</p>
        </div>
      )}
      {result && (
        <div>
          {result}
        </div>
      )}
      <button
        onClick={generate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mb-20"
      >
        Generate Plan
      </button>
    </div>
  );
};
export default StrategyIdeas;
