const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const router = express.Router();

// Setup multer with disk storage
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // Ensure the directories exist
      const resumeDir = path.join(__dirname, "../public/resume");
      const profilePictureDir = path.join(__dirname, "../public/profilePicture");

      if (!fs.existsSync(resumeDir)) {
        fs.mkdirSync(resumeDir, { recursive: true });
      }
      if (!fs.existsSync(profilePictureDir)) {
        fs.mkdirSync(profilePictureDir, { recursive: true });
      }

      // Determine the destination folder based on file type
      if (file.fieldname === "file") {
        cb(null, resumeDir); // Upload resume files to the resume folder
      } else {
        cb(null, profilePictureDir); // Upload profilePicture images to the profilePicture folder
      }
    },
    filename: function (req, file, cb) {
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const filename = `${uuidv4()}${fileExtension}`;
      cb(null, filename); // Generate a unique filename
    }
  })
});

// Function to get file extension
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase();
}

// Route to upload resume (PDF)
router.post("/resume", upload.single("file"), (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Received file for resume:", file);
  console.log("File extension:", getFileExtension(file.originalname));

  // Check for PDF extension
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

// Route to upload profilePicture image (JPG or PNG)
router.post("/profilePicture", upload.single("file"), (req, res) => {
  const { file } = req;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  console.log("Received file for profilePicture:", file);
  console.log("File extension:", getFileExtension(file.originalname));

  // Check for image extensions (JPG or PNG)
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
