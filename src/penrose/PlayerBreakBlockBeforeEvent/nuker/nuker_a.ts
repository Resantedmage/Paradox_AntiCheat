import { PlayerBreakBlockBeforeEvent, PlayerLeaveAfterEvent, world } from "@minecraft/server";
import { AfterNukerA } from "../../PlayerBreakBlockAfterEvent/nuker/nuker_a";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry";

const breakData = new Map<string, { breakCount: number; lastBreakTimeBefore: number }>();

let antiNukerABoolean: boolean = dynamicPropertyRegistry.get("antinukera_b") as boolean; // Initialize

function onPlayerLogout(event: PlayerLeaveAfterEvent): void {
    // Remove the player's data from the map when they log off
    const playerName = event.playerId;
    breakData.delete(playerName);

    if (!antiNukerABoolean) {
        // Unsubscribe from the playerLeave event
        world.afterEvents.playerLeave.unsubscribe(onPlayerLogout);
    }
}

async function beforenukera(object: PlayerBreakBlockBeforeEvent): Promise<void> {
    antiNukerABoolean = dynamicPropertyRegistry.get("antinukera_b") as boolean;
    if (antiNukerABoolean === false) {
        breakData.clear();
        world.beforeEvents.playerBreakBlock.unsubscribe(beforenukera);
        return;
    }

    const { player } = object;
    const playerID = player?.id;

    const uniqueId = dynamicPropertyRegistry.get(playerID);
    if (uniqueId === player.name) {
        return;
    }

    // Retrieve or initialize break data for the player
    const playerBreakData = breakData.get(playerID) || { breakCount: 0, lastBreakTime: 0 };

    // Increment break count and update last break time
    const updatedBreakData = {
        ...playerBreakData,
        breakCount: playerBreakData.breakCount + 1,
        lastBreakTimeBefore: Date.now(),
    };

    // Store the updated break data
    breakData.set(playerID, updatedBreakData);
}

const BeforeNukerA = () => {
    AfterNukerA(breakData);
    world.beforeEvents.playerBreakBlock.subscribe((object) => {
        beforenukera(object).catch((error) => {
            console.error("Paradox Unhandled Rejection: ", error);
            // Extract stack trace information
            if (error instanceof Error) {
                const stackLines = error.stack.split("\n");
                if (stackLines.length > 1) {
                    const sourceInfo = stackLines;
                    console.error("Error originated from:", sourceInfo[0]);
                }
            }
        });
    });
    world.afterEvents.playerLeave.subscribe(onPlayerLogout);
};

export { BeforeNukerA };
