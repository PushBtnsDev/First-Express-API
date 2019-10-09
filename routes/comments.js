const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('./../models/Comment');

router.get('/', async (req, res, next) => {
  try {
    const comments = await Comment.find().limit(20);
    res.send(comments);
  }
  catch(err) {
    res.status(500).send(err)
  }
});

module.exports = router;