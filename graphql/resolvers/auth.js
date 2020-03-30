const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { pocketVariables } = require('../../helpers/pocketVars');

module.exports = {
  login: async ({ email, password }) => {

    const user = await User.findOne({ 'contact.email': email });
    if (!user) {
      throw new Error('User does not exist!');

    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign({ userId: user.id },'CoronaWorkLife',{expiresIn: '5h'});

    const userLoggedIn = await User.findOneAndUpdate({_id: user.id},{loggedIn: true},{new: true, useFindAndModify: false})
    // pocketVariables.token = token;
    // pocketVariables.userId = user.id;

    return { activityId: user.id, role: "User", token: token, tokenExpiration: 4 };
  },
  logout: async ({ args }) => {

    const userLogout = await User.findOneAndUpdate({ _id: args.userId },{loggedIn: false},{new: true, useFindAndModify: false});

    return {
      ...userLogout._doc,
      _id: userLogout.id,
      email: userLogout.contact.email ,
      name: userLogout.name,
    };
  }
};
