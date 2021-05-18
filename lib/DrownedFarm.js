const chalk = require("chalk");
const formatAMPM = require("./utils");

function Drowned(bot) {
    bot.dfarm = {}

    bot.dfarm.start = () => {
        if (bot.game.dimension !== 'minecraft:overworld') {
            console.log(chalk.blue.italic.bold('Starting Drowned farm in nether'))
            bot.emit('whisper', 'admin', '', 'kill')

            var counter = 0;
            // const checker = setInterval(() => {
            //     const filter = e => e.mobType === 'Drowned'

            //     const entities = Object.values(bot.entities).filter(filter)
            //     if (counter !== entities.length) {
            //         bot.chat(formatAMPM() + ' ' + entities.length + ' drowns')
            //         console.log(formatAMPM(), entities.length + ' drowns')
            //         counter = entities.length
            //     }

            // }, 2000)
            bot.on('stoppedAttacking', () => {
                counter++;
                console.log(chalk.grey.italic.bold(formatAMPM() + ' killed ' + counter + ' drowns'));
                (counter % 10 === 0) && bot.chat(formatAMPM() + ' killed ' + counter + ' drowns')
            })
            const tridentchecker = setInterval(() => {
                const filter = e => e.mobType === 'Drowned'

                const entities = Object.values(bot.entities).filter(filter)

                const tridents = entities.filter(e => e.heldItem && e.heldItem.name === 'trident')
                if (tridents.length) {
                    bot.chat(formatAMPM() + ' drown holding a trident!')
                    console.log(formatAMPM(), 'drown holding a trident!')

                }

            }, 5 * 1000 * 60)
            const chestMonitor = setInterval(() => {

            }, 1 * 1000 * 60)

            return
        }
        console.log(chalk.blue.italic.bold('Starting Drowned farm mode'))
        console.log(chalk.grey.italic('its overworld so ill just chill'))
    }

    bot.on('whisper', (username, _, message) => {
        if (username === bot.username) return
        switch (message) {
            case 'dfarm':
                bot.dfarm.start()
                break

        }
    })
}

module.exports = Drowned