function Listener(bot) {
    bot.listener = { onmessage: () => { } }
    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message);
        bot.listener.onmessage(username, message);
    })

}
module.exports = Listener