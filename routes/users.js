const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User')

router.get('/', async (req, res, next) => {
  // GET all users
  try {
    const users = await User.find().limit(20);
    res.send(users);
  }
  catch(err) {
    res.status(500).send(err);
  }
});

router.get('/:id', async (req, res, next) => {
  // GET one user by id
  try {
    const user = await User.findById(req.params.id, (err, user) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(user);
      }
    })
  }
  catch(err) {
    res.status(500).send(err);
  }
})

module.exports = router;