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
const Notification = require('../../models/notification');
const util = require('util');
const moment = require('moment');

const { transformNotification } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllNotifications: async (args, req) => {
    console.log("Resolver: getAllNotifications...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const notifications = await Notification.find({})
      .populate('creator')
      .populate('lesson')
      .populate('recipients')

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  createNotification: async (args, req) => {
    console.log("Resolver: createNotification...");
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      const time = new Date().toLocaleDateString().substr(11,5);
      const creator = await User.findById({_id: args.activityId});
      let lesson = await Lesson.findById({_id: args.lessonId});

      let recipients = await User.find({_id: {$in: args.userIds}});
      let start = null;
      if (args.notificationInput.type === 'Reminder') {
        start = args.notificationInput.sessionDate+" "+args.notificationInput.sessionTime;
      } else {
        start = args.notificationInput.sessionEndDate;
      }

      const triggerValue = args.notificationInput.triggerValue;
      const triggerUnit = args.notificationInput.triggerUnit;

      let sendDate = null;
      sendDate = moment(start).add(triggerValue, triggerUnit);
      // console.log(triggerValue,triggerUnit,'moment start',moment(start),'sendDate',sendDate);

      const notification = new Notification({
        createDate: date,
        sendDate: sendDate,
        creator: creator,
        type: args.notificationInput.type,
        title: args.notificationInput.title,
        time: args.notificationInput.time,
        trigger: {
          unit: args.notificationInput.triggerUnit,
          value: args.notificationInput.triggerValue
        },
        lesson: lesson,
        session: {
          title: args.notificationInput.sessionTitle,
          date: args.notificationInput.sessionDate,
          time: args.notificationInput.sessionTime
        },
        recipients: recipients,
        body: args.notificationInput.body,
        delivery: {
          type: args.notificationInput.deliveryType,
          params: args.notificationInput.deliveryParams,
          sent: args.notificationInput.deliverySent
        }
      })

      const result = await notification.save();
      const updateLesson = await Lesson.findOneAndUpdate(
        {_id: lesson._id},
        {$addToSet: {reminders: result}},
        {new: true, useFindAndModify: false}
      )
      const updateUsers = await User.updateMany(
        {_id: {$in: recipients}},
        {$addToSet: {notifications: result}},
        {new: true, useFindAndModify: false}
      )

      return {
        ...result._doc,
        _id: result.id,
        createDate: result.createDate,
        sendDate: result.sendDate,
        type: result.type,
        title: result.title
      };
    } catch (err) {
      throw err;
    }
  }
};
