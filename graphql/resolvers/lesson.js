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
const moment = require('moment');

const { transformLesson } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');

// const mailjet = require ('node-mailjet')
// .connect(pocketVariables.mailjet.a, pocketVariables.mailjet.b)
const AWS = require('aws-sdk');

module.exports = {
  getAllPublicLessons: async () => {
    console.log('getAllPublicLessons...');
    try {
      const lessons = await Lesson.find({public: true})
      .populate('instructors')
      .populate({
        path: 'reviews',
        populate: {
          path: 'reviews',
          model: 'User'
        }
      });

      return lessons.map(lesson => {
        return transformLesson(lesson,);
      });
    } catch (err) {
      throw err;
    }
  },
  getPublicLessonsByField: async (args) => {
    console.log('getPublicLessonsByField...');
    try {
      // let resolverField = args.field;
      // let resolverQuery = args.query;
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      const lessons = await Lesson.find(query)
      .populate('instructors')
      .populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }});

      lessons2 = lessons.filter(x => x.public === true);
      return lessons2.map(lesson => {
        return transformLesson(lesson,);
      });
    } catch (err) {
      throw err;
    }
  },
  getAllLessons: async (args, req) => {

    console.log("Resolver: getAllLessons...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lessons = await Lesson.find({})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson,);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonById: async (args, req) => {
    console.log("Resolver: getLessonById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const lesson = await Lesson.findById(args.lessonId)
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  getLessonsByField: async (args, req) => {
    console.log("Resolver: getLessonByField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      let fieldType = null;
      let resolverField = args.field;
      let resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const lessons = await Lesson.find(query)
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);

      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByFieldRegex: async (args, req) => {
    console.log("Resolver: getLessonByFieldRegex...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }

    try {
      let fieldType = null;
      let resolverField = args.field;
      const regExpQuery = new RegExp(args.query)
      let resolverQuery = {$regex: regExpQuery, $options: 'i'};
      const query = {[resolverField]:resolverQuery};
      const lessons = await Lesson.find(query)
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);

      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByTitleRegex: async (args, req) => {

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const regex = "/^" + args.regex + "/";
      const lessons = await Lesson.find({'title': {$regex: regex, $options: 'i'}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
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
      const lessons = await Lesson.find({'schedule': {$gte: startDate, $lte: endDate}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
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
      const lessons = await Lesson.find({'instructors._id': {$all: instructors}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonByReview: async (args, req) => {
    console.log("Resolver: getLessonsByReview...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const review = args.reviewId;
      const lessons = await Lesson.find({reviews: review})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return {
          ...lesson._doc,
          _id: lesson.id,
          title: lesson.title
      };
    } catch (err) {
      throw err;
    }
  },
  getLessonsByPromo: async (args, req) => {
    console.log("Resolver: getLessonsByPromo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const promo = args.promoId;
      const lessons = await Lesson.find({promos: promo})
      .populate('instructors')
      .populate('attendees')
      .populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByCategory: async (args, req) => {
    console.log("Resolver: getLessonsByCategory...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const regex = new RegExp(args.regex);
      console.log(regex);
      const lessons = await Lesson.find({category: {$regex: regex, $options: 'i'}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByTags: async (args, req) => {
    console.log("Resolver: getLessonsByTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const tags = args.tags;
      const lessons = await Lesson.find({'tags': {$all: tags}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByRequirements: async (args, req) => {
    console.log("Resolver: getLessonsByRequirements...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const requirements = args.lessonInput.requirements;
      const lessons = await Lesson.find({'requirements': {$all: requirements}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonsByMaterials: async (args, req) => {
    console.log("Resolver: getLessonsByMaterials...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const materials = args.lessonInput.materials;
      const lessons = await Lesson.find({'materials': {$all: materials}})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
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
      const lessons = await Lesson.find({[field]: args.query})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      return lessons.map(lesson => {
        return transformLesson(lesson);
      });
    } catch (err) {
      throw err;
    }
  },
  getLessonReminders: async (args, req) => {
    console.log("Resolver: getLessonReminders...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const sessionDate = new Date(args.sessionDate);
      const sessions = await Lesson.aggregate([
        {$unwind: '$sessions'},
        {$group: {_id:{
          lessonId: '$_id',
          lessonTitle: '$title',
          date:'$sessions.date',
          endDate:'$sessions.endDate',
          title:'$sessions.title',
          time:'$sessions.time',
          limit:'$sessions.limit',
          bookedAmount: '$sessions.bookedAmount',
          booked: '$sessions.booked',
          full: '$sessions.full',
        }}},
        {$match: {
          '_id.date': {$eq: sessionDate },
          '_id.booked': {$ne: []}
        }}
      ]);
      const sessions2 = sessions.map(x => x._id);
      console.log("x day sessions",sessions2);
      const sessionsBooked = sessions.map(x => x._id.booked);
      const sessionsBookedConcat = [].concat.apply([], sessionsBooked);
        // console.log("x day session bookings",sessionsBookedConcat);
      const bookedUsers = await User.find({_id: {$in: sessionsBookedConcat}})
      const bookedUserContacts = bookedUsers.map(user =>
        ({_id: user._id, username: user.username, email: user.contact.email, phone: user.contact.phone})
      )
      // console.log('todays booked session user contacts...',bookedUserContacts);
      const sessionReminders = sessions2.map(x => ({
        message: `
          Don't forget !!! You have a class: ${x.lessonTitle},
          session: ${x.title}, on: ${x.date.toLocaleDateString()}, at: ${x.time},
          wake that ass up!!
        `,
        recipients: x.booked,
      }))
      // console.log('sessionReminders',sessionReminders);
      let arr1 = sessionReminders;
      let arr2 = bookedUserContacts;
      let arr3 = [];
      let arr4 = []
      // console.log(arr2);
        // arr1.forEach(reminder => console.log('beep',reminder.recipients));
        // arr1.forEach(reminder => reminder.recipients.forEach(recipient => console.log({msg: reminder.message, usrid: recipient})));
        arr1.forEach(reminder => reminder.recipients.forEach(recipient => arr3.push({message: reminder.message, user: recipient})));
        // arr1.forEach(reminder => reminder.recipients.forEach(recipient => recipient = 'x',console.log(recipient)));
        // arr3.forEach(reminder => console.log(reminder.message,arr2.find(contact => contact._id.toString() === reminder.user.toString())))
        arr3.forEach(reminder => arr4.push({message: reminder.message, contact: arr2.find(contact => contact._id.toString() === reminder.user.toString())}))
        // arr3.forEach(reminder => console.log(reminder.user,arr2.filter(contact => contact._id === reminder.user)))
        console.log('finally',arr4);


        // Run in loop
        // let sendStatus = null;
        // sgMail.setApiKey(process.env.SENDGRID_A);
        // const msg = {
        //   to: result.contact.email,
        //   from: 'african.genetic.survival@gmail.com',
        //   subject: 'Signup Verification',
        //   text: `
        //     Thanks for signing up... use this code to verify your account at login...
        //     ${result.verification.code}...
        //   `,
        //   html: `
        //   <strong>
        //   Thanks for signing up... use this code to verify your account at login...
        //   ${result.verification.code}...
        //   </strong>`,
        // };
        // sgMail
        //   .send(msg)
        //   .then(() => {
        //     // console.log('Email Sent!');
        //     sendStatus = 'Email Sent!';
        //     // console.log('sendStatus',sendStatus);
        //   })
        //   .catch(error => {
        //     // console.error(error.toString());
        //     const {message, code, response} = error;
        //     const {headers, body} = response;
        //     sendStatus = error.toString()+response;
        //     // console.log('sendStatus',sendStatus);
        //   });


      // return lessons.map(lesson => {
        //   return transformLesson(lesson);
        // });
    } catch (err) {
      throw err;
    }
  },
  getLessonSession: async (args, req) => {
    console.log("Resolver: getLessonSession...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const session = await Lesson.aggregate([
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
                  '_id.lessonId': {$eq: preLesson._id},
                  '_id.title': {$eq: args.lessonInput.sessionTitle }
                }},
              // {$match: {'_id.lessonId': args.lessonId, '_id.title': {$eq: args.lessonInput.sessionTitle }}}
            ]);
            const session2 = session[0]._id;
            // console.log(session2);

            return {
              ...session2
            }
    } catch (err) {
      throw err;
    }
  },
  updateLessonBasic: async (args, req) => {
    console.log("Resolver: updateLessonBasic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{
        title: args.lessonInput.title,
        subtitle: args.lessonInput.subtitle,
        type: args.lessonInput.type,
        subType: args.lessonInput.subType,
        public: args.lessonInput.public,
        category: args.lessonInput.category,
        sku: args.lessonInput.sku,
        price: args.lessonInput.price,
        points: args.lessonInput.points,
        description: args.lessonInput.description,
        notes: args.lessonInput.notes,
        duration: args.lessonInput.duration,
        },{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  updateLessonByField: async (args, req) => {
    console.log("Resolver: updateLessonField...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const instructors = preLesson.instructors;
      let userIsInstructor = instructors.includes(user._id);
      let userIsAdmin = user.role === "Admin";
      if (userIsAdmin === false && userIsInstructor === false) {
        throw new Error('Umm just no! Only instructors of this class and Admin can edit it...')
      }

      const resolverField = args.field;
      const resolverQuery = args.query;
      const query = {[resolverField]:resolverQuery};
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},query,{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonTags: async (args, req) => {
    console.log("Resolver: addLessonTags...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const instructors = preLesson.instructors;
      let userIsInstructor = instructors.includes(user._id);
      let userIsAdmin = user.role === "Admin";
      if (userIsAdmin === false && userIsInstructor === false) {
        throw new Error('Umm just no! Only instructors of this class and Admin can edit it...')
      }

      const tags = args.lessonInput.tags;
      const splitTags = tags.split(",");
      // console.log('splitTags',splitTags);
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: { tags: {$each: splitTags} }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      // console.log(lesson.tags);
        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonTag: async (args, req) => {
    console.log("Resolver: deleteLessonTag...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const tag = args.lessonInput.tag;
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { tags: tag }},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonRequirements: async (args, req) => {
    console.log("Resolver: addLessonRequirements...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const requirements = args.lessonInput.requirements;
      const splitRequirements = requirements.split(",");
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: { requirements: {$each: splitRequirements} }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonRequirement: async (args, req) => {
    console.log("Resolver: deleteLessonRequirement...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const requirement = args.lessonInput.requirement;
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { requirements: requirement }},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonMaterials: async (args, req) => {
    console.log("Resolver: addLessonMaterials...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const materials = args.lessonInput.materials;
      const splitMaterials = materials.split(",");
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: { materials: {$each: splitMaterials} }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonMaterial: async (args, req) => {
    console.log("Resolver: deleteLessonMaterial...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
        const material = args.lessonInput.material;
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { materials: material }},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonScheduleDate: async (args, req) => {
    console.log("Resolver: addLessonScheduleDate...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const scheduleDate = {
        date: args.lessonInput.scheduleDate,
        time: args.lessonInput.scheduleTime,
      };
      const lesson = await Lesson.findOneAndUpdate({_id: args.lessonId},{$addToSet: {schedule: scheduleDate}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonScheduleDate: async (args, req) => {
    console.log("Resolver: deleteLessonScheduleDate...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');

      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };

      const scheduleDate = {
        date: args.lessonInput.scheduleDate,
        time: args.lessonInput.scheduleTime,
      };
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {schedule: scheduleDate}},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  addLessonImage: async (args, req) => {
    console.log("Resolver: addLessonImage...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const image = {
        name: args.lessonInput.imageName,
        type: args.lessonInput.imageType,
        path: args.lessonInput.imagePath,
        public: args.lessonInput.imagePublic,
      };
      const preLessonGallery = preLesson.gallery.map(x => x.name);
      const imageExists = preLessonGallery.includes(image.name);
      // console.log('preLessonGallery',preLessonGallery,'imageExists',imageExists);
      if (imageExists === true ) {
        console.log('...um no! an image with that name exists already...');
        throw new Error('...um no! an image with that name exists already...');
      }

      const lesson = await Lesson.findOneAndUpdate({_id: args.lessonId},{$addToSet: {gallery: image}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonImage: async (args, req) => {
    console.log("Resolver: deleteLessonImage...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const image = {
        name: args.lessonInput.imageName,
        type: args.lessonInput.imageType,
        path: args.lessonInput.imagePath,
        public: args.lessonInput.imagePublic,
      };

      const filePath = 'lessons/'+preLesson.title+'/gallery/';
      // console.log('delete key',filePath+args.userInput.profileImageName);
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_A,
        secretAccessKey: process.env.S3_B,
      });

      const params = {
          Bucket: 'mycouchcoachstorage',
          Key: filePath+image.name
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          console.log('error:',error);
        }
        console.log("File has been deleted successfully...data",data);
      });

        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {gallery: image}},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  toggleLessonImagePublic: async (args, req) => {
    console.log("Resolver: toggleLessonImagePublic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };

      const image = {
        name: args.lessonInput.imageName,
        type: args.lessonInput.imageType,
        path: args.lessonInput.imagePath,
        public: args.lessonInput.imagePublic,
      };

      let newPublic = null;
      if (image.public === true || image.public === null || image.public === undefined ) {
        newPublic = false;
      }
      if (image.public === false) {
        newPublic = true;
      }

      // const x = await Lesson.findOne({_id:args.lessonId, 'gallery.path': image.path})
      // const x = await Lesson.findOne({_id:args.lessonId, 'gallery.name': image.name, 'gallery.path': image.path})
      // console.log('lessonId',args.lessonId,'image.name',image.name,'image.path',image.path,'x',x.gallery,'newPublic',newPublic);
      console.log('x',newPublic);

        const lesson = await Lesson.findOneAndUpdate(
          {_id:args.lessonId, 'gallery.name': image.name},
          {'gallery.$.public': newPublic},
          {new: true, useFindAndModify: false}
        )
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');


          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  addLessonFile: async (args, req) => {
    console.log("Resolver: addLessonFile...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const file = {
        name: args.lessonInput.fileName,
        type: args.lessonInput.fileType,
        size: args.lessonInput.fileSize,
        path: args.lessonInput.filePath,
        public: args.lessonInput.filePublic,
      };
      const preLessonFiles = preLesson.files.map(x => x.name);
      const fileExists = preLessonFiles.includes(file.name);
      // console.log('preLessonFiles',preLessonFiles,'fileExists',fileExists);
      if (fileExists === true ) {
        console.log('...um no! a file with that name exists already...');
        throw new Error('...um no! a file with that name exists already...');
      }
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {files: file}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonFile: async (args, req) => {
    console.log("Resolver: deleteLessonFile...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const file = {
        name: args.lessonInput.fileName,
        type: args.lessonInput.fileType,
        size: args.lessonInput.fileSize,
        path: args.lessonInput.filePath,
        public: args.lessonInput.filePublic,
      };

      const filePath = 'lessons/'+preLesson.title+'/files/';
      // console.log('delete key',filePath+args.userInput.profileImageName);
      const s3 = new AWS.S3({
        accessKeyId: process.env.S3_A,
        secretAccessKey: process.env.S3_B,
      });

      const params = {
          Bucket: 'mycouchcoachstorage',
          Key: filePath+file.name
      };

      s3.deleteObject(params, (error, data) => {
        if (error) {
          console.log('error:',error);
        }
        console.log("File has been deleted successfully...data",data);
      });

        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {files: file}},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  toggleLessonFilePublic: async (args, req) => {
    console.log("Resolver: toggleLessonFilePublic...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete this");
      };

      const file = {
        name: args.lessonInput.fileName,
        type: args.lessonInput.fileType,
        size: args.lessonInput.fileSize,
        path: args.lessonInput.filePath,
        public: args.lessonInput.filePublic,
      };
      let newPublic = null;
      if (file.public === true || file.public === null || file.public === undefined ) {
        newPublic = false;
      }
      if (file.public === false) {
        newPublic = true;
      }
        const lesson = await Lesson.findOneAndUpdate(
          {_id:args.lessonId, 'files.name': file.name},
          {'files.$.public': newPublic},
          {new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

          return {
              ...lesson._doc,
              _id: lesson.id,
              title: lesson.title
          };
    } catch (err) {
      throw err;
    }
  },
  addLessonSession: async (args, req) => {
    console.log("Resolver: addLessonSession...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      let endDate = null;
      const preLesson = await Lesson.findById({_id: args.lessonId});

      // console.log(preLesson.type,preLesson.subType,'type lesson',preLesson.sessions.length);
      let userIsInstructor = preLesson.instructors.includes(args.activityId);
      if (userIsInstructor === false) {
        console.log('...check your privilage... only instructors for this lesson can create its sessions...');
        throw new Error('...check your privilage... only instructors for this lesson can create its sessions...')
      }

      if (preLesson.type === 'OneTime') {
        // console.log('onetime...');
        if(preLesson.sessions.length >= 1) {
          // console.log('onetime,oneday cant add...');
          console.log('...this is a one-time lesson. there already is and can only be 1 session...');
          throw new Error('...this is a one-time lesson. there already is and can only be 1 session...');
        }
        if (preLesson.sessions.length === 0) {
          // console.log('onetime,oneday can add...');
          if (preLesson.subType === 'OneDay') {
            endDate = args.lessonInput.sessionDate;
            // console.log('onetime,oneday enddate...',endDate);
          }
          if (preLesson.subType === 'MultiDay') {
            endDate = args.lessonInput.sessionEndDate;
            // console.log('onetime,multiday enddate...',endDate);
          }
        }
      }
      if (preLesson.type === 'Recurring') {
        // console.log('recurring...');
        if (preLesson.subType === 'OneDay') {
          endDate = args.lessonInput.sessionDate;
          // console.log('recurring,oneday enddate...',endDate);
        }
        if (preLesson.subType === 'MultiDay') {
          endDate = args.lessonInput.sessionEndDate;
          // console.log('recurring,multiday enddate...',endDate);
        }
      }
      // console.log('endDate',endDate);

      const preLessonSessions = preLesson.sessions;
      const existingSessionTitles = preLessonSessions.map(x => x.title);
      const sessionTitleExists = existingSessionTitles.filter(x => x === args.lessonInput.sessionTitle).length > 0;
      if (sessionTitleExists === true ) {
        throw Error('...sessionTitleExists for this lesson ...please choose a different one')
      }
      const session = {
        title: args.lessonInput.sessionTitle,
        date: args.lessonInput.sessionDate,
        endDate: endDate,
        time: args.lessonInput.sessionTime,
        limit: args.lessonInput.sessionLimit,
        amount: args.lessonInput.sessionAmount,
        booked: [],
        bookedAmount: 0,
        attended: [],
        attendedAmount: 0,
        inProgress: false,
        full: false,
        url: args.lessonInput.sessionUrl,
      };
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId},
        {$addToSet: {sessions: session, schedule: {date: session.date , time: session.time}}},
        {new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonSession: async (args, req) => {
    console.log("Resolver: deleteLessonSession...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const session = {
        title: args.lessonInput.sessionTitle,
        date: args.lessonInput.sessionDate,
        endDate: args.lessonInput.sessionEndDate,
        time: args.lessonInput.sessionTime,
      };
      const lesson = await Lesson.findOneAndUpdate(
        {_id: args.lessonId},
        {
          $pull: {
            sessions: {title: session.title },
            // sessions: {title: session.title, date: session.date },
            schedule: {date: session.date}
          }},{new: true, useFindAndModify: false})
      // const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {
      //   'sessions.title': session.title,
      //   'sessions.date': session.date,
      //   'sessions.time': session.time
      // }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonInstructor: async (args, req) => {
    console.log("Resolver: addLessonInstructor...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const user = await User.findById({_id: args.instructorId});
      let userIsInstructor = user.role === "Instructor";
      if (userIsInstructor === false) {
        throw new Error('Users cant be Instructors...Only Instructors can..')
      }

      const instructor = await User.findById({_id: args.instructorId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {instructors: instructor}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      const updateInstructor = await User.findOneAndUpdate(
        {_id: instructor._id},
        {$addToSet:
          {toTeachLessons: lesson}},
        {new: true, useFindAndModify: false}
      )

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonInstructor: async (args, req) => {
    console.log("Resolver: deleteLessonInstructor...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      // if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
      //   throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      // };
      const instructor = await User.findById({_id: args.instructorId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {instructors: instructor._id}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

      const updateInstructor = await User.findOneAndUpdate(
        {_id: instructor._id},
        {$pull:
          {toTeachLessons: lesson}},
        {new: true, useFindAndModify: false}
      )

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonOrder: async (args, req) => {
    console.log("Resolver: addLessonOrder...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const order = await Order.findById({_id: args.orderId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {orders: order}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonOrder: async (args, req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const order = await Order.findById({_id: args.orderId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {orders: order}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonPromo: async (args, req) => {
    console.log("Resolver: addLessonPromo...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const promo = await Promo.findById({_id: args.promoId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {promos: promo}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonPromo: async (args, req) => {
    console.log("Resolver: deleteLessonPromo...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const promo = await Promo.findById({_id: args.promoId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {promos: promo}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonReview: async (args, req) => {
    console.log("Resolver: addLessonReview...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const review = await Review.findById({_id: args.reviewId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {promos: promo}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonReview: async (args, req) => {
    console.log("Resolver: deleteLessonReview...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const activityUser = await User.findById({_id: args.activityId});
      const preLesson = await Lesson.findById({_id: args.lessonId}).populate('instructors');
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const review = await Review.findById({_id: args.reviewId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {reviews: review}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonBooking: async (args, req) => {
    console.log("Resolver: addLessonBooking...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = new Date().toLocaleDateString().substr(0,10);
      const time = new Date().toLocaleDateString().substr(11,5);
      const user = await User.findById({_id: args.userId});
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const userBookings = user.bookedLessons.map(x => x.ref);
      // console.log(args.lessonId,preLesson._id);
      // console.log(userBookings, userBookings.includes(args.lessonId));
      const session = await Lesson.aggregate([
        {$unwind: '$sessions'},
        {$group: {_id:{
          // lessonId: '$_id',
          lessonId: '$_id',
          lessonTitle: '$title',
          date:'$sessions.date',
          endDate:'$sessions.endDate',
          title:'$sessions.title',
          limit:'$sessions.limit',
          bookedAmount: '$sessions.bookedAmount',
          booked: '$sessions.booked',
          full: '$sessions.full'
        }}},
        {$match:
          {
            // '_id.lessonId': {$ne: args.lessonId},
            '_id.lessonId': {$eq: preLesson._id},
            '_id.title': {$eq: args.lessonInput.sessionTitle }
          }
        }
      ]);

      // console.log(session);

      if (session[0]._id.booked.toString().split(',').includes(args.userId) === true) {
        throw new Error('...umm no.. youve already booked this session');
      }
      let sessionFull = session[0]._id.full;
      if (session[0]._id.bookedAmount >= (session[0]._id.limit - 1)) {
        // console.log('...session full...');
        sessionFull = true;
        throw new Error('...sorry this session is full..')
      }
      if (session[0]._id.bookedAmount < (session[0]._id.limit - 1)) {
        console.log('...spaces open...');
      }
      // console.log(session,session[0]._id.limit,session[0]._id.bookedAmount,sessionFull,session[0]._id.booked,session[0]._id.booked.toString(),session[0]._id.booked.toString().split(','),user._id,args.userId,session[0]._id.booked.includes(user._id),session[0]._id.booked.includes(args.userId),session[0]._id.booked.toString().search(args.userId),session[0]._id.booked.toString().split(',').includes(args.userId),session[0]._id.booked.filter(x => x === user._id));
      // console.log(args.lessonInput.sessionDate);



      const lesson = await Lesson.findOneAndUpdate(
        // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle },
        {
          $addToSet: {'sessions.$.booked': user},
          $inc: {'sessions.$.bookedAmount': 1,'sessions.$.amount': 1},
          $set: {'sessions.$.full': sessionFull}
        }
        ,{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
        path: 'reviews',
        populate: {
            path: 'author',
            model: 'User'
        }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

      //   const seshDate = new Date(args.lessonInput.sessionDate).toISOString();
      // const lessonx = await Lesson.find(
      //   {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle}
      // )
      // console.log('args.lessonInput.sessionTitle',args.lessonInput.sessionTitle,'args.lessonInput.sessionDate',args.lessonInput.sessionDate, 'seshDate', seshDate);
      // console.log('lessonx',lessonx.sessions);
      // console.log('lesson',lesson);

      const instructors = lesson.instructors.map(x => x._id);
      const bookingRef = {
        date: today,
        session: {
          title: args.lessonInput.sessionTitle,
          date: args.lessonInput.sessionDate,
          time: args.lessonInput.sessionTime,
        },
        ref: lesson
      };
      const updateStudentBookedLessons = await User.findOneAndUpdate({_id: args.userId},{$addToSet: {bookedLessons: bookingRef}},{new: true, useFindAndModify: false})
      const updateStudentWishlist = await User.findOneAndUpdate(
        {_id: args.userId, 'wishlist.ref': lesson._id},
        {$set: {'wishlist.$.booked': true}},
        {new: true, useFindAndModify: false})
      const updateInstructors = await User.updateMany({_id: {$in: instructors}},{$addToSet: {toTeachLessons: lesson}},{new: true, useFindAndModify: false})


      const updateNotifications = await Notification.updateMany(
        {
          lesson: lesson,
          'session.title': args.lessonInput.sessionTitle,
          'session.date': args.lessonInput.sessionDate
        },
        {$addToSet: {recipients: user}},
        {new: true, useFindAndModify: false}
      )
      // .map(x => x._id);
      const updateNotifications2 = await Notification.find(
        {
          lesson: lesson,
          'session.title': args.lessonInput.sessionTitle,
          'session.date': args.lessonInput.sessionDate
        }
      )
      // console.log('updateNotifications',updateNotifications,test);

      const updatUserNotification = await User.findOneAndUpdate(
        {_id: user._id},
        {$addToSet: {notifications: {$each: updateNotifications2}}},
        {new: true, useFindAndModify: false}
      )
      console.log('updatUserNotification',updatUserNotification.notifications);
      const lesson2 = await Lesson.findById({_id: lesson._id})
      .populate('instructors')
      .populate('attendees')
      .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');

        return {
            ...lesson2._doc,
            _id: lesson2.id,
            title: lesson2.title
        };
    } catch (err) {
      throw err;
    }
  },
  addMultipleBookings: async (args, req) => {
    console.log("Resolver: addMultipleBookings...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const today = new Date().toLocaleDateString().substr(0,10);
      let bookedLessons = [];

      const user = await User.findById({_id: args.activityId});
      // console.log(user.cart);
      let bookingArray = user.cart.map(x => ({
        userId: user._id,
        lessonId: x.lesson,
        sessionDate: x.sessionDate,
        sessionTitle: x.sessionTitle
      }))
      // console.log(bookingArray);

      console.log('start');
      for (let index = 0; index < bookingArray.length; index++) {
        let booking = bookingArray[index];
        console.log('loop',index);
        const user = await User.findById({_id: booking.userId});
        const preLesson = await Lesson.findById({_id: booking.lessonId});
        const userBookings = user.bookedLessons.map(x => x.ref);
        let session = await Lesson.aggregate([
          {$unwind: '$sessions'},
          {$group: {_id:{
            lessonId: '$_id',
            lessonTitle: '$title',
            date:'$sessions.date',
            endDate:'$sessions.endDate',
            time: '$sessions.time',
            title:'$sessions.title',
            limit:'$sessions.limit',
            bookedAmount: '$sessions.bookedAmount',
            booked: '$sessions.booked',
            full: '$sessions.full'
          }}},
          {$match:
            {
              '_id.lessonId': {$eq: preLesson._id},
              '_id.title': {$eq: booking.sessionTitle },
              // '_id.date': {$eq: new Date(booking.sessionDate.substr(0,10)*1000).toISOString() },
            }}
        ]);
        console.log(index, 'booking',booking, 'session[0]._id',session[0]._id);

          if (session[0]._id.booked.toString().split(',').includes(booking.userId.toString()) === true) {
          // throw new Error('...umm no.. youve already booked this session');
          console.log('...umm no.. youve already booked this session');
          continue
        }
        let sessionFull = session[0]._id.full;
        if (session[0]._id.bookedAmount >= (session[0]._id.limit - 1)) {
          // console.log('...session full...');
          sessionFull = true;
          // throw new Error('...sorry this session is full..')
          console.log('...sorry this session is full..')
          continue
        }
        if (session[0]._id.bookedAmount < (session[0]._id.limit - 1)) {
          console.log('...spaces open...');
        }


        const lesson = await Lesson.findOneAndUpdate(
          {_id: session[0]._id.lessonId, 'sessions.title': session[0]._id.title, 'sessions.date': session[0]._id.date },
          {
            $addToSet: {'sessions.$.booked': user},
            $inc: {'sessions.$.bookedAmount': 1,'sessions.$.amount': 1},
            $set: {'sessions.$.full': sessionFull}
          }
          ,{new: true, useFindAndModify: false});
        // .populate('instructors')
        // .populate({
  // path: 'reviews',
  // populate: {
  //     path: 'author',
  //     model: 'User'
  // }})
        // .populate('sessions.booked')
        // .populate('sessions.attended');
        // console.log(lesson.sessions);
        bookedLessons.push(lesson);

        const instructors = lesson.instructors.map(x => x._id);
        const bookingRef = {
          date: today,
          session: {
            title: session[0]._id.title,
            date: session[0]._id.date,
            time: session[0]._id.time,
          },
          ref: lesson
        };
        const updateStudentBookedLessons = await User.findOneAndUpdate({_id: booking.userId},{$addToSet: {bookedLessons: bookingRef}},{new: true, useFindAndModify: false})
        const updateStudentWishlist = await User.findOneAndUpdate(
          {_id: booking.userId, 'wishlist.ref': booking.lessonId},
          {$set: {'wishlist.$.booked': true}},
          {new: true, useFindAndModify: false})
          .populate('perks')
          .populate('promos')
          .populate('friends')
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
            path: 'reminders',
            populate: {
              path: 'creator',
              model: 'User'
            }
          })
          .populate({
            path: 'reminders',
            populate: {
              path: 'recipients',
              model: 'User'
            }
          })
          .populate({
            path: 'reminders',
            populate: {
              path: 'lesson',
              model: 'Lesson'
            }
          })
          .populate('friendRequests.sender')
          .populate('cancellations.lesson')
          .populate('friendRequests.receiver');

        const updateInstructors = await User.updateMany({_id: {$in: instructors}},{$addToSet: {bookedLessons: bookingRef}},{new: true, useFindAndModify: false})

        const hasNotifican = await Notification.find(
            {
              lesson: lesson,
              'session.title': session[0]._id.title
            }
        )
        // console.log('hasNotifican',hasNotifican);
        if (hasNotifican.length === 0) {
          console.log('...there are no notifications for this session...');
          continue
        }

        const updateNotifications = await Notification.updateMany(
          {
            lesson: lesson,
            'session.2title': session[0]._id.title
          },
          {$addToSet: {recipients: user}},
          {new: true, useFindAndModify: false}
        )

        const updatUserNotification = await User.findOneAndUpdate(
          {_id: user._id},
          {$addToSet: {notifications: {$each: updateNotifications}}},
          {new: true, useFindAndModify: false}
        )
        console.log('updatUserNotification',updatUserNotification.notifications);

      }
      console.log('end');

      console.log('bookedLessons',bookedLessons);
      if (bookedLessons.length === 0) {
        console.log('...all of your requested sessions are either full or youve already booked them...');
        throw new Error('...all of your requested sessions are either full or youve already booked them...')
      }

      const user2 = await User.findOneAndUpdate(
        {_id: user._id},
        {cart: []},
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

      // if (bookedLessons.length === 0) {
      //   console.log('...all of your requested sessions are either full or youve already booked them...');
      //   throw new Error('...all of your requested sessions are either full or youve already booked them...')
      // }
      // console.log('bookedLessons',bookedLessons);

      return {
          ...user2._doc,
          _id: user2.id,
          name: user2.name
      };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonBooking: async (args, req) => {
    console.log("Resolver: deleteLessonBooking...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = new Date().toLocaleDateString().substr(0,10);
      const user = await User.findById({_id: args.userId});
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$all: [user]} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$nin: user} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: {$ne: user}} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: user} },
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle },
        // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$pull: {'sessions.$.booked': user._id}, $inc: {'sessions.$.bookedAmount': -1,'sessions.$.amount': -1}}
        // {$pull: {'sessions': {'sessions.booked': user}}, $inc: {'sessions.$.bookedAmount': -1}}
        ,{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

      const instructors = lesson.instructors.map(x => x._id);
      const updateUser = await User.findOneAndUpdate({_id: args.userId},{$pull: {bookedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
      const lessonCancellation = {
        date: today,
        reason: args.lessonInput.cancellationReason,
        sessionDate: args.lessonInput.sessionDate,
        sessionTitle: args.lessonInput.sessionTitle,
        user: user
      };
      const userCancellation = {
        date: today,
        reason: args.lessonInput.cancellationReason,
        sessionDate: args.lessonInput.sessionDate,
        sessionTitle: args.lessonInput.sessionTitle,
        lesson: lesson
      };
      const addCancellationLesson = await Lesson.findOneAndUpdate(
        {_id: lesson._id},
        {$addToSet: {cancellations: lessonCancellation}},
        {new: true, useFindAndModify: false}
      )
      const addCancellationUser = await User.findOneAndUpdate(
        {_id: user._id},
        {$addToSet: {cancellations: userCancellation}},
        {new: true, useFindAndModify: false}
      )

      // const test = await Notification.find(
      //   {
      //     lesson: lesson,
      //     'session.title': args.lessonInput.sessionTitle,
      //     'session.date': args.lessonInput.sessionDate
      //   }
      // )
      // console.log('test',test,test.reci);
      const updateNotifications = await Notification.updateMany(
        {
          lesson: lesson,
          'session.title': args.lessonInput.sessionTitle,
          'session.date': args.lessonInput.sessionDate
        },
        {$pull: {recipients: user._id}},
        {new: true, useFindAndModify: false}
      )
      // .map(x => x._id);
      const updateNotifications2 = await Notification.find(
        {
          lesson: lesson,
          'session.title': args.lessonInput.sessionTitle,
          'session.date': args.lessonInput.sessionDate
        }
      )
      .map(x => x._id);
      const updatUserNotification = await User.findOneAndUpdate(
        {_id: user._id},
        {$pull: {notifications: updateNotifications2}},
        {new: true, useFindAndModify: false}
      )

      const lessonx = await Lesson.findById({_id: lesson._id})
      .populate('instructors')
      .populate('attendees')
      .populate({
      path: 'reviews',
      populate: {
          path: 'author',
          model: 'User'
      }})
      .populate('sessions.booked')
      .populate('sessions.attended')
      .populate({
        path: 'reminders',
        populate: {
          path: 'creator',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'recipients',
          model: 'User'
        }
      })
      .populate({
        path: 'reminders',
        populate: {
          path: 'lesson',
          model: 'Lesson'
        }
      })
      .populate('cancellations.user');
      // console.log('updatUserNotification',updatUserNotification.notifications);
      // console.log('updateNotifications',updateNotifications,test);

      // const updateInstructors = await User.update({_id: {$in: instructors}},{$pull: {bookedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
        return {
            ...lessonx._doc,
            _id: lessonx.id,
            title: lessonx.title
        };
    } catch (err) {
      throw err;
    }
  },
  addLessonAttendance: async (args, req) => {
    console.log("Resolver: addLessonAttendance...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = new Date().toLocaleDateString().substr(0,10);
      const user = await User.findById({_id: args.userId});
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$all: [user]} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$nin: user} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: {$ne: user}} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: user} },
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle},
        // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$addToSet: {'sessions.$.attended': user, attendees: user}, $inc: {'sessions.$.attendedAmount': 1}}
        ,{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
          path: 'reviews',
          populate: {
              path: 'author',
              model: 'User'
          }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

      const instructors = lesson.instructors.map(x => x._id);
      const attendanceRef = {
        date: today,
        ref: lesson
      };
      const updateUser = await User.findOneAndUpdate({_id: args.userId},{$addToSet: {attendedLessons: attendanceRef}},{new: true, useFindAndModify: false})
      const updateInstructors = await User.update({_id: {$in: instructors}},{$addToSet: {taughtLessons: attendanceRef}},{new: true, useFindAndModify: false})
        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonAttendance: async (args, req) => {
    console.log("Resolver: deleteLessonAttendance...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const today = new Date();
      const user = await User.findById({_id: args.userId});
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$all: [user]} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$nin: user} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: {$ne: user}} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: user} },
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$pull: {'sessions.$.attended': user._id}, $inc: {'sessions.$.attendedAmount': -1}}
        // {$pull: {'sessions': {'sessions.attended': user}}, $inc: {'sessions.$.attendedAmount': -1}}
        ,{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

      const instructors = lesson.instructors.map(x => x._id);
      const updateUser = await User.findOneAndUpdate({_id: args.userId},{$pull: {attendedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
      const updateInstructors = await User.update({_id: {$in: instructors}},{$pull: {attendedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  updateSessionUrl: async (args, req) => {
    console.log("Resolver: updateSessionUrl...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$set: {'sessions.$.url': args.lessonInput.sessionUrl}},
        {new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  updateSessionField: async (args, req) => {
    console.log("Resolver: updateSessionField...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const field = 'sessions.$.'+args.lessonInput.sessionField+'';
      // console.log(field);
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$set: {[field]: args.lessonInput.sessionQuery}},
        // {'sessions.$.url': args.lessonInput.sessionQuery},
        {new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('attendees')
        .populate({
  path: 'reviews',
  populate: {
      path: 'author',
      model: 'User'
  }})
        .populate('sessions.booked')
        .populate('sessions.attended')
        .populate({
          path: 'reminders',
          populate: {
            path: 'creator',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'recipients',
            model: 'User'
          }
        })
        .populate({
          path: 'reminders',
          populate: {
            path: 'lesson',
            model: 'Lesson'
          }
        })
        .populate('cancellations.user');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonCancellation: async (args, req) => {
    console.log("Resolver: deleteLessonCancellation...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const cancellation = {
        reason: args.lessonInput.cancellationReason,
        sessionTitle: args.lessonInput.sessionTitle,
      };
      // const user = await User.findOneAndUpdate(
      //   {
      //     _id: args.activityId,
      //     'cancellations.reason': cancellation.reason,
      //     'cancellations.sessionTitle': cancellation.sessionTitle
      //   },
      //   {$pull:
      //     {cancellations:
      //       {
      //         reason: cancellation.reason,
      //         sessionTitle:cancellation.sessionTitle
      //       }}},
      //   {new: true, useFindAndModify: false}
      // );
      const user2 = await User.findOne(
        {
          _id: args.activityId,
          'cancellations.reason': args.lessonInput.cancellationReason
        });
      console.log('user',user2);


      // const lesson = await Lesson.findOneAndUpdate(
      //   {
      //     _id: args.activityId,
      //     'cancellations.reason': cancellation.reason,
      //     'cancellations.sessionTitle': cancellation.sessionTitle,
      //     user: user
      //   },
      //   {$pull:
      //     {cancellations:
      //       {
      //         reason: cancellation.reason,
      //         sessionTitle:cancellation.sessionTitle,
      //         user: user
      //       }}},
      //   {new: true, useFindAndModify: false})
      //
      // return {
      //     ...lesson._doc,
      //     _id: lesson.id,
      //     title: lesson.title
      // };
    } catch (err) {
      throw err;
    }
  },
  deleteLessonById: async (args, req) => {
    console.log("Resolver: deleteLessonById...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lesson = await Lesson.findByIdAndRemove(args.lessonId);
      return {
          ...lesson._doc,
          _id: lesson.id,
          title: lesson.title
      };
    } catch (err) {
      throw err;
    }
  },
  createLesson: async (args, req) => {
    console.log("Resolver: createLesson...");
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {

      const existingLessonTitle = await Lesson.findOne({ title: args.lessonInput.title});
      if (existingLessonTitle) {
        throw new Error('Lesson w/ that title exists already.');
      }

      const creator = await User.findById({_id: args.creatorId});
      if (creator.role !== "Instructor" && creator.role !== "Admin") {
        console.log('...check your privilage! creating lessons is for Instructors and Admin only...');
        throw new Error('...check your privilage! creating lessons is for Instructors and Admin only...')
      }

      const lesson = new Lesson({
        title: args.lessonInput.title,
        subtitle: args.lessonInput.subtitle,
        type: args.lessonInput.type,
        subType: args.lessonInput.subType,
        public: args.lessonInput.public,
        category: args.lessonInput.category,
        sku: args.lessonInput.sku,
        price: args.lessonInput.price,
        points: args.lessonInput.points,
        description: args.lessonInput.description,
        notes: args.lessonInput.notes,
        duration: args.lessonInput.duration,
        schedule: [],
        // schedule: [{
        //   date: args.lessonInput.scheduleDate,
        //   time: args.lessonInput.scheduleTime,
        // }],
        instructors: [creator]
      });

      const result = await lesson.save();

      const updateCreator = await User.findOneAndUpdate(
        {_id: creator._id},
        {$addToSet: {toTeachLessons: lesson}},
        {new: true, useFindAndModify: false}
      )

      return {
        ...result._doc,
        title: result.title,
        subtitle: result.subtitle,
        type: result.type,
        subType: result.subType,
        public: result.public,
        category: result.category,
        price: result.price,
        points: result.points,
        description: result.description,
        notes: result.notes,
        duration: result.duration,
        schedule: result.schedule,
        instructors: result.instructors
      };
    } catch (err) {
      throw err;
    }
  }
};
