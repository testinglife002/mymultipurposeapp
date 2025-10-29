// controllers/sendPulseController.js
// controllers/sendPulseController.js
// 2️⃣ controllers/sendPulseController.js
// controllers/sendPulseController.js
import { sendVerificationEmail } from "../utils/sendingVerifyEmailSendPulseEmail.js";


// POST /api/send-email
export const sendEmail = async (req, res) => {
  const { toEmail, code } = req.body;

  if (!toEmail || !code) {
    return res.status(400).json({ ok: false, error: "toEmail and code required" });
  }

  try {
    const result = await sendVerificationEmail(toEmail, code);
    res.json({ ok: true, result });
  } catch (err) {
    console.error("SendPulse error:", err);
    res.status(500).json({ ok: false, error: "Failed to send email" });
  }
};


