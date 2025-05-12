/* eslint-disable jsx-a11y/iframe-has-title */
import React from "react";
import { ColorPickerComponent } from "@syncfusion/ej2-react-inputs";

import { Header } from "../components";

const change = (args) => {
  document.getElementById("preview").style.backgroundColor =
    args.currentValue.hex;
};

const CustomColorPicker = ({ id, mode }) => (
  <ColorPickerComponent
    id={id}
    mode={mode}
    modeSwitcher={false}
    inline
    showButtons={false}
    change={change}
  />
);

const DeviceLevel = () => (
  <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
    <Header title="Device Level Analysis" />
    <div className="text-center">
      <div className="flex justify-center items-center gap-20 flex-wrap">
        <iframe
          className="responsive-iframe w-full h-screen"
          src="https://lookerstudio.google.com/embed/reporting/1ff0b910-a387-4bac-89a3-4ed04aa5fcc5/page/L6LoD"
          allowfullscreen
          sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        ></iframe>
      </div>
    </div>
  </div>
);

export default DeviceLevel;
