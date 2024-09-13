import React, { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays, subDays } from "date-fns";
import { Button, Popover } from "@mui/material";

const DropdownCalendar = ({ startDate, endDate, onDateChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const initialStartDate = subDays(startDate || new Date(), 7);

  const [selectionRange, setSelectionRange] = useState({
    startDate: initialStartDate,
    endDate: endDate || new Date(),
    key: "selection",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
    if (onDateChange) {
      onDateChange(ranges.selection); // Call the parent-provided onDateChange
    }
  };

  return (
    <div>
      <Button aria-describedby={id} variant="contained" onClick={handleClick}   sx={{
    background: "linear-gradient(to right, #FF4B2B, #FF416C)",
    color: "#fff",
    "&:hover": {
      background: "linear-gradient(to right, #FF4B2B, #FF416C)",
      opacity: 0.9,
    },
  }}>
        {`${selectionRange.startDate.toLocaleDateString()} - ${selectionRange.endDate.toLocaleDateString()}`}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <DateRangePicker
          ranges={[selectionRange]}
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={1}
          direction="horizontal"
          showDateDisplay={false}
          rangeColors={["#FF416C"]}
          // Pass an empty array to remove the predefined ranges
          definedRanges={[]}
        />
      </Popover>
    </div>
  );
};

export default DropdownCalendar;
