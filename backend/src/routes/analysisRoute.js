const express = require('express');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const { uploadResume } = require('../controllers/analysisController');

console.log("upload =", upload);
console.log("uploadResume =", uploadResume);
router.post(
  "/analyze",
  upload.single("resume"),
  uploadResume
);


module.exports = router;