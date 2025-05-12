/* eslint-disable array-callback-return */
/* eslint-disable eqeqeq */
import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaColumns,
  FaExpand,
  FaCompress,
  FaGripLines,
  FaLayerGroup,
} from "react-icons/fa";
import LoadingAnimation from "../components/LoadingAnimation";
import axios from "axios";
import { DateRangePicker } from "react-date-range";
import "../styles/CustomDateRangePicker.css";
import { format, isYesterday, isToday } from "date-fns";
import { checkMark } from "../assets";
import { MdOutlineSegment } from "react-icons/md";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import CampaignsViewBy from "./CampaignsViewBy";
import Switcher7 from "./Tools/Switcher";
import {
  Autocomplete,
  TextField,
  Button,
  Box,
  Checkbox,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
} from "@mui/material";

import { IoCodeSharp } from "react-icons/io5";

import CampaignsGroupBy from "./CampaignsGroupBy";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import ModifyColumns from "./Tools/ModifyColumns";

const CampaignsTable = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isGroupDropdownVisible, setGroupDropdownVisible] = useState(false);

  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [isDialogOpenCreateGroup, setIsDialogOpenCreateGroup] = useState(false);

  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [isVisibleGroupInput, setIsVisibleGroupInput] = useState(false);

  let d = new Date();
  let year = d.getFullYear();
  let month = d.getMonth();
  const [columns, setColumns] = useState([
    {
      id: "1",
      title: "Campaign",
      key: "name",
      visible: true,
      locked: true,
      category: "Recommended",
      isLocked: true,
    },
    {
      id: "2",
      title: "Budget",
      key: "budget_micros",
      visible: true,
      category: "Recommended",
      isLocked: false,
    },
    {
      id: "3",
      title: "Status",
      key: "status" || "",
      visible: true,
      locked: true,
      category: "Recommended",
      isLocked: false,
    },
    {
      id: "4",
      title: "Interaction rate",
      key: "interaction_rate",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "5",
      title: "Avg.cost",
      key: "avg_cost",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "6",
      title: "Cost",
      key: "costs",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "7",
      title: "Clicks",
      key: "clicks",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "8",
      title: "Invalid clicks",
      key: "invalid_clicks",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "9",
      title: "Avg.CPC",
      key: "average_cpc",
      visible: true,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "10",
      title: "Impr.(Abs.Top)%",
      key: "absolute_top_impression_percentage",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "11",
      title: "Invalid click rate",
      key: "invalid_click_rate",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "12",
      title: "Impr.(Top)%",
      key: "top_impression_percentage",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "13",
      title: "Avg.Target ROAS",
      key: "average_target_roas",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "14",
      title: "CTR",
      key: "ctr",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "15",
      title: "Avg.target CPA",
      key: "average_target_cpa_micros",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "16",
      title: "Interactions",
      key: "interactions",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "17",
      title: "Conversions",
      key: "conversions",
      visible: true,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "18",
      title: "Cost/conv.",
      key: "cost_per_conv",
      visible: true,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "19",
      title: "NewCustomerLifetimeValue",
      key: "new_customer_lifetime_value",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "20",
      title: "AllNewCustomerLifetimeValue",
      key: "all_new_customer_lifetime_value",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "21",
      title: "CrossSellCostOfGoodsSold",
      key: "cross_sell_cost_of_goods_sold_micros",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "22",
      title: "LeadCostOfGoodsSold",
      key: "lead_cost_of_goods_sold_micros",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "23",
      title: "CrossSellRevenueMicros",
      key: "cross_sell_revenue_micros",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "24",
      title: "LeadGrossProfitMicros",
      key: "lead_gross_profit_micros",
      visible: false,
      category: "Conversions",
      isLocked: false,
    },
    {
      id: "25",
      title: "LeadRevenueMicros",
      key: "lead_revenue_micros",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "26",
      title: "Conv.value",
      key: "conversions_value",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "27",
      title: "Revenue",
      key: "revenue_micros",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "28",
      title: "allConv.value",
      key: "all_conversions_value",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "29",
      title: "CostOfGoodsSold",
      key: "cost_of_goods_sold_micros",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "30",
      title: "GrossProfitMargin",
      key: "gross_profit_margin",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "31",
      title: "Cost/Conv.",
      key: "cost_per_conversion",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "32",
      title: "Cross-sellGrossProfit",
      key: "cross_sell_gross_profit_micros",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "33",
      title: "Cross-deviceConversionsValue",
      key: "cross_device_conversions_value_micros",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "34",
      title: "Conv.rate",
      key: "conversions_from_interactions_rate",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "35",
      title: "AllConversionsValueByConversionDate",
      key: "all_conversions_value_by_conversion_date",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "36",
      title: "Cross-deviceConv.",
      key: "cross_device_conversions",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "37",
      title: "Cost/allConv.",
      key: "cost_per_all_conversions",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "38",
      title: "Cross-sellUnitsSold",
      key: "cross_sell_units_sold",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "39",
      title: "View-throughConv.",
      key: "view_through_conversions",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "40",
      title: "LeadUnitsSold",
      key: "lead_units_sold",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "41",
      title: "UnitsSold",
      key: "units_sold",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "42",
      title: "Value/Conv.",
      key: "value_per_conversion",
      visible: false,
      category: "Conversion",
      isLocked: false,
    },
    {
      id: "43",
      title: "SearchBudgetLostAbsoluteTopImpressionShare",
      key: "search_budget_lost_absolute_top_impression_share",
      visible: false,
      category: "Attribution",
      isLocked: false,
    },
    {
      id: "44",
      title: "CurrentModelAttributedConversionsValuePerCost",
      key: "current_model_attributed_conversions_value_per_cost",
      visible: false,
      category: "Attribution",
      isLocked: false,
    },
    {
      id: "45",
      title: "Bidstrategy",
      key: "bidding_strategy",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      id: "46",
      title: "TargetRoas",
      key: "target_roas",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      id: "47",
      title: "BiddingStrategyType",
      key: "bidding_strategy_type",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      id: "48",
      title: "Conv./Value(CurrentModel)",
      key: "current_model_attributed_conversions_from_interactions_value_per_interaction",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      id: "49",
      title: "TargetCPA",
      key: "target_cpa_micros",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      d: "50",
      title: "SearchexactmatchIS",
      key: "search_exact_match_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "51",
      title: "Impressions",
      key: "impressions",
      visible: true,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "52",
      title: "SearchLostIS(Rank)",
      key: "search_rank_lost_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "53",
      title: "SearchlosttopIS(Rank)",
      key: "search_rank_lost_top_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "54",
      title: "SearchlosttopIS(Budget)",
      key: "search_budget_lost_top_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "55",
      title: "SearchImpr.Share",
      key: "search_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "56",
      title: "ClickShare",
      key: "search_click_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "57",
      title: "SearchlostAbstopIS(Rank)",
      key: "search_rank_lost_absolute_top_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "58",
      title: "SearchTopIS",
      key: "search_top_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "59",
      title: "SearchlostIS(Budget)",
      key: "search_budget_lost_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "60",
      title: "SearchAbstopIS",
      key: "search_absolute_top_impression_share",
      visible: false,
      category: "Competitivemetrics",
      isLocked: false,
    },
    {
      id: "61",
      title: "PhoneCalls",
      key: "phone_calls",
      visible: false,
      category: "Calldetails",
      isLocked: false,
    },
    {
      id: "62",
      title: "PhoneImpressions",
      key: "phone_impressions",
      visible: false,
      category: "Calldetails",
      isLocked: false,
    },
    {
      id: "63",
      title: "PhoneThroughRate",
      key: "phone_through_rate",
      visible: false,
      category: "Calldetails",
      isLocked: false,
    },
    {
      id: "64",
      title: "Avg.Cpm",
      key: "avg_cpm",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "64",
      title: "GroupName",
      key: "group_name",
      visible: false,
      category: "Attributes",
      isLocked: false,
    },
    {
      id: "65",
      title: "Value/AllConversionsByConversionDate",
      key: "value_per_all_conversions_by_conversion_date",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "66",
      title: "AdvertisingChannelSubType",
      key: "advertising_channel_sub_type",
      visible: false,
      category: "Attribution",
      isLocked: false,
    },
    {
      id: "67",
      title: "AdvertisingChannelType",
      key: "advertising_channel_type",
      visible: false,
      category: "Attribution",
      isLocked: false,
    },
    {
      id: "68",
      title: "OptimizationScore",
      key: "optimization_score",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
    {
      id: "69",
      title: "ConversionsByConversionDate",
      key: "conversions_by_conversion_date",
      visible: false,
      category: "Performance",
      isLocked: false,
    },
  ]);

  const PercentColumns = [
    "impressions_percent_diff",
    "costs_percent_diff",
    "clicks_percent_diff",
    "conversion_percent_diff",
    "ctr_percent_diff",
    "cost_per_conv_percent_diff",
    "average_cpc_percent_diff",
  ];

  const [defaultCampaignColumns, setDefaultCampaignColumns] = useState(columns);

  let [viewByColumns, setViewByColumns] = useState([
    {
      id: "1",
      title: "date",
      key: "date",
      visible: true,
      locked: true,
      category: "Recommended",
    },
    {
      id: "2",
      title: "Cost",
      key: "cost",
      visible: true,
      locked: true,
      category: "Recommended",
    },
    {
      id: "3",
      title: "Clicks",
      key: "clicks",
      visible: true,
      locked: true,
      category: "Performance",
    },
    {
      id: "4",
      title: "Impr.",
      key: "impressions",
      visible: true,
      category: "Performance",
      locked: true,
    },
    {
      id: "5",
      title: "Conversions",
      key: "conversions",
      visible: false,
      category: "Conversion",
    },
    {
      id: "6",
      title: "Cost/Conv",
      key: "cost_per_conversion",
      visible: false,
      category: "Conversion",
    },
    {
      id: "7",
      title: "CTR",
      key: "ctr",
      visible: false,
      category: "Performance",
    },
    {
      id: "8",
      title: "Avg CPC",
      key: "average_cpc",
      visible: false,
      category: "Performance",
    },
    {
      id: "9",
      title: "Conversion Rate",
      key: "conversion_rate",
      visible: false,
      category: "Conversion",
    },
  ]);

  const [tableVisible, setTableVisible] = useState(true);
  const [data, setData] = useState([]);
  const [tempdata, setTempData] = useState([]);
  const datePickerRef = useRef(null);
  const [customColumns, setCustomColumns] = useState([]);

  const [showTotal, setTotalShow] = useState(true);

  const [random, setRandom] = useState(Math.random());
  const toggleSegmentType = (type) => {
    toggleDropDownTabs("Hide all");
    setSegmentType(type);
    setRandom(Math.random());
  };
  const [segmentType, setSegmentType] = useState("campaigns");

  useEffect(() => {
    setData([]);
    fetch_custom_columns();

    switch (segmentType) {
      case "campaigns":
        fetch_campaigns();
        break;
      case "default":
        fetchData();
        break;
      case "groups":
        CampaignFilterButton();
        break;
      case "segment_date":
        fetchSegmentData();
        break;
      case "segment_device":
        fetchSegmentDeviceData();
        break;
      case "compare":
        fetchCompareCampaignsData();
        break;
      default:
        break;
    }
  }, [random]);

  const fetchData = async () => {
    const defaultColumns = [
      {
        id: "1",
        title: "Status",
        key: "status",
        visible: true,
        category: "Recommended",
      },
      {
        id: "2",
        title: "Ad",
        key: "headlines",
        visible: true,
        category: "Recommended",
      },
      {
        id: "3",
        title: "Campaign ",
        key: "campaign",
        visible: true,
        category: "Recommended",
      },
      {
        id: "4",
        title: "Ad group",
        key: "ad_group_name",
        visible: true,
        category: "Recommended",
      },
      {
        id: "5",
        title: "status",
        key: "primary_status",
        visible: false,
        category: "Performance",
      },
      {
        id: "6",
        title: "Cost",
        key: "costs",
        visible: true,
        category: "Performance",
      },
      {
        id: "7",
        title: "Labels",
        key: "labels",
        visible: false,
        category: "Attributes",
      },
      {
        id: "8",
        title: "Impr.",
        key: "impressions",
        visible: true,
        category: "Performance",
      },
      {
        id: "9",
        title: "Ad Name",
        key: "ad_name",
        visible: false,
        category: "Attributes",
      },
      {
        id: "10",
        title: "Final Url",
        key: "final_urls",
        visible: true,
        category: "Attributes",
      },
      {
        id: "11",
        title: "Headlines",
        key: "headlines",
        visible: false,
        category: "Attributes",
      },
      {
        id: "12",
        title: "Avg CPC",
        key: "avg_cpc",
        visible: true,
        category: "Performance",
      },
      {
        id: "13",
        title: "Clicks",
        key: "clicks",
        visible: true,
        category: "Performance",
      },
      {
        id: "14",
        title: "Conversions",
        key: "conversions",
        visible: true,
        category: "Conversion",
      },
      {
        id: "15",
        title: "Cost/Conv.",
        key: "cost_per_conv",
        visible: false,
        category: "Conversion",
      },
      {
        id: "16",
        title: "CTR",
        key: "ctr",
        visible: false,
        category: "Performance",
      },
    ];
    try {
      const startDate = format(state[0].startDate, "yyyy-MM-dd");
      const endDate = format(state[0].endDate, "yyyy-MM-dd");

      const response = await fetch(
        "https://api.confidanto.com/get-datewise-campaigns-data",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: 4643036315,
            // email:"exampleuser@gmail.com",
            email: localStorage.getItem("email"),
            start_date: startDate,
            end_date: endDate,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Combine the Final URLs, Descriptions, and Headlines into the Headlines field with styling
      const combinedData = result.map((item) => ({
        ...item,
        headlines: [
          ...item.headlines.map(
            (headline) =>
              `<span class="text-blue-800 cursor-pointer"> ${headline} |</span> `
          ),
          ...item.final_urls.map(
            (url) =>
              `<br/> <span class="text-green-500 cursor-pointer"> ${url}</span> <br/>`
          ),
          ...item.descriptions.map(
            (description) =>
              `<span class="cursor-pointer"> ${description} </span>`
          ),
        ].join(" "),
      }));

      //console.log("combinedData",combinedData);

      setData(combinedData);
      setColumns(defaultColumns);
      setTotal({});
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchSegmentData = async () => {
    axios
      .post("https://api.confidanto.com/get-campaign-device-metrics", {
        customer_id:
          localStorage.getItem("customer_id") == "Not Connected" ||
          localStorage.getItem("customer_id") == null
            ? "4643036315"
            : localStorage.getItem("customer_id"),
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
        group_by: viewByObject.groupBy,
      })
      .then((res) => {
        const columnsAdSegment = [
          {
            key: "date",
            title: "Date",
            visible: true,
            category: "Performance",
          },
          {
            key: "cost",
            title: "Cost",
            visible: true,
            category: "Performance",
          },
          {
            key: "clicks",
            title: "Clicks",
            visible: true,
            category: "Performance",
          },
          {
            key: "impressions",
            title: "Impressions",
            visible: true,
            category: "Performance",
          },
          {
            key: "conversions",
            title: "Conversions",
            visible: true,
            category: "Performance",
          },
          {
            key: "cost_per_conversion",
            title: "Cost/Conv",
            visible: true,
            category: "Performance",
          },
          { key: "ctr", title: "Ctr", visible: true, category: "Performance" },
          {
            key: "average_cpc",
            title: "Avg Cpc",
            visible: true,
            category: "Performance",
          },
          {
            key: "interaction_rate",
            title: "Interaction Rate",
            visible: true,
            category: "Performance",
          },
          {
            key: "interactions",
            title: "Interactions",
            visible: true,
            category: "Performance",
          },
        ];
        console.log(res);
        setData(res.data);
        setColumns(columnsAdSegment);

        setTotal({});
      })
      .catch((err) => {
        console.error("Error Fetching Ads Segment");
      });
  };

  const fetchSegmentDeviceData = async () => {
    axios
      .post("https://api.confidanto.com/get-campaign-device-metrics", {
        customer_id:
          localStorage.getItem("customer_id") == "Not Connected" ||
          localStorage.getItem("customer_id") == null
            ? "4643036315"
            : localStorage.getItem("customer_id"),
        start_date: format(state[0].startDate, "yyyy-MM-dd"),
        end_date: format(state[0].endDate, "yyyy-MM-dd"),
      })
      .then((res) => {
        let adDeviceColumns = [
          {
            id: "1",
            title: "Campaign ID",
            key: "campaign_id",
            visible: true,
            category: "Identification",
          },
          {
            id: "2",
            title: "Campaign Name",
            key: "campaign_name",
            visible: true,
            category: "Identification",
          },
          // {
          //   id: "3",
          //   title: "Ad ID",
          //   key: "ad_id",
          //   visible: true,
          //   category: "Identification",
          // },
          // {
          //   id: "4",
          //   title: "Ad Name",
          //   key: "ad_name",
          //   visible: true,
          //   category: "Identification",
          // },
          {
            id: "5",
            title: "Average CPC",
            key: "average_cpc",
            visible: true,
            category: "Performance",
          },
          {
            id: "6",
            title: "Clicks",
            key: "clicks",
            visible: true,
            category: "Performance",
          },
          {
            id: "7",
            title: "Conversions",
            key: "conversions",
            visible: true,
            category: "Performance",
          },
          {
            id: "8",
            title: "Conversion Rate",
            key: "conversions_rate",
            visible: true,
            category: "Performance",
          },
          {
            id: "9",
            title: "Cost",
            key: "cost",
            visible: true,
            category: "Performance",
          },
          {
            id: "10",
            title: "Cost Per Conversion",
            key: "cost_per_conversion",
            visible: true,
            category: "Performance",
          },
          {
            id: "11",
            title: "CTR",
            key: "ctr",
            visible: true,
            category: "Performance",
          },
          // {
          //   id: "12",
          //   title: "Descriptions",
          //   key: "descriptions",
          //   visible: false,
          //   category: "Content",
          // },
          {
            id: "13",
            title: "Device",
            key: "device",
            visible: true,
            category: "Audience",
          },
          // {
          //   id: "14",
          //   title: "Final URLs",
          //   key: "final_urls",
          //   visible: false,
          //   category: "Destination",
          // },
          // {
          //   id: "15",
          //   title: "Headlines",
          //   key: "headlines",
          //   visible: false,
          //   category: "Content",
          // },
          {
            id: "16",
            title: "Impressions",
            key: "impressions",
            visible: true,
            category: "Performance",
          },
          {
            id: "17",
            title: "Interaction Rate",
            key: "interaction_rate",
            visible: true,
            category: "Performance",
          },
          {
            id: "18",
            title: "Interactions",
            key: "interactions",
            visible: true,
            category: "Performance",
          },
        ];

        setColumns(adDeviceColumns);
        setData(res.data);
        setTotal({});
      })
      .catch((err) => {
        console.error("Error Fetching Ads Segment Device");
      });
  };
  const normalizeCampaigns = (campaigns) => {
    return campaigns.map((campaign) => ({
      ...campaign,
      id: campaign.id || campaign.campaign_id,
    }));
  };

  const fetch_custom_columns = () => {
    axios
      .post("https://api.confidanto.com/custom_columns/get-custom-columns", {
        email: localStorage.getItem("email"),
      })
      .then((res) => {
        let resData = res.data.data;
        let temp = resData.map((i) => {
          let obj = {
            id: i.id,
            title: i.custom_column,
            key: i.custom_column,
            category: "Custom Columns",
            visible: false,
          };
          console.log("ci", i);

          return obj;
        });
        console.log("temp: ", temp);

        setCustomColumns(temp);
        setColumns([...columns, ...temp]);
        setDefaultCampaignColumns([...columns, ...temp]);
        console.log("custom columns: ", customColumns, columns);
      });
  };

  const fetch_campaigns = async () => {
    const customerId = localStorage.getItem("customer_id") || "4643036315";

    let url = "https://auth.confidanto.com/fetch/fetch_campaigns";
    let requestBody = {
      customer_id: customerId,
      start_date: format(state[0].startDate, "yyyy-MM-dd"),
      end_date: format(state[0].endDate, "yyyy-MM-dd"),
    };

    if (customerId === "7948821642") {
      url = "https://auth.confidanto.com/fetch_dummy/campaigns";
      requestBody = {
        customer_id: "7948821642",
        start_date: "2024-04-20",
        end_date: "2027-09-22",
      };
    }

    try {
      const response = await axios.post(url, requestBody);
      const data = response.data;

      setData(data);
      setColumns(defaultCampaignColumns);
      setTempData(data);
      setTotal({});
      setTotalShow(false);
      setTotalShow(true);
    } catch (err) {
      console.error("FETCH ERROR", err);
    }
  };

  // Checkbox code
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const downloadData = (format) => {
    const visibleColumns = columns.filter((col) => col.visible);
    const headers = visibleColumns.map((col) => col.title);
    const rows = data
      .filter((item) => checkDataByFilter(item))
      .map((item) => visibleColumns.map((col) => item[col.key]));

    if (format === "pdf") {
      const doc = new jsPDF();
      autoTable(doc, { head: [headers], body: rows });
      doc.save("data.pdf");
    } else if (format === "csv" || format === "excel") {
      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      if (format === "csv") {
        XLSX.writeFile(wb, "data.csv");
      } else {
        XLSX.writeFile(wb, "data.xlsx");
      }
    } else if (format === "xml") {
      const xmlContent = `
        <root>
          ${data
            .map(
              (item) => `
            <row>
              ${visibleColumns
                .map((col) => `<${col.key}>${item[col.key]}</${col.key}>`)
                .join("")}
            </row>
          `
            )
            .join("")}
        </root>
      `;
      const blob = new Blob([xmlContent], { type: "application/xml" });
      FileSaver.saveAs(blob, "data.xml");
    } else if (format === "google_sheets") {
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = `https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing`;
      window.open(url, "_blank");
      FileSaver.saveAs(blob, "data.csv");
    }

    setShowDownloadOptions(false);
  };

  const handleCheckboxChange = (id, campaign_name) => {
    const isAlreadySelected = selectedRows.some((row) => row.id === id);

    if (isAlreadySelected) {
      // Remove only the clicked row
      const updatedRows = selectedRows.filter((row) => row.id !== id);
      setSelectedRows(updatedRows);
    } else {
      // Add only the clicked row
      setSelectedRows([...selectedRows, { id, campaign_name }]);
    }
  };

  // Select All toggle
  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedRows([]);
    } else {
      // Select all
      const allRows = data.map((item) => ({
        id: item.id,
        campaign_name: item.name,
      }));
      setSelectedRows(allRows);
    }
    setSelectAll(!selectAll);
  };

  const fetchGroups = async () => {
    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/fetch-groups",
        {
          email: localStorage.getItem("email"),
          customer_id:
            localStorage.getItem("customer_id") == null ||
            localStorage.getItem("customer_id") == "Not Connected"
              ? "4643036315"
              : localStorage.getItem("customer_id"),
        }
      );

      if (response.data.groups) {
        const groupsData = response.data.groups;
        setSavedGroups(groupsData);

        // Extract group IDs
        const names = groupsData.map((group) => group.group_name);
        setGroupNames(names);
      }
    } catch (error) {
      console.error("Error fetching campaign groups:", error);
    }
  };

  const handleCreateGroup = async () => {
    setIsVisibleGroupInput(true);
  };

  const handleGroupSave = async () => {
    const groupData = {
      group_name: groupName,
      campaign_ids: selectedRows.map((row) => row.id),
      campaign_names: selectedRows.map((row) => row.campaign_name),
      number_of_campaigns: selectedRows.length,
      email: localStorage.getItem("email"), // or any other way to get the email
      customer_id:
        localStorage.getItem("customer_id") == null ||
        localStorage.getItem("customer_id") == "Not Connected"
          ? "4643036315"
          : localStorage.getItem("customer_id"),
    };

    try {
      const response = await axios.post(
        "https://api.confidanto.com/campaign-group/create",
        groupData
      );
      if (response.status === 200) {
        // Success: group created
        setIsDialogOpenCreateGroup(true);
        setIsVisibleGroupInput(false);
        setSelectedRows([]);
        fetchGroups();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Group name already exists. Please choose a different name.");
      } else {
        // Other errors
        console.error("Error inserting data:", error);
        alert("Failed to insert data");
      }
    }
  };

  const [groupNames, setGroupNames] = useState([]);
  const [savedGroups, setSavedGroups] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isGroupListVisible, setIsGroupListVisible] = useState(false);
  const groupListRef = useRef(null); // Ref for the group name list
  const segmentButtonRef = useRef(null); // Ref for the "Segment" button
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroups, setShowGroups] = useState(false);

  const [showViewBy, setShowViewBy] = useState(false);
  const [showViewBySection, setShowViewBySection] = useState(false);
  const [showGroupBySection, setShowGroupBySection] = useState(false);

  const [showFilterBy, setShowFilterBy] = useState(false);

  let today = new Date();
  let priorDate = new Date(today);
  priorDate.setDate(today.getDate() - 30);

  today = today.toJSON().slice(0, 10).replace(/-/g, "-");
  priorDate = priorDate.toJSON().slice(0, 10).replace(/-/g, "-");

  // //console.log('cur date',today,priorDate);
  let [viewByObject, setViewbyObject] = useState({
    groupBy: "date",
    startDate: priorDate,
    endDate: today,
  });

  const changeGroupbyView = (newGroupBy) => {
    let newObj = viewByObject;
    newObj.groupBy = newGroupBy;
    setViewbyObject(newObj);

    if (newGroupBy == "none") {
      setShowViewBySection(false);
      setTableVisible(true);
    } else if (newGroupBy == "device") {
      setSegmentType("segment_device");
      setRandom(Math.random());
    } else {
      setShowViewBySection(true);
      setTableVisible(false);
    }

    // toggleFilterDropdown();
  };
  const changeDatebyView = (startdate, enddate) => {
    let newObj = viewByObject;
    newObj.startDate = startdate;
    newObj.endDate = enddate;

    setViewbyObject(newObj);
  };

  today = new Date();
  let firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const [state, setState] = useState([
    {
      startDate: firstDayOfMonth,
      endDate: today,
      // startDate: new Date(2024,9,1),
      // endDate: new Date(2025,1,2),
      key: "selection",
    },
  ]);
  useEffect(() => {
    fetchGroups();
  }, []);

  const filterButtonRef = useRef(null);

  const [selectedFilters, setSelectedFilters] = useState({ CampaignType: [] });
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef(null);
  const filterOptions = [
    { name: "Search", value: "SEARCH" },
    { name: "Display", value: "DISPLAY" },
    { name: "Youtube", value: "VIDEO" },
    { name: "P-Max", value: "PERFORMANCE_MAX" },
  ];

  const applyFilters = () => {
    let tempdata = data;

    setData([]);

    axios
      .post("https://api.confidanto.com/get-campaigns-by-campaigns-type", {
        // customer_id:4643036315,
        customer_id:
          localStorage.getItem("customer_id") == null ||
          localStorage.getItem("customer_id") == "Not Connected"
            ? "4643036315"
            : localStorage.getItem("customer_id"),

        campaign_type: selectedFilters.CampaignType,
      })
      .then((res) => {
        //console.log(res.data);
        setData(res.data);
        setShowFilterDropdown(false);
      })
      .error((e) => {
        setData(tempdata);
      });
    // setData([])
  };

  const handleCheckboxFilter = (filterType, value, checked) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };

      if (checked) {
        updatedFilters[filterType] = [
          ...(updatedFilters[filterType] || []),
          value,
        ];
      } else {
        updatedFilters[filterType] = updatedFilters[filterType].filter(
          (v) => v !== value
        );
      }

      return updatedFilters;
    });
  };

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  useEffect(() => {
    if (selectedGroup) {
      const groupData = savedGroups.find(
        (group) => group.group_name === selectedGroup
      );

      if (groupData) {
        // Convert campaignIds to integers for comparison
        const campaignIds = groupData.campaign_ids.map((id) =>
          parseInt(id, 10)
        );

        // Filter the campaigns based on the campaign IDs
        const filteredCampaigns = data.filter((campaign) =>
          campaignIds.includes(campaign.id)
        );

        // Set the filtered data state
        setFilteredData(filteredCampaigns);
      }
    }
  }, [selectedGroup, savedGroups, data]);

  const formatDateDisplay = (date) => {
    if (isToday(date)) {
      return `Today ${format(date, "MMM dd, yyyy")}`;
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, "MMM dd, yyyy")}`;
    } else {
      return format(date, "MMM dd, yyyy");
    }
  };

  const [dateChanged, setDateChanged] = useState(false);
  const formatButtonLabel = () => {
    const { startDate, endDate } = state[0];

    // Check if start and end dates are in the same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      // Format as 'Nov 1 - 5, 2024'
      // console.log(" Knjghyfctdxrdfghj 1",startDate, endDate);
      return `${format(startDate, "MMM d")} - ${format(endDate, "d, yyyy")}`;
    } else {
      // Format as 'Nov 1, 2024 - Dec 5, 2024' if they differ
      // console.log(" Knjghyfctdxrdfghj 2",startDate, endDate);
      return `${format(startDate, "MMM d, yyyy")} - ${format(
        endDate,
        "MMM d, yyyy"
      )}`;
    }
  };

  const handleGroupClick = (name) => {
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    let requestBody = {
      // customer_id: 4643036315,
      customer_id: localStorage.getItem("customer_id"),
      email: localStorage.getItem("email"),
    };

    if (startDate === endDate) {
      // Single date request
      requestBody = { ...requestBody, single_date: startDate };
    } else {
      // Custom date range request
      requestBody = {
        ...requestBody,
        start_date: startDate,
        end_date: endDate,
      };
    }

    changeDatebyView(startDate, endDate);
    // Fetch data based on selected date range
    fetch("https://api.confidanto.com/get-datewise-campaign-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((responseData) => {
        //console.log("Fetched data:", responseData); // Log response in console
        setData(responseData); // Update the table data
        setColumns([...defaultCampaignColumns, ...customColumns]);

        Object.keys(total).forEach((key) => delete total[key]);

        setShowDatePicker(false);

        // Change Date Format
        dateFormatFunction(startDate, endDate);
        setDateChanged(true);
        setIsSelectInputVisible(true);
      })
      .catch((error) => {
        console.error("Error fetching ad group data:", error);
      });
    setSelectedGroup(name);
    setIsGroupListVisible(false); // Optionally hide the dropdown after selection
  };

  const toggleGroupListVisibility = () => {
    setIsGroupListVisible(!isGroupListVisible);
  };
  // Function to close the group name list when clicking outside
  const handleClickOutside = (event) => {
    if (
      groupListRef.current &&
      !groupListRef.current.contains(event.target) &&
      !segmentButtonRef.current.contains(event.target)
    ) {
      setIsGroupListVisible(false);
    }
  };

  let segmentBoxRef = useRef(null);
  let categoryBoxRef = useRef(null);
  let downloadBoxRef = useRef(null);
  let columnBoxRef = useRef(null);
  useEffect(() => {
    // Handle clicks outside of the datepicker
    const handleClickOutside = (event) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        // Calendar
        // setShowDatePicker(false)
        setShowDatePicker(false);
      }
      if (
        segmentBoxRef.current &&
        !segmentBoxRef.current.contains(event.target)
      ) {
        // // Segment // toggleGroupListVisibility
        // setIsGroupListVisible(false)
        setIsGroupListVisible(false);
      }

      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target)
      ) {
      }

      if (
        categoryBoxRef.current &&
        !categoryBoxRef.current.contains(event.target)
      ) {
        setGroupDropdownVisible(false);
      }

      if (
        downloadBoxRef.current &&
        !downloadBoxRef.current.contains(event.target)
      ) {
        // // Download
        // setShowDownloadOptions(false)
        setShowDownloadOptions(false);
      }

      if (
        columnBoxRef.current &&
        !columnBoxRef.current.contains(event.target)
      ) {
        // // Columns
        // setShowColumnsMenu(false)
        setShowColumnsMenu(false);
      }

      if (
        wholeColumnFilterRef.current &&
        !wholeColumnFilterRef.current.contains(event.target)
      ) {
        setFilterColumnsBoxVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCompareCampaignsData = () => {
    const CurrstartDate = format(state[0].startDate, "yyyy-MM-dd");
    const CurrendDate = format(state[0].endDate, "yyyy-MM-dd");
    const PrevstartDate = format(state[1].startDate, "yyyy-MM-dd");
    const PrevendDate = format(state[1].endDate, "yyyy-MM-dd");

    console.log(CurrstartDate, CurrendDate, PrevstartDate, PrevendDate);

    const RequestBody = {
      customer_id: "4643036315",
      start_date: CurrstartDate, // curr date
      end_date: CurrendDate,
      previous_start_date: PrevstartDate, //prev date
      previous_end_date: PrevendDate,
    };
    let tempData = data;
    setShowDatePicker(false);
    setData([]);
    axios
      .post(
        "https://api.confidanto.com/get-datewise-campaign-data",
        RequestBody
      )
      .then((res) => {
        console.log("IUYREXRDCFV", res.data);
        setData(res.data);

        let newColumns = [
          {
            id: "1",
            title: "Campaign	",
            key: "name",
            visible: true,
            category: "Recommended",
          },
          {
            id: "2",
            title: "Status",
            key: "status",
            visible: true,
            category: "Recommended",
          },
          {
            id: "3",
            title: "Budget",
            key: "budget_micros",
            visible: true,
            category: "Recommended",
          },
          {
            id: "4",
            title: "Impr.",
            key: "impressions",
            visible: true,
            category: "Performance",
          },
          {
            id: "5",
            title: "Impr. ",
            key: "impressions_percent_diff",
            visible: true,
            category: "Performance",
            perentage_diff: true,
          },
          {
            id: "6",
            title: "Cost",
            key: "costs",
            visible: true,
            category: "Performance",
          },
          {
            id: "7",
            title: `Cost `,
            key: "costs_percent_diff",
            visible: true,
            category: "Performance",
            perentage_diff: true,
          },
          {
            id: "8",
            title: "Clicks",
            key: "clicks",
            visible: true,
            category: "Performance",
          },
          {
            id: "9",
            title: "Clicks ",
            key: "clicks_percent_diff",
            visible: true,
            category: "Performance",
            perentage_diff: true,
          },
          {
            id: "10",
            title: "Conversion",
            key: "conversion",
            visible: true,
            category: "Conversion",
          },
          {
            id: "11",
            title: "Conversion ",
            key: "conversion_percent_diff",
            visible: true,
            category: "Conversion",
            perentage_diff: true,
          },
          {
            id: "12",
            title: "Ctr",
            key: "ctr",
            visible: true,
            category: "Performance",
          },
          {
            id: "13",
            title: "Ctr ",
            key: "ctr_percent_diff",
            visible: true,
            category: "Performance",
            perentage_diff: true,
          },
          {
            id: "14",
            title: "Cost/Conv",
            key: "cost_per_conv",
            visible: true,
            category: "Conversion",
          },
          {
            id: "15",
            title: "Cost/Conv ",
            key: "cost_per_conv_percent_diff",
            visible: true,
            category: "Conversion",
            perentage_diff: true,
          },
          {
            id: "16",
            title: "Avg Cpc",
            key: "average_cpc",
            visible: true,
            category: "Performance",
          },
          {
            id: "17",
            title: "Avg Cpc ",
            key: "average_cpc_percent_diff",
            visible: true,
            category: "Performance",
            perentage_diff: true,
          },
        ];

        Object.keys(total).forEach((key) => delete total[key]);
        setColumns(newColumns);
      })
      .catch((res) => {
        console.log("Error Loading Compare Data");
        setData(tempData);
      });
  };

  const fetchAdGroupData = () => {
    if (state.length > 1) {
      toggleSegmentType("compare");
      // fetchCompareCampaignsData()
    } else {
      toggleSegmentType(segmentType);
      // fetchDateCampaignsData()
    }
  };

  const applyChanges = () => {
    setShowColumnsMenu(false);
    // setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    // setTableVisible(true);
  };
  const toggleColumnsMenu = () => {
    setShowColumnsMenu(!showColumnsMenu);
    // setTableVisible(false);
  };
  const toggleDatePicker = () => {
    // setDateChanged(true)
    setShowDatePicker(!showDatePicker);
  };
  const [selectedGroupIds, SetSelectedGroupIds] = useState([]);
  const handleGroupCheckboxChange = (e) => {
    let checkedId = e.target.value;
    if (e.target.checked) {
      SetSelectedGroupIds([...selectedGroupIds, checkedId]);
    } else {
      SetSelectedGroupIds(selectedGroupIds.filter((id) => id !== checkedId));
    }
  };
  const deleteCustomColumn = (id, name) => {
    let con = window.confirm(`Delete ${name} Column?`);

    if (con) {
      axios
        .post(
          "https://api.confidanto.com/custom_columns/delete-custom-column",
          {
            email: localStorage.getItem("email"),
            id: id,
          }
        )
        .then((res) => {
          // console.log(res.data);
          let newColumns = columns.filter((col) => col.id != id);
          setColumns(newColumns);
          // console.log("old Cols", columns);
          // console.log("new Cols", newColumns);
          // setRandom(Math.random())
        })
        .catch((error) => {
          console.log(error);
        });
    }
    // console.log(id, name)
  };
  const ColumnItem = ({ column, index, toggleVisibility, category }) => {
    return (
      <div className="flex flex-row items-center justify-between  p-2 mb-1 rounded cursor-pointer bg-white shadow-sm hover:bg-slate-100">
        <div className="">
          <input
            type="checkbox"
            checked={column.visible}
            onChange={() => toggleVisibility(column.key)}
            className="mr-2"
            disabled={column.locked}
          />
          <span>{column.title}</span>
        </div>
        {category == "Custom Columns" && (
          <>
            <button
              onClick={() => {
                deleteCustomColumn(column.id, column.title);
              }}
            >
              <RiDeleteBin6Line />
            </button>
          </>
        )}
      </div>
    );
  };
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
    Object.keys(total).forEach((key) => delete total[key]);
  };
  const toggleViewColumnColumnVisibility = (key) => {
    setViewByColumns(
      viewByColumns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );
    Object.keys(total).forEach((key) => delete total[key]);
  };

  const [isSelectInputVisible, setIsSelectInputVisible] = useState(true);
  const CampaignFilterButton = async () => {
    const selectedGroupObjs = savedGroups.filter((d) => {
      return selectedGroupIds.includes(d.group_id.toString());
    });
    const groupNames = selectedGroupObjs.map((d) => d.group_name);
    console.log(groupNames, selectedGroupObjs);

    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    let requestBody = {
      customer_id: "4643036315",
      group_names: groupNames,
      email: localStorage.getItem("email"),
    };

    if (startDate === endDate) {
      requestBody = { ...requestBody, single_date: startDate };
    } else {
      requestBody = {
        ...requestBody,
        start_date: startDate,
        end_date: endDate,
      };
    }

    setData([]);
    // setIsLoading(true)
    const response = await axios.post(
      "https://api.confidanto.com/get-grouped-campaign-metrics",
      requestBody
    );

    const summarizedMetrics = response.data.metrics.map((group) => {
      let totalObj = group.metrics[1].totals;

      // console.log("Total obj: ",totalObj);

      return {
        group_name: group.group_name,
        // metrics: [totalObj]
        ...totalObj,
      };
    });

    let groupColumns = [
      {
        title: "Group Name",
        category: "Performance",
        visible: true,
        key: "group_name",
      },
      {
        title: "Absolute Top Impression Percentage",
        category: "Performance",
        visible: false,
        key: "absolute_top_impression_percentage",
      },
      {
        title: "All Conversions Value By Conversion Date",
        category: "Performance",
        visible: false,
        key: "all_conversions_value_by_conversion_date",
      },
      {
        title: "Avg. Cart Size",
        category: "Performance",
        visible: false,
        key: "average_cart_size",
      },
      {
        title: "Avg. Cost",
        category: "Performance",
        visible: false,
        key: "average_cost",
      },
      {
        title: "Avg. Cpa",
        category: "Performance",
        visible: false,
        key: "average_cpa",
      },
      {
        title: "Avg. Cpc",
        category: "Performance",
        visible: false,
        key: "average_cpc",
      },
      {
        title: "Avg. Cpm",
        category: "Performance",
        visible: false,
        key: "average_cpm",
      },
      {
        title: "Avg. Target Roas",
        category: "Performance",
        visible: false,
        key: "average_target_roas",
      },
      {
        title: "Clicks",
        category: "Performance",
        visible: true,
        key: "clicks",
      },
      {
        title: "Conversion From Interactions Rate",
        category: "Performance",
        visible: false,
        key: "conversion_from_interactions_rate",
      },
      {
        title: "Conversion Rate",
        category: "Performance",
        visible: false,
        key: "conversion_rate",
      },
      {
        title: "Conversion Value",
        category: "Performance",
        visible: false,
        key: "conversion_value",
      },
      {
        title: "Conversions",
        category: "Performance",
        visible: true,
        key: "conversions",
      },
      {
        title: "Conversions By Conversion Date",
        category: "Performance",
        visible: false,
        key: "conversions_by_conversion_date",
      },
      {
        title: "Cost Of Goods Sold",
        category: "Performance",
        visible: false,
        key: "cost_of_goods_sold",
      },
      {
        title: "Cost Per Conversion",
        category: "Performance",
        visible: false,
        key: "cost_per_conversion",
      },
      { title: "Costs", category: "Performance", visible: false, key: "costs" },
      {
        title: "Cross Device Conversions",
        category: "Performance",
        visible: false,
        key: "cross_device_conversions",
      },
      {
        title: "Cross Device Conversions Value",
        category: "Performance",
        visible: false,
        key: "cross_device_conversions_value",
      },
      {
        title: "Cross Sell Cost Of Goods Sold",
        category: "Performance",
        visible: false,
        key: "cross_sell_cost_of_goods_sold",
      },
      {
        title: "Cross Sell Gross Profit",
        category: "Performance",
        visible: false,
        key: "cross_sell_gross_profit",
      },
      {
        title: "Cross Sell Revenue",
        category: "Performance",
        visible: false,
        key: "cross_sell_revenue",
      },
      {
        title: "Cross Sell Units Sold",
        category: "Performance",
        visible: false,
        key: "cross_sell_units_sold",
      },
      { title: "Ctr", category: "Performance", visible: true, key: "ctr" },
      {
        title:
          "Current Model Attributed Conversions From Interactions Value Per Interaction",
        category: "Performance",
        visible: false,
        key: "current_model_attributed_conversions_from_interactions_value_per_interaction",
      },
      {
        title: "Current Model Attributed Conversions Value Per Cost",
        category: "Performance",
        visible: false,
        key: "current_model_attributed_conversions_value_per_cost",
      },
      {
        title: "Gross Profit",
        category: "Performance",
        visible: false,
        key: "gross_profit",
      },
      {
        title: "Gross Profit Margin",
        category: "Performance",
        visible: false,
        key: "gross_profit_margin",
      },
      {
        title: "Impressions",
        category: "Performance",
        visible: false,
        key: "impressions",
      },
      {
        title: "Interactions",
        category: "Performance",
        visible: false,
        key: "interactions",
      },
      {
        title: "Interactions Rate",
        category: "Performance",
        visible: false,
        key: "interactions_rate",
      },
      {
        title: "Invalid Click Rate",
        category: "Performance",
        visible: false,
        key: "invalid_click_rate",
      },
      {
        title: "Invalid Clicks",
        category: "Performance",
        visible: false,
        key: "invalid_clicks",
      },
      {
        title: "Lead Cost Of Goods Sold",
        category: "Performance",
        visible: false,
        key: "lead_cost_of_goods_sold",
      },
      {
        title: "Lead Revenue",
        category: "Performance",
        visible: false,
        key: "lead_revenue",
      },
      {
        title: "Lead Units Sold",
        category: "Performance",
        visible: false,
        key: "lead_units_sold",
      },
      {
        title: "New Customer Lifetime Value",
        category: "Performance",
        visible: false,
        key: "new_customer_lifetime_value",
      },
      {
        title: "Revenue",
        category: "Performance",
        visible: false,
        key: "revenue",
      },
      {
        title: "Top Impression Percentage",
        category: "Performance",
        visible: false,
        key: "top_impression_percentage",
      },
      {
        title: "Units Sold",
        category: "Performance",
        visible: false,
        key: "units_sold",
      },
      {
        title: "Value Per Conversion",
        category: "Performance",
        visible: false,
        key: "value_per_conversion",
      },
      {
        title: "View Through Conversions",
        category: "Performance",
        visible: false,
        key: "view_through_conversions",
      },
    ];

    Object.keys(total).forEach((key) => delete total[key]);
    setColumns(groupColumns);
    setData(summarizedMetrics);

    console.log("Response: ", summarizedMetrics);
    setIsSelectInputVisible(false);
  };

  const GroupFilterButton = () => {
    const selectedGroupObjs = savedGroups.filter((d) => {
      return selectedGroupIds.includes(d.group_id.toString());
    });
    let groupCampaignIds = [];
    selectedGroupObjs.map((obj) => {
      groupCampaignIds.push(...obj.campaign_ids);
    });
    const tempFilteredCampaigns = data.filter((obj) => {
      return groupCampaignIds.includes(obj.id.toString());
    });
    console.log(selectedGroupObjs, groupCampaignIds, tempFilteredCampaigns);

    setShowGroupBySection(!showGroupBySection);
    setTableVisible(!tableVisible);
  };
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  let [total, setTotal] = useState({});
  let [dateFormatText, setDateFormatText] = useState("This Month");

  function dateFormatFunction(startDate, endDate) {
    let tempVal = "Custom";

    // today yesterday
    if (startDate == endDate) {
      if (isToday(startDate)) {
        tempVal = "Today";
      } else if (isYesterday(startDate)) {
        tempVal = "Yesterday";
      } else {
        // show Custom
        // tempVal = startDate
      }
    }

    // this month, last month
    let thisMonthfirstDay = format(new Date(year, month, 1), "yyyy-MM-dd");
    let thisMonthlastDay = format(new Date(year, month + 1, 0), "yyyy-MM-dd");

    let lastMonthfirstDay = format(new Date(year, month - 1, 1), "yyyy-MM-dd");
    let lastMonthlastDay = format(new Date(year, month, 0), "yyyy-MM-dd");

    if (startDate == thisMonthfirstDay && endDate == thisMonthlastDay) {
      setDateChanged(false);
      tempVal = "This Month";
    }

    if (startDate == lastMonthfirstDay && endDate == lastMonthlastDay) {
      tempVal = "Last Month";
    }

    // This Week
    let first = d.getDate() - d.getDay(); // First day is the day of the month - the day of the week
    let last = first + 6; // last day is the first day + 6

    let thisWeekFirstDay = format(new Date(d.setDate(first)), "yyyy-MM-dd");
    let thisWeekLastDay = format(new Date(d.setDate(last)), "yyyy-MM-dd");

    // Get Last Week
    first = d.getDate() - d.getDay(); // First day is the day of the month - the day of the week
    first = first - 7;
    last = first + 6; // last day is the first day + 6

    let lastWeekFirstDay = format(new Date(d.setDate(first)), "yyyy-MM-dd");

    if (startDate == thisWeekFirstDay && endDate == thisWeekLastDay) {
      tempVal = "This Week";
    }

    if (startDate == lastWeekFirstDay) {
      const diffTime = Math.abs(new Date(startDate) - new Date(endDate));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays == 6) {
        tempVal = "Last Week";
      }
    }

    setDateFormatText(tempVal);
  }

  function compareDateRanges() {
    let tempStates = state;

    if (state.length > 1) {
      setState([tempStates[0]]);
    } else {
      let newState = {
        startDate: new Date(year, month - 1, 1),
        endDate: new Date(year, month, 0),
        key: "compare",
      };

      setState([...tempStates, newState]);
    }

    console.log(state);
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function handleSelectDateRanges(ranges) {
    let key = Object.keys(ranges)[0]; //curr key
    let values = Object.values(ranges)[0]; //curr obj vals

    // Set Selection Date
    // if(key == "selection"){
    for (const i of state) {
      if (i.key == key) {
        i.startDate = values.startDate;
        i.endDate = values.endDate;
      }
    }
    setState(state);
  }

  const uniqueCategories = Array.from(
    new Set(columns.map((col) => col.category))
  );
  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };
  const handleCategoryClick = (category) => {
    setGroupDropdownVisible(!isGroupDropdownVisible);
  };

  const toggleDropDownTabs = (type) => {
    // Calendar
    setShowDatePicker(false);
    // Segment // toggleGroupListVisibility
    setIsGroupListVisible(false);
    // Filter
    setShowFilterDropdown(false);
    // Category
    setGroupDropdownVisible(false);
    // Download
    setShowDownloadOptions(false);
    // Columns
    setShowColumnsMenu(false);

    if (type == "Calendar") {
      setShowDatePicker(!showDatePicker);
    } else if (type == "Segment") {
      setIsGroupListVisible(!isGroupListVisible);
    } else if (type == "Filter") {
      setShowFilterDropdown(!showFilterDropdown);
    } else if (type == "Category") {
      setGroupDropdownVisible(!isGroupDropdownVisible);
    } else if (type == "Download") {
      setShowDownloadOptions(!showDownloadOptions);
    } else if (type == "Columns") {
      // Columns
      setShowColumnsMenu(!showColumnsMenu);
    } else {
      // /hide all
    }
  };

  // Complex Filter
  const [filterColumnsBoxVisible, setFilterColumnsBoxVisible] = useState(false);
  const [filterFormVisible, setFilterFormVisible] = useState(false);
  const [stringFilterFormVisible, setStringFilterFormVisible] = useState(false);
  const [booleanFilterFormVisible, setBooleanFilterFormVisible] =
    useState(false);

  const [filterIdIncrement, setFilterIdIncrement] = useState(1);
  const toggleFormFilterButton = () => {
    setFilterColumnsBoxVisible(!filterColumnsBoxVisible);
    setFilterFormVisible(false);
    setBooleanFilterFormVisible(false);
    setStringFilterFormVisible(false);

    setFilterFormColId(0);
    setFilterFormColName("title");
    setFilterFormColKey("key");
  };
  const setFormFilter = (key, title, id) => {
    console.log(key, id);
    setFilterFormColId(id);
    setFilterFormColName(title);
    setFilterFormColKey(key);

    setFilterColumnsBoxVisible(false);

    if (stringColumns.indexOf(key) != -1) {
      setStringFilterFormVisible(true);
    } else if (booleanColumns.indexOf(key) != -1) {
      setBooleanFilterFormVisible(true);
    } else {
      setFilterFormVisible(true);
    }
  };

  const [stringColumns, setStringColumns] = useState(["name"]);
  const [booleanColumns, setBooleanColumns] = useState(["status"]);

  const [filterFormColId, setFilterFormColId] = useState(0);
  const [filterFormColName, setFilterFormColName] = useState("title");
  const [filterFormColKey, setFilterFormColKey] = useState("key");

  const closeFilterFormBox = () => {
    toggleFormFilterButton();
    setFilterColumnsBoxVisible(false);
  };

  let wholeColumnFilterRef = useRef(null);

  let filterValueInputRef = useRef(null);
  let filterCompareValueInputRef = useRef(null);

  let filterStringInputRef = useRef(null);
  let booleanInputRef = useRef(null);

  const applyFilterForm = () => {
    if (stringColumns.indexOf(filterFormColKey) != -1) {
      // string
      // For String
      let stringValueInput = filterStringInputRef.current.value;

      console.log(stringValueInput, filterFormColKey);

      let obj = {
        title: filterFormColName,
        key: filterFormColKey,
        // id:filterFormColId,
        id: filterIdIncrement,
        condition: "contains",
        sign: "contains",
        type: "String",
        value: stringValueInput,
      };

      setFilterArray([...filterArray, obj]);
    } else if (booleanColumns.indexOf(filterFormColKey) != -1) {
      // boolean
      // For Boolean

      let booleanValueInput = booleanInputRef.current.value;

      console.log(booleanValueInput, filterFormColKey);

      let obj = {
        title: filterFormColName,
        key: filterFormColKey,
        id: filterIdIncrement,
        condition: "is",
        sign: "is",
        type: "Boolean",
        value: booleanValueInput,
      };
      setFilterArray([...filterArray, obj]);
    } else {
      // for metric
      // For Metric
      let valueInput = filterValueInputRef.current.value;
      let compareInput = filterCompareValueInputRef.current.value;
      let Sign = "=";

      if (compareInput == "Greater") {
        Sign = ">";
      } else if (compareInput == "Lower") {
        Sign = "<";
      }

      let obj = {
        title: filterFormColName,
        key: filterFormColKey,
        id: filterIdIncrement,
        condition: compareInput,
        sign: Sign,
        type: "Number",
        value: valueInput,
      };

      setFilterArray([...filterArray, obj]);
      console.log(valueInput, compareInput, obj, filterArray);
    }
    setStringFilterFormVisible(false);
    setBooleanFilterFormVisible(false);
    setFilterFormVisible(false);

    setFilterColumnsBoxVisible(false);

    let temp = filterIdIncrement + 1;
    setFilterIdIncrement(temp);
  };

  const [filterArray, setFilterArray] = useState([]);

  function checkDataByFilter(data) {
    let finalReturnValue = true;

    filterArray.map((fil) => {
      // console.log(data[fil.key], fil.value,data[fil.key] < fil.value);
      // For Boolean
      if (fil.type == "Boolean") {
        console.log(data[fil.key], fil.value, data[fil.key] == fil.value);

        if (data[fil.key] != fil.value) {
          finalReturnValue = false;
        }
      }

      // For String
      if (fil.type == "String") {
        if (fil.condition == "contains") {
          console.log(
            data[fil.key],
            fil.value,
            data[fil.key].includes(fil.value)
          );
          if (!data[fil.key].toLowerCase().includes(fil.value.toLowerCase())) {
            finalReturnValue = false;
          }
        }
      }
      // For Metric
      if (fil.type == "Number") {
        if (fil.condition == "Greater") {
          if (data[fil.key] < fil.value) {
            finalReturnValue = false;
            return false;
          }
        } else if (fil.condition == "Lower") {
          if (data[fil.key] > fil.value) {
            finalReturnValue = false;
            return false;
          }
        } else {
          // equal
          if (data[fil.key] != fil.value) {
            finalReturnValue = false;
            return false;
          }
        }
      }
    });
    // console.log(data);
    return finalReturnValue;
  }

  const removeFilterFromArray = (id) => {
    let newFilterList = filterArray.filter((fil) => fil.id != id);
    setFilterArray(newFilterList);
  };

  // Asc Desc Buttons
  // true=Asc, False = Desc
  const [currentOrderType, setCurrentOrderType] = useState(true);
  const [currentOrderVariable, setCurrentOrderVariable] = useState(null);

  const toggleOrderType = () => {
    setCurrentOrderType(!currentOrderType);
  };
  const toggleCurrentOrderVariable = (type) => {
    setCurrentOrderVariable(type);
  };

  const changeOrderTypeCampaign = (type) => {
    // arrow ui
    if (type != currentOrderVariable) {
      toggleOrderType();
    }
    toggleOrderType();
    toggleCurrentOrderVariable(type);

    // sort data
    let temp = data;
    let tempDataValue = temp[0][type];

    console.log(
      type,
      currentOrderVariable,
      currentOrderType,
      tempDataValue,
      typeof tempDataValue
    );
    if (currentOrderType) {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => a[type] - b[type]);
      } else {
        data.sort((a, b) => a[type].localeCompare(b[type]));
      }
    } else {
      if (typeof tempDataValue == "number") {
        temp = temp.sort((a, b) => b[type] - a[type]);
      } else {
        data.sort((a, b) => b[type].localeCompare(a[type]));
      }
    }
    setData(temp);
  };

  return (
    <div>
      <div
        className={`flex h-screen bg-white ${
          isFullScreen
            ? "fixed top-0 left-0 w-full h-full z-50 overflow-x-scroll"
            : "mb-16"
        }`}
      >
        <main className="flex-grow p-6 overflow-hidden flex flex-col font-roboto">
          <div className="flex justify-between items-center mb-4  ">
            <div
              className="filterButton relative 
              flex flex-row justify-center items-center 
              h-full z-50"
              ref={wholeColumnFilterRef}
            >
              <button
                className=" flex flex-col justify-center items-center "
                onClick={toggleFormFilterButton}
              >
                <FaFilter className="ml-5 text-2xl" />
                <p className=" flex self-end">Filter</p>
                <p className="absolute top-0 left-2  bg-red-500 text-white rounded-full w-5 flex flex-row items-center justify-center text-sm">
                  {filterArray.length}
                </p>
              </button>

              <div className="absolute top-10 left-0 z-50">
                {filterColumnsBoxVisible && (
                  <div className=" bg-white shadow-md rounded p-4 mt-2 z-20 border w-64 border-gray-200">
                    <div className="columns">
                      {uniqueCategories.map((category) => (
                        <div key={category}>
                          <div
                            className=""
                            onClick={() => toggleCategory(category)}
                          >
                            <span className="p-2 flex items-center hover:bg-gray-50 cursor-pointer w-full justify-between">
                              {category}{" "}
                              {expandedCategory === category ? (
                                <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                              ) : (
                                <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                              )}
                            </span>
                          </div>

                          {expandedCategory === category && (
                            <div className="flex flex-col h-32 overflow-auto bg-gray-50 hover:bg-white">
                              {columns
                                .filter((col) => col.category === category)
                                .map((col) => (
                                  <button
                                    className="flex flex-row p-2 items-center justify-start hover:bg-gray-50"
                                    onClick={() => {
                                      setFormFilter(col.key, col.title, col.id);
                                    }}
                                  >
                                    <p>{col.title}</p>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {filterFormVisible && (
                  <div className="  bg-white shadow-md rounded px-2 pt-2 pb-1 mt-2 z-20 border w-64 border-gray-200">
                    <div className="flex flex-row items-center justify-between m-2">
                      <h2 className="p-1 font-semibold">{filterFormColName}</h2>
                      <button
                        className="text-2xl hover:bg-red-500 hover:text-white rounded-md p-1"
                        onClick={closeFilterFormBox}
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-around m-2 ">
                      <select
                        name=""
                        id=""
                        className="p-1"
                        ref={filterCompareValueInputRef}
                      >
                        <option value="Greater">Greater</option>
                        <option value="Lower">Lower</option>
                        <option value="Equal">Equal</option>
                      </select>
                      <input
                        type="text"
                        className="w-full border-2 p-1 border-black rounded-md"
                        ref={filterValueInputRef}
                      />
                    </div>

                    <div className="m-2 flex flex-row justify-start items-end mt-4">
                      <button
                        className="text-blue-500 hover:bg-blue-500 hover:text-white rounded-md p-2"
                        onClick={applyFilterForm}
                      >
                        Apply
                      </button>
                    </div>
                    {/* {filterFormColKey }  */}
                  </div>
                )}

                {stringFilterFormVisible && (
                  <div className="  bg-white shadow-md rounded px-2 pt-2 pb-1  mt-2 z-20 border w-64 border-gray-200">
                    <div className="flex flex-row items-center justify-between m-2">
                      <h2 className="p-1 font-semibold">{filterFormColName}</h2>
                      <button
                        className="text-2xl hover:bg-red-500 hover:text-white rounded-md p-1"
                        onClick={closeFilterFormBox}
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-around m-2">
                      <p className="p-1">Contains</p>
                      <input
                        type="text"
                        className="w-full border-2 p-1 border-black rounded-md"
                        ref={filterStringInputRef}
                      />
                    </div>

                    <div className="m-2 flex flex-row justify-start items-end mt-4">
                      <button
                        className="text-blue-500 hover:bg-blue-500 hover:text-white rounded-md p-2"
                        onClick={applyFilterForm}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
                {booleanFilterFormVisible && (
                  <div className=" bg-white shadow-md rounded px-2 pt-2 pb-1 mt-2 z-20 border w-64 border-gray-200">
                    <div className="flex flex-row items-center justify-between m-2">
                      <h2 className="p-1 font-semibold">{filterFormColName}</h2>
                      <button
                        className="text-2xl hover:bg-red-500 hover:text-white rounded-md p-1"
                        onClick={closeFilterFormBox}
                      >
                        <IoMdClose />
                      </button>
                    </div>

                    <div className="flex flex-row items-center justify-around m-2">
                      {/* <p>Contains</p> */}
                      {/* <input type="text" 
                          className="w-full"
                          ref={filterStringInputRef}
                          /> */}
                      <select
                        name=""
                        id=""
                        ref={booleanInputRef}
                        className="w-full border-2 p-1 border-black rounded-md"
                      >
                        <option value="ENABLED">Enabled</option>
                        <option value="PAUSED">Paused</option>
                      </select>
                    </div>
                    <div className="m-2 flex flex-row justify-start items-end mt-4">
                      <button
                        className="text-blue-500 hover:bg-blue-500 hover:text-white rounded-md p-2"
                        onClick={applyFilterForm}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-2 ">
              <div className="relative" ref={datePickerRef}>
                <span className="mx-2 text-lg text-[#616161]">
                  {dateFormatText}
                </span>
                <button
                  // onClick={toggleDatePicker}
                  onClick={() => {
                    toggleDropDownTabs("Calendar");
                  }}
                  className="text-base border mr-2 border-gray-400 p-2 w-60"
                >
                  {formatButtonLabel()}
                </button>
                {showDatePicker && (
                  <div className="absolute z-10 mt-2 shadow-lg bg-white right-2">
                    <DateRangePicker
                      // onChange={(item) => setState([...state,item])}

                      onChange={(e) => {
                        handleSelectDateRanges(e);
                      }}
                      showSelectionPreview={true}
                      moveRangeOnFirstSelection={false}
                      months={1}
                      ranges={state}
                      direction="horizontal"
                      maxDate={new Date()}
                    />
                    <div className=" flex flex-row  justify-between items-center mb-2 mx-2">
                      <button
                        onClick={fetchAdGroupData} // Call API when dates are selected
                        className="bg-blue-500 text-white px-4 py-2 rounded text-center mt-2"
                      >
                        Apply
                      </button>

                      <Switcher7
                        onToggle={() => compareDateRanges()}
                        flag={state.length > 1}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="relative" ref={segmentBoxRef}>
                <button
                  ref={segmentButtonRef}
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  // onClick={toggleGroupListVisibility}
                  onClick={() => {
                    toggleDropDownTabs("Segment");
                  }}
                >
                  <MdOutlineSegment cclassName="ml-5" /> Segment
                </button>

                {isGroupListVisible && (
                  <div
                    className="absolute z-20  w-60 bg-white shadow-lg rounded-lg mt-2 p-4 border border-gray-200"
                    style={{
                      top:
                        segmentButtonRef.current?.offsetTop +
                        segmentButtonRef.current?.offsetHeight,
                      left: segmentButtonRef.current?.offsetLeft,
                    }}
                  >
                    <p className="p-2 text-sm text-gray-400">By</p>

                    <button
                      className="p-2 flex items-center hover:bg-gray-50 cursor-pointer w-full justify-between"
                      onClick={() => setShowViewBy(!showViewBy)}
                    >
                      View By{" "}
                      {showViewBy ? (
                        <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                      ) : (
                        <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                      )}
                    </button>

                    {showViewBy && (
                      <ul className="mx-2">
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            changeGroupbyView("none");
                          }}
                        >
                          None
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            changeGroupbyView("date");
                          }}
                        >
                          Day
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            changeGroupbyView("week");
                          }}
                        >
                          Week
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            changeGroupbyView("month");
                          }}
                        >
                          Month
                        </li>
                        <li
                          className="p-2 hover:bg-gray-100  capitalize space-x-2 cursor-pointer"
                          onClick={(e) => {
                            changeGroupbyView("device");
                          }}
                        >
                          Device
                        </li>
                      </ul>
                    )}

                    <button
                      className="p-2 flex items-center hover:bg-gray-50 cursor-pointer justify-between w-full"
                      onClick={() => setShowFilterBy(!showFilterBy)}
                    >
                      Campaign Types
                      {showFilterBy ? (
                        <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                      ) : (
                        <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                      )}
                    </button>

                    {showFilterBy && (
                      <div className="mx-2">
                        <div className="flex flex-col  space-y-2">
                          {filterOptions.map((option) => (
                            <label
                              key={option.name}
                              className="flex items-center"
                            >
                              <input
                                type="checkbox"
                                value={option.value}
                                checked={selectedFilters.CampaignType?.includes(
                                  option.value
                                )}
                                onChange={(e) =>
                                  handleCheckboxFilter(
                                    "CampaignType",
                                    e.target.value,
                                    e.target.checked
                                  )
                                }
                                className="mr-2"
                              />
                              {option.name}
                            </label>
                          ))}
                        </div>

                        <button
                          className="bg-blue-500 text-white px-4 py-2 my-2 rounded-sm w-full"
                          onClick={applyFilters}
                        >
                          Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative" ref={categoryBoxRef}>
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  onClick={() => {
                    toggleDropDownTabs("Category");
                  }}
                >
                  <FaLayerGroup className="ml-5" />
                  Category
                </button>
                {isGroupDropdownVisible && (
                  <>
                    <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border w-64 border-gray-200">
                      <ul className="mx-2 h-56 overflow-y-auto">
                        <li
                          className="p-2 hover:bg-gray-100 cursor-pointer capitalize"
                          onClick={() => handleGroupClick(null)}
                        >
                          All
                        </li>
                        {savedGroups.map((data, index) => (
                          <li
                            key={index}
                            className="p-2 hover:bg-gray-100  capitalize space-x-2"
                            // onClick={() => handleGroupClick(name)}
                          >
                            <input
                              type="checkbox"
                              className="cursor-pointer"
                              name=""
                              id=""
                              value={data.group_id}
                              onChange={(e) => handleGroupCheckboxChange(e)}
                            />
                            <span>{data.group_name}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 my-2 rounded-sm w-full"
                        onClick={() => {
                          toggleSegmentType("groups");
                        }}
                      >
                        Filter
                      </button>

                      <Link
                        to="/google-ads/campaign-groups"
                        className="p-2 flex items-center hover:bg-gray-50 cursor-pointer justify-between w-full"
                      >
                        Edit Groups
                      </Link>
                    </div>
                  </>
                )}
              </div>
              <div className="relative" ref={downloadBoxRef}>
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  // onClick={() => setShowDownloadOptions(!showDownloadOptions)}
                  onClick={() => {
                    toggleDropDownTabs("Download");
                  }}
                >
                  <MdOutlineFileDownload className="ml-5" />
                  Download
                </button>
                {showDownloadOptions && (
                  <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border border-gray-200">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData("pdf")}
                    >
                      PDF
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData("csv")}
                    >
                      CSV
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData("excel")}
                    >
                      Excel
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData("xml")}
                    >
                      XML
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData("google_sheets")}
                    >
                      Google Sheets
                    </button>
                  </div>
                )}
              </div>
              <button
                className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                onClick={toggleFullScreen}
              >
                {isFullScreen ? (
                  <FaCompress className="ml-5" />
                ) : (
                  <FaExpand className="ml-5" />
                )}{" "}
                {isFullScreen ? "Collapse" : "Expand"}
              </button>
              <div className="relative " ref={columnBoxRef}>
                <button
                  className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
                  // onClick={toggleColumnsMenu}
                  onClick={() => {
                    toggleDropDownTabs("Columns");
                  }}
                >
                  <FaColumns className="ml-5" /> Columns
                </button>
                {showColumnsMenu && (
                  <ModifyColumns
                    columns={columns}
                    setColumns={setColumns}
                    setTableVisible={setTableVisible}
                    setShowColumnsMenu={setShowColumnsMenu}
                    setTotalShow={setTotalShow}
                    setTotal={setTotal}
                  />
                )}
              </div>
            </div>
          </div>

          {selectedRows.length >= 2 && (
            <div className="p-2 w-full bg-[#4142dc] flex items-center">
              <p className="text-lg text-white font-normal p-2 my-4 pr-4 border-r-1 border-white">
                {selectedRows.length} selected
              </p>
              <button
                className="bg-transparent text-white text-lg p-2 m-4 font-semibold"
                onClick={handleCreateGroup}
              >
                Create Group
              </button>
              {isVisibleGroupInput && (
                <div className="flex justify-center items-center">
                  <input
                    type="text"
                    className="text-lg text-white bg-transparent border-b-1 border-white p-2 focus:outline-none"
                    placeholder="Group Name"
                    onChange={(e) => setGroupName(e.target.value)}
                  />
                  <button
                    className="bg-white text-[#4142dc] text-lg  m-4 font-semibold px-4 py-1.5"
                    onClick={handleGroupSave}
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          )}
          {selectedGroup !== null ? (
            <>
              {tableVisible && (
                <div className="flex-grow overflow-auto">
                  <h1 className="text-2xl font-semibold capitalize py-4">
                    {selectedGroup} Group's Campaigns
                  </h1>
                  {filteredData.length > 0 ? (
                    <>
                      <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
                        <thead>
                          <tr className="bg-gray-200 normal-case text-sm leading-normal">
                            <th className="py-3 px-6 text-left font-medium">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            </th>
                            {columns
                              .filter((col) => col.visible)
                              .map((col) => (
                                <th
                                  key={col.key}
                                  className="py-3 px-6 text-left font-medium"
                                >
                                  {col.title}
                                </th>
                              ))}
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light font-roboto">
                          {filteredData.map((item, index) => (
                            <tr
                              key={index}
                              className={`border-b   ${
                                selectedRows.some((row) => row.id === item.id)
                                  ? "bg-blue-100 border-gray-300"
                                  : "hover:bg-gray-100 border-gray-200"
                              }`}
                            >
                              <td className="py-3 px-6 text-left">
                                <input
                                  type="checkbox"
                                  checked={selectedRows.some(
                                    (row) => row.id === item.id
                                  )}
                                  onChange={() =>
                                    handleCheckboxChange(item.id, item.name)
                                  }
                                />
                              </td>

                              {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                  <td
                                    key={col.key}
                                    className="py-3 px-6 text-left"
                                  >
                                    {col.key !== "status" &&
                                      (Array.isArray(item[col.key])
                                        ? item[col.key].join(", ")
                                        : item[col.key])}
                                    {/* Render the status cell */}
                                    {PercentColumns.indexOf(col.key) != -1 ? (
                                      <span> %</span>
                                    ) : null}
                                    {col.key === "status" ? (
                                      <div className="flex items-center">
                                        {item.status === "ENABLED" && (
                                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        )}
                                        {item.status === "PAUSED" && (
                                          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                        )}
                                        {item.status === "REMOVED" && (
                                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                        )}
                                        {/* {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()} */}
                                      </div>
                                    ) : null}
                                  </td>
                                ))}
                            </tr>
                          ))}
                        </tbody>
                        {showTotal && (
                          <tfoot className="bg-gray-100">
                            <tr className="text-gray-700 font-semibold">
                              <td className="px-4 py-2 ">Total</td>
                              {() => {
                                Object.keys(total).forEach(
                                  (key) => delete total[key]
                                );
                              }}
                              {columns
                                .filter((col) => col.visible)
                                .map((col) => {
                                  // //console.log("KEY",col.key)
                                  total[col.key] = 0;
                                })}
                              {filteredData.map((d) => {
                                Object.keys(d).forEach((val) => {
                                  Object.keys(total).forEach((totalVal) => {
                                    if (totalVal == val) {
                                      total[val] = total[val] + d[val];
                                    }
                                  });
                                });
                              })}

                              {Object.entries(total).map((t, k) => {
                                //console.log("type",typeof(t[1]))
                                let tempval = "";
                                let ignoreColumns = [
                                  "id",
                                  "customer_id",
                                  "amount_micros",
                                  "campaign_id",
                                ];
                                if (typeof t[1] == "number") {
                                  if (ignoreColumns.indexOf(t[0]) == -1) {
                                    tempval = numberWithCommas(t[1].toFixed(2));
                                  }

                                  if (PercentColumns.indexOf(t[0]) != -1) {
                                    tempval = String(tempval) + " %";
                                  }
                                }
                                return (
                                  <td className="py-3 px-6 text-left">
                                    {tempval}
                                  </td>
                                );
                              })}
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </>
                  ) : (
                    <div className="flex justify-center items-center h-40 mt-8">
                      <LoadingAnimation />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              {tableVisible && (
                <div className="flex-grow overflow-auto mb-12">
                  {/* {filterArray.length != 0?<> */}
                  {true ? (
                    <>
                      {/* {Filters } */}
                      <div
                        className="w-full  flex flex-row space-x-4 items-center p-2 relative "
                        // ref={wholeColumnFilterRef}
                      >
                        <button
                          className="  flex-row justify-center items-center hidden"
                          onClick={toggleFormFilterButton}
                        >
                          <FaFilter className="ml-5 text-2xl" />
                          <p className="absolute top-0 left-2  bg-red-500 text-white rounded-full w-5 flex-row items-center justify-center text-sm hidden">
                            {filterArray.length}
                          </p>
                        </button>

                        <div className=" flex flex-row w-11/12 overflow-auto scroll-container">
                          {filterArray.map((item) => {
                            return (
                              <div className="flex flex-row items-center justify-between p-2 border-1 border-black rounded-lg min-w-fit mx-1">
                                <h2>
                                  {item.title} {item.sign} {item.value}
                                </h2>
                                <button
                                  onClick={() => removeFilterFromArray(item.id)}
                                >
                                  <IoMdClose />
                                </button>
                              </div>
                            );
                          })}
                        </div>

                        {filterArray.length >= 1 && (
                          <div className="clearfilter flex item-center justify-center absolute right-5 text-2xl hover:bg-red-500 hover:text-white">
                            <button
                              onClick={() => {
                                setFilterArray([]);
                              }}
                            >
                              <IoMdClose />
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}

                  {data.length > 0 ? (
                    <table className="min-w-full bg-white rounded-lg overflow-hidden shadow-md font-roboto">
                      <thead>
                        <tr className="bg-gray-200 normal-case text-sm leading-normal">
                          {isSelectInputVisible && (
                            <th className="py-3 px-6 text-left font-medium">
                              <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                              />
                            </th>
                          )}
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => (
                              <th
                                key={col.key}
                                className="py-3 px-6 text-left font-semibold  "
                              >
                                <button
                                  className="flex flex-row justify-between items-center"
                                  onClick={() => {
                                    changeOrderTypeCampaign(col.key);
                                  }}
                                >
                                  <h2 className=" whitespace-nowrap flex flex-row justify-between items-center">
                                    {col.title}
                                    {col.perentage_diff == true && (
                                      <div className="mx-2">
                                        <IoCodeSharp />
                                      </div>
                                    )}
                                  </h2>
                                  {currentOrderVariable == col.key && (
                                    <>
                                      {currentOrderType ? (
                                        <IoIosArrowDown className="ml-2 transform rotate-180 transition-transform duration-300 ease-out text-xl" />
                                      ) : (
                                        <IoIosArrowDown className="ml-2 transform rotate-0 transition-transform duration-300 ease-out text-xl" />
                                      )}
                                    </>
                                  )}
                                </button>
                              </th>
                            ))}
                        </tr>
                      </thead>

                      <tbody className="text-gray-600 text-sm font-medium font-roboto">
                        {data
                          .filter((item) => checkDataByFilter(item))
                          .map((item, index) => (
                            <tr
                              key={index}
                              className={`border-b   ${
                                selectedRows.some((row) => row.id === item.id)
                                  ? "bg-blue-100 border-gray-300"
                                  : "hover:bg-gray-100 border-gray-200"
                              }`}
                            >
                              {isSelectInputVisible && (
                                <td className="py-3 px-6 text-left">
                                  <input
                                    type="checkbox"
                                    checked={selectedRows.some(
                                      (row) => row.id === item.id
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(item.id, item.name)
                                    }
                                  />
                                </td>
                              )}

                              {columns
                                .filter((col) => col.visible)
                                .map((col) => (
                                  <td
                                    key={col.key}
                                    className="py-3 px-6 text-left"
                                  >
                                    {col.key !== "status" &&
                                      (Array.isArray(item[col.key])
                                        ? item[col.key].join(", ")
                                        : item[col.key])}
                                    {/* Render the status cell */}
                                    {PercentColumns.indexOf(col.key) != -1 ? (
                                      <span> %</span>
                                    ) : null}
                                    {col.key === "status" ? (
                                      <div className="flex items-center">
                                        {item.status === "ENABLED" && (
                                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                        )}
                                        {item.status === "PAUSED" && (
                                          <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                                        )}
                                        {item.status === "REMOVED" && (
                                          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                                        )}
                                        {/* {item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()} */}
                                      </div>
                                    ) : null}
                                  </td>
                                ))}
                            </tr>
                          ))}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        {showTotal && (
                          <tr className="text-gray-700 font-semibold">
                            {isSelectInputVisible && (
                              <td className="px-4 py-2 ">Total</td>
                            )}
                            {() => {
                              Object.keys(total).forEach(
                                (key) => delete total[key]
                              );
                            }}
                            {columns
                              .filter((col) => col.visible)
                              .map((col) => {
                                // //console.log("KEY",col.key)
                                total[col.key] = 0;
                              })}
                            {data
                              .filter((item) => checkDataByFilter(item))
                              .map((d) => {
                                Object.keys(d).forEach((val) => {
                                  Object.keys(total).forEach((totalVal) => {
                                    if (totalVal == val) {
                                      total[val] = total[val] + d[val];
                                    }
                                  });
                                });
                              })}

                            {Object.entries(total).map((t, k) => {
                              //console.log("type",typeof(t[1]))
                              let tempval = "";
                              let ignoreColumns = [
                                "id",
                                "customer_id",
                                "amount_micros",
                                "campaign_id",
                              ];
                              if (typeof t[1] == "number") {
                                if (ignoreColumns.indexOf(t[0]) == -1) {
                                  tempval = numberWithCommas(t[1].toFixed(2));
                                }

                                if (PercentColumns.indexOf(t[0]) != -1) {
                                  tempval = String(tempval) + " %";
                                }
                              }
                              return (
                                <td className="py-3 px-6 text-left">
                                  {tempval}
                                </td>
                              );
                            })}
                          </tr>
                        )}
                      </tfoot>
                    </table>
                  ) : (
                    <div className="flex justify-center items-center h-40 mt-8">
                      <LoadingAnimation />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
          {showViewBySection && (
            <div>
              <CampaignsViewBy
                groupBy={viewByObject.groupBy}
                startDate={format(state[0].startDate, "yyyy-MM-dd")}
                endDate={format(state[0].endDate, "yyyy-MM-dd")}
                //  newColumns={columns}
                columns={viewByColumns}
                setColumns={setViewByColumns}
              />
            </div>
          )}

          {showGroupBySection && (
            <>
              <CampaignsGroupBy
                startDate={viewByObject.startDate}
                endDate={viewByObject.endDate}
                campaigns={data}
                groups={savedGroups}
              />
            </>
          )}
        </main>
      </div>
      {isDialogOpenCreateGroup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Background Overlay */}
          <div
            className="fixed inset-0 bg-black opacity-70"
            onClick={() => setIsDialogOpenCreateGroup(false)}
          ></div>

          {/* Dialog Box */}
          <div className="relative bg-white p-6 pt-2 rounded shadow-lg w-96">
            {/* Close Button */}
            <button
              className="absolute top-0 right-3 text-gray-500 hover:text-gray-700 text-lg"
              onClick={() => setIsDialogOpenCreateGroup(false)}
            >
              x
            </button>

            <div className="flex flex-col justify-center items-center">
              <img src={checkMark} alt="Success" />
              <p>Your campaign group has been created.</p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => setIsDialogOpenCreateGroup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsTable;
