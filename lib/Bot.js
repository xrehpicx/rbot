const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const pvp = require('mineflayer-pvp').plugin
const Mcdata = require('minecraft-data')
const armorManager = require('mineflayer-armor-manager')
const mineflayerViewer = require('prismarine-viewer').mineflayer

//plugins
const Sleep = require('./Sleep')
const autoEat = require('./autoEat')
const Lookatme = require('./Lookatme')
const Listener = require('./Listener')
const Listener = require('./Follower')
const Listener = require('./Guard')


function Bot(name, password) {// password not needed
    const bot = mineflayer.createBot({
        host: process.env.MHOST,
        port: parseInt(process.env.MPORT),
        username: name,
        password
    })

    process.env.NODE_ENV === 'production' && mineflayerViewer(bot, { port: process.env.PORT }) // Start the viewing server on port 3000
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)
    bot.once('spawn', () => {


        console.log('bot spawned')
        const mcData = Mcdata(bot.version)

        const defaultMove = new Movements(bot, mcData)
        defaultMove.canDig = false;
        bot.pathfinder.setMovements(defaultMove);
        bot.pvp.movements = defaultMove;


        bot.loadPlugin(Sleep);
        bot.loadPlugin(autoEat);
        bot.loadPlugin(Lookatme);
        bot.loadPlugin(Listener);
        bot.loadPlugin(Follower);
        bot.loadPlugin(Guard);

        bot.on('whisper', (username, _, message) => {
            if (username === bot.username) return
            switch (message) {
                case 'where':
                    console.log(bot.entity.position)
                    bot.whisper(username, `${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`)
                    break

            }
        })

    });

    return bot;

}

module.exports = Bot;