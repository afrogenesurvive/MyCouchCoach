const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');
const mongoose = require('mongoose');


const User = require('../../models/user');
const Lesson = require('../../models/lesson');
const Order = require('../../models/order');
const Review = require('../../models/review');
const Perk = require('../../models/perk');
const Promo = require('../../models/promo');
const Comment = require('../../models/comment');
const Message = require('../../models/message');
const util = require('util');

const { transformOrder } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllOrders: async (args, req) => {

    console.log("Resolver: getAllOrders...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const orders = await Order.find({})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

      return orders.map(order => {
        return transformOrder(order,);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrderById: async (args, req) => {
    console.log("Resolver: getOrderById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const order = await Order.findById(args.orderId)
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  getOrdersByField: async (args, req) => {
    console.log("Resolver: getOrderByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const orders = await Order.find(query)

      return orders.map(order => {
        return transformOrder(order);

      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByTotalsRange: async (args, req) => {
    console.log("Resolver: getOrdersByTotalsRange...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const orders = await Order.find({'schedule': {$gte: startDate, $lte: endDate}});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByBuyer: async (args, req) => {
    console.log("Resolver: getOrdersByBuyer...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const buyer = await User.findById({_id: args.buyerId});
      const orders = await Order.find({buyer: buyer});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByReceiver: async (args, req) => {
    console.log("Resolver: getOrdersByReceiver...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reciever = await User.findById({_id: args.recieverId});
      const orders = await Order.find({reciever: reciever});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByBuyerReceiver: async (args, req) => {
    console.log("Resolver: getOrdersByBuyerReceiver...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.userId});
      const orders = await Order.find({[args.role]: user});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByLesssons: async (args, req) => {
    console.log("Resolver: getOrdersByLesssons...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lessons = await Lesson.find({_id: {$in: args.lessonIds}});
      const orders = await Order.find({'lessons.ref': {$all: lessons}});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByBillingAddress: async (args, req) => {
    console.log("Resolver: getOrdersByBillingAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const billingAddress = {
        number: args.orderInput.billingAddressNumber,
        street: args.orderInput.billingAddressStreet,
        town: args.orderInput.billingAddressTown,
        city: args.orderInput.billingAddressCity,
        counrty: args.orderInput.billingAddressCountry,
        postCode: args.orderInput.billingAddressPostalCode
      };
      const orders = await Order.find({'billingAddress': billingAddress});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByShippingAddress: async (args, req) => {
    console.log("Resolver: getOrdersByShippingAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const shippingAddress = {
        number: args.orderInput.shippingAddressNumber,
        street: args.orderInput.shippingAddressStreet,
        town: args.orderInput.shippingAddressTown,
        city: args.orderInput.shippingAddressCity,
        counrty: args.orderInput.shippingAddressCountry,
        postCode: args.orderInput.shippingAddressPostalCode
      };
      const orders = await Order.find({'shippingAddress': shippingAddress});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  getOrdersByAddresses: async (args, req) => {
    console.log("Resolver: getOrdersByShippingAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const billingAddress = {
        number: args.orderInput.billingAddressNumber,
        street: args.orderInput.billingAddressStreet,
        town: args.orderInput.billingAddressTown,
        city: args.orderInput.billingAddressCity,
        counrty: args.orderInput.billingAddressCountry,
        postCode: args.orderInput.billingAddressPostalCode
      };
      const shippingAddress = {
        number: args.orderInput.shippingAddressNumber,
        street: args.orderInput.shippingAddressStreet,
        town: args.orderInput.shippingAddressTown,
        city: args.orderInput.shippingAddressCity,
        counrty: args.orderInput.shippingAddressCountry,
        postCode: args.orderInput.shippingAddressPostalCode
      };
      const orders = await Order.find({'shippingAddress': shippingAddress, 'billingAddress': billingAddress});

      return orders.map(order => {
        return transformOrder(order);
      });
    } catch (err) {
      throw err;
    }
  },
  updateOrderBasic: async (args, req) => {
    console.log("Resolver: updateOrderBasic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const order = await Order.findOneAndUpdate({_id:args.orderId},{
          date: args.orderInput.date,
          time: args.orderInput.time,
          type: args.orderInput.type,
          description: args.orderInput.description,
          notes: args.orderInput.notes,
          payment: args.orderInput.payment,
          shipping: args.orderInput.shipping,
        },{new: true, useFindAndModify: false})
        .populate('buyer')
        .populate('reciever')
        .populate('lessons.ref');

          return {
              ...order._doc,
              _id: order.id,
              date: order.date,
              type: order.type
          };
    } catch (err) {
      throw err;
    }
  },
  updateOrderByField: async (args, req) => {
    console.log("Resolver: updateOrderField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const order = await Order.findOneAndUpdate({_id:args.orderId},query,{new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderSenderReceiver: async (args, req) => {
    console.log("Resolver: updateOrderSenderReceiver...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.userId});
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {[role]: user},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderTotals: async (args, req) => {
    console.log("Resolver: updateOrderTotals...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tax = {
        description: args.orderInput.taxDescription,
        amount: args.orderInput.taxAmount,
      };
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {tax: tax},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderTax: async (args, req) => {
    console.log("Resolver: updateOrderTax...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const totals = {
        a: args.orderInput.totalA,
        Bb: args.orderInput.totalB,
        c: args.orderInput.totalC,
      };
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {totals: totals},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderBillingAddress: async (args, req) => {
    console.log("Resolver: updateOrderBillingAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const billingAddress = {
        number: args.orderInput.billingAddressNumber,
        street: args.orderInput.billingAddressStreet,
        town: args.orderInput.billingAddressTown,
        city: args.orderInput.billingAddressCity,
        counrty: args.orderInput.billingAddressCountry,
        postCode: args.orderInput.billingAddressPostalCode
      };
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {billingAddress: billingAddress},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderShippingAddress: async (args, req) => {
    console.log("Resolver: updateOrderShippingAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const shippingAddress = {
        number: args.orderInput.shippingAddressNumber,
        street: args.orderInput.shippingAddressStreet,
        town: args.orderInput.shippingAddressTown,
        city: args.orderInput.shippingAddressCity,
        counrty: args.orderInput.shippingAddressCountry,
        postCode: args.orderInput.shippingAddressPostalCode
      };
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {shippingAddress: shippingAddress},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  updateOrderStatus: async (args, req) => {
    console.log("Resolver: updateOrderStatus...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const status = args.orderInput.status;
      const statusObject = {
        value: args.orderInput.statusDate,
        date: args.orderInput.statusValue,
      };
      const query = 'status.'+status+'';
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {[query]: statusObject},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  addOrderLesson: async (args, req) => {
    console.log("Resolver: addOrderLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: lessonId});
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {$addToSet: {lessons: lesson}},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  deleteOrderLesson: async (args, req) => {
    console.log("Resolver: deleteOrderLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: lessonId});
      const order = await Order.findOneAndUpdate({_id:args.orderId},
        {$pull: {lessons: lesson}},
        {new: true, useFindAndModify: false})
      .populate('buyer')
      .populate('reciever')
      .populate('lessons.ref');

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  deleteOrder: async (args, req) => {
    console.log("Resolver: deleteOrder...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const order = await Order.findByIdAndRemove(args.orderId);

        return {
            ...order._doc,
            _id: order.id,
            date: order.date,
            type: order.type
        };
    } catch (err) {
      throw err;
    }
  },
  createOrder: async (args, req) => {
    console.log("Resolver: createOrder...");
    try {

      const buyer = await User.findById({_id: args.buyerId});
      const receiver = await User.findById({_id: args.receiverId});
      const today = new Date();
      const time = new Date().toISOString().substr(11,5);
      const preCart = buyer.cart;
      const orderLessons = preCart.map(lesson => ({
        price: x.lesson.price,
        date: x.dateAdded,
        ref: x.lesson
      }));

      const order = new Order({
        date: today,
        time: time,
        type: args.orderInput.Type,
        buyer: buyer,
        reciever: receiver,
        lessons: orderLessons,
        totals:{
          a: args.orderInput.totalA,
          b: args.orderInput.totalB,
          c: args.orderInput.totalC,
        },
        tax:{
          description: args.orderInput.Description,
          amount: args.orderInput.Amount,
        },
        description: args.orderInput.Description,
        notes: args.orderInput.Notes,
        payment: args.orderInput.Payment,
        shipping: args.orderInput.Shipping,
        billingAddress:{
          number: args.orderInput.Number,
          street: args.orderInput.Street,
          town: args.orderInput.Town,
          city: args.orderInput.City,
          country: args.orderInput.Country,
          postalCode: args.orderInput.PostalCode,
        },
        shippingAddress:{
          number: args.orderInput.Number,
          street: args.orderInput.Street,
          town: args.orderInput.Town,
          city: args.orderInput.City,
          country: args.orderInput.Country,
          postalCode: args.orderInput.PostalCode,
        }
      });

      const result = await order.save();

      return {
        ...result._doc,
        date: result.date,
        time: result.time,
        type: result.type,
        buyer: result.buyer,
        receiver: result.receiver
      };
    } catch (err) {
      throw err;
    }
  }
};
