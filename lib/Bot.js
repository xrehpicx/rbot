const mineflayer = require('mineflayer');
const { pathfinder, Movements } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const pvp = require('mineflayer-pvp').plugin
const armorManager = require('mineflayer-armor-manager')
const Mcdata = require('minecraft-data')
const notifier = require('node-notifier');

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
const Drowned = require('./DrownedFarm');
const formatAMPM = require('./utils');
const Stasis = require('../custom/StasisTemple');


function Bot({ admin = 'admin', name, password, host, port, cli = true, onspawn = () => { }, onmessage = () => { }, onend = () => { } }) {// password not needed

    console.log(chalk.blackBright.italic('connecting to server.....'))
    const bot = mineflayer.createBot({
        host: host || process.env.MHOST,
        port: port || parseInt(process.env.MPORT),
        username: name,
        password,
    })

    bot.adminusername = admin

    // load plugins
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)


    this._onspawn = () => {

        

        notifier.notify(
            {
                title: name + ' has spawned',
                message: 'U will be notified about bot events',
                sound: true, // Only Notification Center or Windows Toasters
                wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
            }
        );

        process.stdout.write('\x1Bc')

        console.log(`${chalk.blue(bot.username)} ${chalk.yellowBright('spawned')}`);

        serverStats(bot)
        const mcData = Mcdata(bot.version)

        function MovementSetup() {
            const defaultMove = new Movements(bot, mcData)
            // defaultMove.canDig = false;
            const doors = Object.keys(mcData.blocksByName).filter(iname => iname.includes('door'))
            if (defaultMove.blocksCantBreak) {
                doors.forEach(doorname => mcData.blocksByName[doorname].id)
                defaultMove.blocksCantBreak.add(mcData.blocksByName['farmland'].id);
            }
            defaultMove.digCost = 50
            defaultMove.placeCost = 50
            defaultMove.liquidCost = 0

            bot.pathfinder.setMovements(defaultMove);
            bot.pvp.movements = defaultMove;
        }

        function MovementNetherSetup() {
            console.log('in nether or end idk')
            const defaultMove = new Movements(bot, mcData)
            defaultMove.canDig = false;
            const doors = Object.keys(mcData.blocksByName).filter(iname => iname.includes('door'))
            if (defaultMove.blocksCantBreak) {
                doors.forEach(doorname => mcData.blocksByName[doorname].id)
                defaultMove.blocksCantBreak.add(mcData.blocksByName['farmland'].id);
            }
            defaultMove.placeCost = 1000
            defaultMove.liquidCost = 100

            bot.pathfinder.setMovements(defaultMove);
            bot.pvp.movements = defaultMove;
        }

        if (bot.game.dimension === 'minecraft:overworld') {

            MovementSetup()
        }
        else {
            MovementNetherSetup()
        }



        bot.loadPlugin(autoEat);
        bot.loadPlugin(Sleep);
        bot.loadPlugin(Lookatme);
        bot.loadPlugin(Listener);
        bot.loadPlugin(Follower);
        bot.loadPlugin(Fetcher);
        bot.loadPlugin(Guard);
        bot.loadPlugin(Leave);
        bot.loadPlugin(Drowned);
        bot.loadPlugin(Stasis);
        cli && bot.loadPlugin(Cli);

        const serverOptions = {
            name, password, host, port, cli, onspawn, onmessage, onend
        }
        // options setup
        bot.leave.options = { Bot, serverOptions };
        bot.cli.options = { Bot, serverOptions };
        bot.listener.onmessage = onmessage;



        bot.on('respawn', () => {
            if (bot.game.dimension !== 'minecraft:overworld') {
                MovementNetherSetup()

                return
            }
            MovementSetup()
        })

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

        var reason;
        bot.on('end', r => {
            // r.extra && console.log(chalk.redBright.italic.bold(`${r.extra[0].text}`));
            console.log(formatAMPM(), chalk.redBright.italic.bold(`${bot.username} is disconnected`));
            onend(reason)
        });
        bot.on('kicked', r => {

            if (r) {
                r = JSON.parse(r)
                r.extra && console.log(chalk.redBright.italic.bold(`${r.extra[0].text}`));
                reason = r.extra[0].text
                // console.log(chalk.redBright.italic.bold(`${bot.username} got kicked`));
            }
        });

        onspawn && onspawn();
    }


    // main event
    bot.once('spawn', this._onspawn);

    this.bot = bot

}


function serverStats(bot) {

    console.log(chalk.cyanBright.italic.bold(`players online:`));
    Object.keys(bot.players).forEach(p => {
        console.log(chalk.greenBright.italic(`- ${p}`));
    })

    console.log(chalk.cyanBright.italic.bold(bot.time.isDay ? 'its day' : 'its night'));

}


module.exports = Bot;