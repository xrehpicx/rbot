const nlp = require('compromise')
const chalk = require('chalk')
function Listener(bot) {
    bot.listener = { onmessage: () => { } }

    bot.on('chat', async (username, message) => {

        if (username === bot.username) {
            console.log(`${chalk.grey(message)}`);
            return
        }

        console.log(`${chalk.grey(chalk.italic.bold(username) + ': ' + message)}`);

        bot.listener.onmessage(username, message);

        const referenced = await botReferenced(message, bot.username)

        switch (referenced) {
            case 'specific':
                bot.chat('Oo')
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