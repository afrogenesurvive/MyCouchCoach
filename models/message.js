const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  date: {type: Date},
  time: {type: String},
  type: {type: String},
  subject: {type: String},
  sender: {type: Schema.Types.ObjectId,ref: 'User'},
  receiver: {type: Schema.Types.ObjectId,ref: 'User'},
  message: {type: String},
  read: {type: Boolean}
},
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
