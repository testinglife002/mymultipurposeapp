import React from "react";
import { FaQuestion } from "react-icons/fa";
import Wrapper from "./Wrapper";
import Button from "./Button";
import "./ConfirmatioDialog.css";

export default function ConfirmatioDialog({
  open,
  setOpen,
  msg,
  setMsg = () => {},
  onClick = () => {},
  type = "delete",
  setType = () => {},
}) {
  const closeDialog = () => {
    setType("delete");
    setMsg(null);
    setOpen(false);
  };

  const isRestore = type === "restore" || type === "restoreAll";

  return (
    <Wrapper open={open} setOpen={closeDialog}>
      <div className="confirm-dialog">
        <div
          className={`confirm-icon ${isRestore ? "restore" : "delete"}`}
        >
          <FaQuestion size={60} />
        </div>

        <p className="confirm-message">
          {msg ?? "Are you sure you want to delete the selected record?"}
        </p>

        <div className="confirm-actions">
          <Button
            type="button"
            className={`confirm-btn ${isRestore ? "btn-restore" : "btn-delete"}`}
            onClick={onClick}
            label={isRestore ? "Restore" : "Delete"}
          />

          <Button
            type="button"
            className="confirm-btn btn-cancel"
            onClick={closeDialog}
            label="Cancel"
          />
        </div>
      </div>
    </Wrapper>
  );
}
