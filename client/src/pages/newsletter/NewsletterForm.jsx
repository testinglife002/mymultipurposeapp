// src/pages/newsletter/NewsletterForm.jsx
// src/pages/newsletter/NewsletterForm.jsx
import React, { useEffect, useState } from "react";
import newRequest from "../../api/newRequest";
import "./templates.css";

const NewsletterForm = () => {
  const [templates, setTemplates] = useState([]);
  const [subject, setSubject] = useState("");
  const [recipientsInput, setRecipientsInput] = useState(""); // comma-separated input
  const [templateId, setTemplateId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResults, setSendResults] = useState([]); // per-email results
  const [retryCount, setRetryCount] = useState({}); // track retries per email
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await newRequest.get("/templates");
        setTemplates(res.data.templates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };
    fetchTemplates();
  }, []);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const getEmailList = () =>
    recipientsInput
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e && isValidEmail(e));

  const sendEmails = async (emails) => {
    if (!emails.length) return;

    try {
      const res = await newRequest.post("/newsletter/send", {
        subject,
        recipients: emails,
        templateId,
      });

      if (res.data.results) {
        setSendResults((prev) => {
          // merge new results with previous
          const merged = [...prev.filter(r => !emails.includes(r.email)), ...res.data.results];
          return merged;
        });

        // Schedule retry for failed emails
        const failed = res.data.results.filter(r => r.status === "failed");
        failed.forEach((f) => {
          const attempts = retryCount[f.email] || 0;
          if (attempts < MAX_RETRIES) {
            setRetryCount((prev) => ({ ...prev, [f.email]: attempts + 1 }));
            setTimeout(() => sendEmails([f.email]), RETRY_DELAY);
          }
        });
      }
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const emailList = getEmailList();
    if (!subject.trim()) return alert("Subject required");
    if (!emailList.length) return alert("Add at least one valid recipient");
    if (!templateId) return alert("Choose a template");

    setSending(true);
    setSendResults([]);
    setRetryCount({});
    await sendEmails(emailList);

    setSending(false);

    // Reset form
    setSubject("");
    setTemplateId("");
    setRecipientsInput("");
  };

  const selectedTemplate = templates.find((t) => t._id === templateId);

  return (
    <div className="container py-3">
      <h3 className="mb-3">Send Newsletter</h3>
      <form onSubmit={handleSend}>
        <div className="mb-2">
          <input
            type="text"
            className="form-control"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div className="mb-2">
          <label className="form-label">Recipients (comma separated)</label>
          <textarea
            className="form-control"
            rows={3}
            placeholder="email1@example.com, email2@example.com"
            value={recipientsInput}
            onChange={(e) => setRecipientsInput(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Choose Template</label>
          <select
            className="form-select"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
          >
            <option value="">Select Template</option>
            {templates.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {selectedTemplate && (
          <div className="mb-3">
            <label className="form-label">Preview</label>
            <div style={{ border: "1px solid #eee" }}>
              <iframe
                title="selected-template-preview"
                srcDoc={selectedTemplate.html || "<div/>"}
                style={{ width: "100%", height: 300, border: 0 }}
                sandbox="allow-same-origin allow-popups"
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-success"
            disabled={sending || !recipientsInput.trim()}
          >
            {sending ? "Sending…" : "Send Newsletter"}
          </button>
        </div>
      </form>

      {sendResults.length > 0 && (
        <div className="mt-4">
          <h5>Email Send Status:</h5>
          <ul className="list-group">
            {sendResults.map((r) => (
              <li
                key={r.email}
                className={`list-group-item d-flex justify-content-between align-items-center ${
                  r.status === "sent" ? "list-group-item-success" : "list-group-item-danger"
                }`}
              >
                {r.email}
                {r.status === "failed" && (
                  <span>❌ {r.error} {retryCount[r.email] ? `(Retrying: ${retryCount[r.email]})` : ""}</span>
                )}
                {r.status === "sent" && <span>✅ Sent</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NewsletterForm;




