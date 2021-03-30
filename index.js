process.env.NODE_ENV !== 'production' && require("dotenv").config();
const Bot = require('./lib/Bot');

const rbot = Bot('rbot');
