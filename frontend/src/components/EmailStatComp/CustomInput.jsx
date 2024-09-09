import React from "react";

const CustomInput = ({ id, label, value, onChange }) => {
  return (
    <label
      htmlFor={id}
      className="flex flex-col items-start text-balck text-base cursor-pointer select-none"
    >
      <span className="font-Poppins font-semibold mb-1">{label}</span>
      <input
        id={id}
        type="number"
        value={value}
        onChange={onChange}
        className="appearance-none w-full py-2 bg-transparent border-2 text-base px-3 border-red-500 text-black rounded p-1 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-300 ease-in-out"
      />
    </label>
  );
};

export default CustomInput;
