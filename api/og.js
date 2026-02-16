export default function handler(req, res) {

  const { title, image } = req.query;

  res.setHeader("Content-Type", "text/html");

  res.send(`
    <html>
      <head>
        <meta property="og:title" content="${title}" />
        <meta property="og:image" content="${image}" />
        <meta property="og:type" content="video.movie" />
      </head>
      <body>
        Redirecting...
        <script>
          window.location.href = "/";
        </script>
      </body>
    </html>
  `);
}
