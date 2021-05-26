import m from 'minecraft-data'
const mcData = m("1.16.5")

export const BehaviorAttackState = (function(){
    function BehaviorAttackState(bot, targets)
    {
        this.bot = bot;
        this.targets = targets;
        this.active = false;
        this.stateName = 'Attack Player';
    }

    BehaviorAttackState.prototype.onStateEntered = function () {
        console.log(`${this.bot.username} has entered the ${this.stateName} state.`);
        this.bot.pvp.attack(this.targets.entity)
    };
    BehaviorAttackState.prototype.onStateExited = function () {
        console.log(`${this.bot.username} has left the ${this.stateName} state.`);
        this.bot.pvp.stop()
    };

    return BehaviorAttackState;
}());

export const BehaviorStuffingState = (function() {
    function BehaviorStuffingState(bot) {
        this.bot = bot
        this.active = false
        this.stuffed = false;
        this.stateName = 'Equipping State'
    }

    BehaviorStuffingState.prototype.onStateEntered = function () {
        for(var item in this.bot.inventory.items()) {
            item = this.bot.inventory.items()[item]
            equip(this.bot, item.name)
        }
        this.stuffed = true;
    }

    BehaviorStuffingState.prototype.onStateExited = function () {
        this.stuffed = false
    }

    function equip(bot, item_name) {
        var tiers = ['netherite', 'diamond', 'iron', 'gold', 'stone', 'wooden']
        var item_car = item_name.split('_')
        console.log(`${item_car[0]}  ${item_car[1]} ${get_slot(item_car[1])}`)

        let itemsByName
        if (bot.supportFeature('itemsAreNotBlocks')) {
            itemsByName = 'itemsByName'
          } else if (bot.supportFeature('itemsAreAlsoBlocks')) {
            itemsByName = 'blocksByName'
          }
          bot.equip(mcData[itemsByName][item_name].id, get_slot(item_car[1]))
    }

    function get_slot(equipement) {
        switch (equipement) {
            case 'helmet': return 'head';
            case 'chestplate': return 'torso';
            case 'leggings': return 'legs';
            case 'boots': return 'feet';
            case 'sword': return 'hand';
        }
    }
    return BehaviorStuffingState;
}())