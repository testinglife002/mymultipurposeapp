// /client/src/components/WhatsAppSender.jsx
import React, { useState } from "react";
// import axios from "axios";
import newRequest from "../../api/newRequest"; // ✅ correct path if this file is in src/components


const WhatsAppSender = () => {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      // const res = await newRequest.post("/whatsapp/send", { to, message });
      const res = await newRequest.post("/whatsapp/send-message", { to, message });
      if (res.data.success) {
        setStatus("✅ Message sent successfully!");
      } else {
        setStatus("❌ Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      setStatus("⚠️ Error sending message.");
    }
  };

  const handleSendText = async () => {
    try {
        const res = await newRequest.post("/whatsapp/send-text", {
        to,
        message,
        });

        if (res.data.success) setStatus("✅ Message sent successfully!");
        else setStatus(`❌ ${res.data.message || "Failed to send message"}`);
    } catch (err) {
        console.error(err);
        setStatus(`⚠️ Error: ${err.response?.data?.message || err.message}`);
    }
    };



  return (
    <div className="whatsapp-sender">
      <h2>Send WhatsApp Message</h2>
      <form onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Recipient number (with country code)"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <textarea
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
        <button type="button" onClick={handleSendText}>
            Send Text Message
        </button>

      </form>
      <p>{status}</p>
    </div>
  );
};

export default WhatsAppSender;
