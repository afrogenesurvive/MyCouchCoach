const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {type: String,required: true},
  name: {type: String,required: true},
  role: {type: String},
  username: {type: String,required: true},
  dob:{type: Date},
  public: {type: Boolean},
  age: {type:Number},
  addresses: [{
    type: {type:String, enum: ['Shipping', 'Billing']},
    number: {type:Number},
    street: {type: String},
    town: {type: String},
    city: {type:String},
    country: {type:String},
    postalCode: {type:String},
    primary: {type: Boolean},
    _id : false
  }],
  contact: {
    phone: {type: String},
    phone2: {type: String},
    email: {type: String,required: true},
  },
  bio: {type: String},
  profileImages: [{
    name: {type:String},
    type: {type: String},
    path: {type: String},
    _id : false
  }],
  socialMedia: [{
    platform: {type:String},
    handle: {type:String},
    _id : false
  }],
  interests: [{type: String}],
  perks: [{type: Schema.Types.ObjectId,ref: 'Perk'}],
  promos: [{type: Schema.Types.ObjectId,ref: 'Promo'}],
  friends:[{type: Schema.Types.ObjectId,ref: 'User'}],
  points: {type: Number},
  tags: [{type: String}],
  loggedIn: {type: Boolean},
  clientConnected: {type: Boolean},
  verfication:{
    verified:{type: Boolean},
    type:{type: String},
    code:{type: String}
  },
  activity:[{
    date: {type: Date},
    request: {type: String},
    _id : false
  }],
  likedLessons: [{type: Schema.Types.ObjectId,ref: 'Lesson'}],
  bookedLessons: [{
    date: {type: Date},
    ref: {type: Schema.Types.ObjectId,ref: 'Lesson'}
  }],
  attendedLessons: [{
    date: {type: Date},
    ref: {type: Schema.Types.ObjectId,ref: 'Lesson'}
  }],
  taughtLessons: [{
    date: {type: Date},
    ref: {type: Schema.Types.ObjectId,ref: 'Lesson'}
  }],
  wishlist: [{
    date: {type: Date},
    ref: {type: Schema.Types.ObjectId,ref: 'Lesson'},
    booked: {type: Boolean}
  }],
  cart: [{
    dateAdded: {type: Date},
    sessionDate: {type: Date},
    lesson: {type: Schema.Types.ObjectId,ref: 'Lesson'}
  }],
  comments: [{type: Schema.Types.ObjectId,ref: 'Comment'}],
  messages: [{type: Schema.Types.ObjectId,ref: 'Message'}],
  orders: [{type: Schema.Types.ObjectId,ref: 'Order'}],
  paymentInfo: [{
    date: {type: Date},
    type: {type: String},
    description: {type: String},
    body: {type: String},
    valid: {type: Boolean},
    primary: {type: Boolean},
    _id : false
  }]
},
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
