const { goals: { GoalFollow } } = require('mineflayer-pathfinder');
function Follower(bot) {
    function followPlayer(name, come) {
        const player = bot.players[name];
        if (!player || !player.entity) {
            bot.whisper(name, 'Cant find you')
            return
        }

        bot.pathfinder.setGoal(null)
        const goal = new GoalFollow(player.entity, come ? 0 : 3)
        console.log(come ? 'going to player' : 'followinfg player')
        bot.pathfinder.setGoal(goal, !come)
    }
    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'come here':
                followPlayer(username, true)
                break
            case 'follow me':
                followPlayer(username)
                break
            case 'stop there':
                bot.pathfinder.setGoal(null)
                break
        }
    })
}

module.exports = Follower