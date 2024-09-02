import React from 'react';

const CustomDateInput = ({ id, label, value, onChange }) => {
  return (
    <label htmlFor={id} className="flex flex-col items-start text-balck text-lg cursor-pointer select-none">
      <span className="-mb-3 p-1 bg-white z-10 text-sm ml-2">{label}</span>
      <input
        id={id}
        type="date"
        value={value}
        onChange={onChange}
        className="appearance-none bg-transparent border-2 text-base px-3 border-red-500 text-black rounded p-1 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all duration-300 ease-in-out"
      />
    </label>
  );
};

export default CustomDateInput;
