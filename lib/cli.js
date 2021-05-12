const chalk = require('chalk');
const myRL = require('serverline')
const events = require('events');

const c = new events.EventEmitter()

myRL.on('line', (line) => {
    c.emit('line', line)
})
process.stdin.on('keypress', (...props) => {
    c.emit('keypress', ...props)
});


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
                    bot.emit('whisper', bot.adminusername, '', line)
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

            c.removeListener('keypress', keyEvents)
            c.removeListener('line', onLine)

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

    c.on('keypress', keyEvents);


    myRL.init({
        prompt: chalk.cyanBright(`${mode} > `)
    })

    console.log(chalk.grey.italic.bold('ctrl + w/g to whisper/global chat'));

    c.on('line', onLine)
    myRL.on('SIGINT', function (rl) {
        rl.question('Confirm exit:(y/n) ', (answer) => answer.match(/^y(es)?$/i) ? process.exit(0) : rl.output.write('\x1B[1K> '))
    })


    bot.on('end', r => {

        myRL.setPrompt(chalk.redBright(`${mode}(offline) > `))
        console.log(chalk.whiteBright.italic.bold('ctrl + r to reconnect'));

    });

    // bot.on('kicked', r => {
    //     if (r) {
    //         console.log(chalk.grey.italic.bold('ctrl + r to reconnect'));
    //     }
    // });

}

module.exports = Cli;