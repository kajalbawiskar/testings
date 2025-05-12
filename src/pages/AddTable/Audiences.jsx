import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaColumns } from "react-icons/fa";
import LoadingAnimation from "../../components/LoadingAnimation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DateRangePicker } from "react-date-range";
import { format, isYesterday, isToday } from "date-fns";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { MdOutlineFileDownload } from "react-icons/md";

const Audience = ({ startDate, endDate }) => {
    const [showColumnsMenu, setShowColumnsMenu] = useState(false);
    const [columns, setColumns] = useState([
        { title: "Age Range", key: "age_range", visible: true, locked: true },
        { title: "Adgroup", key: "ad_group_name", visible: true },
        { title: "Status", key: "ad_group_primary_status", visible: true, locked: true },
        { title: "Campaign", key: "campaign_name", visible: true },
        { title: "Impr.", key: "impressions", visible: true },
        { title: "CTR", key: "ctr", visible: true },
        { title: "Cost", key: "cost", visible: true },
        { title: "Clicks", key: "clicks", visible: true },
        { title: "Conv. rate", key: "conversions_rate", visible: true },
        { title: "Conversions", key: "conversions", visible: true },
        { title: "Avg. CPC", key: "average_cpc", visible: true },
        // Add other keys here if curr_start_date is needed
    ]);
    const [tableVisible, setTableVisible] = useState(true);
    const [data, setData] = useState([]);
    const [state, setState] = useState([
        { startDate: new Date(), endDate: new Date(), key: "selection" }
      ]);
      const [showDatePicker, setShowDatePicker] = useState(false);
      
    const [showDownloadOptions, setShowDownloadOptions] = useState(false);

    const aggregateAgeRanges = (data) => {
        return data.reduce((acc, curr) => {
            const existing = acc.find(item => item.age_range === curr.age_range);
            if (existing) {
                existing.impressions += curr.impressions || 0;
                existing.cost += curr.cost || 0;
                existing.clicks += curr.clicks || 0;
                existing.conversions += curr.conversions || 0;
                existing.conversions_rate = existing.clicks
                    ? (existing.conversions / existing.clicks) * 100
                    : 0;
            } else {
                acc.push({ ...curr });
            }
            return acc;
        }, []);
    };

    const formatDateDisplay = (date) => {
        if (isToday(date)) return `Today ${format(date, "MMM dd, yyyy")}`;
        if (isYesterday(date)) return `Yesterday ${format(date, "MMM dd, yyyy")}`;
        return format(date, "MMM dd, yyyy");
    };

    

    const fetchData = (requestBody) => {
        fetch("https://api.confidanto.com/audience-data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        })
            .then((res) => res.json())
            .then((resData) => {
                if (resData?.age_data) {
                    const aggregatedData = aggregateAgeRanges(resData.age_data);
                    setData(aggregatedData);
                } else {
                    console.warn("No age_data returned from API:", resData);
                    setData([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setData([]);
            });
    };
    useEffect(() => {
        if (startDate && endDate) {
          const requestBody =
            startDate === endDate
              ? { customer_id: 4643036315, single_date: startDate }
              : { customer_id: 4643036315, start_date: startDate, end_date: endDate };
          fetchData(requestBody);
        }
      }, [startDate, endDate]);

    const toggleColumnVisibility = (key) => {
        setColumns(columns.map(col => col.key === key ? { ...col, visible: !col.visible } : col));
    };

    const downloadData = (format) => {
        const visibleCols = columns.filter(col => col.visible);
        const headers = visibleCols.map(col => col.title);
        const rows = data.map(item => visibleCols.map(col => item?.[col.key] ?? "N/A"));

        if (format === "pdf") {
            const doc = new jsPDF();
            autoTable(doc, { head: [headers], body: rows });
            doc.save("data.pdf");
        } else if (format === "csv" || format === "excel") {
            const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            XLSX.writeFile(wb, `data.${format === "excel" ? "xlsx" : "csv"}`);
        } else if (format === "xml") {
            const xml = `<root>${data.map(item =>
                `<row>${visibleCols.map(col => `<${col.key}>${item?.[col.key]}</${col.key}>`).join("")}</row>`
            ).join("")}</root>`;
            const blob = new Blob([xml], { type: "application/xml" });
            FileSaver.saveAs(blob, "data.xml");
        } else if (format === "google_sheets") {
            const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv" });
            FileSaver.saveAs(blob, "data.csv");
            window.open("https://docs.google.com/spreadsheets/d/your-sheet-id/edit?usp=sharing", "_blank");
        }

        setShowDownloadOptions(false);
    };

    const ColumnItem = ({ column }) => (
        <div className="flex items-center p-2 mb-1 rounded cursor-pointer bg-white shadow-sm">
            <input
                type="checkbox"
                checked={column.visible}
                onChange={() => toggleColumnVisibility(column.key)}
                disabled={column.locked}
                className="mr-2"
            />
            <span>{column.title}</span>
        </div>
    );

    return (
        <div className="flex h-full bg-gray-100 font-roboto">
            <main className="flex-grow p-6 overflow-y-auto">
                <div className="flex justify-end items-center mb-4 space-x-2">
                    <button className="hover:bg-slate-200 p-2 rounded text-gray-600">
                        <FaFilter className="inline mr-1" /> Add filter
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowDownloadOptions(!showDownloadOptions)} className="p-2 rounded hover:bg-slate-200 text-gray-600">
                            <MdOutlineFileDownload className="inline mr-1" /> Download
                        </button>
                        {showDownloadOptions && (
                            <div className="absolute right-0 mt-2 bg-white border p-2 shadow z-20">
                                {["pdf", "csv", "excel", "xml", "google_sheets"].map((f) => (
                                    <button key={f} onClick={() => downloadData(f)} className="block w-full text-left px-4 py-1 hover:bg-gray-100">
                                        {f.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <button onClick={() => setShowColumnsMenu(true)} className="hover:bg-slate-200 p-2 rounded text-gray-600">
                            <FaColumns className="inline mr-1" /> Columns
                        </button>
                        {showColumnsMenu && (
                            <div className="absolute right-0 z-30 bg-white p-4 border w-[400px] shadow">
                                <div className="font-bold text-gray-700 mb-2">Modify Columns</div>
                                {columns.map((col, idx) => (
                                    <ColumnItem key={idx} column={col} />
                                ))}
                                <div className="flex space-x-2 mt-4">
                                    <button onClick={() => setShowColumnsMenu(false)} className="bg-blue-500 text-white px-4 py-2 rounded">
                                        Apply
                                    </button>
                                    <button onClick={() => setShowColumnsMenu(false)} className="bg-red-500 text-white px-4 py-2 rounded">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {tableVisible && (
                    <div className="overflow-x-auto bg-white rounded shadow">
                        {data.length > 0 ? (
                            <table className="min-w-full text-sm">
                                <thead className="bg-gray-200">
                                    <tr>
                                        {columns.filter(col => col.visible).map(col => (
                                            <th key={col.key} className="px-4 py-2 text-left">{col.title}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, i) => (
                                        <tr key={i} className="border-b hover:bg-gray-50">
                                            {columns.filter(col => col.visible).map(col => (
                                                <td key={col.key} className="px-4 py-2">
                                                    {item?.[col.key] ?? "N/A"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex justify-center items-center h-40 mt-8">
                                <LoadingAnimation />
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Audience;
