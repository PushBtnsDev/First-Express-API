const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('../models/Comment');

router.get('/', async (req, res, next) => {
  // GET all comments
  try {
    const comments = await Comment.find().limit(20);
    res.send(comments);
  }
  catch(err) {
    res.status(500).send(err)
  }
});

router.get('/name', async (req, res, next) => {
  // assumes GET has 'name' query string
  // returns a single comment by provided username
  if (!req.query.name) {
    res.status(422).send('invalid query');
  } else {
    try {
      const comment = await Comment.findOne({
        "name" : new RegExp('^' + req.query.name + '$', "i")
      });
      res.send(comment);
    }
    catch(err) {
      res.status(500).send(err);
    }
  }
})

router.get('/:id', async (req, res, next) => {
  // GET comment by id
  try {
    const comment = await Comment.findById(req.params.id, (err, comment) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(comment);
      }
    })
  }
  catch(err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req, res, next) => {
  // CREATE new comment
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