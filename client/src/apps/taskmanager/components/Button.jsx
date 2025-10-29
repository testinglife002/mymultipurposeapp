import React from "react";
import { Button as MuiButton } from "@mui/material";
import clsx from "clsx";
import "./Button.css";

const Button = ({ label, className, ...props }) => {
  return (
    <MuiButton
      {...props}
      className={clsx("custom-btn", className)}
      variant={props.variant || "contained"}
    >
      {label || props.children}
    </MuiButton>
  );
};

export default Button;
