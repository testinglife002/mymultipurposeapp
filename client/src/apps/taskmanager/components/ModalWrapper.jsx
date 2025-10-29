import React from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { IoClose } from "react-icons/io5";
import "./ModalWrapper.css";

const ModalWrapper = ({ open, setOpen, children, title }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{ className: "modal-wrapper-paper" }}
    >
      {title && (
        <DialogTitle className="modal-wrapper-header">
          {title}
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
            className="modal-close-btn"
          >
            <IoClose />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent className="modal-wrapper-body">{children}</DialogContent>
    </Dialog>
  );
};

export default ModalWrapper;
