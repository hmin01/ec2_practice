const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const multerS3 = require('multer-s3');
// AWS
const AWS = require('aws-sdk');
AWS.config.update({
  "accessKeyId": "",
  "secretAccessKey": "",
  "region": "ap-northeast-2"
});
// S3
const s3 = new AWS.S3();
// S3 bucket and directory
const BUCKET = "Bucket_Name";
const DIR = "Directory_Name";
// Multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: BUCKET,
    key: function (req, file, cb) {
      const filePath = DIR + "/" + Date.now().toString() + "_" + file.originalname;
      cb(null, filePath);
    },
    acl: 'private'
  })
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* Upload image in S3 */
router.post('/upload', upload.single('image'), function(req, res) {
  try {
    console.log("Successfully Upload.");
    res.json({result: true, message: "Successfully uploaded file!"});
  } catch (err) {
    console.error(err);
    res.json({result: false, message: "Server error (code: 500)"});
  }
});

module.exports = router;
