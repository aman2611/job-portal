const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const resumeDir = path.join(__dirname, "../public/resume");
      const profilePictureDir = path.join(__dirname, "../public/profilePicture");

      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      if (!fs.existsSync(profilePictureDir)) {
        fs.mkdirSync(profilePictureDir, { recursive: true });
      }

      if (file.mimetype === "application/pdf") {
        cb(null, resumeDir); 
      } else if (file.mimetype === "image/jpeg") {
        cb(null, profilePictureDir); 
      } else {
        return cb(new Error("Invalid file format"), false); 
      }
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const filename = `${uuidv4()}${fileExtension}`;
      cb(null, filename); 
    }
  })
});

function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Received file for resume:", file);
  console.log("File extension:", getFileExtension(file.originalname));

  const fileExtension = getFileExtension(file.originalname);
  if (fileExtension !== ".pdf") {
    return res.status(400).json({
      message: "Invalid format, file must be a PDF",
    });
  }

  res.send({
    message: "File uploaded successfully",
    url: `/host/resume/${file.filename}`,
  });
});

router.post("/profilePicture", upload.single("file"), (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Received file for profilePicture:", file);
  console.log("File extension:", getFileExtension(file.originalname));

  const fileExtension = getFileExtension(file.originalname);
  if (fileExtension !== ".jpg" && fileExtension !== ".png") {
    return res.status(400).json({
      message: "Invalid format, only .jpg or .png images are allowed",
    });
  }

  res.send({
    message: "profilePicture image uploaded successfully",
    url: `/host/profilePicture/${file.filename}`,
  });
});

module.exports = router;
