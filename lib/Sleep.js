const { goals: { GoalNear } } = require('mineflayer-pathfinder');

function Sleep(bot) {
    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'sleep':
                goToSleep(bot)
                break
            case 'wakeup':
                wakeUp(bot)
                break
        }
    })
}
async function goToSleep(bot) {
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
                    bot.chat(err.message)
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
        bot.chat(err.message)
    }
}

module.exports = Sleep;