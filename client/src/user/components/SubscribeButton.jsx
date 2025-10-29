// src/admin/components/SubscribeButton.jsx
import React, { useState } from "react";
import { Bell } from "lucide-react";
import "./SubscribeButton.css";

const SubscribeButton = ({ user, categoryName }) => {
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = () => {
    // Here you can integrate your Firebase subscription logic
    setSubscribed(!subscribed);
  };

  return (
    <button
      className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
      onClick={handleSubscribe}
    >
      <Bell size={16} />
      {subscribed ? "Subscribed" : "Subscribe"}
    </button>
  );
};

export default SubscribeButton;

