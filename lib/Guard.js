const { goals: { GoalBlock, GoalFollow } } = require('mineflayer-pathfinder');

function Guard(bot) {

    const modeoptions = {};

    function guardArea(pos, radius = 16) {
        modeoptions.pos = pos
        modeoptions.guard = true;
        modeoptions.radius = radius;
        // We we are not currently in combat, move to the guard pos
        if (!bot.pvp.target) {
            moveToGuardPos()
        }
    }
    function guardEntity(entity) {
        if (!entity || !entity.position) return console.log('cant find entiry');
        modeoptions.entity = entity;
        modeoptions.guard = true;
        modeoptions.radius = 10;

        followGuardEntity()
    }

    function moveToGuardPos() {
        modeoptions.pos && bot.pathfinder.setGoal(new GoalBlock(modeoptions.pos.x, modeoptions.pos.y, modeoptions.pos.z))
    }
    function followGuardEntity() {
        const goal = new GoalFollow(modeoptions.entity, 3)
        bot.pathfinder.setGoal(goal, true)
    }
    function stopGuarding() {
        modeoptions.guard = false;
        bot.pvp.stop()
        bot.pathfinder.setGoal(null)
    }

    bot.on('whisper', (username, _, message) => {
        // if (username === bot.username) return
        const player = bot.players[username]
        switch (message) {
            case 'kill':
                // if (!player || !player.entity) {
                //     bot.whisper(username, "I can't see you.")
                //     return
                // }
                if (username === 'admin') {
                    bot.whisper(username, 'I will kill, ANYTHING I SEE')
                    bot.chat('I will kill, ANYTHING I SEE')
                    guardArea(bot.entity.position, 10)
                }
                break
            case 'guard here':
                if (!player || !player.entity) {
                    bot.whisper(username, "I can't see you.")
                    return
                }
                bot.whisper(username, 'I will guard that location.')
                guardArea(player.entity.position)
                break
            case 'guard me':
                if (!player || !player.entity) {
                    bot.whisper(username, "I can't see you.")
                    return
                }
                bot.whisper(username, 'comming')
                // guardArea(player.entity.position)
                guardEntity(player.entity)
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
        if (!modeoptions.guard) return // Do nothing if bot is not guarding anything
        // Only look for mobs within 16 blocks
        const filter = e => e.type === 'mob' && e.kind === 'Hostile mobs' && e.position.distanceTo(bot.entity.position) < modeoptions.radius &&
            e.mobType !== 'Armor Stand'

        const entity = bot.nearestEntity(filter)
        if (entity) {
            ready()
            // Start attacking
            bot.pvp.attack(entity)
        }
    })
    bot.on('stoppedAttacking', () => {
        if (modeoptions.guard && modeoptions.entity) {
            followGuardEntity()
            return
        }
        if (modeoptions.guard) {
            moveToGuardPos()
        }
    })


}

module.exports = Guard;