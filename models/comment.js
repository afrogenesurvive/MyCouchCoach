const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  date: {type: Date},
  time: {type: String},
  type: {type: String},
  lesson: {type: Schema.Types.ObjectId,ref: 'Lesson'},
  author: {type: Schema.Types.ObjectId,ref: 'User'},
  comment: {type: String},
  parent: {type: Schema.Types.ObjectId,ref: 'Comment'},
  children: [{type: Schema.Types.ObjectId,ref: 'Comment'}]
},
  { timestamps: true }
);

module.exports = mongoose.model('Comment', commentSchema);
