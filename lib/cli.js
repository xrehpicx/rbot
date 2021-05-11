const chalk = require('chalk');
const myRL = require('serverline')


function Cli(bot) {

    bot.cli = {}



    let mode = 'global'
    if (process.stdin.isTTY)
        process.stdin.setRawMode(true);

    const onLine = (line) => {

        if (!bot.dead) {
            switch (mode) {
                case 'global':
                    if (line[0] === '/') { bot.chat(line); break; }
                    bot.chat(bot.username + "'s" + ' admin: ' + line)
                    break;
                case 'whisper':
                    bot.emit('whisper', 'admin', '', line)
                    break;
                default:
                    break;
            }


            if (myRL.isMuted())
                myRL.setMuted(false)
        }
    }
    const keyEvents = (chunk, key) => {
        if (key && key.name == 'g' && key.ctrl) {
            mode = 'global'
            myRL.setPrompt(chalk.cyanBright(`${mode} > `))
            console.log(chalk.grey.italic.bold(`messaging to ${mode} channel`));
            return
        }
        if (key && key.name == 'w' && key.ctrl) {
            mode = 'whisper'
            myRL.setPrompt(chalk.cyanBright(`${mode} > `))
            console.log(chalk.grey.italic.bold(`messaging to ${mode} channel`));
            return
            // process.exit();
        }

        if (key && key.name == 'r' && key.ctrl) {
            bot.dead = 1
            process.stdout.write('\x1Bc')
            process.stdin.removeListener('keypress', keyEvents)
            myRL.getRL().removeListener('line', onLine)
            myRL.close()

            if (bot.cli.options) {
                const temp = { ...bot.cli };
                bot = (new bot.cli.options.Bot({ ...temp.options.serverOptions })).bot;
                bot.cli = temp;
                return
            }
            console.log(chalk.redBright.italic('Something failed restart script'))
        }
        if (key && key.name == 'c' && key.ctrl) {
            process.exit();
        }
    }

    process.stdin.on('keypress', keyEvents);


    myRL.init({
        prompt: chalk.cyanBright(`${mode} > `)
    })

    console.log(chalk.grey.italic.bold('ctrl + w/g to whisper/global chat'));


    myRL.on('line', onLine)
    myRL.on('SIGINT', function (rl) {
        rl.question('Confirm exit:(y/n) ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
    })

    bot.on('end', r => {

        myRL.setPrompt(chalk.redBright(`${mode}(offline) > `))
        console.log(chalk.grey.italic.bold('ctrl + r to reconnect'));

    });

    // bot.on('kicked', r => {
    //     if (r) {
    //         myRL.setPrompt(chalk.redBright(`${mode}(offline) > `))
    //         console.log(chalk.grey.italic.bold('ctrl + r to reconnect'));
    //     }
    // });

}

// function StatusMessage(bot) {
//     return setInterval(function () {
//         process.stdout.write(`${chalk.greenBright.bold('health')}: ${bot.health <= 5 ? chalk.red(bot.health.toFixed(1)) : (bot.health >= 5 && bot.health < 15) ? chalk.yellow(bot.health.toFixed(1)) : chalk.green(bot.health.toFixed(1))} ${chalk.yellowBright.bold('hunger')}: ${bot.food <= 5 ? chalk.red(bot.food.toFixed(1)) : (bot.food >= 5 && bot.food < 15) ? chalk.yellow(bot.food.toFixed(1)) : chalk.green(bot.food.toFixed(1))} ${chalk.blue.bold('position')}: ${chalk.yellow(`${bot.entity.position.x.toFixed(1)}, ${bot.entity.position.y.toFixed(1)}, ${bot.entity.position.z.toFixed(1)}`)}\r`);

//     }, 100);
// }

module.exports = Cli;