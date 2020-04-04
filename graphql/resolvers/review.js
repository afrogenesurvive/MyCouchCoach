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

const { transformPerk } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllReviews: async (args, req) => {

    console.log("Resolver: getAllReviews...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const reviews = await Review.find({});

      return reviews.map(perk => {
        return transformReview(review,);
      });
    } catch (err) {
      throw err;
    }
  },
  getReviewById: async (args, req) => {
    console.log("Resolver: getReviewById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const review = await Review.findById(args.reviewId);

        return {
            ...review._doc,
            _id: review.id,
            title: review.title
        };
    } catch (err) {
      throw err;
    }
  },
  getReviewsByField: async (args, req) => {
    console.log("Resolver: getReviewByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const reviews = await Review.find(query)

      return reviews.map(review => {
        return transformReview(review);

      });
    } catch (err) {
      throw err;
    }
  },
  updateReviewBasic: async (args, req) => {
    console.log("Resolver: updateReviewBasic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perk = await Review.findOneAndUpdate({_id:args.perkId},{
        name: args.perkInput.name,
        type: args.perkInput.type,
        description: args.perkInput.description,
        code: args.perkInput.code,
        imageLink: args.perkInput.imageLink,
        },{new: true, useFindAndModify: false});

        return {
            ...perk._doc,
            _id: perk.id,
            name: perk.name
        };
    } catch (err) {
      throw err;
    }
  },
  updateReviewByField: async (args, req) => {
    console.log("Resolver: updateReviewField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const user = await Review.findOneAndUpdate({_id:args.perkId},query,{new: true, useFindAndModify: false});

      return {
          ...perk._doc,
          _id: perk.id,
          name: perk.name
      };
    } catch (err) {
      throw err;
    }
  },
  deleteReview: async (args, req) => {
    console.log("Resolver: deleteReview...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perk = await Review.findByIdAndRemove(args.perkId);
      return {
          ...perk._doc,
          _id: perk.id,
          name: perk.name
      };
    } catch (err) {
      throw err;
    }
  },
  createReview: async (args, req) => {
    console.log("Resolver: createReview...");
    try {

      const today = new Date();

      const perk = new Review({
        date: today,
        type: args.reviewInput.type,
        title: args.reviewInput.title,
        lesson: lesson,
        author: author,
        body: args.reviewInput.body,
        rating: args.reviewInput.rating
      });

      const result = await perk.save();

      return {
        ...result._doc,
        date: result.date,
        type: result.type,
        title: result.title,
        lesson: result.lesson,
        author: result.author,
        body: result.body,
        rating: result.rating
      };
    } catch (err) {
      throw err;
    }
  }
};
