import { world, MinecraftEffectTypes, EntityMovementComponent, system } from "@minecraft/server";
import { flag } from "../../../util.js";
import config from "../../../data/config.js";
import { dynamicPropertyRegistry } from "../../worldinitializeevent/registry.js";

function invalidsprinta(id: number) {
    // Get Dynamic Property
    const invalidSprintABoolean = dynamicPropertyRegistry.get("invalidsprinta_b");

    // Unsubscribe if disabled in-game
    if (invalidSprintABoolean === false) {
        system.clearRunSchedule(id);
        return;
    }
    // run as each player
    for (const player of world.getPlayers()) {
        // Get unique ID
        const uniqueId = dynamicPropertyRegistry.get(player.scoreboard.id);

        // Skip if they have permission
        if (uniqueId === player.name) {
            continue;
        }
        const speedcheck = player.getComponent("minecraft:movement") as EntityMovementComponent;
        // Check the players current speed and see if it is equal or more than the value we have hardcoded
        // If they do have the effect for blindness and they are sprinting then we flag and reset their speed.
        if (speedcheck.current >= config.modules.invalidsprintA.speed && player.getEffect(MinecraftEffectTypes.blindness)) {
            const speedrecord = speedcheck.current;
            flag(player, "InvalidSprint", "A", "Movement", null, null, "BlindSprint", speedrecord.toFixed(3), true, null);
            speedcheck.setCurrent(speedcheck.value);
        }
    }
    return;
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export function InvalidSprintA() {
    const invalidSprintAId = system.runSchedule(() => {
        invalidsprinta(invalidSprintAId);
    }, 40);
}
