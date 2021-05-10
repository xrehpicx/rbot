const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const pvp = require('mineflayer-pvp').plugin
const armorManager = require('mineflayer-armor-manager')
const Mcdata = require('minecraft-data')

//plugins
const Sleep = require('./Sleep')
const autoEat = require('./autoEat')
const Lookatme = require('./Lookatme')
const Listener = require('./Listener')
const Follower = require('./Follower')
const Guard = require('./Guard');
const Fetcher = require('./Fetcher');
const Leave = require('./Leave');
const Cli = require('./cli');

//utils
const chalk = require('chalk');


function Bot({ name, password, host, port, onspawn, onmessage = () => { }, onend = () => { } }) {// password not needed
    const bot = mineflayer.createBot({
        host: host || process.env.MHOST,
        port: port || parseInt(process.env.MPORT),
        username: name,
        password,

    });


    bot.loadPlugin(pathfinder)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)
    bot.once('spawn', () => {

        console.log(`${chalk.blue(bot.username)} ${chalk.yellowBright('spawned')}`);


        const mcData = Mcdata(bot.version)

        const defaultMove = new Movements(bot, mcData)
        // defaultMove.canDig = false;
        const doors = Object.keys(mcData.blocksByName).filter(iname => iname.includes('door'))
        if (defaultMove.blocksCantBreak) {
            doors.forEach(doorname => mcData.blocksByName[doorname].id)
            defaultMove.blocksCantBreak.add(mcData.blocksByName['farmland'].id);
        }
        defaultMove.digCost = 20
        defaultMove.placeCost = 20
        defaultMove.liquidCost = 2

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
        // bot.loadPlugin(Cli);

        // options setup
        bot.leave.options = { Bot };
        bot.listener.onmessage = onmessage;

        bot.on('whisper', (username, _, message) => {
            if (username === bot.username) return
            switch (message) {
                case 'where':
                    console.log('at:', bot.entity.position)
                    bot.whisper(username, `${bot.entity.position.x}, ${bot.entity.position.y}, ${bot.entity.position.z}`)
                    break

            }
        })

        bot.on('path_reset', (v) => console.log('bot path reset:', v));
        bot.on('end', onend);
        bot.on('kicked', onend);

        onspawn && onspawn();
    });

    return bot;

}



module.exports = Bot;