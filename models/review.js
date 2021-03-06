const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  date: {type: Date},
  type: {type: String},
  title: {type: String},
  lesson: {type: Schema.Types.ObjectId,ref: 'Lesson'},
  author: {type: Schema.Types.ObjectId,ref: 'User'},
  body: {type: String},
  rating: {type: Number, min: 0, max: 5},
},
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
