process.env.NODE_ENV !== 'production' && require("dotenv").config();
const axios = require('axios');
const Bot = require('./lib/Bot');


// const Bot = require('simpler-minecraft-bot');
const tbot = new Bot({ name: 'drownedslayer', host: '135.125.16.188', port: 25575, admin: 'nrohan09' });
// const tbot = new Bot({ name: 'tbot', host: '135.125.16.188', port: 25575, cli: false });
process.on('exit', onend);
// process.on('SIGINT', onend);

function onend(reason) {
    axios.post('https://evve.herokuapp.com/api/notify', { title: 'rbot left', description: reason || 'rbot left the world' }).catch(() => { console.log('failed to notify discord') })
}

// axios.post('https://evve.herokuapp.com/api/notify', { title: 'rbot', description: 'rbot joined the world' }).catch(() => { console.log('failed to notify discord') });