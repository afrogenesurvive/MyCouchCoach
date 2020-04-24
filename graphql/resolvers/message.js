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

const { transformMessage } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllMessages: async (args, req) => {
    console.log("Resolver: getAllMessages...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const messages = await Message.find({})
      .populate('sender')
      .populate('receiver');

      return messages.map(message => {
        return transformMessage(message,);
      });
    } catch (err) {
      throw err;
    }
  },
  getMessageById: async (args, req) => {
    console.log("Resolver: getMessageById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const message = await Message.findById({_id: args.messageId})
      .populate('sender')
      .populate('receiver');

        return {
          ...message._doc,
          _id: message.id,
          date: message.date,
          time: message.time,
        };
    } catch (err) {
      throw err;
    }
  },
  getMessageBySender: async (args, req) => {
    console.log("Resolver: getMessageBySender...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const sender = await User.findById({_id: args.senderId});
      const message = await Message.findId({sender: sender})
      .populate('sender')
      .populate('receiver');

        return {
          ...message._doc,
          _id: message.id,
          date: message.date,
          time: message.time,
        };
    } catch (err) {
      throw err;
    }
  },
  getMessageByReciever: async (args, req) => {
    console.log("Resolver: getMessageByReciever...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reciever = await User.findById({_id: args.recieverId});
      const message = await Message.findById({receiver: receiver})
      .populate('sender')
      .populate('receiver');

        return {
          ...message._doc,
          _id: message.id,
          date: message.date,
          time: message.time,
        };
    } catch (err) {
      throw err;
    }
  },
  updateMessageRead: async (args, req) => {
    console.log("Resolver: updateMessageRead...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const message = await Message.findOneAndUpdate({_id: args.messageId},{read: true},{new: true, useFindAndModify: false});
        return {
          ...message._doc,
          _id: message.id,
          date: message.date,
          time: message.time,
        };
    } catch (err) {
      throw err;
    }
  },
  deleteMessage: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const preMessage = await Message.findById({_id: args.messageId});
      const senderRole = preMessage.sender.role;
      const recieverRole = preMessage.reciever.role;

      const message = await Message.findByIdAndRemove(args.messageId);

      const updateSender = await mongoose.model(senderRole).findOneAndUpdate({_id: args.senderId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});
      const updateReceiver = await mongoose.model(receiverRole).findOneAndUpdate({_id: args.receiverId},{$pull: {'messages._id': args.messageId}},{new: true, useFindAndModify: false});

        return {
          ...message._doc,
          _id: message.id,
          date: message.date,
          time: message.time,
        };
    } catch (err) {
      throw err;
    }
  },
  createMessage: async (args, req) => {

    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      const time = new Date().toLocaleDateString().substr(11,5);
      let sender = await User.findById({_id: args.senderId});
      let receiver = await User.findById({_id: args.receiverId});

      const message = new Message({
        date: date,
        time: time,
        type: args.messageInput.type,
        subject: args.messageInput.subject,
        sender: sender,
        receiver: receiver,
        message: args.messageInput.message,
        read: false,
      });

      const updateSender = await User.findOneAndUpdate({_id: args.senderId},{$addToSet: {messages: message}},{new: true, useFindAndModify: false});
      const updateReceiver = await User.findOneAndUpdate({_id: args.receiverId},{$addToSet: {messages: message}},{new: true, useFindAndModify: false});
      const result = await message.save();

      return {
        ...result._doc,
        _id: result.id,
        date: result.date,
        time: result.time,
        type: result.type,
        subject: result.subject,
        sender: result.sender,
        receiver: result.receiver,
        message: result.message,
      };
    } catch (err) {
      throw err;
    }
  }
};
