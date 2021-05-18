const { goals: { GoalNear } } = require('mineflayer-pathfinder');

function Stasis(bot) {
    bot.on('whisper', async (username, _, message) => {
        if (username === bot.username) return
        const player = bot.players[username]
        switch (message) {
            case 'home':

                const signsPos = bot.findBlocks({
                    matching: block => block.name === 'warped_wall_sign',
                    count: 10,
                    maxDistance: 32
                })

                if (!signsPos.length) {
                    bot.whisper(username, 'Im not that bot')
                }

                const signs = signsPos.map(s => {
                    const newsign = bot.blockAt(s, true)
                    newsign.position = s
                    newsign.signText = newsign.signText.trim()
                    return newsign
                })



                // console.log(signs)
                const sign = signs.filter(s => s.signText === username)[0]

                if (!sign || !sign.position) {
                    bot.whisper(username, 'couldnt find a sign with ur name')
                }

                const door = bot.findBlock({
                    matching: block => block.name === 'dark_oak_trapdoor',
                    point: sign.position,
                    maxDistance: 32,
                    count: 1
                })

                const goal = new GoalNear(door.position.x, door.position.y, door.position.z, 4)
                bot.pathfinder.setGoal(goal)
                bot.once('goal_reached', async (g) => {
                    if (goal === g) {
                        try {
                            bot.activateBlock(door, () => {
                                bot.activateBlock(door, () => {
                                    bot.whisper(username, 'closed the door')
                                    goNearBed(bot)
                                })
                            })
                        } catch (err) {
                            bot.chat(err.message)
                        }
                    }
                })

                break
        }
    })
}

async function goNearBed(bot) {


    const bed = bot.findBlock({
        matching: block => bot.isABed(block),
        maxDistance: 20
    })

    if (bed) {
        await bot.pathfinder.setGoal(null)
        const goal = new GoalNear(bed.position.x, bed.position.y, bed.position.z, 1)
        await bot.pathfinder.setGoal(goal)
    }
}

module.exports = Stasis