function autoEat(bot) {
    bot.autoEat.options = {
        priority: 'saturation',
        startAt: 15,
        bannedFood: ["golden_apple", "enchanted_golden_apple", "rotten_flesh"],
    }

    bot.on('health', (d) => {
        console.log(bot.health, bot.food)
        if (bot.health <= 15 && bot.food < 20) {
            bot.autoEat.options.startAt = bot.food
            try {
                bot.autoEat.eat()
            } catch (error) {

            }
            return
        }
        bot.autoEat.options.startAt = 15;
        if (bot.food === 20) { bot.autoEat.disable(); return }
        bot.autoEat.enable()
    })

    bot.on('whisper', (username, _, message) => {
        if (username === bot.username) return
        if (message === 'eat') {
            bot.autoEat.eat()
        }
    })

}
module.exports = autoEat;