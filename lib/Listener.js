const nlp = require('compromise')

function Listener(bot) {
    bot.listener = { onmessage: () => { } }
    bot.on('chat', async (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message);
        bot.listener.onmessage(username, message);

        const referenced = await botReferenced(message, bot.username)

        switch (referenced) {
            case 'specific':
                bot.chat('Oo')
                break;
            case 'general':
                bot.chat('oO')
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