const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const pvp = require('mineflayer-pvp').plugin
const Mcdata = require('minecraft-data')
const armorManager = require('mineflayer-armor-manager')
const mineflayerViewer = require('prismarine-viewer').mineflayer
const axios = require('axios');

//plugins
const Sleep = require('./Sleep')
const autoEat = require('./autoEat')
const Lookatme = require('./Lookatme')
const Listener = require('./Listener')
const Follower = require('./Follower')
const Guard = require('./Guard');
const Fetcher = require('./Fetcher');
const Leave = require('./Leave');


function Bot(name, password, host, port) {// password not needed
    const bot = mineflayer.createBot({
        host: host || process.env.MHOST,
        port: port || parseInt(process.env.MPORT),
        username: name,
        password,

    });

    axios.post('https://evve.herokuapp.com/api/notify', { title: 'rbot', description: 'rbot joined the world' }).catch(() => { console.log('failed to notify discord') });

    // process.env.NODE_ENV === 'production' && mineflayerViewer(bot, { port: process.env.PORT }) // Start the viewing server on port 3000
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)
    bot.once('spawn', () => {


        console.log('bot spawned')
        const mcData = Mcdata(bot.version)

        const defaultMove = new Movements(bot, mcData)
        // defaultMove.canDig = false;
        const doors = Object.keys(mcData.blocksByName).filter(iname => iname.includes('door'))
        if (defaultMove.blocksCantBreak) {
            console.log('adding to blocks cant break')
            doors.forEach(doorname => mcData.blocksByName[doorname].id)
            defaultMove.blocksCantBreak.add(mcData.blocksByName['farmland'].id);
        }
        defaultMove.digCost = 20
        defaultMove.placeCost = 20
        defaultMove.liquidCost = 10

        bot.pathfinder.setMovements(defaultMove);
        bot.pvp.movements = defaultMove;


        bot.loadPlugin(autoEat);
        bot.loadPlugin(Sleep);
        bot.loadPlugin(Lookatme);
        bot.loadPlugin(Listener);
        bot.loadPlugin(Follower);
        bot.loadPlugin(Fetcher);
        bot.loadPlugin(Guard);
        bot.loadPlugin(Leave);

        bot.on('whisper', (username, _, message) => {
            if (username === bot.username) return
            switch (message) {
                case 'where':
                    console.log(bot.entity.position)
                    bot.whisper(username, `${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`)
                    break

            }
        })

        bot.on('path_reset', console.log)
        bot.on('end', () => onend())
        bot.on('kicked', onend)


    });

    return bot;

}

function onend(reason) {
    try {
        axios.post('https://evve.herokuapp.com/api/notify', { title: 'rbot left', description: reason || 'rbot left the world' }).catch(() => { console.log('failed to notify discord') })
    } catch (error) {

    }
}

module.exports = Bot;