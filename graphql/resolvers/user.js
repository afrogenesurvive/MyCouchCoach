const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const DataLoader = require('dataloader');

const User = require('../../models/user');
const Comment = require('../../models/comment');
const Message = require('../../models/message');
const util = require('util');

const { transformUser, transformMessage } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  users: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const users = await User.find({})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate('comments.')
      .populate('messages')
      .populate('orders');
      return users.map(user => {
        return transformUser(user,);
      });
    } catch (err) {
      throw err;
    }
  },
  getUserById: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const user = await User.findById(args.userId)
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate('comments.')
      .populate('messages')
      .populate('orders');

        return {
            ...user._doc,
            _id: user.id,
            name: user.name
        };
    } catch (err) {
      throw err;
    }
  },
  getUserByField: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      // if (resolverField ===) {
      //   fieldType =
      // }
      // if (fieldType === ) {
      //   resolverField
      // }

      const query = {[resolverField]:resolverQuery};
      const users = await User.find(query)

      return users.map(user => {
        return transformUser(user);

      });
    } catch (err) {
      throw err;
    }
  },
  getUserByNameRegex: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const regex = "/^" + args.regex + "/";
      const users = await User.find({'name': {$regex: regex, $options: 'i'}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUserByInterests: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const interests = args.interests;
      const users = await User.find({'interests': {$all: interests}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUserByTags: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const tags = args.tags;
      const users = await User.find({'tags': {$all: tags}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPerks: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const perkIds = args.perkIds;
      const users = await User.find({'perks._id': {$all: perkIds}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPromos: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const promoIds = args.promoIds;
      const users = await User.find({'promos._id': {$all: promoIds}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByFriends: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const friends = args.friendIds;
      const users = await User.find({'friends._id': friends});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPointRange: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const upper = args.upperLimit;
      const lower = args.lowerLimit;
      const users = await User.find({'points': {$gte: lower, $lte: upper}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getThisUser: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const user = await User.findById({_id: args.activityId})
      .populate('models')
      .populate('viewedShows')
      .populate('viewedcontent')
      .populate('likedcontent')
      .populate('comments')
      .populate('messages')
      .populate('transactions');

      return {
        ...user._doc,
        _id: user.id,
        email: user.contact.email ,
        name: user.name,
      };
    } catch (err) {
      throw err;
    }
  },
  updateUser: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = await User.findOneAndUpdate({_id:args.userId},{
        password: hashedPassword,
        name: args.userInput.name,
        username: args.userInput.username,
        dob: args.userInput.dob,
        contact: {
          email: args.userInput.contactEmail,
          phone: args.userInput.contactPhone
        },
        address: {
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
        },
        bio: args.userInput.bio
        },{new: true, useFindAndModify: false})
        .populate('models')
        .populate('viewedShows')
        .populate('viewedcontent')
        .populate('likedcontent')
        .populate('comments')
        .populate('messages')
        .populate('transactions');

        return {
          ...user._doc,
          _id: user.id,
          name: user.name,
          role: user.role,
          username: user.username,
          dob: user.dob,
          contact: {
            email: user.contact.email,
            phone: user.contact.phone
          },
          address: {
            number: user.address.number,
            street: user.address.street,
            town: user.address.town,
            city: user.address.city,
            country: user.address.country,
            postalCode: user.address.postalCode
          },
          bio: user.bio,
        };
    } catch (err) {
      throw err;
    }
  },
  updateUserField: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const resolverField = args.field;
      const resolverQuery = args.query;

      const query = {[resolverField]:resolverQuery};
      const user = await User.findOneAndUpdate({_id:args.userId},query,{new: true, useFindAndModify: false})
      .populate('models')
      .populate('viewedShows')
      .populate('viewedcontent')
      .populate('likedcontent')
      .populate('comments')
      .populate('messages')
      .populate('transactions');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
        dob: user.dob,
        contact: {
          email: user.contact.email,
          phone: user.contact.phone
        },
        address: {
          number: user.address.number,
          street: user.address.street,
          town: user.address.town,
          city: user.address.city,
          country: user.address.country,
          postalCode: user.address.postalCode
        },
        bio: user.bio,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserTags: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tags = args.userInput.tags;
      const splitTags = tags.split(",");
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { tags: {$each: splitTags} }},{new: true, useFindAndModify: false})
      .populate('models')
      .populate('viewedShows')
      .populate('viewedcontent')
      .populate('likedcontent')
      .populate('comments')
      .populate('messages')
      .populate('transactions');

        return {
          ...user._doc,
          _id: user.id,
          email: user.contact.email ,
          name: user.name,
        };
    } catch (err) {
      throw err;
    }
  },
  addUserProfileImage: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const profileImage = {
        name: args.userInput.profileImageName,
        type: args.userInput.profileImageType,
        path: args.userInput.profileImagePath
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { profileImages: profileImage }},{new: true, useFindAndModify: false})
      .populate('models')
      .populate('viewedShows')
      .populate('viewedcontent')
      .populate('likedcontent')
      .populate('comments')
      .populate('messages')
      .populate('transactions');

        return {
          ...user._doc,
          _id: user.id,
          email: user.contact.email,
          name: user.name,
        };
    } catch (err) {
      throw err;
    }
  },
  addUserTokens: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    // admin or own profile check here
    try {
      const prevAmountUser = await User.findById({_id: args.userId});
      const prevAmount = prevAmountUser.tokens;
      const amountToAdd = args.userInput.tokens;
      let newAmount = prevAmount + amountToAdd;
      const user = await User.findOneAndUpdate({_id:args.userId},{ tokens: newAmount },{new: true, useFindAndModify: false})
      .populate('models')
      .populate('viewedShows')
      .populate('viewedcontent')
      .populate('likedcontent')
      .populate('comments')
      .populate('messages')
      .populate('transactions');

        return {
          ...user._doc,
          _id: user.id,
          email: user.contact.email ,
          name: user.name,
        };
    } catch (err) {
      throw err;
    }
  },
  deleteUserTransaction: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const transaction = await Transaction.findById({_id: args.transactionId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { 'transactions': transaction }},{new: true, useFindAndModify: false});

        return {
          ...user._doc,
          _id: user.id,
          email: user.contact.email ,
          name: user.name,
        };
    } catch (err) {
      throw err;
    }
  },
  deleteUser: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findByIdAndRemove(args.userId);
        return {
          ...user._doc,
          _id: user.id,
          name: user.name,
          username: user.username,
          dob: user.dob,
          role: user.role,
          contact: {
            email: user.contact.email,
            phone: user.contact.phone
          },
          addresses: [{
            number: user.address.number,
            street: user.address.street,
            town: user.address.town,
            city: user.address.city,
            country: user.address.country,
            postalCode: user.address.postalCode
          }],
          bio: user.bio,
        };
    } catch (err) {
      throw err;
    }
  },
  createUser: async (args, req) => {

    try {
      const existingUserName = await User.findOne({ username: args.userInput.username});
      if (existingUserName) {
        throw new Error('User w/ that username exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const today = new Date();
      let dob = args.userInput.dob;
      let ageDifMs = Date.now() - birthday.getTime();
      let ageDate = new Date(ageDifMs);
      let age =  Math.abs(ageDate.getUTCFullYear() - 1970);
      console.log("age",age);
}
      const user = new User({
        password: hashedPassword,
        name: args.userInput.name,
        role: "User",
        username: args.userInput.username,
        dob: args.userInput.dob,
        age: age,
        public: args.userInput.public,
        contact: {
          email: args.userInput.contactEmail,
          phone: args.userInput.contactPhone
        },
        addresses: [{
          type: args.userInput.addressType,
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode
        }],
        bio: args.userInput.bio,
        profileImages: [{
          name: "",
          type: "",
          path: "",
        }],
        socialMedia: [{
          platform: "",
          handle: "",
        }],
        interests: [""],
        perks: [{
          date: 0,
          name: "",
          description: "",
        }],
        friends: [],
        points: 0,
        tags: [""],
        verification: {
          verified: false,
          type: "email",
          code: null
        },
        activity: [{
          date: today,
          request: "initial activity... rpofile created..."
        }],
        likedLessons: [],
        bookedLessons: [],
        attendedLessons: [],
        taughtLessons: [],
        wishlist: [],
        cart: [],
        comments: [],
        messages: [],
        orders: [],
        billing: [{
          date: "",
          type: "",
          description: "",
          body: "",
          valid: false,
          primary: false,
        }]
      });

      const result = await user.save();

      return {
        ...result._doc,
        password: hashedPassword,
        _id: result.id,
        name: result.name,
        role: result.role,
        username: result.username,
        dob: result.dob,
        content: {
          email: result.contact.email,
          phone: result.contact.phone
        },
        addresses: [{
          number: result.address.number,
          street: result.address.street,
          town: result.address.town,
          city: result.address.city,
          country: result.address.country,
          postalCode: result.address.postalCode
        }],
        bio: result.bio
      };
    } catch (err) {
      throw err;
    }
  }
};
