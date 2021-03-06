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

const { transformUser } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');

const sgMail = require('@sendgrid/mail');
// const S3 = require('aws-sdk/clients/s3');
const AWS = require('aws-sdk');
// const stripe = require('stripe')(process.env.STRIPE_B);

module.exports = {
  cronTest: async (args) => {
    console.log("Resolver: cronTest...",args);
    // try {
    //   return
    // } catch (err) {
    //   throw err;
    // }
  },
  testEmail: async () => {
    console.log("Resolver: test email...");
    try {
      let sendStatus = null;

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: 'michael.grandison@gmail.com',
        from: 'african.genetic.survival@gmail.com',
        subject: 'Its yah Booiii!!!',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      sgMail
        .send(msg)
        .then(() => {
          // console.log('Email Sent!');
          sendStatus = 'Email Sent!';
          // console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          // console.error(error.toString());
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          // console.log('sendStatus',sendStatus);
        });

      // return users.map(user => {
      //   return transformUser(user,);
      // });

      return sendStatus;
    } catch (err) {
      throw err;
    }
  },
  getAllUsers: async (args, req) => {

    console.log("Resolver: getAllUsers...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const users = await User.find({})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
        path: 'orders',
        populate: {
          path: 'buyer',
          model: 'User'
        }})
      .populate({
        path: 'orders',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
        .populate({
          path: 'orders',
          populate: {
            path: 'lessons.ref',
            model: 'Lesson'
          }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');


      return users.map(user => {
        return transformUser(user,);
      });
    } catch (err) {
      throw err;
    }
  },
  getUserById: async (args, req) => {
    console.log("Resolver: getUserById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const user = await User.findById(args.userId)
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
        path: 'orders',
        populate: {
          path: 'buyer',
          model: 'User'
        }})
      .populate({
        path: 'orders',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
        path: 'orders',
        populate: {
          path: 'lessons.ref',
          model: 'Lesson'
        }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

        return {
            ...user._doc,
            _id: user.id,
            name: user.name
        };
    } catch (err) {
      throw err;
    }
  },
  getUsersByField: async (args, req) => {
    console.log("Resolver: getUsersByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
    path: 'orders',
    populate: {
      path: 'buyer',
      model: 'User'
    }})
    .populate({
      path: 'orders',
      populate: {
        path: 'receiver',
        model: 'User'
      }})
    .populate({
      path: 'orders',
      populate: {
        path: 'lessons.ref',
        model: 'Lesson'
      }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);

      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByFieldRegex: async (args, req) => {
    console.log("Resolver: getUsersByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let fieldType = null;
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      // console.log(query);
      const users = await User.find(query)
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);

      });
    } catch (err) {
      throw err;
    }
  },
  getPocketVars: async (args, req) => {
    console.log('Resolver: getPocketVars...');
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const pocketVars = process.env.CREDS;
      // console.log('pocketVars',pocketVars);
      // const pocketVars = JSON.stringify(pocketVariables);
      // console.log(pocketVariables,pocketVars);
      return pocketVars;
    } catch (err) {
      throw err;
    }
  },
  stripeCreatePaymentIntent: async (args, req) => {
    console.log('Resolver: stripeCreatePaymentIntent...');
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    const stripe = require('stripe')(process.env.STRIPE_B);
    try {

      const preUser = await User.findById({_id: args.activityId})
      // console.log('preUser.contact.email',preUser.contact.email);
      // const stripe = require('stripe')(process.env.STRIPE_B);
      // console.log(stripe);

      let response = null;
      let x = await stripe.paymentIntents.create(
      // let x =  stripe.paymentIntents.create(
        {
          amount: args.amount,
          currency: args.currency,
          payment_method_types: ['card'],
          receipt_email: preUser.contact.email
        },
        function(err, paymentIntent) {
          if (err) {
            console.log('err',err);
            // setResponse(err)
            response = err;
            return response;
          } else {
            // console.log('x2',x);
            // console.log('paymentIntent',paymentIntent.client_secret);
            // return 'x';
            // setResponse(paymentIntent)
            response = paymentIntent;
            console.log(response);
            return response;
          }
        })
        // .then((res) => {
        //   console.log('finish line?',res);
        // })

      // function setResponse (args) {
      //   // response = JSON.stringify(args);
      //   response = args.client_secret;
      //   console.log('x3',x);
      //   console.log("boop",response);
      //   return response;
      // }

      // console.log('brap',x);
      // console.log('brip',response);
      // return response;
    } catch (err) {
      throw err;
    }
  },
  getPublicUserById: async (args) => {
    console.log('Resolver: getPublicUserById...');
    try {

      const user = await User.findById({_id: args.userId})

      return {
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  requestPasswordReset: async (args) => {
    console.log('Resolver: requestPasswordReset...');
    try {

      const username = args.userInput.username;
      const email = args.userInput.email;
      const userExists = await User.findOne({username: args.userInput.username, 'contact.email': args.userInput.contactEmail})
      if (!userExists) {
        console.log('...user doesnt exist. Check your credentials and try again...');
        throw new Error('...user doesnt exist. Check your credentials and try again...')
      }
      const verificationCode = 'VERF002';

      const user = await User.findOneAndUpdate(
        {_id: userExists._id},
        {verification: {
          verified: false,
          type: 'passwordReset',
          code: verificationCode
        }},
        {new: true, useFindAndModify: false}
      )
      const resetUrl = 'localhost:3000/passwordReset/'+userExists._id+'@'+verificationCode+'';
      const userEmail = user.contact.email;
      // console.log('resetUrl',resetUrl);

      let sendStatus = null;

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: userEmail,
        from: 'african.genetic.survival@gmail.com',
        subject: 'Password Reset',
        text: `
          ... use this url to reset your password...
          ${resetUrl} ...
        `,
        html: `
        <strong>
        ... use this url to reset your password...
        <a target="_blank">
        ${resetUrl}
        </a> ...
        </strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          // console.log('Email Sent!');
          sendStatus = 'Email Sent!';
          console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          // console.error(error.toString());
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          console.log('sendStatus',sendStatus);
        });
        // console.log('Password reset: ',sendStatus);

      return {
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  resetUserPassword: async (args) => {
    console.log('Resolver: resetUserPassword...');
    try {
      const verificationChallengeCode = args.verification;
      const preUser = await User.findById({_id: args.userId});
      const verificationResponse = preUser.verification;
      if (verificationResponse.type !== 'passwordReset') {
        console.log('...umm no... reset request doesnt match our records... are you hacking??');
        throw new Error('...umm no... reset request doesnt match our records... are you hacking??')
      }
      if (verificationResponse.code !== verificationChallengeCode) {
        console.log('...there was an error with password reset verification... contact tech support or request a new reset email...');
        throw new Error('...there was an error with password reset verification... contact tech support or request a new reset email...')
      }
      else {
        console.log('...password reset verification success... resetting password...');
      }
      const password = args.userInput.password;
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await User.findOneAndUpdate(
        {_id: args.userId},
        { $set:
          {password: hashedPassword,
            verification: {
              verified: true,
              type: null,
              code: null
          }}
        },
        {new: true, useFindAndModify: false}
      )
      // console.log(user);
      return {
          ...user._doc,
          _id: user.id,
          name: user.name
      };
    } catch (err) {
      throw err;
    }
  },
  getUserByNameRegex: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const regex = new RegExp(args.regex);
      // const regex = "/^" + args.regex + "/";
      const users = await User.find({'name': {$regex: regex, $options: 'i'}});

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByInterests: async (args, req) => {
    console.log("Resolver: getUsersByInterests...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const interests = args.interests;
      const users = await User.find({'interests': {$all: interests}})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByTags: async (args, req) => {
    console.log("Resolver: getUsersByTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const tags = args.tags;
      const users = await User.find({'tags': {$all: tags}})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPerks: async (args, req) => {
    console.log("Resolver: getUsersByPerks...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perkIds = args.perkIds;
      const users = await User.find({'perks._id': {$all: perkIds}})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPromos: async (args, req) => {
    console.log("Resolver: getUsersByPromos...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const promoIds = args.promoIds;
      const users = await User.find({'promos._id': {$all: promoIds}})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByFriends: async (args, req) => {
    console.log("Resolver: getUsersByFriends...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const friends = args.friendIds;
      const users = await User.find({'friends._id': friends})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getUsersByPointRange: async (args, req) => {
    console.log("Resolver: getUsersByPointRange...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const upper = args.upperLimit;
      const lower = args.lowerLimit;
      const users = await User.find({points: {$gte: lower, $lte: upper}})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return users.map(user => {
        return transformUser(user);
      });
    } catch (err) {
      throw err;
    }
  },
  getThisUser: async (args, req) => {
    console.log("Resolver: getThisUser...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.activityId})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  getUserBookedSessionsToday: async (args, req) => {
    console.log("Resolver: getUserBookedSessionsToday...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

  const today = new Date().toLocaleDateString().slice(0,10);
  // const today = '2020-04-24';
  const today2 = new Date(today);
  // console.log(today,today2);
  const user = await User.findById({_id: args.activityId});
  // console.log(today,today2, user._id);
  const sessions = await Lesson.aggregate([
    {$unwind: '$sessions'},
    {$unwind: '$sessions.booked'},
    {$group: {_id:{
      userId: '$sessions.booked',
      lessonId: '$_id',
      lessonTitle: '$title',
      lessonInstructors: '$instructors',
      date:'$sessions.date',
      endDate:'$sessions.endDate',
      title:'$sessions.title',
      time:'$sessions.time',
      limit:'$sessions.limit',
      full:'$sessions.full',
      amount:'$sessions.amount',
      inProgress:'$sessions.inProgress',
      url:'$sessions.url',
      bookedAmount: '$sessions.bookedAmount',
      booked: '$sessions.booked',
      attendedAmount: '$sessions.attendedAmount',
      attended: '$sessions.attended',
    }}},
    {$match: {
      '_id.date': {$eq: today2 },
      '_id.userId': {$eq: user._id },
      '_id.booked': {$ne: [] }
    }}
  ]);
  const sessions2 = sessions.map(x => x._id);
  // console.log(sessions2);
  const sessions3 = sessions2.map(x => ({
    title: x.title,
    date: x.date,
    endDate: x.endDate,
    time: x.time,
    limit: x.limit,
    amount: x.amount,
    bookedAmount: x.bookedAmount,
    attendedAmount: x.attendedAmount,
    inProgress: x.inProgress,
    full: x.full,
    url: x.url,
    lessonId: x.lessonId,
    lessonTitle: x.lessonTitle,
    lessonInstructors: x.lessonInstructors,
    userId: x.userId
  }))

      return sessions3;
    } catch (err) {
      throw err;
    }
  },
  updateUserBasic: async (args, req) => {
    console.log("Resolver: updateUserBasic...");
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
          phone: args.userInput.contactPhone,
          phone2: args.userInput.contactPhone2
        },
        bio: args.userInput.bio
        },{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

        return {
          ...user._doc,
          _id: user.id,
          name: user.name,
          role: user.role,
          username: user.username,
          dob: user.dob,
          bio: user.bio,
        };
    } catch (err) {
      throw err;
    }
  },
  updateUserByField: async (args, req) => {
    console.log("Resolver: updateUserField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const user = await User.findOneAndUpdate({_id:args.userId},query,{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  addUserPoints: async (args, req) => {
    console.log("Resolver: addUserPoints...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin") {
        throw new Error("How'd you find this!? Silly User. Tokens are for Admin");
      }
      const prevAmountUser = await User.findById({_id: args.userId});
      const prevAmount = prevAmountUser.points;
      const amountToAdd = args.userInput.points;
      let newAmount = prevAmount + amountToAdd;
      const user = await User.findOneAndUpdate({_id:args.userId},{ points: newAmount },{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserAddress: async (args, req) => {
    console.log("Resolver: addUserAddress...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const address = {
        type: args.userInput.addressType,
        number: args.userInput.addressNumber,
        street: args.userInput.addressStreet,
        town: args.userInput.addressTown,
        city: args.userInput.addressCity,
        country: args.userInput.addressCountry,
        postalCode: args.userInput.addressPostalCode,
        primary: false
      };

      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: {addresses: address}},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserAddress: async (args, req) => {
    console.log("Resolver: deleteUserAddress...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
        throw new Error("Yaah.. No! Only the owner or Admin can delete a User Address");
      };
        const address = {
          type: args.userInput.addressType,
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
          primary: args.userInput.addressPrimary
        };
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { 'addresses': address }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  setUserAddressPrimary: async (args, req) => {
    console.log("Resolver: setUserAddressPrimary...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const activityUser = await User.findById({_id: args.activityId});
      // if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
      //   throw new Error("Yaah.. No! Only the owner or Admin can delete a User Address");
      // };
      const nerfLikeAddresses = await User.findOneAndUpdate(
        // {_id: args.userId},
        {_id: args.userId, 'addresses.type':args.userInput.addressType},
        // {'addresses.primary': true},
        // {'addresses.$.primary': true},
        // {$set: {'addresses.primary': true}},
        // {$set: {'addresses.$.primary': true}},
        // {$set: {'addresses.$[].primary': false}},
        {$set: {'addresses.$[elem].primary': false}},
        {
          arrayFilters: [ { "elem.type": args.userInput.addressType } ],
          new: true,
          useFindAndModify: false
        })
        // {new: true, useFindAndModify: false})
        // const preUser = await User.findById({_id: args.userId})
        // console.log("beep",nerfLikeAddresses.addresses);

      const address = {
        type: args.userInput.addressType,
        number: args.userInput.addressNumber,
        street: args.userInput.addressStreet,
        town: args.userInput.addressTown,
        city: args.userInput.addressCity,
        country: args.userInput.addressCountry,
        postalCode: args.userInput.addressPostalCode,
        primary: args.userInput.addressPrimary,
      };
      const address2 = {
        type: args.userInput.addressType,
        number: args.userInput.addressNumber,
        street: args.userInput.addressStreet,
        town: args.userInput.addressTown,
        city: args.userInput.addressCity,
        country: args.userInput.addressCountry,
        postalCode: args.userInput.addressPostalCode,
        primary: true,
      };
      const user = await User.findOneAndUpdate(
        {_id:args.userId,
          'addresses.number': address.number,
          'addresses.street': address.street,
          'addresses.town': address.town,
          'addresses.city': address.city,
          'addresses.country': address.country,
          'addresses.postalCode': address.postalCode,
        },
        {'addresses.$.primary': true},
        // {$set:{'addresses.$': address2}},
        {new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserProfileImage: async (args, req) => {
    console.log("Resolver: addUserProfileImage...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preUser = await User.findById({_id:args.userId});
      const profileImage = {
        name:args.userInput.profileImageName,
        type:args.userInput.profileImageType,
        path:args.userInput.profileImagePath,
        public:args.userInput.profileImagePublic,
      };
      const preUserImages = preUser.profileImages.map(x => x.name);
      const imageExists = preUserImages.includes(profileImage.name);
      // console.log('preUserImages',preUserImages,'imageExists',imageExists);
      if (imageExists === true ) {
        console.log('...um no! an image with that name exists already...');
        throw new Error('...um no! an image with that name exists already...');
      }

      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: {profileImages: profileImage}},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserProfileImage: async (args, req) => {
    console.log("Resolver: deleteUserProfileImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
        throw new Error("Yaah.. No! Only the owner or Admin can delete a User ProfileImage");
      };
      const profileImage = {
        name:args.userInput.profileImageName,
        type:args.userInput.profileImageType,
        path:args.userInput.profileImagePath,
        public:args.userInput.profileImagePublic,
      };

      const filePath = 'users/'+activityUser.username+'/profileImages/';
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_A,
        secretAccessKey: process.env.S3_B,
      });

      const params = {
          Bucket: 'mycouchcoachstorage',
          Key: filePath+args.userInput.profileImageName
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          // console.log('error:',error);
        }
        // console.log("File has been deleted successfully...data",data);
      });


        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { 'profileImages': profileImage }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');


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
  toggleUserProfileImagePublic: async (args, req) => {
    console.log("Resolver: toggleUserProfileImagePublic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const profileImage = {
        name:args.userInput.profileImageName,
        type:args.userInput.profileImageType,
        path:args.userInput.profileImagePath,
        public:args.userInput.profileImagePublic,
      };
      let newPublic = null;
      if (profileImage.public === true || profileImage.public === null || profileImage.public === undefined ) {
        newPublic = false;
      }
      if (profileImage.public === false) {
        newPublic = true;
      }
      const user = await User.findOneAndUpdate(
        {_id:args.userId, 'profileImages.name': profileImage.name},
        {'profileImages.$.public': newPublic},
        {new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserSocialMedia: async (args, req) => {
    console.log("Resolver: addUserSocialMedia...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const socialMedia = {
        platform:args.userInput.socialMediaPlatform,
        handle:args.userInput.socialMediaHandle,
        link:args.userInput.socialMediaLink,
      };

      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: {socialMedia: socialMedia}},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserSocialMedia: async (args, req) => {
    console.log("Resolver: deleteUserSocialMedia...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
        throw new Error("Yaah.. No! Only the owner or Admin can delete a User SocialMedia");
      };
        const socialMedia = {
          platform:args.userInput.socialMediaPlatform,
          handle:args.userInput.socialMediaHandle,
          link:args.userInput.socialMediaLink,
        };
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { 'socialMedia': socialMedia }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserPaymentInfo: async (args, req) => {
    console.log("Resolver: addUserPaymentInfo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const paymentInfo = {
        date: args.userInput.paymentInfoDate,
        type: args.userInput.paymentInfoType,
        description: args.userInput.paymentInfoDescription,
        body: args.userInput.paymentInfoBody,
        valid: args.userInput.paymentInfoValid,
        primary: args.userInput.paymentInfoPrimary,
      };

      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: {paymentInfo: paymentInfo}},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  editUserPaymentInfo: async (args, req) => {
    console.log("Resolver: editUserPaymentInfo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const paymentInfoOriginal = {
        date: args.userInput.paymentInfoDate,
        type: args.userInput.paymentInfoType,
        description: args.userInput.paymentInfoDescription,
        body: args.userInput.paymentInfoBody,
        valid: args.userInput.paymentInfoValid,
        primary: args.userInput.paymentInfoPrimary,
      };
      const paymentInfoField = 'paymentInfo.$.'+args.field+'';
      const user = await User.findOneAndUpdate(
      {_id:args.userId, 'paymentInfo.date': paymentInfoOriginal.date, 'paymentInfo.body': paymentInfoOriginal.body},
      {$set: {[paymentInfoField]: args.query}}
      ,{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserPaymentInfo: async (args, req) => {
    console.log("Resolver: deleteUserPaymentInfo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
        throw new Error("Yaah.. No! Only the owner or Admin can delete a User PaymentInfo");
      };
        const paymentInfo = {
          date: args.userInput.paymentInfoDate,
          type: args.userInput.paymentInfoType,
          description: args.userInput.paymentInfoDescription,
          body: args.userInput.paymentInfoBody,
          valid: args.userInput.paymentInfoValid,
          primary: args.userInput.paymentInfoPrimary,
        };
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { 'paymentInfo': paymentInfo }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  setUserPaymentInfoPrimary: async (args, req) => {
    console.log("Resolver: setUserPaymentInfoPrimary...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // const activityUser = await User.findById({_id: args.activityId});
      // if (activityUser.role !== "Admin" && args.activityId !== args.userId) {
      //   throw new Error("Yaah.. No! Only the owner or Admin can delete a User Address");
      // };
      const nerfAllPaymentInfo = await User.findOneAndUpdate(
        {_id: args.userId},
        {'paymentInfo.$[].primary': false},
        {new: true, useFindAndModify: false})
      // console.log('nerfAllPaymentInfo.paymentInfo',nerfAllPaymentInfo.paymentInfo);

      const paymentInfo = {
        date: new Date().toLocaleDateString().substr(0,10),
        type: args.userInput.paymentInfoType,
        description: args.userInput.paymentInfoDescription,
        body: args.userInput.paymentInfoBody,
        valid: args.userInput.paymentInfoValid,
        primary: true
      };
      // console.log('paymentInfo',paymentInfo);

      // const x = await User.find(
      //   {_id:args.userId,
      //     'paymentInfo.type': paymentInfo.type,
      //     'paymentInfo.description': paymentInfo.description,
      //     'paymentInfo.body': paymentInfo.body,
      //     'paymentInfo.valid': paymentInfo.valid,
      //   }
      // );
      // console.log('x.paymentInfo',x[0].paymentInfo);
      const y = await User.findOneAndUpdate(
        {_id:args.userId,
          'paymentInfo.type': paymentInfo.type,
          'paymentInfo.description': paymentInfo.description,
          'paymentInfo.body': paymentInfo.body,
        },
        {'paymentInfo.$.primary': true},
        // {$set:{'paymentInfo.$.primary': true}},
        // {$set:{'paymentInfo.$.type': 'faust'}},
        {new: true, useFindAndModify: false})
        // console.log('y.paymentInfo',y.paymentInfo);

      const user = await User.findOneAndUpdate(
        {_id:args.userId,
        'paymentInfo.type': paymentInfo.type,
        'paymentInfo.description': paymentInfo.description,
        'paymentInfo.body': paymentInfo.body,
      },
      {'paymentInfo.$.primary': true},
        {new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserTags: async (args, req) => {
    console.log("Resolver: addUserTag...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const tags = args.userInput.tags;
      const splitTags = tags.split(",");
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { tags: {$each: splitTags} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserTag: async (args, req) => {
    console.log("Resolver: deleteUserTag...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const tag = args.userInput.tag;
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { tags: tag }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserInterests: async (args, req) => {
    console.log("Resolver: addUserInterests...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const interests = args.userInput.interests;
      const splitInterests = interests.split(",");
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { interests: {$each: splitInterests} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserInterest: async (args, req) => {
    console.log("Resolver: deleteUserInterest...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const interest = args.userInput.interest;
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { interests: interest }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserPerk: async (args, req) => {
    console.log("Resolver: addUserPerk...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const perk = await Perk.findById({_id: args.perkId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { perks: perk }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserPerk: async (args, req) => {
    console.log("Resolver: deleteUserPerk...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const perk = await Perk.findById({_id: args.perkId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { perks: perk }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserPromo: async (args, req) => {
    console.log("Resolver: addUserPromo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const promo = await Promo.findById({_id: args.promoId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { promos: promo }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserPromo: async (args, req) => {
    console.log("Resolver: deleteUserPromo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const promo = await Promo.findById({_id: args.promoId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { promos: promo }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserFriend: async (args, req) => {
    console.log("Resolver: addUserFriend...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const friend = await User.findById({_id: args.friendId});
      const user = await User.findOneAndUpdate({_id: args.userId},{
        $addToSet: { friends: friend },
        $pull: {friendRequests: {sender: args.friendId, receiver: args.userId }}
      },
        {new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

      // console.log(user.friends);
      // const user2 = await User.findOneAndUpdate({_id: args.userId},{
      //   $pull: {friendRequests: {sender: friend._id}}
      // },
      //   {new: true, useFindAndModify: false})
      //   console.log(friend._id,user2.friendRequests);
      const updateFriend = await User.findOneAndUpdate({_id: args.friendId},{
        $addToSet: {friends: user},
        $pull: {friendRequests: {sender: args.friendId, receiver: args.userId }}
      },
      {new: true, useFindAndModify: false});

      // const updateFriend2 = await User.findOneAndUpdate({_id: args.friendId},{
      //   $pull: {friendRequests: {receiver: userId, sender: friendId}}
      // },
      // {new: true, useFindAndModify: false});
      // console.log(`
      //   user.friends: ${user.friends}
      //   user.friendRequests: ${user2.friendRequests}
      //   friend.friends: ${updateFriend.friends}
      //   friendFriendRequests: ${updateFriend2.FriendRequests}
      //   `);

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
  deleteUserFriend: async (args, req) => {
    console.log("Resolver: deleteUserFriend...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const preUser = await User.findById({_id: args.userId});
        const friend = await User.findById({_id: args.friendId});
        console.log(preUser.friends);
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { friends: friend._id }},{new: true, useFindAndModify: false});
        const updateFriend = await User.findOneAndUpdate({_id: args.friendId},{$pull: {friends: user._id}},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  sendFriendRequest: async (args, req) => {
    console.log("Resolver: sendFriendRequest...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const now = new Date().toLocaleDateString().substr(0,10);
      const invitee = await User.findById({_id: args.receiverId});
      const sender = await User.findById({_id: args.senderId});
      const friendRequest = {
        date: now,
        sender: sender,
        receiver: invitee
      };

      const user = await User.findOneAndUpdate({_id:args.senderId},{$addToSet: { friendRequests: friendRequest }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      const updateInvitee = await User.findOneAndUpdate({_id: args.receiverId},{$addToSet: {friendRequests: friendRequest}},{new: true, useFindAndModify: false});

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
  deleteFriendRequest: async (args, req) => {
    console.log("Resolver: deleteFriendRequest...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      // let user = null;
      // const preSender = await User.findById({_id: args.senderId});
      // const preReceiver = await User.findById({_id: args.senderId});
      // const friendRequest = {
      //   sender: preSender,
      //   user: preReceiver
      // };

      const sender = await User.findOneAndUpdate(
        {_id:args.senderId },
        {$pull: {friendRequests: {sender: args.senderId, receiver: args.receiverId}}},
        {new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

      const receiver = await User.findOneAndUpdate(
        {_id:args.receiverId },
        {$pull: {friendRequests: {sender: args.senderId, receiver: args.receiverId}}},
        {new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

        return {
          ...sender._doc,
          _id: sender.id,
          email: sender.contact.email ,
          name: sender.name,
        };
    } catch (err) {
      throw err;
    }
  },
  addUserActivity: async (args, req) => {
    console.log("Resolver: addUserActivity...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      const request = args.userInput.activityRequest;
      const activity = {
        date: date,
        request: request,
      };

      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: {activity: activity}},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

      return {
        ...user._doc,
        _id: user.id,
        name: user.name,
        username: user.username,
      };
    } catch (err) {
      throw err;
    }
  },
  deleteUserActivity: async (args, req) => {
    console.log("Resolver: deleteUserActivity...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      if (activityUser.role !== "Admin") {
        throw new Error("Yaah.. No! Only Admin can delete a User Activity");
      };
        const activity = {
          date: args.userInput.activityDate,
          request: args.userInput.activityRequest,
        };
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { activity: activity }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserLikedLesson: async (args, req) => {
    console.log("Resolver: addUserLikedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: args.lessonId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { likedLessons: lesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserLikedLesson: async (args, req) => {
    console.log("Resolver: deleteUserLikedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const lesson = await Lesson.findById({_id: args.lessonId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { likedLessons: lesson._id }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserBookedLesson: async (args, req) => {
    console.log("Resolver: addUserBookedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      // const time = date.toLocaleDateString().substr(11,5);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const bookedLesson = {
        date: date,
        session: {
          title: args.sessionTitle,
          date: args.sessionDate,
        },
        ref: lesson
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { bookedLessons: bookedLesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserBookedLesson: async (args, req) => {
    console.log("Resolver: deleteUserBookedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const date = args.date;
        // const iSOString = new Date().toLocaleDateString().substr(0,10);
        const lesson = await Lesson.findById({_id: args.lessonId});
        // console.log("args.date",date,"toLocaleDateString",iSOString,"x",preUser.bookedLessons[0].date.toLocaleDateString().substr(0,10));
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { bookedLessons: {date: date, ref: lesson} }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserAttendedLesson: async (args, req) => {
    console.log("Resolver: addUserAttendedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      // const time = date.toLocaleDateString().substr(11,5);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const attendedLesson = {
        date: date,
        ref: lesson
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { attendedLessons: attendedLesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserAttendedLesson: async (args, req) => {
    console.log("Resolver: deleteUserAttendedLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = args.date;
      // const iSOString = new Date().toLocaleDateString().substr(0,10);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { attendedLessons: {date: date, ref: lesson} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('toTeachLessons')
      .populate('likedLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserTaughtLesson: async (args, req) => {
    console.log("Resolver: addUserTaughtLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      // const time = date.toLocaleDateString().substr(11,5);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const taughtLesson = {
        date: date,
        ref: lesson
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { taughtLessons: taughtLesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserTaughtLesson: async (args, req) => {
    console.log("Resolver: deleteUserTaughtLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = args.date;
      // const iSOString = new Date().toLocaleDateString().substr(0,10);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { taughtLessons: {date: date, ref: lesson} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserToTeachLesson: async (args, req) => {
    console.log("Resolver: addUserToTeachLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: args.lessonId})
      const user = await User.findOneAndUpdate(
        {_id: args.userId},
        {$addToSet: {toTeachLessons: lesson}},
        {new: true, useFindAndModify: false}
      )
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserToTeachLesson: async (args, req) => {
    console.log("Resolver: deleteUserToTeachLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: args.lessonId})
      const user = await User.findOneAndUpdate(
        {_id: args.userId},
        {$pull: {toTeachLessons: lesson}},
        {new: true, useFindAndModify: false}
      )
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserCartLesson: async (args, req) => {
    console.log("Resolver: addUserCartLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toISOString().substr(0,10);
      // const time = date.toLocaleDateString().substr(11,5);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const cartLesson = {
        dateAdded: date,
        sessionDate: args.sessionDate,
        sessionTitle: args.sessionTitle,
        lesson: lesson
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { cart: cartLesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserCartLesson: async (args, req) => {
    console.log("Resolver: deleteUserCartLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const dateAdded = args.dateAdded;
      // let sessionDate = args.sessionDate;

      let sessionDate = new Date (args.sessionDate.substr(0,10)*1000).toISOString().slice(0,10);

      const lesson = await Lesson.findById({_id: args.lessonId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { cart: {sessionDate: sessionDate, sessionTitle: args.sessionTitle, lesson: lesson} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserWishlistLesson: async (args, req) => {
    console.log("Resolver: addUserWishlistLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const date = new Date().toLocaleDateString().substr(0,10);
      // const time = date.toLocaleDateString().substr(11,5);
      const lesson = await Lesson.findById({_id: args.lessonId});
      const wishlistLesson = {
        date: date,
        ref: lesson,
        booked: false
      };
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { wishlist: wishlistLesson }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  // const preUser = await User.find({'bookedLessons.ref': lesson});
  // if (preUser) {
  //   throw new Error('User has lready booked this lesson');
  // }
  deleteUserWishlistLesson: async (args, req) => {
    console.log("Resolver: deleteUserWishlistLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findById({_id: args.lessonId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { wishlist: {ref: lesson} }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  addUserComment: async (args, req) => {
    console.log("Resolver: addUserComment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const comment = await Comment.findById({_id: args.commentId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { comments: comment }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserComment: async (args, req) => {
    console.log("Resolver: deleteUserComment...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const comment = await Comment.findById({_id: args.commentId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { comments: comment }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserOrder: async (args, req) => {
    console.log("Resolver: addUserOrder...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const order = await Order.findById({_id: args.orderId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { orders: order }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserOrder: async (args, req) => {
    console.log("Resolver: deleteUserOrder...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

        const order = await Order.findById({_id: args.orderId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { orders: order._id }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
          path: 'orders',
          populate: {
            path: 'buyer',
            model: 'User'
          }})
        .populate({
          path: 'orders',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
          path: 'orders',
          populate: {
            path: 'lessons.ref',
            model: 'Lesson'
          }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserReview: async (args, req) => {
    console.log("Resolver: addUserReview...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const review = await Review.findById({_id: args.reviewId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { reviews: review }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');

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
  deleteUserReview: async (args, req) => {
    console.log("Resolver: deleteUserReview...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const review = await Review.findById({_id: args.reviewId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { reviews: review._id }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  addUserMessage: async (args, req) => {
    console.log("Resolver: addUserMessage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const review = await Message.findById({_id: args.messageId});
      const user = await User.findOneAndUpdate({_id:args.userId},{$addToSet: { messages: message }},{new: true, useFindAndModify: false})
      .populate('perks')
      .populate('promos')
      .populate('friends')
      .populate('likedLessons')
      .populate('toTeachLessons')
      .populate('bookedLessons.ref')
      .populate('attendedLessons.ref')
      .populate('taughtLessons.ref')
      .populate('wishlist.ref')
      .populate('cart.lesson')
      .populate({
        path:'reviews',
        populate: {
          path: 'author',
          model: 'User'
        }
      })
      .populate({
        path:'reviews',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate({
        path: 'messages',
        populate: {
          path: 'sender',
          model: 'User'
        }})
      .populate({
        path: 'messages',
        populate: {
          path: 'receiver',
          model: 'User'
        }})
      .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
      .populate({
        path: 'notifications',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'notifications',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('friendRequests.sender')
      .populate('cancellations.lesson')
      .populate('friendRequests.receiver');


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
  deleteUserMessage: async (args, req) => {
    console.log("Resolver: deleteUserMessage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const message = await Message.findById({_id: args.messageId});
        const user = await User.findOneAndUpdate({_id:args.userId},{$pull: { messages: message._id }},{new: true, useFindAndModify: false})
        .populate('perks')
        .populate('promos')
        .populate('friends')
        .populate('likedLessons')
        .populate('toTeachLessons')
        .populate('bookedLessons.ref')
        .populate('attendedLessons.ref')
        .populate('taughtLessons.ref')
        .populate('wishlist.ref')
        .populate('cart.lesson')
        .populate({
          path:'reviews',
          populate: {
            path: 'author',
            model: 'User'
          }
        })
        .populate({
          path:'reviews',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate({
          path: 'messages',
          populate: {
            path: 'sender',
            model: 'User'
          }})
        .populate({
          path: 'messages',
          populate: {
            path: 'receiver',
            model: 'User'
          }})
        .populate({
  path: 'orders',
  populate: {
    path: 'buyer',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'receiver',
    model: 'User'
  }})
.populate({
  path: 'orders',
  populate: {
    path: 'lessons.ref',
    model: 'Lesson'
  }})
        .populate({
          path: 'notifications',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'notifications',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('friendRequests.sender')
        .populate('cancellations.lesson')
        .populate('friendRequests.receiver');

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
  deleteUserById: async (args, req) => {
    console.log("Resolver: deleteUser...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findByIdAndRemove(args.userId);
        return {
          ...user._doc,
          _id: user.id,
          name: user.name,
          username: user.username
        };
    } catch (err) {
      throw err;
    }
  },
  verifyUser: async (args, req) => {
    console.log("Resolver: verifyUser...");
    // if (!req.isAuth) {
    //   throw new Error('Unauthenticated!');
    // }
    try {
      // const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const challenge = {
        type: args.userInput.verificationType,
        code: args.userInput.verificationCode,
      }
      const preUser = await User.findOne({'contact.email': args.userInput.contactEmail});
      // console.log('hashedPassword',hashedPassword,'preUser',preUser,);
      const response = {
        type: preUser.verification.type,
        code: preUser.verification.code,
      };
      console.log('challenge', challenge, 'response',response, 'match',challenge.type === response.type && challenge.code === response.code);
      if (challenge.type !== response.type && challenge.code !== response.code) {
        throw new Error('challenge and response do not match. Check the type and code sent in the verification email and try again');
      }
      if (challenge.type === response.type && challenge.code === response.code) {
        console.log("success");;
      }

      const user = await User.findOneAndUpdate({_id: preUser._id},{
        verification: {
          verified: true,
          type: response.type,
          code: null
        }
      },{new: true, useFindAndModify: false});
        return {
          ...user._doc,
          _id: user.id,
          name: user.name,
          username: user.username
        };
    } catch (err) {
      throw err;
    }
  },
  userOnline: async (args, req) => {
    console.log("Resolver: userOnline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findOneAndUpdate({_id:args.userId},{clientConnected: true},{new: true, useFindAndModify: false})

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
  userOffline: async (args, req) => {
    console.log("Resolver: userOffline...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findOneAndUpdate({_id:args.userId},{clientConnected: false},{new: true, useFindAndModify: false})

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
  createUser: async (args, req) => {
    console.log("Resolver: createUser...");

    try {

      const existingUserName = await User.findOne({ username: args.userInput.username});
      if (existingUserName) {
        throw new Error('User w/ that username exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const today = new Date();
      let age = 0;
      let dob = new Date(args.userInput.dob);
      let ageDifMs = Date.now() - dob.getTime();
      let ageDate = new Date(ageDifMs);
      age =  Math.abs(ageDate.getUTCFullYear() - 1970);
      let verfCode = null;
      const user = new User({
        password: hashedPassword,
        name: args.userInput.name,
        role: args.userInput.role,
        username: args.userInput.username,
        dob: args.userInput.dob,
        age: age,
        public: args.userInput.public,
        contact: {
          email: args.userInput.contactEmail,
          phone: args.userInput.contactPhone,
          phone2: args.userInput.contactPhone2
        },
        addresses: [{
          type: args.userInput.addressType,
          number: args.userInput.addressNumber,
          street: args.userInput.addressStreet,
          town: args.userInput.addressTown,
          city: args.userInput.addressCity,
          country: args.userInput.addressCountry,
          postalCode: args.userInput.addressPostalCode,
          primary: true
        }],
        bio: args.userInput.bio,
        profileImages: [],
        socialMedia: [],
        interests: [],
        perks: [],
        promos: [],
        friends: [],
        points: 0,
        tags: [],
        clientConnected: false,
        loggedIn:false,
        verification: {
          verified: false,
          type: "email",
          code: 'VERF001'
        },
        activity: [{
          date: today,
          request: "initial activity... profile created..."
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
        paymentInfo: []
      });

      const result = await user.save();


      let sendStatus = null;

      sgMail.setApiKey(process.env.SENDGRID_A);
      const msg = {
        to: result.contact.email,
        from: 'african.genetic.survival@gmail.com',
        subject: 'Signup Verification',
        text: `
          Thanks for signing up... use this code to verify your account at login...
          ${result.verification.code}...
        `,
        html: `
        <strong>
        Thanks for signing up... use this code to verify your account at login...
        ${result.verification.code}...
        </strong>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          // console.log('Email Sent!');
          sendStatus = 'Email Sent!';
          // console.log('sendStatus',sendStatus);
        })
        .catch(error => {
          // console.error(error.toString());
          const {message, code, response} = error;
          const {headers, body} = response;
          sendStatus = error.toString()+response;
          // console.log('sendStatus',sendStatus);
        });
        console.log('verification: ',sendStatus);

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
          phone: result.contact.phone,
          phone2: result.contact.phone2
        },
        addresses: [{
          type: result.addresses[0].type,
          number: result.addresses[0].number,
          street: result.addresses[0].street,
          town: result.addresses[0].town,
          city: result.addresses[0].city,
          country: result.addresses[0].country,
          postalCode: result.addresses[0].postalCode
        }],
        bio: result.bio
      };
    } catch (err) {
      throw err;
    }
  }
};
