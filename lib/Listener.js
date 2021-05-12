const nlp = require('compromise')
const chalk = require('chalk')
const api = require('termux')

const notifier = require('node-notifier')

function notify({ title, subtitle, message, sound, icon, contentImage, open, wait, timeout, closeLabel, actions, dropdownLabel, reply }) {
    if (process.platform === 'android') { return }
    return new Promise((res, rej) => {
        notifier.notify(
            {
                title,
                subtitle,
                message,
                sound,
                icon,
                contentImage,
                open,
                wait,
                timeout,
                closeLabel,
                actions,
                dropdownLabel,
                reply
            },
            function (error, response, metadata) {
                if (!error) res(response)
                error && rej(error)
            }
        );
    })
}

function Listener(bot) {
    bot.listener = { onmessage: () => { } }



    bot.on('playerJoined', player => {
        console.log(chalk.yellowBright.bold(`${player.username} joined`));
        notify({
            title: `${player.username} joined`,
            message: bot.username,
            sound: true, // Only Notification Center or Windows Toasters
            wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        });
    })
    bot.on('playerLeft', player => {
        console.log(chalk.yellowBright.bold(`${player.username} left`));
    })

    bot.on('chat', async (username, message) => {

        if (username === bot.username) {
            // console.log(`${chalk.grey(message)}`);
            return
        }
        if (api.hasTermux) {
            api.vibrate().duration(1000)
            api.notification().id('chat_noti').content(username + ': ' + message).title('Global chat')
        }

        console.log(`${chalk.grey(chalk.italic.bold(username) + ': ' + message)}`);

        bot.listener.onmessage(username, message);

        const referenced = await botReferenced(message, bot.username)

        switch (referenced) {
            case 'specific':
                bot.chat('Oo')
                notify({
                    title: `${bot.username} was referenced by ${username}`,
                    message,
                    sound: true, // Only Notification Center or Windows Toasters
                    wait: true // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
                });
                console.log(chalk.grey.italic.bold(`${bot.username} was referenced by ${username}`));
                break;
            case 'general':
                bot.chat('oO')
                console.log(chalk.grey.italic.bold(`${bot.username} may have been referenced by ${username}`));
                break;

            default:
                break;
        }

    })

}

function botReferenced(message, botname) {
    return new Promise((res, rej) => {
        const doc = nlp(message)
        doc.nouns().out('array').includes(botname) && res('specific')
        doc.nouns().out('array').includes('bot') && res('general')
        res(false)
    })
}

module.exports = Listener