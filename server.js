const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 3000;

const distPath = path.join(__dirname, "frontend/dist");

if (!fs.existsSync(distPath)) {
  console.error(
    "ERROR: frontend/dist directory not found. Run 'npm run build' first.",
  );
  process.exit(1);
}

app.use(express.static(distPath));

app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server started on port ${port}.`);
});
