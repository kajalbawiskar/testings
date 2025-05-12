import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const MetricCardWithChart = ({ title, value, change, data, color }) => {
  const isPositive = change >= 0;
  const percentText = `${Math.abs(change).toFixed(2)}%`;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-xs">
      <div className="flex justify-between items-start mb-1">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-center space-x-1 text-sm font-semibold">
            <span className={isPositive ? "text-green-600" : "text-red-500"}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {percentText}
            </span>
          </div>
        </div>
        <button className="text-sm text-blue-600 font-medium">Report</button>
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>

      <ResponsiveContainer width="100%" height={50}>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricCardWithChart;
