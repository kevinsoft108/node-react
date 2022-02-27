const express = require("express");
const multer = require('multer');
const fs = require('fs');

// parse is an instance of the express router.
const parse = express.Router();

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname )
  }
});
var upload = multer({ storage: storage }).single('file');

function wordFrequency(txt, n) {
  var words = txt.split(/\s+/);
  var wordCount = {};
  words.forEach(word => {
    if (word == '') {
      return;
    }
    const lowerWord = word.toLowerCase();
    wordCount[lowerWord] =
      lowerWord in wordCount ? wordCount[lowerWord] + 1 : 1;
  });

  var wordsArray = [];
  for (let [word, count] of Object.entries(wordCount)) {
    wordsArray.push({ word: word, count: count });
  }

  wordsArray.sort((a, b) => {
    if (a.count !== b.count) {
      return b.count - a.count;
    } else if (a.word !== b.word) {
      return a.word < b.word ? -1 : 1;
    }
    return 0;
  });
  return wordsArray.slice(0, n);
}

parse.route("/").post(function (req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    var n = parseInt(req.body.number);
    var filename = req.file.filename;
    fs.readFile(`./public/${filename}`, 'utf8', function(err, data) {
      if (err) return res.status(500).json(err);
      var result = wordFrequency(data, n);
      res.status(200).json({ frequencies: result });
    });
  })
});

module.exports = parse;
