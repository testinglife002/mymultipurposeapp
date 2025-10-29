// 6️⃣ server/controllers/newsletterController.js
// server/controllers/newsletterController.js
// server/controllers/newsletterController.js
import EmailTemplate from "../models/EmailTemplate.js";
import Newsletter from "../models/Newsletter.js";
import transporter from "../utils/mailer.js";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, recipients, templateId } = req.body;

    if (!subject?.trim()) return res.status(400).json({ success: false, message: "Subject is required" });
    if (!recipients || recipients.length === 0) return res.status(400).json({ success: false, message: "Add at least one recipient" });
    if (!templateId) return res.status(400).json({ success: false, message: "Template ID is required" });

    const template = await EmailTemplate.findById(templateId);
    if (!template) return res.status(404).json({ success: false, message: "Template not found" });

    const emailList = Array.isArray(recipients)
      ? recipients.map(e => e.trim()).filter(Boolean)
      : recipients.split(",").map(e => e.trim()).filter(Boolean);

    if (emailList.length === 0) return res.status(400).json({ success: false, message: "Add at least one valid recipient" });

    const results = [];
    const BATCH_SIZE = 5;        // send 5 emails per batch
    const BATCH_DELAY = 2000;    // 2 seconds delay between batches
    const RETRY_DELAY = 5000;    // 5 seconds delay before retry on 421
    const MAX_RETRIES = 3;

    for (let i = 0; i < emailList.length; i += BATCH_SIZE) {
      const batch = emailList.slice(i, i + BATCH_SIZE);

      for (const email of batch) {
        let attempt = 0;
        let sent = false;

        while (attempt < MAX_RETRIES && !sent) {
          try {
            await transporter.sendMail({
              from: `"MERN Newsletter" <${process.env.GOOGLE_EMAIL}>`,
              to: email,
              subject,
              html: template.html,
            });
            results.push({ email, status: "sent" });
            sent = true;
          } catch (err) {
            attempt++;
            // Retry only on temporary Gmail errors (421)
            if (err.message.includes("421") && attempt < MAX_RETRIES) {
              console.warn(`Temporary error sending to ${email}, retrying in ${RETRY_DELAY/1000}s (Attempt ${attempt})`);
              await sleep(RETRY_DELAY);
            } else {
              results.push({ email, status: "failed", error: err.message });
              sent = true; // stop retrying
            }
          }
        }
      }

      // Delay between batches
      if (i + BATCH_SIZE < emailList.length) {
        await sleep(BATCH_DELAY);
      }
    }

    const record = new Newsletter({
      subject,
      recipients: emailList,
      templateId,
      sentAt: new Date(),
    });
    await record.save();

    const failedEmails = results.filter(r => r.status === "failed");
    if (failedEmails.length) {
      return res.status(207).json({
        success: false,
        message: "Some emails failed to send",
        results,
        failedEmails,
        newsletter: record,
      });
    }

    res.json({
      success: true,
      message: "Newsletter sent successfully",
      results,
      newsletter: record,
    });

  } catch (err) {
    console.error("Newsletter send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};


