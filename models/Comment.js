const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
  name: String,
  email: String,
  movie_id: mongoose.Schema.Types.ObjectId,
  text: String,
  date: Date
})

module.exports = mongoose.model('Comment', CommentSchema)