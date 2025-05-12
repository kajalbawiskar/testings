import React, { useEffect, useState } from "react";
import { adsGif } from "../../assets";

function SerpapiSavedDataTable() {
  const [data, setData] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    // Fetching data from the API using a POST request
    fetch("https://api.confidanto.com/serpapi-data/fetch-saved-data-serpapi", {
      method: "POST", // Specify the method as POST
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ email }), // Send the email in the request body
    })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [email]);

  const formatDate = (date) => {
    const formattedDate = new Date().toISOString().split('T')[0];
    return formattedDate;
  }

  return (
    <div className="mb-20 w-full mx-6">
      {data.length > 0 ? (
        <div className="flex flex-col justify-center items-center w-full">
          <h1 className="p-4 text-3xl font-semibold text-[#4142dc]">
            Saved Competitors Data
          </h1>
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-300 py-2 bg-gray-200">
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Keyword</th>
                <th className="px-4 py-2">Location</th>
                <th className="px-4 py-2">Website Link</th>
                <th className="px-4 py-2">Position</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className=" hover:bg-gray-200 border-b border-gray-300"
                >
                    <td className="px-4 py-2 capitalize text-center">
                    {formatDate(item.date)}
                  </td>
                  <td className="px-4 py-2 capitalize text-center">
                    {item.keyword}
                  </td>
                  <td className="px-4 py-2 text-center">{item.location}</td>
                  <td className="px-4 py-2 text-center">
                    <a
                      className="text-blue-500 hover:underline cursor-pointer"
                      href={
                        item.website_link.includes(".")
                          ? item.website_link.startsWith("http")
                            ? item.website_link
                            : `http://${item.website_link}`
                          : `https://www.google.com/search?q=${item.website_link}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.website_link}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-center">{item.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center  mt-8 bg-white mx-4 h-auto rounded-lg p-2">
          <div className="max-w-[500px] mx-auto ">
            <img src={adsGif} alt="Ads GIF" className="max-w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  );
}

export default SerpapiSavedDataTable;
