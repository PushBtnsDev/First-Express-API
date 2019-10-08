const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send('Successful Req to /users');
});

module.exports = router;