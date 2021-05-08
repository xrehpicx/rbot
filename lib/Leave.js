function Leave(bot) {
    bot.on('whisper', (username, _, message) => {
        if (username === bot.username) return
        switch (message) {
            case 'leave':
                bot.whisper(username, `kk bye`)
                bot.quit()
                console.log('left server')
                break

        }
    })

}

module.exports = Leave;