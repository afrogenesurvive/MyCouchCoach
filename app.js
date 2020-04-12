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
const server = require('http').Server(app);
const io = require('socket.io')(server);
const User = require('./models/user');

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
mongoose.connect("mongodb+srv://profBlack:FoiH8muN5lZAWdNT@cluster0-knrho.mongodb.net/test?retryWrites=true&w=majority",
// mongoose.connect('mongodb://localhost:27017/my_couch_coach',
{useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log(`
      DB connected... Now Serving Port: 8088
      `);
    app.listen(8088);
  })
  .catch(err => {
    console.log(err);
});

const userOffline = async function (args) {
  console.log("Socket.io: userOffline...",args);
  try {
    const user = await User.findOneAndUpdate({_id:args},{clientConnected: false},{new: true, useFindAndModify: false})
      return ;
  } catch (err) {
    throw err;
  }
};
const userOnline = async function (args) {
  console.log("Socket.io: userOnline...",args);
  try {
    const user = await User.findOneAndUpdate({_id:args},{clientConnected: true},{new: true, useFindAndModify: false})
      return ;
  } catch (err) {
    throw err;
  }
};

let connectedClients = [];
io.on('connection', (socket) => {

    socket.on('unauthorizedClientConnect', function(data) {
      console.log("a wild client appeared...socket..",socket.id);
      // connectedClients.push({socket: socket.id, user: 'wild'});
      // console.log('connectedClients',connectedClients);
    });
    socket.on('msg_subscribe', function(data) {
        console.log('a domestic client appeared...socket...'+socket.id+'...user...'+data.user);
        console.log('joining room', data.room);
        socket.join(data.room);
        connectedClients.push({socket: socket.id, user: data.user})
        console.log('connectedClients',connectedClients);
        userOnline(data.user);
    });
    socket.on('send message', function(data) {
      console.log('sending room post', data.room);
      socket.broadcast.to(data.room).emit('conversation private post', {
          message: data.message
      });
      socket.emit("MESSAGE_SENT", {msg: "message sent!!"});
    });
    socket.on('disconnect', function(){
      let clientToRemove = connectedClients.find(x => x.socket === socket.id);
      if (clientToRemove === undefined) {
        console.log('a wild client disappeared', socket.id);
      } else {
        console.log('a domestic client disappeared...',clientToRemove);
        let connectedClientsUpdate = connectedClients.filter(x => x.socket !== socket.id)
        connectedClients = connectedClientsUpdate;
        console.log('connectedClients', connectedClients);
        userOffline(clientToRemove.user);
      }
    })

});

io.on('disconnect', (socket) => {
  console.log("a wild client disappeared..");
});
server.listen(9909, function (err) {
  if (err) throw err
  console.log(`
    socket.io listening on port 9909
    `)
})


app.use(
  express.static(path.join(__dirname, "./frontend/build"))
);
app.get('/*', function(req, res) {
  // res.send("Hello World!");
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
