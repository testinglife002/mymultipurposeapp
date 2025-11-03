// (controllers/ogController.js)
// controllers/ogController.js
// controllers/ogController.js
import Post from "../models/post.model.js";

export const getOGMeta = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug }).populate("author channel");

    if (!post) return res.status(404).send("Post not found");

    const images = post.images?.length
      ? post.images.map(img => img.url || img).filter(Boolean)
      : ["https://mymultipurposeapp.vercel.app/default-og.jpg"];

    // escape HTML entities to avoid breaking meta tags
    const escapeHtml = str => str?.replace(/[&<>'"]/g, c => (
      { '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]
    )) || '';

    const ogTags = `
      <meta property="og:title" content="${escapeHtml(post.title)}" />
      <meta property="og:description" content="${escapeHtml(post.description)}" />
      <meta property="og:type" content="article" />
      <meta property="og:url" content="https://mymultipurposeapp.vercel.app/post/${post.slug}" />
      ${images.map(img => `<meta property="og:image" content="${img}" />`).join('\n')}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${escapeHtml(post.title)}" />
      <meta name="twitter:description" content="${escapeHtml(post.description)}" />
      <meta name="twitter:image" content="${images[0]}" />
    `;

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(post.title)}</title>
        ${ogTags}
        <script>
          window.location.href = "https://mymultipurposeapp.vercel.app/post/${post.slug}";
        </script>
      </head>
      <body>
        Redirecting to <a href="https://mymultipurposeapp.vercel.app/post/${post.slug}">${escapeHtml(post.title)}</a>...
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating OG metadata");
  }
};

