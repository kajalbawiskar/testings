import React from "react";
import clsx from "clsx";

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={clsx(
        "bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
