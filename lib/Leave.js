
function Leave(bot, Bot) {
    bot.leave = {}
    bot.leave.options = {}
    bot.on('whisper', (username, _, message) => {

        if (username === bot.username) return
        const botname = bot.username;
        message = message.split(' ');

        if (message[0] === 'leave') {

            if (message[1] && Number(message[1])) {

                bot.whisper(username, `kk bye, leaving for ${Number(message[1])}${Number(message[1]) > 1 ? 'mins' : 'min'}`)
                bot.quit()
                console.log(`bot leaving for ${Number(message[1])}${Number(message[1]) > 1 ? 'mins' : 'min'}`)
                setTimeout(() => {
                    if (bot.leave.options.Bot) { bot = bot.leave.options.Bot(bot.leave.options.serverOptions); return }
                    console.log('cant find Bot instance')
                }, Number(message[1]) * 60 * 1000);
                return
            }

            bot.whisper(username, `kk bye`)
            bot.quit()
            console.log(`bot leaving`)

        }

    })

}

module.exports = Leave;