const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    createDate: {type: Date},
    sendDate: {type: Date},
    creator: {type: Schema.Types.ObjectId,ref: 'User'},
    type: {type:String, enum: ['Reminder', 'FollowUp']},
    title: {type: String},
    time: {type: String},
    trigger: {
      unit: {type: String},
      value: {type: Number}
    },
    lesson: {type: Schema.Types.ObjectId,ref: 'Lesson'},
    session: {
      title: {type: String},
      date: {type: Date},
      endDate: {type: Date},
      time: {type: String}
    },
    recipients: [{type: Schema.Types.ObjectId,ref: 'User'}],
    body: {type: String},
    delivery: {
      type: {type:String, enum: ['Email', 'SMS', 'CouchCoachMSG', 'All']},
      params: {type:String},
      sent: {type: Boolean}
    }
},
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
