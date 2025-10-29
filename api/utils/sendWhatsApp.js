// Create a file, e.g. sendWhatsApp.js

import fetch from "node-fetch"; // if using Node 18+, fetch is already available

const token = "EAAQvIxujzTkBPq7C7o3dIDL1i2FQnCfsBgFuLTZCV2ZAJPNRdcZBkq2eFZBbfWSflsJveoTpqUk8Ta5iGka6AMZCcmZCIiV7Jm9T5CcvZAaPKI0n1srL1m3CSoYlASJMwVoie7orh7rvZBRhv3mXccw5p3O8Soz0nJ8MCIZBGDcMuxlkCZC78edFQZCQcujYgN6lB4lv73dZAia5AMnnzTJB0k7ZClSZCulJlOZB6n6NtzhYpPvX6ZCvvAZDZD";

const url = "https://graph.facebook.com/v22.0/860916310429051/messages";

const body = {
  messaging_product: "whatsapp",
  to: "8801617063739",
  type: "template",
  template: {
    name: "hello_world",
    language: { code: "en_US" },
  },
};

async function sendWhatsApp() {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  console.log(data);
}

sendWhatsApp().catch(console.error);