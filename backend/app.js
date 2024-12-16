require('dotenv').config();
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// Initialising directories
if (!fs.existsSync("./public")) fs.mkdirSync("./public");
if (!fs.existsSync("./public/resume")) fs.mkdirSync("./public/resume");
if (!fs.existsSync("./public/profilePicture")) fs.mkdirSync("./public/profilePicture");

const app = express();
const PORT = process.env.PORT || 4444;

app.use(bodyParser.json()); // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

// Serve static files from the React app
const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');
app.use(express.static(buildPath, {
  cacheControl: true,
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-store'); // Prevent caching for HTML files
    } else {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache other assets for 1 day
    }
  },
}));

// For any other routes, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), {
    headers: {
      'Cache-Control': 'no-store', // Prevent caching for the HTML file
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}!`);
});
