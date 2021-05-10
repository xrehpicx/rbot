const chalk = require('chalk');
function autoEat(bot) {
    bot.autoEat.options = {
        priority: 'saturation',
        startAt: 15,
        bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }


    bot.once('health', () => {
        console.log(`${chalk.greenBright.bold('health')}: ${bot.health <= 5 ? chalk.red(bot.health.toFixed(1)) : (bot.health >= 5 && bot.health < 15) ? chalk.yellow(bot.health.toFixed(1)) : chalk.green(bot.health.toFixed(1))}`)
        console.log(`${chalk.yellowBright.bold('hunger')}: ${bot.food <= 5 ? chalk.red(bot.food.toFixed(1)) : (bot.food >= 5 && bot.food < 15) ? chalk.yellow(bot.food.toFixed(1)) : chalk.green(bot.food.toFixed(1))}`)
    })
    bot.on('health', (d) => {
        if (bot.health <= 15 && bot.food < 20) {
            bot.autoEat.options.startAt = bot.food
            try {
                bot.autoEat.eat()
            } catch (error) {

            }
            return
        }
        bot.autoEat.options.startAt = 15;
        if (bot.food === 20) { bot.autoEat.disable(); return }
        bot.autoEat.enable()
    })

    bot.on('whisper', (username, _, message) => {
        if (username === bot.username) return
        if (message === 'eat') {
            bot.autoEat.eat()
        }
    })

}
module.exports = autoEat;