import React from "react";
import { FaQuestion } from "react-icons/fa";
import Wrapper from "./Wrapper";
import Button from "./Button";
import "./ConfirmatioDialog.css";

export function UserAction({ open, setOpen, onClick = () => {} }) {
  const closeDialog = () => setOpen(false);

  return (
    <Wrapper open={open} setOpen={closeDialog}>
      <div className="confirm-dialog">
        <div className="confirm-icon delete">
          <FaQuestion size={60} />
        </div>

        <p className="confirm-message">
          Are you sure you want to activate or deactivate this account?
        </p>

        <div className="confirm-actions">
          <Button
            type="button"
            className="confirm-btn btn-delete"
            onClick={onClick}
            label="Yes"
          />
          <Button
            type="button"
            className="confirm-btn btn-cancel"
            onClick={closeDialog}
            label="No"
          />
        </div>
      </div>
    </Wrapper>
  );
}
