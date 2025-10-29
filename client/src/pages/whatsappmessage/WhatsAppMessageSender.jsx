// src/components/WhatsAppMessageSender.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";


const WhatsAppMessageSender = ({ templatesApi = "/templates" }) => {
  const [phone, setPhone] = useState("");
  const [messageHtml, setMessageHtml] = useState("");
  const [messageText, setMessageText] = useState("");
  const [templates, setTemplates] = useState([]);
  const [selectedTpl, setSelectedTpl] = useState("");
  const [files, setFiles] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await newRequest.get(templatesApi);
        setTemplates(res.data.templates || []);
      } catch {}
    })();
  }, [templatesApi]);

  const handleTemplateSelect = async (tplId) => {
    setSelectedTpl(tplId);
    if (!tplId) return;
    try {
      const res = await newRequest.get(`${templatesApi}/${tplId}`);
      const tpl = res.data.template;
      setMessageHtml(tpl.html || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleFiles = (e) => setFiles(Array.from(e.target.files));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!phone) return alert("Enter phone number");
    setSending(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append("phone", phone);
      if (messageText) form.append("messageText", messageText);
      if (messageHtml) form.append("messageHtml", messageHtml);
      if (selectedTpl) form.append("templateId", selectedTpl);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user?._id) form.append("userId", user._id);

      files.forEach((f) => form.append("files", f));

      const res = await newRequest.post("/whatsapp-sender/send-message", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult({ ok: true, data: res.data });
      alert(`✅ Sent to ${res.data.to}`);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ ok: false, error: msg });
      alert(`❌ Failed: ${msg}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="whatsapp-sender">
      <h3>Send WhatsApp Message</h3>
      <form onSubmit={handleSend}>
        <label>Phone:</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+8801..."
        />

        <label>Template:</label>
        <select value={selectedTpl} onChange={(e) => handleTemplateSelect(e.target.value)}>
          <option value="">-- none --</option>
          {templates.map((t) => (
            <option key={t._id} value={t._id}>{t.name}</option>
          ))}
        </select>

        <label>Message (HTML allowed):</label>
        <textarea
          rows={6}
          value={messageHtml}
          onChange={(e) => setMessageHtml(e.target.value)}
        />

        <label>Plain text (optional):</label>
        <textarea
          rows={4}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />

        <label>Files:</label>
        <input type="file" multiple onChange={handleFiles} />

        <button disabled={sending}>{sending ? "Sending…" : "Send"}</button>
      </form>

      {result && (
        <pre style={{ color: result.ok ? "green" : "red", marginTop: 10 }}>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default WhatsAppMessageSender;
