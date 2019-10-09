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

router.post('/', async (req, res, next) => {
  const comment = new Comment({
    name: req.body.name,
    email: req.body.email,
    movie_id: mongoose.Types.ObjectId(),
    text: req.body.text,
    date: Date.now()
  })

  try {
    let newComment = await comment.save();
    res.send(newComment);
  }
  catch(err) {
    console.log(err);
    res.send(500).send(err);
  }
})

module.exports = router;