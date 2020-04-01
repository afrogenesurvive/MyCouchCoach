const authResolver = require('./auth');
const userResolver = require('./user');
// const commentResolver = require('./comment');
// const reviewResolver = require('./review');
// const messageResolver = require('./message');
const lessonResolver = require('./lesson');
// const orderResolver = require('./order');
// const perkResolver = require('./perk');
// const promoResolver = require('./promo');

const rootResolver = {
  ...authResolver,
  ...userResolver,
  // ...commentResolver,
  // ...reviewResolver,
  // ...messageResolver,
  ...lessonResolver,
  // ...orderResolver,
  // ...perkResolver,
  // ...promoResolver,
};

module.exports = rootResolver;
