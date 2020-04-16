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

const { transformLesson } = require('./merge');
const { dateToString } = require('../../helpers/date');
const { pocketVariables } = require('../../helpers/pocketVars');


module.exports = {
  getAllLessons: async (args, req) => {

    console.log("Resolver: getAllLessons...");

    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      const lessons = await Lesson.find({})
      .populate('instructors')
      .populate('attendees')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      const lessons = await Lesson.find({'title': {$regex: regex, $options: 'i'}});

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
      const lessons = await Lesson.find({'schedule': {$gte: startDate, $lte: endDate}});

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
      const lessons = await Lesson.find({'instructors._id': {$all: instructors}});

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
      const lessons = await Lesson.find({reviews: review});

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
      const lessons = await Lesson.find({promos: promo});

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
      const lessons = await Lesson.find({category: {$regex: regex, $options: 'i'}});

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
      const lessons = await Lesson.find({'tags': {$all: tags}});

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
      const lessons = await Lesson.find({'requirements': {$all: requirements}});

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
      const lessons = await Lesson.find({'materials': {$all: materials}});

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
      const lessons = await Lesson.find({[field]: args.query});

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
          session: ${x.title}, on: ${x.date.toISOString()}, at: ${x.time},
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
              {$group: {_id:{
                // lessonId: '$_id',
                lessonId: '$_id',
                lessonTitle: '$title',
                date:'$sessions.date',
                title:'$sessions.title',
                time:'$sessions.time',
                limit:'$sessions.limit',
                bookedAmount: '$sessions.bookedAmount',
                booked: '$sessions.booked',
                full: '$sessions.full'
              }}},
              // {$group: {_id:{date:'$sessions.date',title:'$sessions.title'},booked: { $addToSet: '$sessions.booked'}}},
              {$match:
                {
                  // '_id.lessonId': {$ne: args.lessonId},
                  '_id.lessonId': {$eq: preLesson._id},
                  '_id.title': {$eq: args.lessonInput.sessionTitle }
                }}
              // {$match: {'_id.lessonId': args.lessonId, '_id.title': {$eq: args.lessonInput.sessionTitle }}}
            ]);
            const session2 = session[0]._id;
            // console.log(session2);
            return {
              ...session2
            }
        // return lessons.map(lesson => {
        //   return transformLesson(lesson);
        // });
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
        category: args.lessonInput.category,
        sku: args.lessonInput.sku,
        price: args.lessonInput.price,
        points: args.lessonInput.points,
        description: args.lessonInput.description,
        notes: args.lessonInput.notes,
        duration: args.lessonInput.duration,
        },{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('reviews')
        .populate('sessions.booked')
        .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
    console.log("Resolver: addLessonTag...");
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
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: { tags: {$each: splitTags} }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { tags: tag }},{new: true, useFindAndModify: false});

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { requirements: requirement }},{new: true, useFindAndModify: false});

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: { materials: material }},{new: true, useFindAndModify: false});

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
        .populate('reviews')
        .populate('sessions.booked')
        .populate('sessions.attended');

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
      const image = {
        name: args.lessonInput.imageName,
        type: args.lessonInput.imageType,
        path: args.lessonInput.imagePath,
      };
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {gallery: image}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      };
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {gallery: image}},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('reviews')
        .populate('sessions.booked')
        .populate('sessions.attended');

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
      const file = {
        name: args.lessonInput.fileName,
        type: args.lessonInput.fileType,
        size: args.lessonInput.fileSize,
        path: args.lessonInput.filePath,
      };
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {files: file}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      };
        const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {files: file}},{new: true, useFindAndModify: false})
        .populate('instructors')
        .populate('reviews')
        .populate('sessions.booked')
        .populate('sessions.attended');

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
      const session = {
        title: args.lessonInput.sessionTitle,
        date: args.lessonInput.sessionDate,
        time: args.lessonInput.sessionTime,
        limit: args.lessonInput.sessionLimit,
        amount: args.lessonInput.sessionAmount,
        booked: [],
        bookedAmount: 0,
        attended: [],
        attendedAmount: 0,
        inProgress: false,
        full: false,
        url: args.lessonInput.sessionUrl
      };
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$addToSet: {sessions: session}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
        time: args.lessonInput.sessionTime,
      };
      const lesson = await Lesson.findOneAndUpdate({_id: args.lessonId},{$pull: {sessions: {title: session.title, date: session.date }}},{new: true, useFindAndModify: false})
      // const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {
      //   'sessions.title': session.title,
      //   'sessions.date': session.date,
      //   'sessions.time': session.time
      // }},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      if (activityUser.role !== "Admin" && preLesson.instructors[0]._id !== activityUser._id) {
        throw new Error("Yaah.. No! Only the lead Instructor of this Lesson or Admin can delete a User Address");
      };
      const instructor = await User.findById({_id: args.instructorId});
      const lesson = await Lesson.findOneAndUpdate({_id:args.lessonId},{$pull: {instructors: instructor._id}},{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
    console.log("Resolver: deleteLessonOrder...");
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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      const today = new Date().toISOString().substr(0,10);
      const user = await User.findById({_id: args.userId});
      const preLesson = await Lesson.findById({_id: args.lessonId});
      const userBookings = user.bookedLessons.map(x => x.ref);
      console.log(args.lessonId,preLesson._id);
      // console.log(userBookings, userBookings.includes(args.lessonId));
      const session = await Lesson.aggregate([
        {$unwind: '$sessions'},
        {$group: {_id:{
          // lessonId: '$_id',
          lessonId: '$_id',
          lessonTitle: '$title',
          date:'$sessions.date',
          title:'$sessions.title',
          limit:'$sessions.limit',
          bookedAmount: '$sessions.bookedAmount',
          booked: '$sessions.booked',
          full: '$sessions.full'
        }}},
        // {$group: {_id:{date:'$sessions.date',title:'$sessions.title'},booked: { $addToSet: '$sessions.booked'}}},
        {$match:
          {
            // '_id.lessonId': {$ne: args.lessonId},
            '_id.lessonId': {$eq: preLesson._id},
            '_id.title': {$eq: args.lessonInput.sessionTitle }
          }}
        // {$match: {'_id.lessonId': args.lessonId, '_id.title': {$eq: args.lessonInput.sessionTitle }}}
      ]);

      if (session[0]._id.booked.toString().split(',').includes(args.userId) === true) {
        throw new Error('...umm no.. youve already booked this session');
      }
      let sessionFull = session[0]._id.full;
      if (session[0]._id.bookedAmount >= (session[0]._id.limit - 1)) {
        // console.log('...session full...');
        sessionFull = true;
        throw new Error('...sorry this session is full..')
      }
      // if (session[0]._id.bookedAmount < (session[0]._id.limit - 1)) {
      //   console.log('...spaces open...');
      // }
      // console.log(session,session[0]._id.limit,session[0]._id.bookedAmount,sessionFull,session[0]._id.booked,session[0]._id.booked.toString(),session[0]._id.booked.toString().split(','),user._id,args.userId,session[0]._id.booked.includes(user._id),session[0]._id.booked.includes(args.userId),session[0]._id.booked.toString().search(args.userId),session[0]._id.booked.toString().split(',').includes(args.userId),session[0]._id.booked.filter(x => x === user._id));

      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {
          $addToSet: {'sessions.$.booked': user},
          $inc: {'sessions.$.bookedAmount': 1},
          $set: {'sessions.$.full': sessionFull}
        }
        ,{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      const updateInstructors = await User.updateMany({_id: {$in: instructors}},{$addToSet: {bookedLessons: bookingRef}},{new: true, useFindAndModify: false})

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
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
      const today = new Date().toISOString().substr(0,10);
      const user = await User.findById({_id: args.userId});
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$all: [user]} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$nin: user} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: {$ne: user}} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: user} },
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$pull: {'sessions.$.booked': user._id}, $inc: {'sessions.$.bookedAmount': -1}}
        // {$pull: {'sessions': {'sessions.booked': user}}, $inc: {'sessions.$.bookedAmount': -1}}
        ,{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

      const instructors = lesson.instructors.map(x => x._id);
      const updateUser = await User.findOneAndUpdate({_id: args.userId},{$pull: {bookedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
      const updateInstructors = await User.update({_id: {$in: instructors}},{$pull: {bookedLessons: {ref: lesson}}},{new: true, useFindAndModify: false})
        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
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
      const today = new Date().toISOString().substr(0,10);
      const user = await User.findById({_id: args.userId});
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$all: [user]} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$nin: user} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: {$ne: user}} },
      // {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate, 'sessions.booked': {$elemMatch: user} },
      const lesson = await Lesson.findOneAndUpdate(
        {_id:args.lessonId, 'sessions.title': args.lessonInput.sessionTitle, 'sessions.date': args.lessonInput.sessionDate },
        {$addToSet: {'sessions.$.attended': user, attendees: user}, $inc: {'sessions.$.attendedAmount': 1}}
        ,{new: true, useFindAndModify: false})
      .populate('instructors')
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

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
      .populate('reviews')
      .populate('sessions.booked')
      .populate('sessions.attended');

        return {
            ...lesson._doc,
            _id: lesson.id,
            title: lesson.title
        };
    } catch (err) {
      throw err;
    }
  },
  deleteLesson: async (args, req) => {
    console.log("Resolver: deleteLesson...");
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

      const lesson = new Lesson({
        title: args.lessonInput.title,
        subtitle: args.lessonInput.subtitle,
        type: args.lessonInput.type,
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

      return {
        ...result._doc,
        title: result.title,
        subtitle: result.subtitle,
        type: result.type,
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
