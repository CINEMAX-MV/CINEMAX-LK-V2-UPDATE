export default function handler(req, res) {

  const { id, title, image } = req.query;

  res.setHeader("Content-Type", "text/html; charset=utf-8");

  res.send(`
  <html>
  <head>

  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="Watch ${title} Full Movie Online - CINEMAX LK" />
  <meta property="og:image" content="${image}" />
  <meta property="og:url" content="https://cinemaxlk.vercel.app/movie.html?id=${id}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />

  <meta http-equiv="refresh" content="0; url=/movie.html?id=${id}" />

  </head>
  <body></body>
  </html>
  `);
}
