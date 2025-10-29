// src/admin/components/UserProfile.jsx
import React from "react";
import { User } from "lucide-react";
import "./UserProfile.css";

const UserProfile = ({ user }) => {
  return (
    <div className="card">
      <div className="card-header">
        <User size={20} />
        <h4>User Profile</h4>
      </div>
      <div className="card-body">
        <p><strong>Name:</strong> {user?.displayName}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>UID:</strong> {user?.uid}</p>
        {user?.photoURL && (
          <div className="profile-photo">
            <img src={user.photoURL} alt="User" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;