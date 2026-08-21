const express = require('express');

const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const {
  uploadResume,
  rewriteResumeHandler,
} = require('../controllers/analysisController');

console.log("upload =", upload);
console.log("uploadResume =", uploadResume);

router.post(
  "/analyze",
  upload.single("resume"),
  uploadResume
);

router.post(
  "/rewrite",
  rewriteResumeHandler
);

module.exports = router;