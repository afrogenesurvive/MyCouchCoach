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
const Notification = require('../../models/notification');
const util = require('util');

const { transformPerk } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllPerks: async (args, req) => {

    console.log("Resolver: getAllPerks...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perks = await Perk.find({});

      return perks.map(perk => {
        return transformPerk(perk,);
      });
    } catch (err) {
      throw err;
    }
  },
  getPerkById: async (args, req) => {
    console.log("Resolver: getPerkById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const perk = await Perk.findById(args.perkId);

        return {
            ...perk._doc,
            _id: perk.id,
            name: perk.name
        };
    } catch (err) {
      throw err;
    }
  },
  getPerksByField: async (args, req) => {
    console.log("Resolver: getPerkByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const perks = await Perk.find(query)

      return perks.map(perk => {
        return transformPerk(perk);

      });
    } catch (err) {
      throw err;
    }
  },
  getPerksByNameRegex: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const regex = "/^" + args.regex + "/";
      const perks = await Perk.find({'name': {$regex: regex, $options: 'i'}});

      return perks.map(perk => {
        return transformPerk(perk);
      });
    } catch (err) {
      throw err;
    }
  },
  updatePerkBasic: async (args, req) => {
    console.log("Resolver: updatePerkBasic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perk = await Perk.findOneAndUpdate({_id:args.perkId},{
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
  updatePerkByField: async (args, req) => {
    console.log("Resolver: updatePerkField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const user = await Perk.findOneAndUpdate({_id:args.perkId},query,{new: true, useFindAndModify: false});

      return {
          ...perk._doc,
          _id: perk.id,
          name: perk.name
      };
    } catch (err) {
      throw err;
    }
  },
  deletePerk: async (args, req) => {
    console.log("Resolver: deletePerk...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perk = await Perk.findByIdAndRemove(args.perkId);
      return {
          ...perk._doc,
          _id: perk.id,
          name: perk.name
      };
    } catch (err) {
      throw err;
    }
  },
  createPerk: async (args, req) => {
    console.log("Resolver: createPerk...");
    try {

      const existingPerkName = await Lesson.findOne({ name: args.perkInput.name});
      if (existingPerkName) {
        throw new Error('Perk w/ that name exists already.');
      }

      const today = new Date();

      const perk = new Perk({
        date: today,
        name: args.perkInput.name,
        type: args.perkInput.type,
        description: args.perkInput.description,
        code: args.perkInput.code,
        imageLink: args.perkInput.imageLink,
      });

      const result = await perk.save();

      return {
        ...result._doc,
        date: result.date,
        type: result.type,
        description: result.description,
        code: result.code,
        imageLink: result.imageLink,
      };
    } catch (err) {
      throw err;
    }
  }
};
