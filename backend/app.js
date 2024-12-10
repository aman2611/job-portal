require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");

const path = require('path');


// MongoDB
mongoose
  .connect(process.env.MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
  .then((res) => console.log("Connected to DB"))
  .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profilePicture")) {
  fs.mkdirSync("./public/profilePicture");
}

const app = express();
const PORT = process.env.PORT || 4444;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

const buildPath = path.resolve(__dirname, '..', 'frontend', 'build');
app.use('/login', express.static(buildPath, { cacheControl: true, maxAge: '1d' })); // Cache files for 1 day

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
