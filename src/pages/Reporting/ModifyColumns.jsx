import React from "react";
import { Box, Button, TextField } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaGripLines } from "react-icons/fa";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

export default function ModifyColumns({
  metricsConfig,
  setMetricsConfig,
  expandedCategory,
  setExpandedCategory,
  onClose,
}) {
  const uniqueCategories = Array.from(
    new Set(metricsConfig.map((m) => m.category))
  );

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const visibleCols = metricsConfig.filter((col) => col.visible);
    const reordered = Array.from(visibleCols);
    const [removed] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, removed);
    const updated = metricsConfig
      .filter((col) => !col.visible)
      .concat(reordered);

    setMetricsConfig(updated);
  };

  return (
    <div className="max-w-9xl mx-auto p-6 border border-gray-200 rounded-lg bg-white shadow">
      <h3 className="text-lg font-medium mb-4">Modify Columns</h3>
      <div className="flex w-full">
        <div className="w-5/6">
          {uniqueCategories.map((category) => {
            const isOpen = expandedCategory === category;
            const catMetrics = metricsConfig.filter(
              (m) => m.category === category
            );

            return (
              <div key={category} className="mb-4">
                <button
                  className="w-full text-left font-medium text-sm capitalize px-2 py-1 rounded hover:bg-gray-100 flex justify-between"
                  onClick={() => setExpandedCategory(isOpen ? null : category)}
                >
                  {category}
                  <ChevronDownIcon
                    className={`h-4 w-4 transform transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pl-4 grid grid-cols-4 gap-2 mt-2 mb-2 transition-all duration-300 ease-in-out">
                    {catMetrics.map((metric) => (
                      <label
                        key={metric.key}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={metric.visible}
                          onChange={() => {
                            const updated = metricsConfig.map((m) =>
                              m.key === metric.key
                                ? { ...m, visible: !m.visible }
                                : m
                            );
                            setMetricsConfig(updated);
                          }}
                        />
                        <span>{metric.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="w-max p-4 mt-6 ">
          <p className="text-sm text-gray-500 mb-4">Drag and drop to reorder</p>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="columnsList">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 overflow-auto h-48 border rounded-md p-2"
                >
                  {metricsConfig
                    .filter((column) => column.visible)
                    .map((column, index) => (
                      <Draggable
                        key={column.key}
                        draggableId={column.key}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="flex items-center p-2 bg-gray-100 mb-1 rounded shadow"
                          >
                            <span className="flex items-center gap-4">
                              <FaGripLines /> {column.label}
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

          <div className="flex items-center mt-4 gap-2">
            <input type="checkbox" id="saveColumnSet" />
            <label htmlFor="saveColumnSet" className="text-sm">
              Save your column set (name required)
            </label>
          </div>

          {/* Optional column set name input */}
          <TextField
            variant="outlined"
            size="small"
            placeholder="Column set name"
            className="mt-2"
            fullWidth
          />
        </div>
      </div>

      <Box className="flex justify-end items-center gap-4 mt-6">
        <Button
          variant="outlined"
          color="secondary"
          className="text-white bg-gray-500 hover:bg-gray-600"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="bg-blue-600 hover:bg-blue-700"
          onClick={onClose}
        >
          Apply
        </Button>
      </Box>
    </div>
  );
}
