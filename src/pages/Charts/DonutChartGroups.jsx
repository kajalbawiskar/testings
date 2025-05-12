import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Card, CardContent } from "@mui/material";
import { IoMdClose } from "react-icons/io";

const DonutChartGroups = (props) => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [allValZeroFlag, setAllValZeroFlag] = useState(false);

  const [titleArray, setTitleArray] = useState(props.labels);
  const [chartParameter, setChartParameter] = useState("impressions");

  const allParameters = [
    { title: "Avg Cost", key: "avg_cost" },
    { title: "Avg Cpm", key: "avg_cpm" },
    { title: "Clicks", key: "clicks" },
    { title: "Conversion", key: "conversion" },
    { title: "Cost/Conv", key: "cost_per_conv" },
    { title: "Ctr", key: "ctr" },
    { title: "Impressions", key: "impressions" },
    { title: "Interaction Rate", key: "interaction_rate" },
    { title: "Interactions", key: "interactions" },
    { title: "Invalid Click rate", key: "invalid_click_rate" },
    { title: "Invalid Clicks", key: "invalid_clicks" },
  ];

  const changeChartParameter = (e) => {
    setChartParameter(e.target.value);
  };

  useEffect(() => {
    setLoading(true);

    let totalValues = 0;
    props.data.forEach((item) => {
      totalValues += item.total[chartParameter];
    });

    setAllValZeroFlag(totalValues <= 0);

    const formattedData = props.data.map((item, index) => ({
      id: index,
      label: `${item.group_name} ${item.total[chartParameter]}`,
      value: item.total[chartParameter],
    }));

    setChartData(formattedData);
    setLoading(false);
  }, [chartParameter, props.data]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 py-8">{error}</div>;
  }

  return (
    <Card className="my-4">
      <CardContent>
        <div className="flex flex-row justify-between items-center">
          <div className="space-y-2">
            <h4 className="font-semibold text-2xl">
              {titleArray.map((title, index) => (
                <span key={index}>
                  {title}
                  {index !== titleArray.length - 1 ? ", " : "."}
                </span>
              ))}
            </h4>
            <select
              name="chartParameter"
              id="chartParameter"
              className="p-2 border rounded"
              onChange={changeChartParameter}
              value={chartParameter}
            >
              {allParameters.map((item) => (
                <option key={item.key} value={item.key}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

          <button
            className="p-2 text-lg bg-red-600 text-white rounded-sm"
            onClick={() => props.removeArrayIndex(props.arrayIndex)}
          >
            <IoMdClose />
          </button>
        </div>

        <div className="flex justify-center items-center w-full h-full">
          <div className="w-full h-[444px]">
            {chartData && !allValZeroFlag ? (
              <PieChart
                series={[
                  {
                    data: chartData,
                    highlightScope: { faded: "global", highlight: "item" },
                    faded: { additionalRadius: -20, color: "gray" },
                    innerRadius: 60,
                  },
                ]}
                height={400}
                slotProps={{
                  legend: {
                    direction: "column",
                    position: { vertical: "top", horizontal: "right" },
                    itemGap: 20,
                  },
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <h4 className="text-xl">No Data Found</h4>
                <p className="text-md text-slate-400">Try changing the date range</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonutChartGroups;
