// controllers/ogFetchController.js
import axios from "axios";
import * as cheerio from "cheerio";

export const fetchOGMeta = async (req, res) => {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).json({ error: "Missing ?url parameter" });
  }

  try {
    // Fetch the target page
    const { data: html } = await axios.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (LinkPreviewBot/1.0; +https://mymultipurposeapp.vercel.app)",
      },
      timeout: 8000,
    });

    const $ = cheerio.load(html);

    const getMeta = (name) =>
      $(`meta[property='${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content") ||
      "";

    const title =
      getMeta("og:title") || $("title").text() || getMeta("twitter:title");
    const description =
      getMeta("og:description") ||
      getMeta("description") ||
      getMeta("twitter:description");
    const url = getMeta("og:url") || targetUrl;

    // Collect multiple images
    let images = [];
    $("meta[property='og:image']").each((_, el) => {
      const src = $(el).attr("content");
      if (src) images.push(src);
    });

    // fallback: get first <img> if no OG image
    if (images.length === 0) {
      const firstImg = $("img").first().attr("src");
      if (firstImg) images.push(firstImg);
    }

    res.json({
      success: true,
      title,
      description,
      url,
      images,
    });
  } catch (err) {
    console.error("OG fetch error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch OG metadata",
    });
  }
};
