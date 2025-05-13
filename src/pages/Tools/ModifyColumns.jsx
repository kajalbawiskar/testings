import React, { useState, useEffect, useRef } from "react";
import {
  FaFilter,
  FaSearch,
  FaColumns,
  FaExpand,
  FaCompress,
  FaGripLines,
  FaLayerGroup,
} from "react-icons/fa";

import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { IoIosClose } from "react-icons/io";

import { Link } from "react-router-dom";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCodeSharp } from "react-icons/io5";
import { MdLockOutline } from "react-icons/md";

function ModifyColumns({
  columns,
  setColumns,
  setShowColumnsMenu,
  setTableVisible,
  setTotal,
  setTotalShow,
}) {
  const [showCustomColumnForm, setShowCustomColumnForm] = useState(false);

  const [expandedCategory, setExpandedCategory] = useState(null);

  const uniqueCategories = Array.from(
    new Set(columns.map((col) => col.category))
  );

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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
          let newColumns = columns.filter((col) => col.id != id);
          setColumns(newColumns);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return; // If the item was dropped outside the list

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (columns[source.index].isLocked || destination.index === 0) return;


    const visibleColumns = columns.filter((col) => col.visible);

    const reorderedVisibleColumns = Array.from(visibleColumns);
    const [movedVisibleItem] = reorderedVisibleColumns.splice(source.index, 1);
    reorderedVisibleColumns.splice(destination.index, 0, movedVisibleItem);

    const updatedFullColumns = [];
    let visibleItemIndex = 0;
    columns.forEach((originalColumn) => {
      if (originalColumn.visible) {
        if (visibleItemIndex < reorderedVisibleColumns.length) {
          updatedFullColumns.push(reorderedVisibleColumns[visibleItemIndex]);
          visibleItemIndex++;
        } else {
          updatedFullColumns.push(originalColumn);
        }
      } else {
        updatedFullColumns.push(originalColumn); 
      }
    });

    setColumns(updatedFullColumns);

    delayFunction();
  };

  const delayFunction = async () => {
    if(setTableVisible != null && setTotalShow != null && setTotal != null){
      setTableVisible(false);
      setTotalShow(false);
      setTotal({});

      await new Promise(resolve => setTimeout(resolve, 100));
      setTableVisible(true);
      setTotalShow(true ); 
      setTotal({});
    }
};

  //hide unhide columns
  const toggleColumnVisibility = (key) => {
    setColumns(
      columns.map((col) =>
        col.key === key && !col.locked ? { ...col, visible: !col.visible } : col
      )
    );

    if (setTotal != undefined && setTotalShow != undefined) {
      setTotal({});
      setTotalShow(false);
      setTotalShow(true);
    }
  };

  const applyChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowColumnsMenu(false);
    setTableVisible(true);
  };

  // Search Columns
  const [columnSearchString, setColumnSearchString] = useState("");
  const searchColumns = (e) => {
    let str = e.target.value.toLowerCase();
    setColumnSearchString(str);
  };

  const filterByColumnString = (value) => {
    return value.toLowerCase().includes(columnSearchString);
  };

  const findColumnByKey = (key) => {
    let colObj = columns.filter((col) => col.key == key);
    columns.map((col) => {
      if (col.key == key) {
        col.visible = true;
      }
    });
    setExpandedCategory(colObj[0].category);
    setShowCustomColumnForm(false);
    setColumnSearchString("");
  };
  const columnSearchRef = useRef(null);
  return (
    <div className="absolute right-0 h-max bg-white shadow-md rounded p-4 mt-2 z-20 lg:w-max max-w-6xl border border-gray-200">
      <div className="font-bold mb-0 w-screen max-h-full text-lg text-gray-700 flex">
        <div className=" justify-between flex items-center border-b-1 w-[1100px] ">
          <div className=" flex border-r-1  p-4 w-3/4 flex-row justify-between items-center">
            {showCustomColumnForm ? (
              <div className="w-full flex flex-row justify-center items-center">
                <input
                  type="text"
                  className="w-full border-b-1 border-gray-400 p-1  focus:outline-none focus:ring-0"
                  onChange={(e) => {
                    searchColumns(e);
                  }}
                  ref={columnSearchRef}
                  placeholder="Enter Column Name"
                />

                <button
                  onClick={() => {
                    setShowCustomColumnForm(false);
                  }}
                >
                  <IoIosClose className=" text-4xl hover:text-white hover:bg-red-500" />
                </button>
              </div>
            ) : (
              <>
                <section className="w-4/5 flex flex-row justify-between items-center">
                  <h2 className="mr-11">Modify columns</h2>
                  <div className="searchColumns cursor-pointer mr-4 outline-1 outline-slate-500">
                    <button
                      onClick={() => {
                        setShowCustomColumnForm(!showCustomColumnForm);
                        columnSearchRef.current?.focus();
                        // if(showCustomColumnForm){
                        //   alert("Hello")
                        // }
                      }}
                      className=""
                    >
                      <FaSearch />
                    </button>
                  </div>
                </section>
                {/* <Link to="/custom-column" className="text-blue-400 w-1/5">
                + Custom column</Link> */}
              </>
            )}
          </div>
          <div className=" justify-start">
            <h2 className="font-bold mb-4">Your columns</h2>
          </div>
        </div>
      </div>

      {/* Show Custom Column Form if active */}

      <>
        <div className="flex ">
          <div className=" h-56 w-3/4">
            {showCustomColumnForm ? (
              <div className="w-full h-full overflow-auto">
                {columns.filter((col) => filterByColumnString(col.title))
                  .length <= 0 ? (
                  <div>No Columns Found</div>
                ) : (
                  <>
                    {columns
                      .filter((col) => filterByColumnString(col.title))
                      .map((col) => {
                        return (
                          <div
                            className="w-full cursor-pointer p-2 hover:bg-slate-200"
                            onClick={() => {
                              findColumnByKey(col.key);
                            }}
                          >
                            {col.title}
                          </div>
                        );
                      })}
                  </>
                )}
              </div>
            ) : (
              <div className=" space-x-3 space-y-2  h-72  overflow-auto">
                {uniqueCategories.map((category) => (
                  <div key={category}>
                    <div className="" onClick={() => toggleCategory(category)}>
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
                      <div className="grid grid-cols-3">
                        {columns
                          .filter((col) => col.category === category)
                          .map((col) => (
                            <ColumnItem
                              key={col.key}
                              column={col}
                              toggleVisibility={toggleColumnVisibility}
                              category={col.category}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="w-max p-4">
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder
            </p>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="columnsList">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 overflow-auto h-48 border rounded-md p-2"
                  >
                    {columns
                      .filter((column) => column.visible) // Only show visible columns
                      .map((column, index) => (
                        <Draggable
                          key={column.id}
                          draggableId={column.id}
                          index={index}
                          isDragDisabled={column.isLocked}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center p-2 bg-gray-100 mb-1 rounded shadow"
                            >
                              <span className="flex items-center gap-4">
                                {column.isLocked == false && <FaGripLines />}
                                {column.isLocked && (
                                  <MdLockOutline
                                    size={26}
                                    className="font-bold text-gray-700  "
                                  />
                                )}{" "}
                                {column.title}{" "}
                              </span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div className="flex items-center mt-4">
              <input type="checkbox" id="saveColumnSet" className="mr-2" />
              <label htmlFor="saveColumnSet" className="text-sm">
                Save your column set (name required)
              </label>
            </div>
          </div>
        </div>
        <div className="flex space-x-2 ">
          <div className="">
            <button
              className=" bg-blue-500 text-white px-4  py-2 rounded hover:text-blue-600"
              onClick={applyChanges}
            >
              Apply
            </button>
            <button
              className="text-white ml-3 bg-gray-400 px-4 py-2 rounded hover:text-gray-600"
              onClick={cancelChanges}
            >
              Cancel
            </button>
          </div>
        </div>
      </>
    </div>
  );
}

export default ModifyColumns;
