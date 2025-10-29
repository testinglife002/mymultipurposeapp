import React, { useState } from "react";
import newRequest from "../../api/newRequest";

export default function WhatsAppSender() {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState("");

  const handleURLPreview = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    if (match) setPreview(match[0]);
  };

  const handleSend = async () => {
    const formData = new FormData();
    formData.append("body", text);
    if (files.length > 0) {
      for (let f of files) formData.append("files", f);
    }

    try {
      const res = await newRequest.post("/whatsapp-sender/send-fix-message", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ WhatsApp message sent successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send message");
    }
  };

  return (
    <div className="whatsapp-sender" style={{ maxWidth: 500, margin: "auto" }}>
      <h2>Send WhatsApp Message (Fixed Number)</h2>

      <textarea
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleURLPreview}
        rows={4}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      {preview && (
        <div className="url-preview">
          <a href={preview} target="_blank" rel="noopener noreferrer">
            {preview}
          </a>
          <img
            src={preview}
            alt="preview"
            onError={(e) => (e.target.style.display = "none")}
            style={{ width: "100%", marginTop: "5px" }}
          />
        </div>
      )}

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
        style={{ margin: "10px 0" }}
      />

      <button
        onClick={handleSend}
        style={{
          padding: "10px 15px",
          background: "#25D366",
          border: "none",
          color: "white",
          cursor: "pointer",
          borderRadius: "5px",
        }}
      >
        Send WhatsApp Message
      </button>
    </div>
  );
}

