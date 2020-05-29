const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require('multer-s3');
// AWS
const AWS = require('aws-sdk');
// AWS config
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");
// S3
const s3 = new AWS.S3();
// S3 bucket and directory
const BUCKET = "image-conversion-practice";
const DIR = "raw-image";
// Multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: function (req, file, cb) {
      const filePath = DIR + "/" + Date.now().toString() + "_" + file.originalname;
      console.log(filePath);
      cb(null, filePath);
    },
    acl: 'public-read-write'
  })
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Upload image in S3 */
router.post('/upload', upload.single('image'), function(req, res) {
  try {
    res.json({result: true, message: "Successfully uploaded file!"});
  } catch (err) {
    console.error(err);
    res.json({result: false, message: "Server error (code: 500)"});
  }
});

module.exports = router;
