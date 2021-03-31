process.env.NODE_ENV !== 'production' && require("dotenv").config();
const Bot = require('./lib/Bot');

const rbot = Bot('rbot');
// const rbot = Bot('theia_bot',null,'localhost',60506);

