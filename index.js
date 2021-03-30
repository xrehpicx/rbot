require("dotenv").config()
const Bot = require('./lib/Bot');

const bot = Bot('rbot');


/* const mineflayer = require('mineflayer')
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder')
const autoeat = require('mineflayer-auto-eat')
const mineflayerViewer = require('prismarine-viewer').mineflayer

const bot = mineflayer.createBot({
    host: process.env.MHOST,
    port: parseInt(process.env.MPORT),
    username: 'rbot',
})


bot.loadPlugin(autoeat)
bot.loadPlugin(pathfinder)

bot.once('spawn', () => {
    console.log('bot spawned')
    // mineflayerViewer(bot, { port: process.env.PORT || 3007, firstPerson: false })

    const mcData = require('minecraft-data')(bot.version)

    const defaultMove = new Movements(bot, mcData)
    bot.on('kicked', console.log)
    bot.on('error', console.log)

    console.log(bot.entity.position)

    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: []
    }

    bot.on('physicTick', () => {
        const entity = bot.nearestEntity()
        if (entity !== null) {
            if (entity.type === 'player') {
                bot.lookAt(entity.position.offset(0, 1.6, 0))
            } else if (entity.type === 'mob') {
                bot.lookAt(entity.position)
            }
        }
    })
    bot.on('autoeat_started', () => {
        console.log('Auto Eat started!')
    })

    bot.on('autoeat_stopped', () => {
        console.log('Auto Eat stopped!')
    })

    bot.on('health', () => {
        if (bot.food === 20) bot.autoEat.disable()
        // Disable the plugin if the bot is at 20 food points
        else bot.autoEat.enable() // Else enable the plugin again

    })

    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message)
    })
    bot.on('whisper', (username, message) => {
        if (username === bot.username) return
        switch (message) {
            case 'sleep':
                goToSleep()
                break
            case 'come':
                Come(username, defaultMove)
                break
            case 'wakeup':
                wakeUp()
                break
            default:
                console.log(username + ': ' + message)
        }

    })
    bot.on('sleep', () => {
        bot.chat('Good night!')
    })
    bot.on('wake', () => {
        bot.chat('Good morning!')
    })

})

function Come(username, defaultMove) {
    const target = bot.players[username]?.entity
    if (!target) {
        bot.chat("I don't see you !")
        return
    }
    const { x: playerX, y: playerY, z: playerZ } = target.position

    bot.pathfinder.setMovements(defaultMove)
    bot.pathfinder.setGoal(new GoalNear(playerX, playerY, playerZ, 1))
}

async function goToSleep() {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block)
    })
    if (bed) {
        try {
            await bot.sleep(bed)
            bot.chat("I'm sleeping")
        } catch (err) {
            bot.chat(`I can't sleep: ${err.message}`)
        }
    } else {
        bot.chat('No nearby bed')
    }
}

async function wakeUp() {
    try {
        await bot.wake()
    } catch (err) {
        bot.chat(`I can't wake up: ${err.message}`)
    }
} */