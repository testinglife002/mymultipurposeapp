// Step 3. Create src/components/WhatsAppForm.jsx
import React, { useState, useEffect } from "react";
import newRequest from "../../api/newRequest";

export default function WhatsAppForm() {
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [messages, setMessages] = useState([]);

  // Fetch all messages from backend
  const fetchMessages = async () => {
    try {
      const res = await newRequest.get("/whatsapp/all");
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Send WhatsApp Message via Twilio Sandbox
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await newRequest.post("/whatsapp/send", { to, message });
      if (res.data.success) {
        setStatus({ ok: true, text: "Message sent successfully!" });
        setTo("");
        setMessage("");
        fetchMessages(); // Refresh list
      } else {
        setStatus({ ok: false, text: "Something went wrong." });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setStatus({ ok: false, text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Save Draft Message
  const handleSaveDraft = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await newRequest.post("/whatsapp/draft", { to, message });
      if (res.data.success) {
        setStatus({ ok: true, text: "Draft saved!" });
        fetchMessages(); // Refresh list
      } else {
        setStatus({ ok: false, text: "Failed to save draft." });
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setStatus({ ok: false, text: msg });
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDelete = async (id) => {
    try {
      await newRequest.delete(`/whatsapp/${id}`);
      fetchMessages();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Send WhatsApp Message</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="tel"
          placeholder="Enter WhatsApp number"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
          required
        />

        <textarea
          placeholder="Type your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          style={{ width: "100%", padding: "8px" }}
          required
        ></textarea>

        <div style={{ marginTop: "10px" }}>
          <button type="submit" disabled={loading} style={{ marginRight: "10px" }}>
            {loading ? "Sending..." : "Send Message"}
          </button>

          <button type="button" disabled={loading} onClick={handleSaveDraft}>
            {loading ? "Saving..." : "Save Draft"}
          </button>
        </div>
      </form>

      {status && (
        <p style={{ color: status.ok ? "green" : "red", marginTop: "10px" }}>
          {status.text}
        </p>
      )}

      <h3 style={{ marginTop: "30px" }}>All Messages & Drafts</h3>
      {messages.length === 0 ? (
        <p>No messages yet.</p>
      ) : (
        <div>
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                backgroundColor:
                  msg.status === "sent"
                    ? "#e0ffe0"
                    : msg.status === "failed"
                    ? "#ffe0e0"
                    : "#f0f0f0",
              }}
            >
              <p>
                <strong>To:</strong> {msg.to}
              </p>
              <p>
                <strong>Message:</strong> {msg.message}
              </p>
              <p>
                <strong>Status:</strong> {msg.status}
              </p>
              <button onClick={() => handleDelete(msg._id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

