const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  title: {type: String},
  subtitle: {type: String},
  type: {type:String, enum: ['OneTime', 'Recurring']},
  subType: {type:String, enum: ['OneDay', 'MultiDay']},
  public: {type: Boolean},
  category: {type: String},
  price: {type: Number},
  points: {type: Number},
  sku: {type: String},
  description: {type: String},
  notes: {type: String},
  duration: {type: String},
  schedule: [{
    date: {type: Date},
    time: {type: String},
    _id : false
  }],
  instructors: [{type: Schema.Types.ObjectId,ref: 'User'}],
  gallery: [{
    name: {type: String},
    type: {type: String},
    path: {type: String},
    public: {type: Boolean},
    _id : false
  }],
  requirements: [{type: String}],
  materials: [{type: String}],
  files: [{
    name: {type: String},
    type: {type: String},
    size: {type: String},
    path: {type: String},
    public: {type: Boolean},
    _id : false
  }],
  attendees: [{type: Schema.Types.ObjectId,ref: 'User'}],
  reviews: [{type: Schema.Types.ObjectId,ref: 'Review'}],
  tags: [{type: String}],
  sessions: [{
    title: {type: String},
    date: {type: Date},
    endDate: {type: Date},
    time: {type: String},
    limit: {type: Number},
    amount: {type: Number},
    booked: [{type: Schema.Types.ObjectId,ref: 'User'}],
    bookedAmount: {type: Number},
    attended: [{type: Schema.Types.ObjectId,ref: 'User'}],
    attendedAmount: {type: Number},
    inProgress: {type: Boolean},
    full: {type: Boolean},
    url: {type: String},
    _id : false
  }],
  reminders: [{type: Schema.Types.ObjectId,ref: 'Notification'}],
  cancellations: [{
    date: {type: String},
    reason: {type: String},
    sessionDate: {type: Date},
    sessionTitle: {type: String},
    user: {type: Schema.Types.ObjectId,ref: 'User'}
  }],
  promos: {type: Schema.Types.ObjectId,ref: 'Promo'}
},
  { timestamps: true }
);

module.exports = mongoose.model('Lesson', lessonSchema);
