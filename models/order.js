const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: {type: Date},
  time: {type: String},
  type: {type: String},
  buyer: {type: Schema.Types.ObjectId,ref: 'User'},
  reciever: {type: Schema.Types.ObjectId,ref: 'User'},
  lessons: [{
    price: {type: Number},
    date: {type: Date},
    ref: {type: Schema.Types.ObjectId,ref: 'Lesson'}
  }],
  totals: {
    a: {type: Number},
    b: {type: Number},
    c: {type: Number}
  },
  tax: {
    description: {type: String},
    amount: {type: Number}
  },
  description: {type: String},
  notes: {type: String},
  payment: {type: String},
  shipping: {type: String},
  billingAddress: {
    number: {type:Number},
    street: {type: String},
    town: {type: String},
    city: {type:String},
    country: {type:String},
    postalCode: {type:String},
  },
  shippingAddress: {
    number: {type:Number},
    street: {type: String},
    town: {type: String},
    city: {type:String},
    country: {type:String},
    postalCode: {type:String},
  },
  status: {
    cancelled: {type: Boolean},
    held: {type: Boolean},
    paid: {type: Boolean},
    checkedOut: {type: Boolean},
    emailSent: {type: Boolean},
    confirmed: {type: Boolean},
    packaged: {type: Boolean},
    shipped: {type: Boolean},
    delivered: {type: Boolean},
    confirmedDelivery: {type: Boolean},
  },
  feedback: {type: String}
},
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
