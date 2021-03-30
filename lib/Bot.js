const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals: { GoalNear, GoalFollow, GoalBlock } } = require('mineflayer-pathfinder');
const autoeat = require('mineflayer-auto-eat');
const pvp = require('mineflayer-pvp').plugin
const Mcdata = require('minecraft-data')
const armorManager = require('mineflayer-armor-manager')

const mineflayerViewer = require('prismarine-viewer').mineflayer

function Bot(name, password) {
    const bot = mineflayer.createBot({
        host: process.env.MHOST,
        port: parseInt(process.env.MPORT),
        username: name,
        password
    })
    bot.loadPlugin(pathfinder)
    bot.loadPlugin(autoeat)
    bot.loadPlugin(armorManager)
    bot.loadPlugin(pvp)

    process.env.NODE_ENV === 'production' && mineflayerViewer(bot, { port: process.env.PORT }) // Start the viewing server on port 3000
    bot.once('spawn', () => {
        console.log('bot spawned')
        const mcData = Mcdata(bot.version)
        console.log(bot.entity.position)
        const defaultMove = new Movements(bot, mcData)
        defaultMove.canDig = false;
        bot.pathfinder.setMovements(defaultMove);
        bot.pvp.movements = defaultMove;
        autoEat(bot)
        Lookatme(bot)
        Listener(bot)
        Sleep(bot, mcData, defaultMove)
        Follower(bot, mcData, defaultMove)
        Guard(bot)

        bot.on('whisper', (username, _, message) => {
            if (username === bot.username) return
            switch (message) {
                case 'test':
                    console.log(bot.entities)
                    break

            }
        })

    });

    return bot;

}
function Guard(bot) {
    var guardPos = null;

    function guardArea(pos) {
        guardPos = pos
        // We we are not currently in combat, move to the guard pos
        if (!bot.pvp.target) {
            moveToGuardPos()
        }
    }
    function moveToGuardPos() {
        bot.pathfinder.setGoal(new GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }
    function stopGuarding() {
        guardPos = null
        bot.pvp.stop()
        bot.pathfinder.setGoal(null)
    }

    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'guard here':
                const player = bot.players[username]
                if (!player) {
                    bot.whisper(username, "I can't see you.")
                    return
                }
                bot.whisper(username, 'I will guard that location.')
                guardArea(player.entity.position)
                break
            case 'chill':
                bot.whisper(username, 'I will no longer guard this area.')
                stopGuarding()
                break
        }
    })
    function ready() {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')
        const shield = bot.inventory.items().find(item => item.name.includes('shield'))
        if (shield) bot.equip(shield, 'off-hand')
    }
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return
        setTimeout(() => {
            const sword = bot.inventory.items().find(item => item.name.includes('sword'))
            if (sword) bot.equip(sword, 'hand')
        }, 150)
    })
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return
        setTimeout(() => {
            const shield = bot.inventory.items().find(item => item.name.includes('shield'))
            if (shield) bot.equip(shield, 'off-hand')
        }, 250)
    })
    bot.on('physicsTick', () => {
        if (!guardPos) return // Do nothing if bot is not guarding anything

        // Only look for mobs within 16 blocks
        const filter = e => e.type === 'mob' && e.kind === 'Hostile mobs' && e.position.distanceTo(bot.entity.position) < 16 &&
            e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

        const entity = bot.nearestEntity(filter)
        if (entity) {
            ready()
            // Start attacking
            bot.pvp.attack(entity)
        }
    })
    bot.on('stoppedAttacking', () => {
        if (guardPos) {
            moveToGuardPos()
        }
    })


}
function Follower(bot, mcData, movements) {
    function followPlayer(name, come) {
        const player = bot.players[name];
        if (!player || !player.entity) {
            bot.whisper(name, 'Cant find you')
            return
        }

        bot.pathfinder.setGoal(null)
        const goal = new GoalFollow(player.entity, come ? 0 : 3)
        console.log(come ? 'going to player' : 'followinfg player')
        bot.pathfinder.setGoal(goal, !come)
    }
    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'come here':
                followPlayer(username, true)
                break
            case 'follow me':
                followPlayer(username)
                break
            case 'stop there':
                bot.pathfinder.setGoal(null)
                break
        }
    })
}
function Sleep(bot, mcData, defaultMove) {
    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'sleep':
                goToSleep(bot, mcData, defaultMove)
                break
            case 'wakeup':
                wakeUp(bot)
                break
        }
    })
}
function Listener(bot) {
    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message)
    })

}
function Lookatme(bot) {
    bot.on('physicTick', () => {
        if (bot.pvp.target) return
        if (bot.pathfinder.isMoving()) return

        const entity = bot.nearestEntity()
        if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
    })
}
function autoEat(bot) {
    bot.autoEat.options = {
        priority: 'foodPoints',
        startAt: 14,
        bannedFood: []
    }
    bot.on('health', () => {
        if (bot.food === 20) bot.autoEat.disable()
        // Disable the plugin if the bot is at 20 food points
        else bot.autoEat.enable() // Else enable the plugin again

    })
}


// utils

async function goToSleep(bot, mcData, defaultMove) {
    const bed = bot.findBlock({
        matching: block => bot.isABed(block),
        maxDistance: 32
    })

    if (bed) {
        await bot.pathfinder.setGoal(null)
        const goal = new GoalNear(bed.position.x, bed.position.y, bed.position.z, 2)
        await bot.pathfinder.setGoal(goal)
        bot.once('goal_reached', async (g) => {
            if (goal === g) {
                try {

                    await bot.sleep(bed)
                    bot.chat("I'm sleeping")
                } catch (err) {
                    bot.chat(`I can't sleep: ${err.message}`)
                }
            }
        })

    } else {

        bot.chat('No nearby bed')
    }
}

async function wakeUp(bot) {
    try {
        await bot.wake()
    } catch (err) {
        bot.chat(`I can't wake up: ${err.message}`)
    }
}

module.exports = Bot;