import React from "react";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./ItemAlt.css";

const ItemAlt = ({ design, delete_design }) => {
  return (
    <div className="item-container">
      <Link className="item-link">
        <img
          className="item-image"
          src={design.image_url}
          alt="User Design"
        />
      </Link>
      <div className="item-delete"  onClick={() => delete_design(design._id)}>
        <FaTrash />
      </div>
    </div>
  );
};

export default ItemAlt;
