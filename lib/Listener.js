const axios = require('axios');
function Listener(bot) {
    bot.on('chat', (username, message) => {
        if (username === bot.username) return
        console.log(username + ': ' + message)
        axios.post('https://evve.herokuapp.com/api/notify', { title: 'mc:' + username, description: message })
    })

}
module.exports = Listener