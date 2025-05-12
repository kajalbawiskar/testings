import React, { useState } from "react";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

const ImageExtractor = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const handleWebsite = (e) => {
    setWebsiteUrl(e.target.value);
  }

  const handleExtract = () => {
    setIsLoading(true);
    axios
      .post("https://api.confidanto.com/extract", { websiteUrl })
      .then((res) => {
        const shuffledUrls = shuffleArray(res.data.images);
        setImageUrls(shuffledUrls);
        setIsLoading(false); // Set isLoading to false when images are loaded
      })
      .catch((err) => console.log(err));
  }

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="image-gallery mb-24 overflow-y-visible font-roboto">
      <h1 className="text-4xl font-semibold mx-12 pb-8 text-[#070a74]">
        Images From Your Website
      </h1>
      <div className="flex flex-col lg:flex-row mx-12">
        <input
          type="text"
          id="website"
          className="bg-transparent border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Enter your website url"
          onChange={handleWebsite}
          required
        />
        <button
          className="group relative min-w-fit lg:w-fit hover:text-white items-center flex justify-center py-2 px-12 border-2 border-[#070a74] hover:border-[#070a74] text-lg font-medium text-[#070a74] bg-transparent hover:bg-[#070a74] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 mx-2 lg:ml-6"
          onClick={handleExtract}
        >
          Extract
        </button>
      </div>
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-3">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex flex-wrap justify-center items-center mt-8">
          {imageUrls.map((imageUrl, index) => (
            <img
              key={index}
              src={imageUrl.url}
              alt="Couldn't Load Image"
              className="w-64 pr-4 pb-4 mx-12"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageExtractor;
