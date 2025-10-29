import React, { useState } from "react";
import {
  Typography,
  Chip,
  TextField,
  Button as MuiButton,
  Box,
} from "@mui/material";
import "./UserList.css";

const UserList = ({ team, setTeam }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddMember = () => {
    if (inputValue.trim() && !team.includes(inputValue.trim())) {
      setTeam([...team, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveMember = (member) => {
    setTeam(team.filter((m) => m !== member));
  };

  return (
    <Box className="userlist-container">
      <Typography variant="subtitle1" className="userlist-label">
        Task Team
      </Typography>

      <div className="userlist-members">
        {team.length === 0 && (
          <div className="userlist-empty">No team members added.</div>
        )}
        {team.map((member) => (
          <Chip
            key={member}
            label={member}
            onDelete={() => handleRemoveMember(member)}
            className="user-chip"
          />
        ))}
      </div>

      <div className="userlist-input">
        <TextField
          variant="outlined"
          size="small"
          placeholder="Add team member"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddMember();
            }
          }}
          className="userlist-textfield"
        />
        <MuiButton
          variant="contained"
          color="primary"
          onClick={handleAddMember}
          className="userlist-btn"
        >
          Add
        </MuiButton>
      </div>
    </Box>
  );
};

export default UserList;
