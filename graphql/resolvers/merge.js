const DataLoader = require('dataloader');
const User = require('../../models/user');
const Lesson = require('../../models/lesson');
const Order = require('../../models/order');
const Review = require('../../models/review');
const Perk = require('../../models/perk');
const Promo = require('../../models/promo');
const Comment = require('../../models/comment');
const Message = require('../../models/message');
const { dateToString } = require('../../helpers/date');

const userLoader = new DataLoader(userIds => {
  return users(userIds);
});
const lessonLoader = new DataLoader(lessonIds => {
  return lessons(lessonIds);
});
const orderLoader = new DataLoader(orderIds => {
  return orders(orderIds);
});
const reviewLoader = new DataLoader(reviewIds => {
  return reviews(reviewIds);
});
const perkLoader = new DataLoader(perkIds => {
  return perks(perkIds);
});
const promoLoader = new DataLoader(promoIds => {
  return promos(promoIds);
});
const commentLoader = new DataLoader(commentIds => {
  return comments(commentIds);
});
const messageLoader = new DataLoader(messageIds => {
  return messages(messageIds);
});


const users = async userIds => {
  try {
    const users = await User.find({ _id: { $in: userIds } });
    users.sort((a, b) => {
      return (
        userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
      );
    });
    return users.map(user => {
      return transformUser(user);
    });
  } catch (err) {
    throw err;
  }
};
const lessons = async lessonIds => {
  try {
    const lessons = await Lesson.find({ _id: { $in: lessonIds } });
    lessons.sort((a, b) => {
      return (
        lessonIds.indexOf(a._id.toString()) - lessonIds.indexOf(b._id.toString())
      );
    });
    return lessons.map(lesson => {
      return transformLesson(lesson);
    });
  } catch (err) {
    throw err;
  }
};
const orders = async orderIds => {
  try {
    const orders = await Order.find({ _id: { $in: orderIds } });
    orders.sort((a, b) => {
      return (
        orderIds.indexOf(a._id.toString()) - orderIds.indexOf(b._id.toString())
      );
    });
    return orders.map(order => {
      return transformOrder(order);
    });
  } catch (err) {
    throw err;
  }
};
const reviews = async reviewIds => {
  try {
    const reviews = await Review.find({ _id: { $in: reviewIds } });
    reviews.sort((a, b) => {
      return (
        reviewIds.indexOf(a._id.toString()) - reviewIds.indexOf(b._id.toString())
      );
    });
    return reviews.map(review => {
      return transformReview(review);
    });
  } catch (err) {
    throw err;
  }
};
const perks = async reviewIds => {
  try {
    const perks = await Perk.find({ _id: { $in: perkIds } });
    perks.sort((a, b) => {
      return (
        perkIds.indexOf(a._id.toString()) - perkIds.indexOf(b._id.toString())
      );
    });
    return perks.map(perk => {
      return transformPerk(perk);
    });
  } catch (err) {
    throw err;
  }
};
const promos = async reviewIds => {
  try {
    const promos = await Promo.find({ _id: { $in: promoIds } });
    promos.sort((a, b) => {
      return (
        promoIds.indexOf(a._id.toString()) - promoIds.indexOf(b._id.toString())
      );
    });
    return promos.map(promo => {
      return transformPromo(promo);
    });
  } catch (err) {
    throw err;
  }
};
const comments = async commentIds => {
  try {
    const comments = await Comment.find({ _id: { $in: commentIds } });
    comments.sort((a, b) => {
      return (
        commentIds.indexOf(a._id.toString()) - commentIds.indexOf(b._id.toString())
      );
    });
    return comments.map(comment => {
      return transformComment(comment);
    });
  } catch (err) {
    throw err;
  }
};
const messages = async messageIds => {
  try {
    const messages = await Message.find({ _id: { $in: messageIds } });
    messages.sort((a, b) => {
      return (
        messageIds.indexOf(a._id.toString()) - messageIds.indexOf(b._id.toString())
      );
    });
    return messages.map(message => {
      return transformMessage(message);
    });
  } catch (err) {
    throw err;
  }
};


const singleUser = async userId => {
  try {
    const user = await userLoader.load(userId.toString());
    return user;
  } catch (err) {
    throw err;
  }
};
const singleLesson = async lessonId => {
  try {
    const lesson = await lessonLoader.load(lessonId.toString());
    return lesson;
  } catch (err) {
    throw err;
  }
};
const singleOrder = async orderId => {
  try {
    const order = await orderLoader.load(orderId.toString());
    return order;
  } catch (err) {
    throw err;
  }
};
const singleReview = async reviewId => {
  try {
    const review = await reviewLoader.load(reviewId.toString());
    return review;
  } catch (err) {
    throw err;
  }
};
const singlePerk = async perkId => {
  try {
    const perk = await perkLoader.load(perkId.toString());
    return perk;
  } catch (err) {
    throw err;
  }
};
const singlePromo = async promoId => {
  try {
    const promo = await promoLoader.load(promoId.toString());
    return promo;
  } catch (err) {
    throw err;
  }
};
const singleComment = async commentId => {
  try {
    const comment = await commentLoader.load(commentId.toString());
    return comment;
  } catch (err) {
    throw err;
  }
};
const singleMessage = async messageId => {
  try {
    const message = await messageLoader.load(messageId.toString());
    return message;
  } catch (err) {
    throw err;
  }
};


const transformUser = user => {
  return {
    ...user._doc,
    _id: user.id,
    name: user.name,
    email: user.email,
  };
};
const transformLesson = lesson => {
  return {
    ...lesson._doc,
    _id: lesson.id,
    title: lesson.title,
    type: lesson.type,
  };
};
const transformOrder = order => {
  return {
    ...order._doc,
    _id: order.id,
    date: order.date,
    type: order.type,
  };
};
const transformReview = review => {
  return {
    ...review._doc,
    _id: review.id,
    date: review.date,
    type: review.type,
  };
};
const transformComment = review => {
  return {
    ...review._doc,
    _id: review.id,
    date: review.date,
    time: review.time,
  };
};
const transformMessage = message => {
  return {
    ...message._doc,
    _id: message.id,
    date: message.date,
    time: message.time,
  };
};
const transformPerk = perk => {
  return {
    ...perk._doc,
    _id: perk.id,
    date: perk.date,
    name: perk.name,
  };
};
const transformPromo = promo => {
  return {
    ...promo._doc,
    _id: promo.id,
    type: promo.type,
    name: promo.name,
  };
};


exports.transformUser = transformUser;
exports.transformProduct = transformProduct;
exports.transformOrder = transformOrder;
exports.transformReview = transformReview;
exports.transformComment = transformComment;
exports.transformMessage = transformMessage;
exports.transformPerk = transformPerk;
exports.transformPromo = transformPromo;
