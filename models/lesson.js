const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: {type: String},
  subtitle: {type: String},
  type: {type: String},
  category: {type: String},
  price: {type: Number},
  points: {type: Number},
  description: {type: String},
  notes: {type: String},
  duration: {type: String},
  schedule: [{
    date: {type: Date},
    time: {type: String}
  }],
  instructors: [{type: Schema.Types.ObjectId,ref: 'User'}],
  gallery: [{
    name: {type: String},
    type: {type: String},
    path: {type: String}
  }],
  requiremnts: [{type: String}],
  materials: [{type: String}],
  files: [{
    name: {type: String},
    type: {type: String},
    path: {type: String}
  }],
  reviews: [{type: Schema.Types.ObjectId,ref: 'Review'}],
  tags: [{type: String}],
  sessions: [{
    title: {type: String},
    date: {type: Date},
    time: {type: String},
    limit: {type: Number},
    amount: {type: Number},
    booked: [{type: Schema.Types.ObjectId,ref: 'User'}],
    bookedAmount: {type: Number},
    attended: [{type: Schema.Types.ObjectId,ref: 'User'}],
    attendedAmount: {type: Number},
    inProgress: {type: Boolean},
    full: {type: Boolean},
  }],
  promos: {type: Schema.Types.ObjectId,ref: 'Promo'}
},
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
