import React from "react";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import "./SelectList.css";

const SelectList = ({ label, lists, selected, setSelected }) => {
  return (
    <FormControl fullWidth className="selectlist-container">
      <InputLabel>{label}</InputLabel>
      <Select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        label={label}
        className="selectlist-select"
      >
        {lists.map((item) => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectList;
