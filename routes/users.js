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

router.get('/name', async (req, res, next) => {
  // returns a single user by provided username
  // requires GET has 'name' query string
  if (!req.query.name) {
    res.status(422).send('invalid query');
  } else {
    try {
      const user = await User.findOne({
        "name" : new RegExp('^' + req.query.name + '$', "i")
      });
      res.send(user);
    }
    catch(err) {
      res.status(500).send(err);
    }
  }
})

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

router.post('/', async (req, res, next) => {
  // CREATE new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    // TODO: hashing/encription
    password: req.body.password
  })

  try {
    let newUser = await user.save();
    res.send(newUser);
  }
  catch(err) {
    res.send(500).send(err);
  }
})

router.patch('/update/name', async (req, res, next) => {
  /*
  requires request has 'name' query string
  PATCH user by username
  does not practically make sense though unless you find the user based on username search
  */

  if (!req.query.name) {
    res.status(500).send('Invalid query string')
  } else {
    const { name, email, password } = req.body
    try {
      const user = await User.findOne({
        "name" : new RegExp('^' + req.query.name + '$', "i")
      });
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (password) {
        user.password = password;
      }
      await user.save();
      res.send(user);
    }
    catch(err) {
      res.status(500).send(err);
    }
  }
})

router.patch('/update/:id', async (req, res, next) => {
  // PATCH user by id
  const { name, email, password } = req.body
  try {
    const user = await User.findById(req.params.id);
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      user.password = password;
    }
    await user.save();
    res.send(user);
  }
  catch (err) {
    res.status(500).send(err);
  }
})

router.delete('/delete/:id', async (req, res, next) => {
  // DELETE user by id
  try {
    const user = await User.findOneAndRemove({ _id: req.params.id })
    res.send(user);
  }
  catch (err) {
    res.status(500).send(err);
  }
})


module.exports = router;