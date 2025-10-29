//Step 4. Create src/components/MessageList.jsx
// src/components/MessageList.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest"; // ✅ correct path if this file is in src/components

export default function MessageList() {
  const [messages, setMessages] = useState([]);

  async function fetchMessages() {
    try {
      const res = await newRequest.get("/whatsapp/all");
      setMessages(res.data); // ✅ Axios returns data here
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  }

  useEffect(() => {
    fetchMessages();
  }, []);

  async function deleteMessage(id) {
    if (!window.confirm("Delete this message?")) return;
    try {
      await newRequest.delete(`/whatsapp/${id}`); // ✅ use Axios instead of fetch
      fetchMessages();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto" }}>
      <h2>All Messages & Drafts</h2>

      {messages.length === 0 && <p>No messages yet.</p>}

      {messages.map((msg) => (
        <div
          key={msg._id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 6,
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p><b>To:</b> {msg.to}</p>
          <p><b>Message:</b> {msg.message}</p>
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color:
                  msg.status === "sent"
                    ? "green"
                    : msg.status === "draft"
                    ? "orange"
                    : "red",
              }}
            >
              {msg.status}
            </span>
          </p>
          <button onClick={() => deleteMessage(msg._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
