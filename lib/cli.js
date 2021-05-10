const readline = require('readline');
const chalk = require('chalk');
require('cli-cursor').hide();
readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY)
    process.stdin.setRawMode(true);



function Cli(bot) {

    const statusbot = StatusMessage(bot)

    // process.on('exit', () => {

    //     process.stdout.write(`\r`);
    //     console.log(chalk.grey.italic.bold(bot.username + ' left the world'))

    // });
    process.stdin.on('keypress', (chunk, key) => {
        // console.log(key)
        if (key && key.name == 'c' && key.ctrl) {
            clearInterval(statusbot)
            setTimeout(process.exit, 0)
        }
        if (key.ctrl) {
            switch (key.name) {
                case 's':
                    console.log('ctrl + s')
                    bot.emit('whisper', 'test', '', 'sleep')
                    break;

                default:
                    break;
            }
        }
    });
}

function StatusMessage(bot) {
    return setInterval(function () {
        process.stdout.write(`${chalk.greenBright.bold('health')}: ${bot.health <= 5 ? chalk.red(bot.health.toFixed(1)) : (bot.health >= 5 && bot.health < 15) ? chalk.yellow(bot.health.toFixed(1)) : chalk.green(bot.health.toFixed(1))} ${chalk.yellowBright.bold('hunger')}: ${bot.food <= 5 ? chalk.red(bot.food.toFixed(1)) : (bot.food >= 5 && bot.food < 15) ? chalk.yellow(bot.food.toFixed(1)) : chalk.green(bot.food.toFixed(1))} ${chalk.blue.bold('position')}: ${chalk.yellow(`${bot.entity.position.x.toFixed(1)}, ${bot.entity.position.y.toFixed(1)}, ${bot.entity.position.z.toFixed(1)}`)}\r`);

    }, 100);
}

module.exports = Cli;