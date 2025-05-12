import React from 'react'
import { MdOutlineFileDownload } from "react-icons/md";

import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import autoTable from "jspdf-autotable";


function Download({columns,data, closeModalBoxes, showDownloadOptions, setShowDownloadOptions,  DownloadRef}) {

    const downloadData = (format) => {
        const visibleColumns = columns.filter((col) => col.visible);
        const headers = visibleColumns.map((col) => col.title);
        const rows = data.map((item) => visibleColumns.map((col) => item[col.key]));
    
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
              `,
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
  return (
    <div className="relative" ref={DownloadRef}>
        <button
        className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-100"
        onClick={() => {
            closeModalBoxes("Download");
        }}
        >
        <MdOutlineFileDownload className="ml-5 " />
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
  )
}

export default Download