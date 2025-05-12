import React from "react";

export const Button = ({ children, ...props }) => (
  <button
    style={{
      backgroundColor: "#4f46e5",
      color: "white",
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    }}
    {...props}
  >
    {children}
  </button>
);
