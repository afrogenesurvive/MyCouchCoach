const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const perkSchema = new Schema({
  date: {type: Date},
  name: {type: String},
  type: {type: String},
  description: {type: String},
  code: {type: String},
  imageLink: {type: String}
},
  { timestamps: true }
);

module.exports = mongoose.model('Perk', perkSchema);
