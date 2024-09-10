import React from "react";

const CustomCheckBtn = ({ checked, onChange }) => {
  return (
    <>
      <label class="relative inline-block text-[20px] cursor-pointer select-none mt-3">
        <input
          type="checkbox"
          class="absolute opacity-0 cursor-pointer h-0 w-0 peer"
          checked={checked}
          onChange={onChange}
        />
        <div class="relative top-0 left-0 h-[1.3em] w-[1.3em] bg-[#dadada] rounded-md transition-all duration-500 peer-checked:bg-[#ffffff] peer-checked:border-2 peer-checked:border-[#FF4841]"></div>
        <div class="absolute top-[0.3em] left-[0.5em] w-[0.3em] h-[0.65em] border-[#FF4841] border-solid border-0 border-r-[0.2em] border-b-[0.2em] rounded-[4px] rotate-[45deg] hidden peer-checked:block filter drop-shadow-[0_0_10px_#888]"></div>
      </label>
    </>
  );
};

export default CustomCheckBtn;
