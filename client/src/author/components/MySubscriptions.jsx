// src/admin/components/MySubscriptions.jsx
import React from "react";
import { Users } from "lucide-react";
 import "./MySubscriptions.css";

const MySubscriptions = ({ subs }) => {
  return (
    <div className="card">
      <div className="card-header">
        <Users size={20} />
        <h4>My Subscriptions</h4>
      </div>
      <div className="card-body">
        {subs.length === 0 ? (
          <p>No subscriptions</p>
        ) : (
          <ul className="subscription-list">
            {subs.map((sub, i) => (
              <li key={i}>
                {sub.type === "category"
                  ? `Category: ${sub.categoryName}`
                  : `Author ID: ${sub.authorId}`}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;