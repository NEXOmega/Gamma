import prompt from 'prompt'

export const BehaviorWaitingCommands = (function() {
    function BehaviorWaitingCommands(bot, targets) {
        this.bot = bot
        this.command = ''
        this.active = false
        this.targets = targets
        this.stateName = 'Wait Command'
    }

    BehaviorWaitingCommands.prototype.onStateEntered = function () {
        console.log(`${this.bot.username} has entered the ${this.stateName} state.`);
    };
    BehaviorWaitingCommands.prototype.onStateExited = function () {
        console.log(`${this.bot.username} has leave the ${this.stateName} state.`);
        if(this.command.startsWith('kill'))
            this.targets.entity = getEntityFromPlayerName(this.bot, this.command.split(' ')[1])
        
        this.command = ''
    };
    function getEntityFromPlayerName(bot, name) {
       for (const entityName of Object.keys(bot.entities)) {
            const entity = bot.entities[entityName]
            if(entity.username == name) 
                return entity
       }
    }
    return BehaviorWaitingCommands;
}());