var aws = require("aws-sdk");
var express = require("express");
var multer = require("multer");
var multerS3 = require("multer-s3");
var bodyParser = require("body-parser");
var app = express();

// AWS Credentials
var s3 = new aws.S3({
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
});

app.use(bodyParser.json());

// Function to upload file as multipart to S3
var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "",
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// Function to download a file from S3
const download = (req, res) => {
  var params = {
    Bucket: "",
    Key: "",
  };

  params.Key = req.params.filename;

  s3.getObject(params)
    .createReadStream()
    .on("error", function (err) {
      res.status(500).json({ error: "Error occurred: " + err });
    })
    .pipe(res);
};

app.post("/upload", upload.single("resume"), function (req, res, next) {
  res.send({
    data: req.files,
    msg: "Successfully uploaded.",
  });
});

app.get("/download/:filename", download);

app.listen(4000, function () {
  console.log("Ready!");
});
