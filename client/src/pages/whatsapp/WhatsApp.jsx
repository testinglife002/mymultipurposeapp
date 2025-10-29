// Step 2. Create src/WhatsApp.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import WhatsAppForm from "../../components/whatsapp/WhatsAppForm";
import MessageList from "../../components/whatsapp/MessageList";
import WhatsAppSender from "../../components/whatsapp/WhatsAppSender";


export default function WhatsApp() {
  return (

      <div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
        <nav style={{ marginBottom: "1rem" }}>
          <Link to="/whatsapp">Send Message</Link> |{" "}
          <Link to="/whatsapp/send">Sending Message</Link> |{" "}
          <Link to="/whatsapp/messages">Messages</Link> |{" "}
        </nav>

        <Routes>
          <Route path="/" element={<WhatsAppForm />} />
          <Route path="/send" element={<WhatsAppSender />} />
          <Route path="/messages" element={<MessageList />} />
        </Routes>
      </div>

  );
}