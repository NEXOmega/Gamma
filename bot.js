// Create your bot
import mineflayer from "mineflayer"
import pathfinder from "mineflayer-pathfinder"
import pvp from 'mineflayer-pvp'
import logger from 'pino'

const bot = mineflayer.createBot({ username: "Emerl" });

// Load your dependency plugins.
bot.loadPlugin(pathfinder.pathfinder);
bot.loadPlugin(pvp.plugin)

import pvpStateMachine from './src/stateMachines/pvpStateMachine.js'
import {BehaviorWaitingCommands} from './src/behaviors/behaviorCommandController.js'

import bot_commands from './src/commands.js'

// Import required behaviors.
import {
    StateTransition,
    BotStateMachine,
    BehaviorPrintServerStats,
    NestedStateMachine,
    StateMachineWebserver } from "mineflayer-statemachine";


// wait for our bot to login.
bot.once("spawn", () =>
{
     // This targets object is used to pass data between different states. It can be left empty.
     const targets = {};

    // Create our states
    const behaviorPrintServerStats = new BehaviorPrintServerStats(bot)
    const behaviorWaitingCommands = new BehaviorWaitingCommands(bot, targets)
    const pvpState = pvpStateMachine.pvpStateMachine(bot, targets)

    // Create our transitions
    const transitions = [

        // We want to start following the player immediately after finding them.
        // Since getClosestPlayer finishes instantly, shouldTransition() should always return true.
        new StateTransition({
            parent: behaviorPrintServerStats,
            child: behaviorWaitingCommands,
            name: 'Waiting Instruction',
            shouldTransition: () => true,
        }),

        new StateTransition({
            parent: behaviorWaitingCommands,
            child: pvpState,
            name: 'Attack Player',
            shouldTransition: () => behaviorWaitingCommands.command.startsWith('kill'),
        }),

        new StateTransition({
            parent: pvpState,
            child: behaviorWaitingCommands,
            name: 'End Attacking',
            shouldTransition: () => pvpState.isFinished(),
        }),
    ];

    // Now we just wrap our transition list in a nested state machine layer. We want the bot
    // to start on the getClosestPlayer state, so we'll specify that here.
    const rootLayer = new NestedStateMachine(transitions, behaviorPrintServerStats);
    rootLayer.stateName = "Root"
    // We can start our state machine simply by creating a new instance.
    var stateMachine = new BotStateMachine(bot, rootLayer);

    const webserver = new StateMachineWebserver(bot, stateMachine);
    webserver.startServer();    

    function create_context() {
        return {
            bot,
            logger,
            stateMachine
        }
    }
    
    async function observe_bot(context) {
        bot_commands.observe(context)
    }
    
    const context = create_context()
    observe_bot(context)
    
});

