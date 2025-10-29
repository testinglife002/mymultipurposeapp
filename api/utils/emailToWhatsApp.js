// 👉 /utils/emailToWhatsApp.js
// utils/emailToWhatsApp.js
// server/utils/emailToWhatsApp.js
// 🧩 1️⃣ Create utils/emailToWhatsApp.js
// This converts HTML email templates → WhatsApp messages automatically.
// server/utils/emailToWhatsApp.js
import { htmlToText } from "html-to-text";

const headingEmojis = {
  h1: "📢",
  h2: "🔹",
  h3: "▪️",
  h4: "👉",
  h5: "💡",
  h6: "📝",
};

export const convertEmailToWhatsApp = (html, brandName = "SuperApp") => {
  if (!html) return "";

  let text = htmlToText(html, {
    wordwrap: false,
    selectors: [
      {
        selector: "a",
        format: "inline",
        options: { linkBrackets: false },
      },
      {
        selector: "ul",
        format: "block",
        options: { itemPrefix: "• " },
      },
      ...Object.entries(headingEmojis).map(([tag, emoji]) => ({
        selector: tag,
        format: "block",
        transform: (node) => `${emoji} *${node.children.map(c => c.data || "").join("")}*`,
      })),
    ],
  });

  text = text
    .replace(/\*\*(.*?)\*\*/g, "*$1*")
    .replace(/__(.*?)__/g, "_$1_")
    .replace(/\[(.*?)\]\((.*?)\)/g, (m, label, url) =>
      label === url || url.includes(label)
        ? `🔗 ${url}`
        : `🔗 ${label}: ${url}`
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const footer = `\n\n💼 *[${brandName}]*\nEmpowering your productivity every day ✨`;
  return `${text}${footer}`;
};


