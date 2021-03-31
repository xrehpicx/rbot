process.env.NODE_ENV !== 'production' && require("dotenv").config();
const Bot = require('./lib/Bot');

// const rbot = Bot('rbot');
const rbot = Bot('theia_bot',null,'192.168.29.172',61638);

