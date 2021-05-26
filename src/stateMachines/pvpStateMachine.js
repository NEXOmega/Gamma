
import {
    StateTransition,
    BehaviorFollowEntity,
    BehaviorIdle,
    NestedStateMachine } from "mineflayer-statemachine";
import {BehaviorAttackState, BehaviorStuffingState} from '../behaviors/pvpBehaviors.js'

export default {
    pvpStateMachine(bot, targets) {

        const enter = new BehaviorIdle();
        enter.stateName = "Start Attacking"
        const exit = new BehaviorIdle();
        exit.stateName = "End Attacking"
        const equipBot = new BehaviorStuffingState(bot)
        const followPlayer = new BehaviorFollowEntity(bot, targets);
        followPlayer.stateName = "Follow Player"
        const attackPlayer = new BehaviorAttackState(bot, targets)

        const transitions = [
            new StateTransition({
                parent: enter,
                child: equipBot,
                name: 'Start Equipping',
                shouldTransition: () => true,
            }),
            new StateTransition({
                parent: equipBot,
                child: followPlayer,
                name: 'Follow Player',
                shouldTransition: () => equipBot.stuffed,
            }),
            // If the distance to the player is less than two blocks, switch from the followPlayer
            // state to the lookAtPlayer state.
            new StateTransition({
                parent: followPlayer,
                child: attackPlayer,
                name: 'Attack Player',
                shouldTransition: () => followPlayer.distanceToTarget() < 3,
            }),

            // If the distance to the player is more than two blocks, switch from the lookAtPlayer
            // state to the followPlayer state.
            new StateTransition({
                parent: attackPlayer,
                child: followPlayer,
                name: 'Follow Player',
                shouldTransition: () => followPlayer.distanceToTarget() >= 3,
            }),

            new StateTransition({
                parent: attackPlayer,
                child: exit,
                name: 'End Attack',
                shouldTransition: () => !bot.pvp.target,
            })
        ]
        const stateMachine =  new NestedStateMachine(transitions, enter, exit);
        stateMachine.stateName = "PVP"
        return stateMachine;
    }
}