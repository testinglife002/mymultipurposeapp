import React, { useEffect, useState } from "react";
import { Avatar, Chip, Typography } from "@mui/material";
import { ChevronDown, Check } from "lucide-react";
import { getInitials } from "../../../utils";
import "./UserListAlt.css";

const UserListAlt = ({ setTeam, team, allUsers = [] }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Toggle selection
  const handleSelect = (user) => {
    const exists = selectedUsers.some((u) => u._id === user._id);
    const updatedUsers = exists
      ? selectedUsers.filter((u) => u._id !== user._id)
      : [...selectedUsers, user];

    setSelectedUsers(updatedUsers);
    setTeam(updatedUsers.map((u) => u._id));
  };

  

  useEffect(() => {
    if (allUsers.length > 0) {
      if (!team || team.length < 1) {
        setSelectedUsers([]);
      } else {
        const preselected = allUsers.filter((user) => team.includes(user._id));
        setSelectedUsers(preselected);
      }
    }

    console.log("AllUsers passed:", allUsers);
  }, [team, allUsers]);

  return (
    <div className="userlist-container">
      <Typography variant="body1" className="userlist-label">
        Assign Task To:
      </Typography>

      {/* Custom dropdown */}
      <div className="userlist-dropdown">
        <button
          type="button"
          className="userlist-toggle"
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          {selectedUsers.length > 0
            ? selectedUsers.map((user) => user.username).join(", ")
            : "Select team member(s)"}
          <ChevronDown className="dropdown-icon" size={18} />
        </button>

        {dropdownOpen && (
          <div className="userlist-menu">
            {allUsers.map((user) => {
              const active = selectedUsers.some((u) => u._id === user._id);
              return (
                <div
                  key={user._id}
                  className={`userlist-item ${active ? "active" : ""}`}
                  onClick={() => handleSelect(user)}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#673ab7",
                      width: 24,
                      height: 24,
                      fontSize: "0.7rem",
                    }}
                  >
                    {getInitials(user?.username || user?.username || "")}
                  </Avatar>
                  <Typography>{user?.username || user?.email} - {user?.email}</Typography>

                  {active && <Check size={16} className="check-icon" />}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Show selected users */}
      <div className="userlist-selected">
        {selectedUsers.map((user) => (
          <Chip
            key={user._id}
            label={user?.username}
            onDelete={() => handleSelect(user)}
            avatar={<Avatar>{getInitials(user?.username)}</Avatar>}
            className="user-chip"
          />
        ))}
      </div>
    </div>
  );
};

export default UserListAlt;
