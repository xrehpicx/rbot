const chalk = require('chalk');
function autoEat(bot) {
    bot.autoEat.options = {
        priority: 'saturation',
        startAt: 15,
        bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }

    // bot.once('health', () => {
    //     console.log(`${chalk.greenBright.bold('health')}: ${bot.health <= 5 ? chalk.red(bot.health.toFixed(1)) : (bot.health >= 5 && bot.health < 15) ? chalk.yellow(bot.health.toFixed(1)) : chalk.green(bot.health.toFixed(1))}`)
    //     console.log(`${chalk.yellowBright.bold('hunger')}: ${bot.food <= 5 ? chalk.red(bot.food.toFixed(1)) : (bot.food >= 5 && bot.food < 15) ? chalk.yellow(bot.food.toFixed(1)) : chalk.green(bot.food.toFixed(1))}`)
    // })

    // ${chalk.blue.bold('position')}: ${chalk.yellow(`${bot.entity.position.x.toFixed(1)}, ${bot.entity.position.y.toFixed(1)}, ${bot.entity.position.z.toFixed(1)}

    bot.on("autoeat_started", () => {

        console.log(chalk.grey.italic.bold(`${bot.username} is eating`));
    })

    bot.on("autoeat_stopped", () => {
        console.log(chalk.grey.italic.bold(`${bot.username} is done eating`));
    })
    bot.on('health', (d) => {
        console.log(`${chalk.greenBright.bold('health')}: ${bot.health <= 5 ? chalk.red(bot.health.toFixed(1)) : (bot.health >= 5 && bot.health < 15) ? chalk.yellow(bot.health.toFixed(1)) : chalk.green(bot.health.toFixed(1))}`, `${chalk.yellowBright.bold('hunger')}: ${bot.food <= 5 ? chalk.red(bot.food.toFixed(1)) : (bot.food >= 5 && bot.food < 15) ? chalk.yellow(bot.food.toFixed(1)) : chalk.green(bot.food.toFixed(1))}`);

        if (bot.health <= 15 && bot.food < 20) {
            bot.autoEat.options.startAt = bot.food
            bot.autoEat.eat(() => {
                bot.autoEat.enable()
                bot.autoEat.options.startAt = 15
            })

            return
        }

        if (bot.food === 20) { bot.autoEat.disable(); return }

    })

    bot.on('whisper', (username, _, message) => {
        if (username === bot.username) return
        if (message === 'eat') {
            bot.autoEat.eat()
        }
    })

}
module.exports = autoEat;