function Lookatme(bot) {
    bot.on('physicTick', () => {
        if (bot.pvp.target) return
        if (bot.pathfinder.isMoving()) return

        const filter = e => e.name !== 'player'
        const entity = bot.nearestEntity(filter)

        if (entity) {
            bot.lookAt(entity.position.offset(0, entity.height, 0))
        }
    })
}
module.exports = Lookatme