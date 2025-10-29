import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import "./AssignUserModalUI.css";

const AssignUserModalUI = ({
  isOpen,
  onClose,
  existingMembers = [],
  users = [],
  selectedUser,
  onSelectUser,
  onAddMember,
  onRemoveMember,
}) => {
  const [selectedMembers, setSelectedMembers] = useState(
    existingMembers.map((m) => m._id)
  );

  useEffect(() => {
    setSelectedMembers(existingMembers.map((m) => m._id));
  }, [existingMembers]);

  if (!isOpen) return null;

  const toggleMember = (user) => {
    if (selectedMembers.includes(user._id)) {
      onRemoveMember(user._id);
    } else {
      onAddMember(user._id);
    }
  };

  return (
    <div className="aum-overlay">
      <div className="aum-modal">
        <div className="aum-header">
          <h4>Manage Members</h4>
          <button onClick={onClose} className="aum-close">
            <X size={18} />
          </button>
        </div>

        <div className="aum-body">
          {users.map((user) => (
            <div key={user._id} className="aum-user-item" onClick={() => toggleMember(user)}>
              <input
                type="checkbox"
                checked={selectedMembers.includes(user._id)}
                onChange={() => toggleMember(user)}
              />
              <span>{user.username || user.email}</span>
            </div>
          ))}

          <div className="aum-add-member">
            <input
              type="text"
              placeholder="Add member by email..."
              value={selectedUser}
              onChange={(e) => onSelectUser(e.target.value)}
            />
            <button
              className="aum-btn add"
              onClick={onAddMember}
              disabled={!selectedUser.trim()}
            >
              Add
            </button>
          </div>
        </div>

        <div className="aum-footer">
          <button onClick={onClose} className="aum-btn cancel">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignUserModalUI;
