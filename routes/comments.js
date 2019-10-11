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
  // returns a single comment by provided username
  // requires GET has 'name' query string
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

router.patch('/update/name', async (req, res, next) => {
  /*
  requires request has 'name' query string
  PATCH comment by username
  does not practically make sense though unless you find the comment based on username search
  */

  if (!req.query.name) {
    res.status(500).send('Invalid query string')
  } else if (!req.body.text) {
    res.status(500).send('No text to correct')
  } else {
    const { text } = req.body
    try {
      const comment = await Comment.findOne({
        "name" : new RegExp('^' + req.query.name + '$', "i")
      });
      comment.text = text;
      await comment.save();
      res.send(comment)
    }
    catch(err) {
      res.status(500).send(err);
    }
  }
})

router.patch('/update/:id', async (req, res, next) => {
  // PATCH comment by id
  const { text } = req.body
  try {
    const comment = await Comment.findById(req.params.id, async (err, comment) => {
      if (err) {
        res.status(500).send(err);
      } else {
        // Update comment
        try {
          comment.text = text;
          let updatedComment = await comment.save();
          res.send(updatedComment);
        }
        catch (err) {
          res.status(500).send(err);
        }
      }
    })
  }
  catch (err) {
    res.status(500).send(err);
  }
})

router.delete('/delete/name', async (req, res, next) => {
  // requires query string with name
  if (!req.query.name) {
    res.status(500).send('Invalid query string')
  } else {
    try {
      // Deletes the first comment that is found with no double checks
      const comment = await Comment.findOneAndRemove({
        "name" : new RegExp('^' + req.query.name + '$', "i")
      });
      res.send(comment)
    }
    catch(err) {
      res.status(500).send(err);
    }
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  // DELETE comment by id
  try {
    const comment = await Comment.findOneAndRemove({ _id: req.params.id });
    res.send(comment);
  }
  catch (err) {
    res.status(500).send(err);
  }
})

module.exports = router;