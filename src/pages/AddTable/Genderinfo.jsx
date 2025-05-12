/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { FaFilter, FaColumns } from "react-icons/fa";
import LoadingAnimation from "../../components/LoadingAnimation";
import { MdOutlineFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import FileSaver from "file-saver";
import { TablePagination } from "@mui/material";

const GenderInfo = ({ startDate, endDate }) => {
  const [showColumnsMenu, setShowColumnsMenu] = useState(false);
  const [columns, setColumns] = useState([
    { title: "Gender", key: "gender", visible: true },
    { title: "Campaign", key: "campaign_name", visible: true },
    { title: "Impr.", key: "impressions", visible: true },
    { title: "CTR", key: "ctr", visible: true },
    { title: "Cost", key: "cost", visible: true },
    { title: "Clicks", key: "clicks", visible: true },
    { title: "Conv. rate", key: "conversion_rate", visible: true },
    { title: "Conversions", key: "conversions", visible: true },
    { title: "Avg. CPC", key: "average_cpc", visible: true },
  ]);
  const [tableVisible, setTableVisible] = useState(true);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [data, setData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ColumnItem = ({ column, index, toggleVisibility }) => (
    <div className="flex items-center p-2 mb-1 rounded cursor-pointer bg-white shadow-sm">
      <input
        type="checkbox"
        checked={column.visible}
        onChange={() => toggleVisibility(column.key)}
        className="mr-2"
        disabled={column.locked}
      />
      <span>{column.title}</span>
    </div>
  );

  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key ? { ...col, visible: !col.visible } : col
      )
    );
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const fetchData = async () => {
      let requestBody = {
        customer_id: 4643036315,
      };

      if (startDate === endDate) {
        requestBody.single_date = startDate;
      } else {
        requestBody.start_date = startDate;
        requestBody.end_date = endDate;
      }

      try {
        const response = await fetch("https://api.confidanto.com/gender_info", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const result = await response.json();
        setData(result.gender_info || []);
      } catch (error) {
        console.error("Error fetching gender info:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const openColumnsMenu = () => {
    setShowColumnsMenu(true);
    setTableVisible(false);
  };

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
      XLSX.writeFile(wb, `data.${format === "csv" ? "csv" : "xlsx"}`);
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

  return (
    <div className="flex h-full bg-gray-100 font-roboto">
      <main className="flex-grow p-6 overflow-y-auto">
        <div className="flex justify-end items-center mb-4 space-x-2">
          <button className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200">
            <FaFilter className="ml-5" /> Add filter
          </button>

          <div className="relative">
            <button
              className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
              onClick={openColumnsMenu}
            >
              <FaColumns className="ml-5" /> Columns
            </button>
            {showColumnsMenu && (
              <div className="absolute right-0 h-screen bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-800 max-w-3xl border border-gray-200">
                <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700">
                  Modify columns for ad groups
                </div>
                <div className="grid grid-rows-2 gap-6 max-h-screen">
                  <div className="">
                    <div className="font-semibold overflow-x-auto mb-2 text-gray-700">
                      Recommended columns
                    </div>
                    <div className="grid grid-cols-5 space-x-3 space-y-2">
                      {columns
                        .filter((col) => !col.locked && !col.section)
                        .map((col, index) => (
                          <ColumnItem
                            key={col.key}
                            column={col}
                            index={index}
                            toggleVisibility={toggleColumnVisibility}
                          />
                        ))}
                    </div>
                    <div className="flex space-x-2 pt-1 mt-2">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={applyChanges}
                      >
                        Apply
                      </button>
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                        onClick={cancelChanges}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="bg-transparent text-gray-600 px-4 py-2 rounded items-center hover:bg-slate-200"
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
            >
              <MdOutlineFileDownload className="ml-5" />
              Download
            </button>
            {showDownloadOptions && (
              <div className="absolute right-0 bg-white shadow-md rounded p-4 mt-2 z-20 border border-gray-200">
                {["pdf", "csv", "excel", "xml", "google_sheets"].map(
                  (format) => (
                    <button
                      key={format}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => downloadData(format)}
                    >
                      {format.toUpperCase().replace("_", " ")}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        {tableVisible && columns.length > 0 && (
          <div className="overflow-x-auto max-w-full overflow-y-auto">
            {data.length > 0 ? (
              <>
                <table className="min-w-full bg-white rounded-lg overflow-y-auto shadow-md">
                  <thead>
                    <tr className="bg-gray-200 normal-case text-sm leading-normal">
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => (
                          <th key={col.key} className="py-3 px-6 text-left">
                            {col.title}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {data
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-200 hover:bg-gray-100"
                        >
                          {columns
                            .filter((col) => col.visible)
                            .map((col) => (
                              <td key={col.key} className="py-3 px-6 text-left">
                                {item[col.key]}
                              </td>
                            ))}
                        </tr>
                      ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100 font-semibold">
                      {columns
                        .filter((col) => col.visible)
                        .map((col) => {
                          // Total only for numeric fields
                          const total = data.reduce((sum, item) => {
                            const value = item[col.key];
                            return typeof value === "number"
                              ? sum + value
                              : sum;
                          }, 0);

                          return (
                            <td key={col.key} className="py-2 px-6 text-left">
                              {typeof data[0]?.[col.key] === "number"
                                ? total.toLocaleString()
                                : ""}
                            </td>
                          );
                        })}
                    </tr>
                  </tfoot>
                </table>

                <TablePagination
                  component="div"
                  count={data.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                />
              </>
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

export default GenderInfo;
