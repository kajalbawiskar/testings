import React, { useState, useRef } from "react";
import { FaGripLines } from "react-icons/fa";

import axios from "axios";
import { IoIosArrowDown } from "react-icons/io";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { RiDeleteBin6Line } from "react-icons/ri";

function ModifyCardDrag({
  columns,
  setColumns,
  setShowCardColumns,
  setTableVisible,
  setTotal,
  setTotalShow,
}) {
  // Do NOT declare useState for cards here!
  const [columnSearchString, setColumnSearchString] = useState("");
  const [cards, setCards] = useState([
    {
      id: "0",
      title: "Clicks",
      key: "clicks",
      color: "text-[#75848B]",
      visible: true,
      category: "Performance",
      locked: false,
    },
    {
      id: "1",
      title: "Cost",
      key: "costs",
      color: "text-[#75848B]",
      visible: true,
      category: "Conversions",
      locked: false,
    },
    {
      id: "2",
      title: "CTR",
      key: "ctr",
      color: "text-[#75848B]",
      visible: true,
      category: "Conversions",
      locked: false,
    },
    {
      id: "3",
      title: "Conversion",
      key: "conversions",
      color: "text-[#75848B]",
      visible: true,
      category: "Conversions",
      locked: false,
    },
    {
      id: "4",
      title: "Avg Cost",
      key: "average_cost",
      color: "text-[#75848B]",
      visible: true,
      category: "Conversions",
      locked: false,
    },
    {
      id: "5",
      title: "Avg Cpc",
      key: "average_cpc",
      color: "text-[#75848B]",
      visible: false,
      category: "Conversions",
      locked: false,
    },
    {
      id: "6",
      title: "Avg Cpm",
      key: "average_cpm",
      color: "text-[#75848B]",
      visible: false,
      category: "Conversions",
      locked: false,
    },
    {
      id: "7",
      title: "Impressions",
      key: "impressions",
      color: "text-[#75848B]",
      visible: false,
      category: "Performance",
      locked: false,
    },
    {
      id: "8",
      title: "Cost/Conv",
      key: "cost_per_conv",
      color: "text-[#75848B]",
      visible: false,
      category: "Conversions",
      locked: false,
    },
    {
      id: "9",
      title: "Interaction Rate",
      key: "interaction_rate",
      color: "text-[#75848B]",
      visible: false,
      category: "Performance",
      locked: false,
    },
    {
      id: "10",
      title: "Interactions",
      key: "interactions",
      color: "text-[#75848B]",
      visible: false,
      category: "Performance",
      locked: false,
    },
    {
      id: "11",
      title: "Budget",
      key: "remaining_budget",
      color: "text-[#75848B]",
      visible: false,
      category: "Conversions",
      locked: false,
    },
    {
      id: "12",
      title: "Conversion Rate",
      key: "conversion_rate",
      color: "text-[#75848B]",
      visible: false,
      category: "Conversions",
      locked: false,
    },
  ]);
  console.log(cards.map((card) => card.id)); // Ensure all are valid strings

  const [showCustomColumnForm, setShowCustomColumnForm] = useState(false);

  const [expandedCategory, setExpandedCategory] = useState(null);

  const uniqueCategories = Array.from(
    new Set(cards.map((card) => card.category))
  );

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  const ColumnItem = ({ card, index, toggleVisibility, category }) => {
    return (
      <div className="flex flex-row items-center justify-between  p-2 mb-1 rounded cursor-pointer bg-white shadow-sm hover:bg-slate-100">
        <div className="">
          <input
            type="checkbox"
            checked={card.visible}
            onChange={() => toggleVisibility(card.key)}
            className="mr-2"
            disabled={card.locked}
          />
          <span>{card.title}</span>
        </div>
        {category == "Custom Columns" && (
          <>
            <button
              onClick={() => {
                deleteCustomColumn(card.id, card.title);
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
    if (!destination) return;

    const visibleCards = cards.filter((card) => card.visible);
    const hiddenCards = cards.filter((card) => !card.visible);

    const reordered = Array.from(visibleCards);
    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    const newOrder = [...reordered, ...hiddenCards];

    setCards(newOrder);
  };

  const toggleColumnVisibility = (key) => {
    setCards(
      cards.map((card) =>
        card.key === key && !card.locked
          ? { ...card, visible: !card.visible }
          : card
      )
    );
  };

  const applyChanges = () => {
    setShowCardColumns(false);
    setTableVisible(true);
  };

  const cancelChanges = () => {
    setShowCardColumns(false);
    setTableVisible(true);
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
              <div className="w-full flex flex-row justify-center items-center"></div>
            ) : (
              <>
                <section className="w-4/5 flex flex-row justify-between items-center">
                  <h2 className="mr-11">Modify cards</h2>
                  <div className="searchColumns cursor-pointer mr-4 outline-1 outline-slate-500"></div>
                </section>
              </>
            )}
          </div>
          <div className=" justify-start">
            <h2 className="font-bold mb-4">Your cards</h2>
          </div>
        </div>
      </div>

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
                        {cards
                          .filter((card) => card.category === category)
                          .map((card) => (
                            <ColumnItem
                              key={card.id || card.key}
                              card={card}
                              toggleVisibility={toggleColumnVisibility}
                              category={card.category}
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
              <Droppable droppableId="cards-droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 overflow-auto h-48 border rounded-md p-2"
                  >
                    {cards
                      .filter((card) => card.visible)
                      .map((card, index) => (
                        <Draggable
                          key={card.id || card.key}
                          draggableId={String(card.id || card.key)}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex items-center p-2 bg-gray-100 mb-1 rounded shadow"
                            >
                              <FaGripLines />
                              <span className="ml-2">{card.title}</span>
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

export default ModifyCardDrag;
