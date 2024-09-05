import React from "react";

const CustomCheckBtn = ({showOpenCount, setShowOpenCount, label}) => {
  return (
      <label  class="flex items-center text-black text-lg cursor-pointer select-none mr-3">
        <input
          type="checkbox"
          className="appearance-none  w-5 h-5 border-2 border-red-600 rounded bg-transparent inline-block relative mr-2 cursor-pointer before:content-[''] before:bg-gradient-to-tr from-[#FF4B2B] to-[#FF416C] before:absolute before:top-1/2 before:left-1/2 before:transform before:-translate-x-1/2 before:-translate-y-1/2 before:scale-0 before:w-2.5 before:h-2.5 before:rounded transition-all duration-300 ease-in-out checked:before:scale-100"
          checked={showOpenCount}
          onChange={(e) => setShowOpenCount(e.target.checked)}
        />
        {label}
      </label>
  );
};

export default CustomCheckBtn;
