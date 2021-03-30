const { goals: { GoalBlock} } = require('mineflayer-pathfinder');

function Guard(bot) {
    var guardPos = null;

    function guardArea(pos) {
        guardPos = pos
        // We we are not currently in combat, move to the guard pos
        if (!bot.pvp.target) {
            moveToGuardPos()
        }
    }
    function moveToGuardPos() {
        bot.pathfinder.setGoal(new GoalBlock(guardPos.x, guardPos.y, guardPos.z))
    }
    function stopGuarding() {
        guardPos = null
        bot.pvp.stop()
        bot.pathfinder.setGoal(null)
    }

    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        switch (message) {
            case 'guard here':
                const player = bot.players[username]
                if (!player) {
                    bot.whisper(username, "I can't see you.")
                    return
                }
                bot.whisper(username, 'I will guard that location.')
                guardArea(player.entity.position)
                break
            case 'chill':
                bot.whisper(username, 'I will no longer guard this area.')
                stopGuarding()
                break
        }
    })
    function ready() {
        const sword = bot.inventory.items().find(item => item.name.includes('sword'))
        if (sword) bot.equip(sword, 'hand')
        const shield = bot.inventory.items().find(item => item.name.includes('shield'))
        if (shield) bot.equip(shield, 'off-hand')
    }
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return
        setTimeout(() => {
            const sword = bot.inventory.items().find(item => item.name.includes('sword'))
            if (sword) bot.equip(sword, 'hand')
        }, 150)
    })
    bot.on('playerCollect', (collector, itemDrop) => {
        if (collector !== bot.entity) return
        setTimeout(() => {
            const shield = bot.inventory.items().find(item => item.name.includes('shield'))
            if (shield) bot.equip(shield, 'off-hand')
        }, 250)
    })
    bot.on('physicsTick', () => {
        if (!guardPos) return // Do nothing if bot is not guarding anything

        // Only look for mobs within 16 blocks
        const filter = e => e.type === 'mob' && e.kind === 'Hostile mobs' && e.position.distanceTo(bot.entity.position) < 16 &&
            e.mobType !== 'Armor Stand' // Mojang classifies armor stands as mobs for some reason?

        const entity = bot.nearestEntity(filter)
        if (entity) {
            ready()
            // Start attacking
            bot.pvp.attack(entity)
        }
    })
    bot.on('stoppedAttacking', () => {
        if (guardPos) {
            moveToGuardPos()
        }
    })


}

module.exports = Guard;