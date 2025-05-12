import React, { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "../../components/LoadingAnimation";
import { states } from "../../data/states";
import { countries } from "../../data/countries";
import { PiCaretDownBold } from "react-icons/pi";
import AdsComponent from "./AdsComponent";
import ShoppingResultsComponent from "./ShoppingResultsComponent";
import InlineProductsComponent from "./InlineProductsComponent";
import OrganicResultsComponent from "./OrganicResultsComponent";
import SavedDataView from "./SavedDataView";
import SerpapiSavedDataTable from "./SerpapiSavedDataTable";

function AdsPositionTool() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("fresh"); // 'fresh' or 'saved'
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
  //console.log(countryName[0].name);
  console.log(gl);
  let cname;
  if (countryName.length > 0) {
    cname = countryName[0].name;
  }
  console.log(cname);

  const country_name = cname;
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  //console.log(options);
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

  const [result, setResult] = useState();
  const [adsData, setAdsData] = useState([]);
  const [inlineProducts, setInlineProducts] = useState([]);
  const [shoppingResults, setShoppingResults] = useState([]);
  const [organicResults, setOrganicResults] = useState([]);
  const [keywordsData, setKeywordsData] = useState([]);
  const [fetchSavedData, setFetchSavedData] = useState([]);
  const [savedAdsData, setSavedAdsData] = useState([]);
  const [savedInlineProducts, setSavedInlineProducts] = useState([]);
  const [savedShoppingResults, setSavedShoppingResults] = useState([]);
  const [keywordIdeas, setKeywordIdeas] = useState([]);

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
  //const location = "Maharashtra, India";
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

    // Define the requests
    const searchAdsRequest = axios.post(
      "https://api.confidanto.com/search_ads_serapi",
      {
        query: query,
        location: location,
        hl: hl,
        gl: gl,
        deviceType: deviceType,
      }
    );

    const fetchSavedUserViewRequest = axios.post(
      "https://api.confidanto.com/serpapi-data/fetch-saved-user-view",
      {
        keyword: query,
        location: location,
      }
    );

    console.log(location);

    // Define the new API request
    const generateKeywordIdeasRequest = axios.post(
      "https://api.confidanto.com/generate-keyword-ideas-with-text",
      {
        customer_id: "4643036315",
        keyword_texts: [query], // Assuming 'query' is your keyword
        location_names: [location], // Assuming 'location' is your location name
        language_name: "English", // Hardcoded to English; adjust as needed
      }
    );

    // Execute all three requests concurrently
    Promise.all([
      searchAdsRequest,
      fetchSavedUserViewRequest,
      generateKeywordIdeasRequest,
    ])
      .then(
        ([
          searchAdsResponse,
          fetchSavedUserViewResponse,
          generateKeywordIdeasResponse,
        ]) => {
          // Handle the search ads response
          console.log(searchAdsResponse.data.serpapi_res);
          setKeywordsData([searchAdsResponse.data.keywordData]);
          setAdsData(searchAdsResponse.data.serpapi_res.ads);
          setInlineProducts(searchAdsResponse.data.serpapi_res.inline_products);
          console.log(searchAdsResponse.data.serpapi_res.inline_products);

          setShoppingResults(
            searchAdsResponse.data.serpapi_res.shopping_results
          );
          setOrganicResults(searchAdsResponse.data.serpapi_res.organic_results);
          setResult(searchAdsResponse.data.serpapi_res);

          // Handle the fetch saved user view response
          console.log(fetchSavedUserViewResponse.data);
          setFetchSavedData(fetchSavedUserViewResponse.data);
          setSavedAdsData(fetchSavedUserViewResponse.data.ads);
          console.log(fetchSavedUserViewResponse.data.ads);
          console.log(savedAdsData);
          setSavedInlineProducts(
            fetchSavedUserViewResponse.data.inline_products
          );
          setSavedShoppingResults(
            fetchSavedUserViewResponse.data.shopping_results
          );

          // Handle the generate keyword ideas response
          console.log("Keyword Ideas:", generateKeywordIdeasResponse.data);

          // Filter the keyword ideas where the text matches the query
          const filteredKeywordIdeas = generateKeywordIdeasResponse.data.filter(
            (idea) => idea.text === query
          );

          console.log("Filtered Keyword Ideas: ", filteredKeywordIdeas);
          // Set the filtered keyword ideas
          setKeywordIdeas(filteredKeywordIdeas);
        }
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  console.log(keywordsData);

  const handleSaveAd = async (adData) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.post(
        "https://api.confidanto.com/serpapi-data/save-ads",
        {
          block_position: adData.block_position,
          position: adData.position,
          website_link: extractDomain(adData.link),
          title: adData.title,
          description: adData.description,
          email: localStorage.getItem("email"),
          keyword: query,
          location: location,
          date: currentDate,
        }
      );

      // Check the response status
      if (response.status === 200) {
        alert(`Ad for "${adData.title}" saved successfully!`);
      } else if (response.status === 409) {
        alert(`Ad for "${adData.title}" already exists.`);
      } else {
        alert(`Failed to save the ad for "${adData.title}".`);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      // Handle known error response
      if (error.response) {
        if (error.response.status === 409) {
          alert(`Ad for "${adData.title}" already exists.`);
        } else {
          alert(`Failed to save the ad for "${adData.title}".`);
        }
      } else {
        // Handle network or unexpected errors
        alert("An unexpected error occurred while saving the ad.");
      }
    }
  };

  const handleSaveShoppingResults = async (shoppingResult) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.post(
        "https://api.confidanto.com/serpapi-data/save-shopping-results",
        {
          block_position: shoppingResult.block_position,
          position: shoppingResult.position,
          title: shoppingResult.title,
          website_link: extractDomain(shoppingResult.link),
          price: shoppingResult.price,
          email: localStorage.getItem("email"),
          keyword: query,
          location: location,
          date: currentDate,
        }
      );

      // Check the response status
      if (response.status === 200) {
        alert(`Ad for "${shoppingResult.title}" saved successfully!`);
      } else if (response.status === 409) {
        alert(`Ad for "${shoppingResult.title}" already exists.`);
      } else {
        alert(`Failed to save the ad for "${shoppingResult.title}".`);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      // Handle known error response
      if (error.response) {
        if (error.response.status === 409) {
          alert(`Ad for "${shoppingResult.title}" already exists.`);
        } else {
          alert(`Failed to save the ad for "${shoppingResult.title}".`);
        }
      } else {
        // Handle network or unexpected errors
        alert("An unexpected error occurred while saving the ad.");
      }
    }
  };

  const handleSaveInlineProducts = async (inlineProduct) => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await axios.post(
        "https://api.confidanto.com/serpapi-data/save-inline-products",
        {
          position: inlineProduct.position,
          title: inlineProduct.title,
          price: inlineProduct.price,
          thumbnail: inlineProduct.thumbnail,
          source: inlineProduct.source,
          email: localStorage.getItem("email"),
          keyword: query,
          location: location,
          date: currentDate,
        }
      );

      console.log(inlineProduct.source);
      // Check the response status
      if (response.status === 200) {
        alert(`Ad for "${inlineProduct.title}" saved successfully!`);
      } else if (response.status === 409) {
        alert(`Ad for "${inlineProduct.title}" already exists.`);
      } else {
        alert(`Failed to save the ad for "${inlineProduct.title}".`);
      }
    } catch (error) {
      console.error("Error saving ad:", error);
      // Handle known error response
      if (error.response) {
        if (error.response.status === 409) {
          alert(`Ad for "${inlineProduct.title}" already exists.`);
        } else {
          alert(`Failed to save the ad for "${inlineProduct.title}".`);
        }
      } else {
        // Handle network or unexpected errors
        alert("An unexpected error occurred while saving the ad.");
      }
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="mb-32 overflow-y-visible h-full font-roboto">
      <style>
        {`
          .break-all {
            word-wrap: break-word;
          }
        `}
      </style>
      <div className="bg-white m-4 rounded-lg shadow-md shadow-gray-500 py-8">
        <h2 className="text-base font-normal mx-12 mt-2 pb-8 uppercase text-[#070a74]">
          Search any keyword here to see the relevant ads running over internet
        </h2>
        <div className="flex flex-col lg:flex-row mx-12 mt-2 py-4">
          <div className="flex flex-col w-full">
            <input
              type="text"
              id="query"
              className="bg-white border border-gray-400 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              placeholder="Enter the search term you want information about"
              onChange={handleSearchQuery}
              required
            />
            {errors.query && (
              <p className="text-red-500 text-sm mt-1">
                Search query is required
              </p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="relative flex justify-between text-base w-full bg-white p-2.5 pr-0.5 border-1 border-gray-400 ml-6 text-left"
              >
                {location !== ""
                  ? location
                  : "Start typing the name of the location"}
                <span className="text-base mt-1 font-extrabold">
                  <PiCaretDownBold />
                </span>
              </button>
              {isOpen && (
                <div
                  id="dropdownHover"
                  className="z-10 absolute top-full left-0 mt-1  bg-white divide-y divide-gray-100 rounded-lg dark:bg-gray-700 shadow-md ml-6 w-full max-h-[250px] h-fit overflow-y-auto"
                >
                  <ul className="py-2 text-base text-gray-500 dark:text-gray-200">
                    <li>
                      <input
                        type="text"
                        id="serach_loc"
                        className="bg-white border border-gray-300 text-gray-900 text-base focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mx-2"
                        placeholder=""
                        onChange={(e) => {
                          setQ(e.target.value);
                          setLocation("");
                        }}
                        value={q}
                        required
                      />
                    </li>
                    {options.map((option) => (
                      <li key={option}>
                        <button
                          onClick={() => {
                            setLocation(option.canonical_name);
                            setRegion(option.country_code);
                            if (location) {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                location: false,
                              }));
                            }
                            toggleDropdown();
                          }}
                          className="w-full text-left px-6 py-2 hover:bg-[#7dabf8] hover:text-white items-center"
                        >
                          <div className="flex flex-col p-2 px-0">
                            <p>{option.canonical_name}</p>
                            <p>{option.reach}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {errors.location && (
              <p className="text-red-500 text-sm mt-1 ml-6">Area is required</p>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-col lg:flex-row mx-12 py-4 text-lg">
            <div>
              <h1 className="mr-16">Select Device Type</h1>
            </div>
            <div className="mr-16 text-base">
              <input
                type="radio"
                id="desktop"
                name="deviceType"
                value="Desktop"
                checked={deviceType === "Desktop"}
                onChange={() => setDeviceType("Desktop")}
                className="text-lg"
              />
              <label htmlFor="desktop" className="ml-2 text-lg">
                Desktop
              </label>
            </div>
            <div className="mr-16 text-base">
              <input
                type="radio"
                id="mobile"
                name="deviceType"
                value="Mobile"
                checked={deviceType === "Mobile"}
                onChange={() => setDeviceType("Mobile")}
                className="text-lg"
              />
              <label htmlFor="mobile" className="ml-2 text-lg">
                Mobile
              </label>
            </div>
            <div>
              <input
                type="radio"
                id="tablet"
                name="deviceType"
                value="Tablet"
                checked={deviceType === "Tablet"}
                onChange={() => setDeviceType("Tablet")}
                className="text-lg"
              />
              <label htmlFor="tablet" className="ml-2 text-lg">
                Tablet
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center mt-4">
            <button
              className="group relative min-w-fit lg:w-fit text-white items-center flex justify-center py-2 px-12 border-2 border-[#00a6fb] hover:border-[#00a6fb] text-lg font-semibold hover:text-[#00a6fb] bg-[#00a6fb] hover:bg-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-100 mx-2 lg:ml-6"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>
        </div>
      </div>
      {isLoading ? ( // Show loader if isLoading is true
        <div className="flex justify-center items-center h-40 mt-8">
          <LoadingAnimation />
        </div>
      ) : (
        <>
          {adsData.length > 0 ||
          shoppingResults.length > 0 ||
          inlineProducts.length > 0 ||
          organicResults.length > 0 ? (
            <div
              className={`m-4 mt-4 pb-20 pr-6 py-2 bg-white  rounded-lg shadow-md shadow-gray-500 `}
            >
              <div>
                <button
                  className={`text-lg p-2 m-4 border-b-4 ${
                    activeTab === "fresh"
                      ? "border-[#4142dc] text-[#4142dc]"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => handleTabChange("fresh")}
                >
                  Fresh Competitors
                </button>
                <button
                  className={`text-lg p-2 m-4 border-b-4 ${
                    activeTab === "saved"
                      ? "border-[#4142dc] text-[#4142dc]"
                      : "border-transparent text-gray-500"
                  }`}
                  onClick={() => handleTabChange("saved")}
                >
                  Saved Competitors
                </button>
              </div>

              {activeTab === "fresh" && (
                <>
                  {keywordIdeas.length !== 0 && (
                    <>
                    {keywordIdeas.map((idea) => (
                    <div className="flex flex-col w-full p-4 bg-blue-100 m-4">
                      <div className="flex justify-center">
                        <h1 className="text-xl font-semibold">Results for {idea.text} for {location}</h1>
                      </div>
                      <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">Top of the page bid (high): {idea.high_top_of_page_bid}</h1>
                        <h1 className="text-xl font-semibold">Top of the page bid (low): {idea.low_top_of_page_bid}</h1>
                      </div>
                      <div className="flex justify-between">
                        <h1 className="text-xl font-semibold">Average monthly searches: {idea.avg_monthly_searches}</h1>
                        <h1 className="text-xl font-semibold">Three month change: {idea.three_month_change}%</h1>
                      </div>
                    </div>
                    ))}
                    </>
                  )}
                  {adsData.length > 0 && (
                    <AdsComponent
                      adsData={adsData}
                      handleSaveAd={handleSaveAd}
                    />
                  )}

                  {shoppingResults.length > 0 && (
                    <ShoppingResultsComponent
                      shoppingResults={shoppingResults}
                      handleSaveShoppingResults={handleSaveShoppingResults}
                    />
                  )}
                  {inlineProducts.length > 0 && (
                    <InlineProductsComponent
                      inlineProducts={inlineProducts}
                      handleSaveInlineProducts={handleSaveInlineProducts}
                    />
                  )}
                  {adsData.length <= 0 &&
                    shoppingResults.length <= 0 &&
                    inlineProducts.length <= 0 &&
                    organicResults.length > 0 && (
                      <OrganicResultsComponent
                        organicResults={organicResults}
                      />
                    )}
                </>
              )}
              {activeTab === "saved" && (
                <>
                  {savedAdsData.length > 0 ||
                  savedShoppingResults.length > 0 ||
                  savedInlineProducts.length > 0 ? (
                    <>
                      <SavedDataView
                        adsData={savedAdsData}
                        shoppingResults={savedShoppingResults}
                        inlineProducts={savedInlineProducts}
                      />
                    </>
                  ) : (
                    <h1 className="text-center text-xl text-[#4142dc] p-4">
                      No saved Competitors
                    </h1>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-center items-center  mt-8 bg-white mx-4 h-auto rounded-lg shadow-md shadow-gray-500 p-2">
              <SerpapiSavedDataTable />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdsPositionTool;
