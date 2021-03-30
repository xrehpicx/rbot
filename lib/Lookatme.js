function Lookatme(bot) {
    bot.on('physicTick', () => {
        if (bot.pvp.target) return
        if (bot.pathfinder.isMoving()) return

        const entity = bot.nearestEntity()
        if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
    })
}
module.exports = Lookatme