import axios from "axios";
import { format } from "date-fns"; // Make sure date-fns is installed: npm install date-fns

import {
  KeywordCompareColumns,
  KeywordDefaultColumns,
  KeywordGroupColumns,
  KeywordSegmentClickTypeColumns,
  KeywordSegmentDateColumns,
  KeywordSegmentDeviceColumns,
  KeywordSegmentNetworkColumns,
  KeywordSegmentTopVsOtherColumns,
} from "./KeywordsColumns";

// Default
export const fetchKeywordData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  const customerId =
    localStorage.getItem("customer_id") === "Not Connected" ||
    localStorage.getItem("customer_id") === null
      ? "4643036315"
      : localStorage.getItem("customer_id");
  const startDate = format(state[0].startDate, "yyyy-MM-dd");
  const endDate = format(state[0].endDate, "yyyy-MM-dd");

  fetch("https://api.confidanto.com/get_keyword_datewise_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customer_id: customerId,
      email: localStorage.getItem("email"),
      start_date: startDate,
      end_date: endDate,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      setData(data);
      setTotal({});
      setColumns(KeywordDefaultColumns);
    })
    .catch((error) => console.error("Error fetching data:", error));
};

// Date
export const fetchKeywordCompareData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  const customerId =
    localStorage.getItem("customer_id") === "Not Connected" ||
    localStorage.getItem("customer_id") === null
      ? "4643036315"
      : localStorage.getItem("customer_id");
  const CurrstartDate = format(state[0].startDate, "yyyy-MM-dd");
  const CurrendDate = format(state[0].endDate, "yyyy-MM-dd");
  const PrevstartDate = format(state[1].startDate, "yyyy-MM-dd");
  const PrevendDate = format(state[1].endDate, "yyyy-MM-dd");

  console.log(CurrstartDate, CurrendDate, PrevstartDate, PrevendDate);

  const RequestBody = {
    customer_id: customerId,
    start_date: CurrstartDate, // curr date
    end_date: CurrendDate,
    previous_start_date: PrevstartDate, //prev date
    previous_end_date: PrevendDate,
    email: localStorage.getItem("email"),
  };

  axios
    .post("https://api.confidanto.com/get_keyword_datewise_data", RequestBody)
    .then((res) => {
      console.log("IUYREXRDCFV", res.data);
      setData(res.data); // Update the table data

      setTotal({});
      setColumns(KeywordCompareColumns);
    });
};

// Groups
export const fetchKeywordGroupsData = async (
  state,
  setColumns,
  setData,
  setTotal,
  selectedGroupIds,
  SetSelectedGroupIds
) => {
  console.log("selectedGroupIds", selectedGroupIds);

  const customerId =
    localStorage.getItem("customer_id") === "Not Connected" ||
    localStorage.getItem("customer_id") === null
      ? "4643036315"
      : localStorage.getItem("customer_id");
  const startDate = format(state[0].startDate, "yyyy-MM-dd");
  const endDate = format(state[0].endDate, "yyyy-MM-dd");

  axios
    .post("https://api.confidanto.com/keyword-grouped-metrics", {
      customer_id: customerId,
      email: localStorage.getItem("email"),
      group_ids: selectedGroupIds,
      start_date: startDate,
      end_date: endDate,
    })
    .then((res) => {
      let tempData = res.data;

      let groupData = tempData.map((item) => {
        let obj = {
          group_name: item.group_name,
          average_cpc: item.group_totals.average_cpc,
          clicks: item.group_totals.clicks,
          conversion_rate: item.group_totals.conversion_rate,
          conversions: item.group_totals.conversions,
          cost_per_conv: item.group_totals.cost_per_conv,
          costs: item.group_totals.costs,
          ctr: item.group_totals.ctr,
          impressions: item.group_totals.impressions,
        };
        console.log(item);

        return obj;
      });

      setData(groupData);
      setColumns(KeywordGroupColumns);
      setTotal({});

      SetSelectedGroupIds([]);
    })
    .catch((err) => {
      console.error("Keyword Groups Total Error", err);
    });
};

// Segments
export const fetchKeywordSegmentDeviceData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  try {
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id");
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    await axios
      .post("https://api.confidanto.com/get-keyword-device-metrics", {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setTotal({});
        setColumns(KeywordSegmentDeviceColumns);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Keyword Segment Device Error: ", err);
      });
  } catch (err) {
    console.error("Keyword Segment Device Error: ", err);
  }
};

export const fetchKeywordSegmentClickTypeData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  try {
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id");
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    await axios
      .post("https://api.confidanto.com/get-keyword-click-type-metrics", {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setTotal({});
        setColumns(KeywordSegmentClickTypeColumns);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Keyword Segment Device Error: ", err);
      });
  } catch (err) {
    console.error("Keyword Segment Device Error: ", err);
  }
};

export const fetchKeywordSegmentTopVsOtherData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  try {
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id");
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    await axios
      .post("https://api.confidanto.com/get-keyword-top-vs-other-metrics", {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setTotal({});
        setColumns(KeywordSegmentTopVsOtherColumns);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Keyword Segment Device Error: ", err);
      });
  } catch (err) {
    console.error("Keyword Segment Device Error: ", err);
  }
};

export const fetchKeywordSegmentNetworkData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  try {
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id");
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    await axios
      .post("https://api.confidanto.com/get-keyword-network-metrics", {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
      })
      .then((res) => {
        setTotal({});
        setColumns(KeywordSegmentNetworkColumns);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Keyword Segment Device Error: ", err);
      });
  } catch (err) {
    console.error("Keyword Segment Device Error: ", err);
  }
};

export const fetchKeywordSegmentDateData = async (
  state,
  setColumns,
  setData,
  setTotal,
  groupBy
) => {
  try {
    const customerId =
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id");
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    await axios
      .post("https://api.confidanto.com/get-keyword-segmented-data", {
        customer_id: customerId,
        email: localStorage.getItem("email"),
        start_date: startDate,
        end_date: endDate,
        group_by: groupBy,
      })
      .then((res) => {
        setTotal({});
        setColumns(KeywordSegmentDateColumns);
        setData(res.data);
      })
      .catch((err) => {
        console.error("Keyword Segment Device Error: ", err);
      });
  } catch (err) {
    console.error("Keyword Segment Device Error: ", err);
  }
};
