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
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationById: async (args, req) => {
    console.log("Resolver: getNotificationById...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const notification = await Notification.findById({_id: args.notificationId})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  getNotificationsByField: async (args, req) => {
    console.log("Resolver: getNotificationsByField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};

      const notifications = await Notification.find(query)
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationsByFieldRegex: async (args, req) => {
    console.log("Resolver: getNotificationsByFieldRegex...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};

      const notifications = await Notification.find(query)
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationsToday: async (args, req) => {
    console.log("Resolver: getNotificationsToday...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const today = new Date().toLocaleDateString().substr(0,10);
      const today2 = new Date(today);
      // const today = moment().format('YYYY-MM-DD');

      let test = await Notification.find({})
      test.map(x => x.sendDate)
      console.log(today2,test);
      const notifications = await Notification.find({sendDate: today2})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationsBySendDateRange: async (args, req) => {
    console.log("Resolver: getNotificationsBySendDateRange...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const lowerLimit = new Date(args.lowerLimit).toLocaleDateString().substr(0,10);
      const upperLimit = new Date(args.upperLimit).toLocaleDateString().substr(0,10);
      const notifications = await Notification.find({sendDate: {$gte: lowerLimit, $lte: upperLimit}})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  // getNotificationsBySendTimeRange: async (args, req) => {
  //   console.log("Resolver: getNotificationsBySendTimeRange...");
  //
  //   if (!req.isAuth) {
  //     throw new Error('Unauthenticated!');
  //   }
  //   try {
  //
  //     const lowerLimit = new Date(args.lowerLimit).toLocaleDateString().substr(0,10);
  //     const upperLimit = new Date(args.upperLimit).toLocaleDateString().substr(0,10);
  //     const notifications = await Notification.find({time: {$gte: lowerLimit, $lte: upperLimit}})
  //     .populate('creator')
  //     .populate('lesson')
  //     .populate('recipients');
  //
  //     return notifications.map(notification => {
  //       return transformNotification(notification,);
  //     });
  //   } catch (err) {
  //     throw err;
  //   }
  // },
  getNotificationsByTrigger: async (args, req) => {
    console.log("Resolver: getNotificationsByTrigger...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const trigger = {
        unit: args.notificationInput.triggerUnit,
        value: args.notificationInput.triggerValue
      }

      const notifications = await Notification.find({trigger: trigger})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationsByLesson: async (args, req) => {
    console.log("Resolver: getNotificationsByLesson...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: args.lessonId});

      const notifications = await Notification.find({lesson: lesson})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  getNotificationsByRecipients: async (args, req) => {
    console.log("Resolver: getNotificationsByRecipients...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      recipients = await User.find({_id: {$in: args.recipientIds}})
      console.log('recipientIds',args.recipientIds);
      console.log('recipients',recipients);

      const notifications = await Notification.find({recipients: {$all: recipients}})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return notifications.map(notification => {
        return transformNotification(notification,);
      });
    } catch (err) {
      throw err;
    }
  },
  updateNotificationBasic: async (args, req) => {
    console.log("Resolver: updateNotificationBasic...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      let sendDate = null;
      let start = null;
      const triggerValue = args.notificationInput.triggerValue;
      const triggerUnit = args.notificationInput.triggerUnit;
      if (args.notificationInput.type === 'Reminder') {
        start = args.notificationInput.sessionDate+" "+args.notificationInput.sessionTime;
        sendDate = moment(start).subtract(triggerValue, triggerUnit);
      }
      if (args.notificationInput.type === 'FollowUp') {
        start = args.notificationInput.sessionEndDate;
        sendDate = moment(start).add(triggerValue, triggerUnit);
      }

      const notification = await Notification.findById({_id: args.notificationId})
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  updateNotificationByField: async (args, req) => {
    console.log("Resolver: updateNotificationByField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};

      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},query,
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  updateNotificationTrigger: async (args, req) => {
    console.log("Resolver: updateNotificationTrigger...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const trigger = {
        unit: args.notificationInput.triggerUnit,
        value: args.notificationInput.triggerValue,
      }
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {trigger: trigger},
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  updateNotificationDelivery: async (args, req) => {
    console.log("Resolver: updateNotificationDelivery...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const delivery = {
        type: args.notificationInput.deliveryType,
        params: args.notificationInput.deliveryParams,
        sent: args.notificationInput.deliverySent
      }
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {delivery: delivery},
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  updateNotificationLesson: async (args, req) => {
    console.log("Resolver: updateNotificationLesson...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const lesson = await Lesson.findById({_id: args.lessonId});
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {delivery: delivery},
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  addNotificationRecipient: async (args, req) => {
    console.log("Resolver: addNotificationRecipient...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const recipient = await Lesson.findById({_id: args.userId});
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {$addToSet: {recipients: recipient}},
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  NotificationSent: async (args, req) => {
    console.log("Resolver: NotificationSent...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const preNotification = await Notification.findById({_id: args.notificationId});
      const sent = args.notificationInput.deliverySent;
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {'delivery.sent': sent},
        {new: true, useFindAndModify: false}
      )
      .populate('creator')
      .populate('lesson')
      .populate('recipients');

      return {
        ...notification._doc,
        _id: notification.id,
        createDate: notification.createDate,
        sendDate: notification.sendDate,
        type: notification.type,
        title: notification.title
      };
    } catch (err) {
      throw err;
    }
  },
  sendNotifications: async (args, req) => {
    console.log("Resolver: sendNotifications...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = new Date().toLocaleDateString().substr(0,10);
      const time = new Date().toLocaleDateString().substr(11,5);
      const notifications = await Notification.find({sendDate: today})
      // get notifications for today and either now or within min span
      // send at intervals w/ chron

    } catch (err) {
      throw err;
    }
  },
  deleteNotificationRecipient: async (args, req) => {
    console.log("Resolver: deleteNotificationRecipient...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const recipient = await User.findById({_id: args.userId})
      const notification = await Notification.findOneAndUpdate(
        {_id: args.notificationId},
        {$pull: {recipients: recipient}},
        {new: true, useFindAndModify: false}
      );

      return {
        ...notification._doc,
        _id: notification.id
      };
    } catch (err) {
      throw err;
    }
  },
  deleteNotification: async (args, req) => {
    console.log("Resolver: deleteNotification...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const notification = await Notification.findByIdAndRemove(
        {_id: args.notificationId},
        {useFindAndModify: false});

      return {
        ...notification._doc,
        _id: notification.id
      };
    } catch (err) {
      throw err;
    }
  },
  createNotification: async (args, req) => {
    console.log("Resolver: createNotification...");
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      let time = new Date().toLocaleDateString().substr(11,5);
      const creator = await User.findById({_id: args.activityId});
      let lesson = await Lesson.findById({_id: args.lessonId});
      const preRecipents = args.userIds.split(',');
      // console.log(args.userIds,preRecipents);
      let recipients = await User.find({_id: {$in: preRecipents}});
      // recipients.push(creator);
      // console.log('lessonId',lesson._id);
      // console.log('foo');
      const sessionBookedUsers = await Lesson.aggregate([
              {$unwind: '$sessions'},
              {$lookup:
                {
                   from: "users",
                   localField: 'sessions.booked',
                   foreignField: '_id',
                   as: "sessions.booked"
                 }
               },
              {$lookup:
                {
                   from: "users",
                   localField: 'sessions.attended',
                   foreignField: '_id',
                   as: "sessions.attended"
                 }
               },
              {$group: {_id:{
                lessonId: '$_id',
                lessonTitle: '$title',
                lessonInstructors: '$instructors',
                date:'$sessions.date',
                endDate:'$sessions.endDate',
                title:'$sessions.title',
                time:'$sessions.time',
                limit:'$sessions.limit',
                bookedAmount: '$sessions.bookedAmount',
                booked: '$sessions.booked',
                attendedAmount: '$sessions.attendedAmount',
                attended: '$sessions.attended',
                full: '$sessions.full',
                url: '$sessions.url',
              }}},
              // {$group: {_id:{date:'$sessions.date',title:'$sessions.title'},booked: { $addToSet: '$sessions.booked'}}},
              {$match:
                {
                  // '_id.lessonId': {$ne: args.lessonId},
                  '_id.lessonId': {$eq: args.lessonId},
                  '_id.title': {$eq: args.notificationInput.sessionTitle }
                }},
              // {$match: {'_id.lessonId': args.lessonId, '_id.title': {$eq: args.lessonInput.sessionTitle }}}
            ]);
            // console.log('sessionBookedUsers',sessionBookedUsers);
            let sessionBookedUsers2 = [];
            let recipients2 = [];
            // console.log('recipients',recipients,'sessionBookedUsers',sessionBookedUsers2);

            if (sessionBookedUsers.length !== 0 &&
            sessionBookedUsers2.length !== 0 ) {
              sessionBookedUsers2 = sessionBookedUsers[0]._id.booked;
             recipients2 = recipients.concat(sessionBookedUsers2);
            }
            // console.log('sessionBookedUsers',sessionBookedUsers[0]._id.booked.map(x => x._id),'recipients',recipients2);
            // recipients.map(x => x._id);

      let sendDate = null;
      let start = null;
      const triggerValue = args.notificationInput.triggerValue;
      const triggerUnit = args.notificationInput.triggerUnit;
      if (args.notificationInput.type === 'Reminder') {
        // console.log('Reminder');
        start = new Date(args.notificationInput.sessionDate+" "+args.notificationInput.sessionTime);
        sendDate = moment(start).subtract(triggerValue, triggerUnit);
        // console.log('start',start,'moment(start)',moment(start));
      }
      if (args.notificationInput.type === 'FollowUp') {
        // console.log('FollowUp');
        start = args.notificationInput.sessionEndDate+' 12:00';
        sendDate = moment(start).add(triggerValue, triggerUnit);
        // console.log('start',start,'moment(start)',moment(start));
      }
      time = sendDate.hour()+':'+sendDate.minute();
      // console.log(triggerValue,triggerUnit,'moment start',moment(start),'sendDate',sendDate);
      console.log('start',start,'sendDate',sendDate,'time',time);
      const trigger = {
        unit: triggerUnit,
        value: triggerValue
      }
      const session = {
        title: args.notificationInput.sessionTitle,
        date: args.notificationInput.sessionDate,
        endDate: args.notificationInput.sessionEndDate,
        time: args.notificationInput.sessionTime
      }
      const delivery = {
        type: args.notificationInput.deliveryType,
        params: args.notificationInput.deliveryParams,
        sent: false
      }

      const notificationExists = await Notification.findOne({
        type: args.notificationInput.type,
        title: args.notificationInput.title,
        'session.date': args.notificationInput.sessionDate,
        'session.title': args.notificationInput.sessionTitle,
        'trigger.unit': args.notificationInput.triggerUnit,
        'trigger.value': args.notificationInput.triggerValue
      })
      if (notificationExists) {
        console.log('...no duplications check your data and try again...');
        throw new Error('...no duplications check your data and try again...')
      }
      // console.log('beep');
      const notification = new Notification({
        createDate: date,
        sendDate: sendDate,
        creator: creator,
        type: args.notificationInput.type,
        title: args.notificationInput.title,
        time: time,
        trigger: trigger,
        lesson: lesson,
        session: session,
        recipients: recipients2,
        body: args.notificationInput.body,
        delivery: delivery
      })

      const result = await notification.save();
      // console.log('boop');
      const updateLesson = await Lesson.findOneAndUpdate(
        {_id: args.lessonId},
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
  },


};
