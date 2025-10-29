import React, { useState } from "react";
import AutoLinkPreviewCard from "./AutoLinkPreviewCard";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState(null);

  const detectLink = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const found = text.match(urlRegex);
    setLink(found ? found[0] : null);
  };

  return (
    <div className="chat-input-container">
      <textarea
        placeholder="Type your message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          detectLink(e.target.value);
        }}
      />
      {link && <AutoLinkPreviewCard link={link} />}
    </div>
  );
}
