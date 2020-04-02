const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');

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
      const lessons = await Lesson.find(query)

      return lessons.map(lesson => {
        return transformOrder(lesson);

      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByScheduleRange: async (args, req) => {
    console.log("Resolver: getLessonsByScheduleRange...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const startDate = args.startDate;
      const endDate = args.endDate;
      const lessons = await Lesson.find({'schedule': {$gte: startDate, $lte: endDate}});

      return lessons.map(lesson => {
        return transformLesosn(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByInstructors: async (args, req) => {
    console.log("Resolver: getLessonsByInstructors...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const instructors = args.instructorIds;
      const lessons = await Lesson.find({'instructors._id': {$all: instructors}});

      return lessons.map(lesson => {
        return transformLesosn(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsBySessionField: async (args, req) => {
    console.log("Resolver: getLessonsBySessionField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const field = "session"+args.field;
      const lessons = await Lesson.find({[field]: args.query});

      return lessons.map(lesson => {
        return transformLesson(lesson);
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
      const lesson = await Order.findOneAndUpdate({_id:args.lessonId},{
        title: args.lessonInput.title,
        subtitle: args.lessonInput.subtitle,
        type: args.lessonInput.type,
        category: args.lessonInput.category,
        price: args.lessonInput.price,
        points: args.lessonInput.points,
        description: args.lessonInput.description,
        notes: args.lessonInput.notes,
        duration: args.lessonInput.duration,
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
      const lesson = await Order.findOneAndUpdate({_id:args.lessonId},query,{new: true, useFindAndModify: false})
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
      const lesson = await Order.findByIdAndRemove(args.lessonId);

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

      const existingOrderTitle = await Order.findOne({ title: args.lessonInput.title});
      if (existingOrderTitle) {
        throw new Error('Order w/ that title exists already.');
      }

      const creator = await User.findById({_id: args.creatorId});
      const today = new Date();

      const lesson = new Lesson({
        title: args.lessonInput.title,
      });

      const result = await lesson.save();

      return {
        ...result._doc,
        title: result.title,
      };
    } catch (err) {
      throw err;
    }
  }
};
