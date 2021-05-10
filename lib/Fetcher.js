const MinecraftData = require('minecraft-data');
const { goals: { GoalFollow, GoalGetToBlock } } = require('mineflayer-pathfinder');
const chalk = require('chalk');
function Fetcher(bot) {
    const mcData = MinecraftData(bot.version)
    function followPlayer(name, come) {
        return new Promise((res, rej) => {

            const player = bot.players[name];
            if (!player || !player.entity) {
                bot.whisper(name, 'Cant find you')
                return
            }

            bot.pathfinder.setGoal(null)
            console.log(chalk.grey.italic.bold(come ? (`going to ${name}`) : (`followinfg ${name}`)))
            const goal = new GoalFollow(player.entity, 3)
            bot.pathfinder.setGoal(goal, !come)

            bot.once('goal_reached', () => res(player.entity))
            bot.once('stuck', rej)
        })
    }
    const getId = (nm) => (mcData.entitiesByName['chest'] || mcData.blocksByName['chest']).id
    function getItem(item, username) {

        const withbot = bot.inventory.items().filter(i => i.name === item.name)
        if (withbot.length) {
            setTimeout(async () => {
                const entity = await followPlayer(username, true)
                if (entity) {
                    bot.lookAt(entity.position)
                    withbot.forEach(i => {
                        if (i.name === item.name) bot.tossStack(i)
                    })
                    bot.whisper(username, 'there u go')
                    return
                }
                bot.whisper(username, 'cant find you')
            }, 10)
            return
        }

        console.log(chalk.grey.italic.bold(`looking for ${item}`))
        const storage = bot.findBlocks({ matching: getId('chest'), count: 99999999, maxDistance: 32 })
        const allchests = storage.map(s => bot.blockAt(s));

        var found = { counter: 0 };
        function searchThrough() {
            searchChest(allchests[found.counter], item).then(async (cheststuff) => {

                const ch = await bot.openChest(allchests[found.counter])
                const inchest = cheststuff.filter(s => s.name === item.name)[0]

                await ch.withdraw(cheststuff.filter(s => s.name === item.name)[0].type, null, inchest.count < 64 ? inchest.count : 64)

                await bot.lookAt(allchests[found.counter].position)

                await ch.close()

                const entity = await followPlayer(username, true)
                if (entity) bot.lookAt(entity.position)
                bot.inventory.items().forEach(i => {
                    if (i.name === item.name) bot.tossStack(i)
                })
                bot.whisper(username, 'there u go')

            }).catch((err) => {
                if (err) return console.log(err)
                if (found.counter < (allchests.length - 1)) {
                    found.counter += 1;
                    searchThrough()
                    return
                } console.log(chalk.grey.italic.bold('not found in any chest'))
                bot.whisper(username, 'could not find in any nearby chest')
            });
        }

        searchThrough()



        function searchChest(chest, itemtosearch) {
            if (chest) {
                return new Promise((res, rej) => {
                    const goal = new GoalGetToBlock(chest.position.x, chest.position.y, chest.position.z)
                    bot.pathfinder.setGoal(goal)
                    const onGoal = async () => {
                        await bot.lookAt(chest.position)
                        const c = await bot.openChest(chest)
                        const filtered = c.containerItems().filter(i => i.name === itemtosearch.name)
                        if (filtered.length) { res(filtered); return }
                        rej();
                        c.close();
                    }
                    bot.once('goal_reached', onGoal)
                })
            }
        }


    }
    bot.on('whisper', (username, _, message) => {

        if (username === bot.username) return
        const commands = message.split(' ')
        if (commands.length > 1) {
            switch (commands[0]) {
                case 'get':

                    console.log(chalk.grey.italic.bold(`looking for ${chalk.white(commands[1])}`))
                    const item = mcData.itemsByName[commands[1]] || mcData.entitiesByName[commands[1]] || mcData.blocksByName[commands[1]]

                    if (!item) {
                        bot.whisper(username, 'no such item')
                        console.log(chalk.grey.italic.bold(`${commands[1]}doesnt exist`))
                        break
                    }

                    getItem(item, username)
                    break
            }
        }
    })
}

module.exports = Fetcher