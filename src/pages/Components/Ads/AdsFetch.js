import axios from "axios";
import { format } from "date-fns"; // Make sure date-fns is installed: npm install date-fns

import {
  AdDefaultColumns,
  AdSegmentDate,
  AdSegmentDeviceColumns,
  AdSegmentNetworkColumns,
  AdSegmentClickTypeColumns,
  AdSegmentTopVsOtherColumns,
  AdGroupColumns,
  AdCompareColumns,
} from "./AdsColumns";

export const fetchData = async (
  state,
  setColumns,
  setData,
  setTotal,
  setError
) => {
  try {
    const customerId = localStorage.getItem("customer_id")
    const startDate = format(state[0].startDate, "yyyy-MM-dd");
    const endDate = format(state[0].endDate, "yyyy-MM-dd");

    const response = await fetch(
      "https://api.confidanto.com/get-datewise-ads-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId,
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

    setData(combinedData);
    setColumns(AdDefaultColumns);
    setTotal({});
  } catch (error) {
    setError(error.message);
    console.error("Error fetching data:", error);
  }
};

// Segments
export const fetchSegmentDateData = async (
  state,
  setColumns,
  setData,
  setTotal,
  viewByObject
) => {
  axios
    .post("https://api.confidanto.com/get-segment-ad-group-ad-data", {
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
      
      let resData =  res.data.map(obj => {
        // 1. Get key-value pairs as an array: [['id', 1], ['name', 'Task A'], ...]
        const entries = Object.entries(obj);
      
        // 2. Map over the pairs, changing the key if needed
        const transformedEntries = entries.map(([key, value]) => {
          if (key === 'week' || key === 'month') {
            return ['date', value]; // Return a new pair with 'date' as the key
          }
          return [key, value]; // Otherwise, return the original pair
        });
      
        // 3. Convert the transformed pairs back into an object
        return Object.fromEntries(transformedEntries);
      });
      
      setData(resData);
      setColumns(AdSegmentDate);

      setTotal({});
    })
    .catch((err) => {
      console.error("Error Fetching Ads Segment", err);
    });
};

export const fetchSegmentDeviceData = async (
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

    const startDateFormatted = format(state[0].startDate, "yyyy-MM-dd");
    const endDateFormatted = format(state[0].endDate, "yyyy-MM-dd");

    const response = await axios.post(
      "https://api.confidanto.com/get-ad-device-metrics",
      {
        customer_id: customerId,
        start_date: startDateFormatted,
        end_date: endDateFormatted,
      }
    );

    setColumns(AdSegmentDeviceColumns);

    const combinedData = response.data.map((item) => ({
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
    setData(combinedData);
    setTotal({});
  } catch (error) {
    console.error("Error Fetching Ads Segment Device:", error);
    // Optionally re-throw or return an error value to be handled in the component.
    // throw error;
  }
};

export const fetchSegmentNetworkData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  console.log("Network Segment", AdSegmentNetworkColumns);
  const customerId =
    localStorage.getItem("customer_id") === "Not Connected" ||
    localStorage.getItem("customer_id") === null
      ? "4643036315"
      : localStorage.getItem("customer_id");

  const startDateFormatted = format(state[0].startDate, "yyyy-MM-dd");
  const endDateFormatted = format(state[0].endDate, "yyyy-MM-dd");

  const response = await axios.post(
    "https://api.confidanto.com/get-ad-network-metrics",
    {
      customer_id: customerId,
      start_date: startDateFormatted,
      end_date: endDateFormatted,
    }
  );

  setColumns(AdSegmentNetworkColumns);

  const combinedData = response.data.map((item) => ({
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
        (description) => `<span class="cursor-pointer"> ${description} </span>`
      ),
    ].join(" "),
  }));
  setData(combinedData);
  setTotal({});
  try {
  } catch (error) {
    console.error("Error Fetching Ads Segment Network:", error);
  }
};

export const fetchSegmentClickTypeData = async (
  state,
  setColumns,
  setData,
  setTotal
) => {
  console.log("Network Segment", AdSegmentNetworkColumns);
  const customerId =
    localStorage.getItem("customer_id") === "Not Connected" ||
    localStorage.getItem("customer_id") === null
      ? "4643036315"
      : localStorage.getItem("customer_id");

  const startDateFormatted = format(state[0].startDate, "yyyy-MM-dd");
  const endDateFormatted = format(state[0].endDate, "yyyy-MM-dd");

  const response = await axios.post(
    "https://api.confidanto.com/get-ad-click-type-metrics",
    {
      customer_id: customerId,
      start_date: startDateFormatted,
      end_date: endDateFormatted,
    }
  );

  setColumns(AdSegmentClickTypeColumns);

  const combinedData = response.data.map((item) => ({
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
        (description) => `<span class="cursor-pointer"> ${description} </span>`
      ),
    ].join(" "),
  }));
  setData(combinedData);
  setTotal({});
  try {
  } catch (error) {
    console.error("Error Fetching Ads Segment Network:", error);
  }
};

export const fetchSegmentTopVsOtherData = async (
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

  const startDateFormatted = format(state[0].startDate, "yyyy-MM-dd");
  const endDateFormatted = format(state[0].endDate, "yyyy-MM-dd");

  const response = await axios.post(
    "https://api.confidanto.com/get-ads-top-vs-other-metrics",
    {
      customer_id: customerId,
      start_date: startDateFormatted,
      end_date: endDateFormatted,
    }
  );

  setColumns(AdSegmentTopVsOtherColumns);

  const combinedData = response.data.map((item) => ({
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
        (description) => `<span class="cursor-pointer"> ${description} </span>`
      ),
    ].join(" "),
  }));
  setData(combinedData);
  setTotal({});
  try {
  } catch (error) {
    console.error("Error Fetching Ads Segment Network:", error);
  }
};

// Groups
export const fetchAdsGroupTotal = (
  state,
  setColumns,
  setData,
  setTotal,
  selectedGroupIds,
  SetSelectedGroupIds
) => {
  console.log("selectedGroupIds", selectedGroupIds);
  axios
    .post("https://api.confidanto.com/ad-group/ads-grouped-metrics", {
      customer_id:
        localStorage.getItem("customer_id") === "Not Connected" ||
        localStorage.getItem("customer_id") === null
          ? "4643036315"
          : localStorage.getItem("customer_id"),
      email: localStorage.getItem("email"),
      group_ids: selectedGroupIds,
      start_date: format(state[0].startDate, "yyyy-MM-dd"),
      end_date: format(state[0].endDate, "yyyy-MM-dd"),
    })
    .then((res) => {
      // cols

      // data

      let tempData = res.data;

      let groupData = tempData.map((item) => {
        let obj = {
          group_name: item.group_name,
          average_cpc: item.total_metrics.average_cpc,
          average_cpm: item.total_metrics.average_cpm,
          clicks: item.total_metrics.clicks,
          conversion_rate: item.total_metrics.conversion_rate,
          conversions: item.total_metrics.conversions,
          cost_per_conv: item.total_metrics.cost_per_conv,
          costs: item.total_metrics.costs,
          ctr: item.total_metrics.ctr,
          impressions: item.total_metrics.impressions,
        };
        console.log(item);

        return obj;
      });

      setData(groupData);
      setColumns(AdGroupColumns);
      setTotal({});
      SetSelectedGroupIds([]);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Compare
export const fetchAdsCompareData = (
  state,
  setData,
  setShowDatePicker,
  setTotal,
  setColumns
) => {
  const CurrstartDate = format(state[0].startDate, "yyyy-MM-dd");
  const CurrendDate = format(state[0].endDate, "yyyy-MM-dd");
  const PrevstartDate = format(state[1].startDate, "yyyy-MM-dd");
  const PrevendDate = format(state[1].endDate, "yyyy-MM-dd");

  const RequestBody = {
    customer_id:
      localStorage.getItem("customer_id") === "Not Connected" ||
      localStorage.getItem("customer_id") === null
        ? "4643036315"
        : localStorage.getItem("customer_id"),
    email: localStorage.getItem("email"),
    start_date: CurrstartDate, // curr date
    end_date: CurrendDate,
    previous_start_date: PrevstartDate, //prev date
    previous_end_date: PrevendDate,
  };

  axios
    .post("https://api.confidanto.com/get-datewise-ads-data", RequestBody)
    .then((res) => {
      setData(res.data); // Update the table data
      setShowDatePicker(false);

      setTotal({});
      setColumns(AdCompareColumns);
    });
};
