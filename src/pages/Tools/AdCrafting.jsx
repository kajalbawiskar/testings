import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "../../components/LoadingAnimation";
import { useStateContext } from "../../contexts/ContextProvider";
import { states } from "../../data/states";
import { SearchResultTable } from "../../components";
import { BsInfoCircle } from "react-icons/bs";
import { countries } from "../../data/countries";
import { NavLink } from "react-router-dom";
import { RxCaretDown } from "react-icons/rx";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";
import { adsGif } from "../../assets";
import AdCraftingGif from "../../data/AdCrafting.gif";
import { IoSearchSharp } from "react-icons/io5";


function AdCrafting() {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const [q, setQ] = useState("");
  const gl = region;
  const [selectedCountry, setSelectedCountry] = useState("");
  const countryStates = states.filter(
    (state) => state.country_code === selectedCountry
  );
  const countryName = countries.filter((country) => country.iso2 === region);
  console.log(region);
  console.log(gl);
  let cname;
  if (countryName.length > 0) {
    cname = countryName[0].name;
  }
  console.log(cname);

  const country_name = cname;
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchOptions = async () => {
      const queryValue = q.trim() === "" ? country_name : q;
      if (queryValue === "") {
        setOptions([]);
        return;
      }
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.confidanto.com/serp-locations`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: queryValue }),
          }
        );
        const data = await response.json();
        setOptions(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching options:", error);
        setLoading(false);
      }
    };

    fetchOptions();
  }, [q, cname]);

  const handleInputChange = (event) => {
    setQ(event.target.value);
  };

  const { currentColor } = useStateContext();
  const [result, setResult] = useState();
  const [adsData, setAdsData] = useState([]);
  const [inlineProducts, setInlineProducts] = useState([]);
  const [shoppingResults, setShoppingResults] = useState([]);
  const [organicResults, setOrganicResults] = useState([]);
  const [keywordsData, setKeywordsData] = useState([]);

  const [errors, setErrors] = useState({
    query: false,
    region: false,
    location: false,
  });

  const handleSearchQuery = (e) => {
    setQuery(e.target.value);
    if (e.target.value.trim() !== "") {
      setErrors((prevErrors) => ({ ...prevErrors, query: false }));
    }
  };
  const [location, setLocation] = useState("");
  const [deviceType, setDeviceType] = useState("desktop");
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  console.log(deviceType);
  const hl = "en";

  const validateFields = () => {
    const newErrors = {
      query: query.trim() === "",
      region: region === "",
      location: location === "",
    };
    console.log(region);
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  console.log(errors);

  console.log(location);
  console.log(gl);

  const extractDomain = (url) => {
    if (!url || typeof url !== "string") {
      console.error("Invalid URL:", url);
      return "";
    }

    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch (error) {
      // Handle URLs without a protocol by adding a default one
      const formattedUrl =
        url.startsWith("http://") || url.startsWith("https://")
          ? url
          : `http://${url}`;
      try {
        const domain = new URL(formattedUrl).hostname.replace("www.", "");
        return domain;
      } catch (error) {
        console.error("Invalid URL:", url);
        return "";
      }
    }
  };

  const handleSearch = () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);
    axios
      .post("https://api.confidanto.com/search_ads_serapi", {
        query: query,
        location: location,
        hl: hl,
        gl: gl,
        deviceType: deviceType,
      })
      .then((res) => {
        console.log(res.data.serpapi_res);
        setKeywordsData([res.data.keywordData]);
        setAdsData(res.data.serpapi_res.ads);
        console.log(res.data);
        setInlineProducts(res.data.serpapi_res.inline_products);
        setShoppingResults(res.data.serpapi_res.shopping_results);
        setOrganicResults(res.data.serpapi_res.organic_results);
        setResult(res.data.serpapi_res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        //setIsLoading(false);
      });
  };

  console.log(keywordsData);

  return (
    <div className="image-gallery mb-32 overflow-y-visible h-full font-roboto">
      <style>
        {`
          .break-all {
  word-wrap: break-word;
}
        `}
      </style>
      <div className="bg-white m-4 rounded-lg shadow-md shadow-gray-500 py-8">
        <h1 className="text-5xl mx-12 pb-2 mt-2 uppercase text-[#070a74] font-semibold">
          Ad Crafting
        </h1>
        <h2 className="text-base font-normal mx-12 mt-2 pb-8 uppercase text-[#070a74]">
          Craft Perfect Ads in Minutes: Tailor Your Campaigns with Ease!
        </h2>
        <div className="flex flex-col lg:flex-row mx-12 mt-2 py-4">
          <div className="flex flex-col w-full">
            <input
              type="text"
              id="query"
              className="bg-white border border-gray-400 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Search here to craft ads for your brand's category"
              onChange={handleSearchQuery}
              required
            />
            {errors.query && (
              <p className="text-red-500 text-sm mt-1">
                Search query is required
              </p>
            )}
          </div>
          <button
            className="group relative min-w-fit rounded-full lg:w-fit text-white  flex items-center justify-center py-2 px-12 border-2 border-[#ef767a] hover:border-[#ef767a] text-lg font-semibold hover:text-[#ef767a] bg-[#ef767a] hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 mx-2 lg:ml-6"
            onClick={handleSearch}
          >
            <IoSearchSharp />
            <span className="px-1">Search</span>
          </button>
        </div>
      </div>
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-8">
          <LoadingAnimation />
        </div>
      ) : (
        <div className="flex justify-center items-center  mt-8 bg-white mx-4 h-auto rounded-lg shadow-md shadow-gray-500 p-2">
          <div className="max-w-[500px] mx-auto ">
            <img
              src={AdCraftingGif}
              alt="Ads GIF"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdCrafting;
