import m from 'minecraft-data'
const mcData = m("1.16.5")

export default {
    observe({bot, stateMachine}) {
        bot.on('chat', (username, message) => {
          stateMachine.states[1].command = message
          if(message.startsWith('target')) {
            const player = bot.players[message.split(' ')[1]]
            if(!player) {
              bot.chat("Wan't see the player.")
              return
            }
            bot.pvp.attack(player.entity)
          }
            
          if (message === 'stop')
              bot.pvp.stop()
              
          if (message == 'sayItems')
              sayItems()
            
          if(message.startsWith('equip'))
              equip(message.split(' ')[1], message.split(' ')[2])
            
        })

        function equip(item_name, slot) {
            let itemsByName
            if (bot.supportFeature('itemsAreNotBlocks')) {
                itemsByName = 'itemsByName'
              } else if (bot.supportFeature('itemsAreAlsoBlocks')) {
                itemsByName = 'blocksByName'
              }
              bot.equip(mcData[itemsByName][item_name].id, slot, (err) => {
                if (err) {
                  bot.chat(`unable to equip: ${err.message}`)
                } else {
                  bot.chat('Done !')
                }
              })
        }

        function sayItems (items = bot.inventory.items()) {
            const output = items.map(itemToString).join(', ')
            if (output) {
                bot.chat(output)
            } else {
                bot.chat('empty')
            }
        }

        function itemToString (item) {
            if (item) {
              return `${item.name} x ${item.count}`
            } else {
              return '(nothing)'
            }
        }
    }
}