import React, { useState } from "react";

 const ToggleSwitch = ({ isToggled, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        className="sr-only peer"
        type="checkbox"
        checked={isToggled}
        onChange={onToggle}
      />
      <div className="group peer ring-0 bg-gray-50 border-2 border-red-600 rounded-full outline-none duration-700 after:duration-200 w-28 h-12 shadow-md peer-checked:bg-gradient-to-r peer-focus:outline-none after:content-[''] after:rounded-full after:absolute after:bg-gradient-to-r after:from-[#FF4B2B] after:to-[#FF416C] after:outline-none after:h-10 after:w-10 after:top-1 after:left-1 peer-checked:after:translate-x-16 peer-hover:after:scale-95">
        <span
          className={`absolute text-lg font-bold top-2 right-5 text-red-600 ${
            isToggled ? "hidden" : "block"
          }`}
        >
          Daily
        </span>
        <span
          className={`absolute text-lg font-bold top-2  left-5 text-red-600 ${
            isToggled ? "block" : "hidden"
          }`}
        >
          Top 
        </span>
      </div>
    </label>
  );
};

 export default ToggleSwitch