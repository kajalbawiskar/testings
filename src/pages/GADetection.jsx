import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

const GADetection = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [result, setResult] = useState("");
  const handleWebsite = (e) => {
    setWebsiteUrl(e.target.value);
  };
  console.log(websiteUrl);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.confidanto.com/check-analytics",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ websiteUrl }),
        }
      );

      const data = await response.json();
      setIsLoading(false);
      if (data.message === "Google Analytics tags found.")
        setResult("Good! GA code is added");
      else
        setResult(
          "We detected that your website does not have a GA code. Please submit a ticket on this ID: advisors@confidanto.com to add the GA code."
        );
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="image-gallery mb-40">
      <h1 className="text-4xl font-semibold mx-12 pb-8">
        Google Analytics Detection
      </h1>
      <div className="flex flex-col lg:flex-row mx-12 mt-8">
        <form onSubmit={handleSubmit} className="flex w-full">
          <input
            type="text"
            id="website"
            className="bg-transparent border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Enter your website url"
            onChange={handleWebsite}
            required
          />
          <button
            className="group relative min-w-fit lg:w-fit text-white items-center flex justify-center py-2 px-14 border-2 border-black hover:border-black text-lg font-medium hover:text-black bg-black hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 mx-2 lg:ml-6"
            type="submit"
          >
            Check
          </button>
        </form>
      </div>
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-3">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-center mt-2">
          <p
            className="mt-8 mb-8 text-center text-xl font-semibold mx-12"
          >
            {result.includes("advisors@confidanto.com") ? (
              <>
                We detected that your website does not have a GA code. Please
                submit a ticket on this ID:{" "}
                <a href="mailto:advisors@confidanto.com" className="text-blue-700">
                  advisors@confidanto.com
                </a>{" "}
                to add the GA code.
              </>
            ) : (
              result
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default GADetection;
