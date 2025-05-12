import React from "react";
import {LoginLoding} from "../assets/index";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <img src={LoginLoding} alt="Loading" className="object-cover h-fit w-fit" />
    </div>
  );
};

export default LoadingSpinner;
