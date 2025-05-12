import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import LoadingAnimation from "../components/LoadingAnimation";
import { MdOutlineSegment } from "react-icons/md";
import { IoCaretForwardSharp } from "react-icons/io5";

const CategoryWeekly = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [groupNames, setGroupNames] = useState([]);
  const [reportData, setReportData] = useState(null);
  const [reportDataDetailed, setReportDataDetailed] = useState(null);
  const [isGroupListVisible, setIsGroupListVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [savedGroups, setSavedGroups] = useState([]);
  const [showGroups, setShowGroups] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const groupListRef = useRef(null);
  const segmentButtonRef = useRef(null);

  // Define the category types
  const categoryTypes = ["Brand", "Non-Brand", "Media Planning"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [yesterdayReport, detailedReport] = await Promise.all([
          axios.post(
            "https://api.confidanto.com/daily-reporting/yesterday-day-before-yesterday-compare",
            { 
              email:localStorage.getItem("email"),
              customer_id: localStorage.getItem("customer_id")
            }
          ),
          axios.post(
            "https://api.confidanto.com/weekly-reporting-google-ads/compare-campaigns-data",
            { customer_id: 4643036315 }            
          ),
        ]);

        axios.post("https://api.confidanto.com/campaign-group/fetch-groups",{email:localStorage.getItem("email")})
        .then((res)=>{
            // // console.log("Groups: ",res.data)
            setGroupNames(res.data.groups)
            // console.log("IUVYTCVYGBH",res.data);
        })
        // if (detailedReport.data.groups) {
        //   const groupsData = detailedReport.data.groups;
        //   setSavedGroups(groupsData);
        //   const names = groupsData.map((group) => group.group_name);
        //   setGroupNames(names);
        // }

        setReportData(yesterdayReport.data);
        setReportDataDetailed(detailedReport.data);
      } catch (error) {
        console.error("Error fetching the data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGroup && savedGroups.length > 0 && reportDataDetailed) {
      const groupData = savedGroups.find(
        (group) => group.group_name === selectedGroup
      );
  
      if (groupData) {
        const campaignIds = groupData.campaign_ids.map((id) =>
          parseInt(id, 10)
        );
  
        const filteredCampaigns = reportDataDetailed.filter(
          (campaign) =>
            campaignIds.includes(campaign.id) &&
            (selectedCategory
              ? campaign.category === selectedCategory
              : true) // Filter by category if selected
        );
  
        setFilteredData(filteredCampaigns);
      }
    }
  }, [selectedGroup, savedGroups, reportDataDetailed, selectedCategory]);

  const handleGroupClick = (name) => {
    setSelectedGroup(name);
    setIsGroupListVisible(false);
    setSelectedCategory(null);  // Reset the selected category
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    
    let newData = []
    if(category == 0){
      setFilteredData(reportDataDetailed)
    }else{
      reportDataDetailed.map((data)=>{  
        if(category.campaign_ids.includes(data.id.toString())){
          newData.push(data)
        }
      })

    }
    setFilteredData(newData)
    // Filter campaigns based on the category
    // if (reportDataDetailed) {
    //   let filteredCampaigns = [];
    //   if (category === "Brand") {
    //     // Show brand campaigns that include brand names like "Confidanto"
    //     filteredCampaigns = reportDataDetailed.filter((campaign) =>
    //       campaign.campaign.includes("Confidanto")
    //     );
    //   } else if (category === "Non-Brand") {
    //     // Show campaigns that are not associated with brands
    //     filteredCampaigns = reportDataDetailed.filter(
    //       (campaign) => !campaign.campaign.includes("Confidanto")
    //     );
    //   } else if (category === "Media Planning") {
    //     // Show all campaigns
    //     filteredCampaigns = reportDataDetailed;
    //   }

    //   setFilteredData(filteredCampaigns);
    // }
  };

  const toggleGroupListVisibility = () => {
    setIsGroupListVisible(!isGroupListVisible);
  };

  const handleClickOutside = (event) => {
    if (
      groupListRef.current &&
      !groupListRef.current.contains(event.target) &&
      !segmentButtonRef.current.contains(event.target)
    ) {
      setIsGroupListVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatPercent = (value) => {
    return (
      <span className="flex text-base">
        {value > 0 ? (
          <IoIosArrowRoundUp className="text-green-500 text-lg" />
        ) : value < 0 ? (
          <IoIosArrowRoundDown className="text-red-500 text-lg" />
        ) : (
          ""
        )}
        {`${value > 0 ? "+" + value : value}%`}
      </span>
    );
  };

  if (!reportData || !reportDataDetailed) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingAnimation />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-semibold py-4">Category wise</h1>
        <div className="">
          <button
            ref={segmentButtonRef}
            className="bg-[#2930a8] text-white px-4 py-2 m-2 rounded hover:shadow-lg flex items-center justify-center"
            onClick={toggleGroupListVisibility}
          >
            <MdOutlineSegment className="mr-2 font-bold" /> Segment
          </button>
          {isGroupListVisible && (
            <div
              ref={groupListRef}
              className="absolute z-20 w-56 bg-white shadow-lg rounded-lg mt-2 p-4 border border-gray-200"
              style={{
                top:
                  segmentButtonRef.current?.getBoundingClientRect().bottom + 5,
                left: segmentButtonRef.current?.getBoundingClientRect().left,
              }}
            >
              <p className="p-2 text-sm text-gray-400">By</p>
              <button
                className="p-2 flex items-center hover:bg-gray-50 cursor-pointer"
                onClick={() => setShowGroups(!showGroups)}
              >
                Groups <IoCaretForwardSharp className="ml-2" />
              </button>
              {showGroups && (
                <div className="mt-4">
                  <button
                      key="0"
                      className="block p-2 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleCategoryClick(0)}
                    >
                      All
                    </button>
                  {groupNames.map((category, index) => (
                  <button
                    key={index}
                    className="block p-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category.group_name}
                  </button>
                ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {(filteredData.length > 0 ? filteredData : reportDataDetailed).length >
        0 && (
        <table className="mb-12 w-full">
          <thead>
            <tr className="bg-[#2930a8] text-white">
              <th className="p-2 border-b text-left">Campaign</th>
              <th className="p-2 border-b text-left">Impressions</th>
              <th className="p-2 border-b text-left">% Δ</th>
              <th className="p-2 border-b text-left">Clicks</th>
              <th className="p-2 border-b text-left">% Δ</th>
              <th className="p-2 border-b text-left">Cost</th>
              <th className="p-2 border-b text-left">% Δ</th>
            </tr>
          </thead>
          <tbody>
            {(filteredData.length > 0 ? filteredData : reportDataDetailed).map(
              (campaign) => (
                <tr key={campaign.campaign} className="border-t">
                  <td className="p-2 border-b">{campaign.campaign}</td>
                  <td className="p-2 border-b">{campaign.impr_curr_week}</td>
                  <td className="p-2 border-b">
                    {formatPercent(campaign.impr_change_percent)}
                  </td>
                  <td className="p-2 border-b">{campaign.clicks_curr_week}</td>
                  <td className="p-2 border-b">
                    {formatPercent(campaign.clicks_change_percent)}
                  </td>
                  <td className="p-2 border-b">
                  ₹{campaign.cost_curr_week.toFixed(2)}
                  </td>
                  <td className="p-2 border-b">
                    {formatPercent(campaign.cost_change_percent)}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoryWeekly;
