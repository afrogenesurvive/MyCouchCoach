const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const { pocketVariables } = require('./helpers/pocketVars');

const mongoose = require('mongoose');
const mongodb = require('mongodb');
const isAuth = require('./middleware/is-auth');
const path = require('path');

const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

mongoose.connect('mongodb://localhost:27017/my_couch_coach',{useNewUrlParser: true, useUnifiedTopology: true})// mongoose.connect("mongodb+srv://"+creds.atlas.user+":"+creds.atlas.pw+"@cluster0-5iwfn.mongodb.net/"+creds.atlas.db+"?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log(`
      DB connected... Now Serving Port: 7077
      `);
    app.listen(7077);
  })
  .catch(err => {
    console.log(err);
});

const User = require('./models/user');
function showUserOnline = (room) {
  try {
    const userOnline = await User.findOneAndUpdate({_id: room},{clientConnected: true},{new: true, useFindAndModify: false})
    if (userOnline.clientConnected === true) {
      console.log("success...others should be able to see that you're online");
    }
    return {
      userOnline
    });
  } catch (err) {
    throw err;
  }
}

io.on('connection', (socket) => {
    console.log("a wild client appered..", socket.id);

    socket.on('msg_subscribe', function(room) {
      console.log('joining room', room);
  console.log("bringing user.."+room+"..online..");
  showUserOnline(room);
      socket.join(room);
    });
    socket.on('send message', function(data) {
      console.log('sending room post', data.room);
      socket.broadcast.to(data.room).emit('conversation private post', {
          message: data.message
      });
      socket.emit("MESSAGE_SENT", {msg: "message sent!!"});
    });

});

server.listen(7770, function (err) {
  if (err) throw err
  console.log(`
    socket.io listening on port 7770
    `)
})

//
// app.use(
//   express.static(path.join(__dirname, "./frontend/build"))
// );
// app.get('/*', function(req, res) {
//   res.send("Hello World!");
//   res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
// });
