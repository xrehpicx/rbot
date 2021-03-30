function Listener(bot) {
    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message)
    })

}
module.exports = Listener