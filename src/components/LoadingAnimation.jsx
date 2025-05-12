import React, { useState, useEffect } from "react";
import { useStateContext } from "../contexts/ContextProvider";

const LoadingAnimation = () => {
  const loadingText = "Loading...";
  const [visibleText, setVisibleText] = useState("");
  const { currentColor } = useStateContext();

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setVisibleText((prevText) => prevText + loadingText[index]);
      index++;
      if (index === loadingText.length) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-40 w-40 border-t-2 border-b-8 border-gray-900" style={{ borderColor: currentColor }}></div>
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
          <div className="font-bold text-lg">{visibleText}</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
