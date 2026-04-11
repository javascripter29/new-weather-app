const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "frontend/dist")));

// SPA fallback: serve index.html for all routes not matching static files
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server has been started on port ${port}.`);
});
