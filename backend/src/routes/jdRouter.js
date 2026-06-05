const express = require('express')

const router = express.Router()

const {analyzeJobDescription} = require('../controllers/jdController')

router.post("/analyze-jd", analyzeJobDescription)

module.exports = router