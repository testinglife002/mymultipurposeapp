import React from "react";
import "./Title.css";

const Title = ({ title, className = "" }) => {
  return (
    <h2 className={`title-heading ${className}`}>
      {title}
    </h2>
  );
};

export default Title;
