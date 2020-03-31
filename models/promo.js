const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const promoSchema = new Schema({
  name: {type: String},
  type: {type: String},
  startDate: {type: Date},
  endDate: {type: Date},
  valid: {type: Boolean},
  lessons: [{type: Schema.Types.ObjectId,ref: 'Lesson'}],
  description: {type: String},
  code: {type: String},
  imageLink: {type: String}
},
  { timestamps: true }
);

module.exports = mongoose.model('Promo', promoSchema);
