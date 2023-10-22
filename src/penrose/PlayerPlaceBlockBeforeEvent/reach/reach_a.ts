import { world, PlayerPlaceBlockBeforeEvent, Vector3, PlayerPlaceBlockAfterEvent } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { AfterReachA } from "../../PlayerPlaceBlockAfterEvent/reach/reach_a.js";

const blockPlaceReachData = new Map<string, { blockLocation: Vector3; playerLocation: Vector3 }>();

function beforereacha(object: PlayerPlaceBlockBeforeEvent) {
    // Get Dynamic Property
    const reachABoolean = dynamicPropertyRegistry.get("reacha_b");

    // Unsubscribe if disabled in-game
    if (reachABoolean === false) {
        return;
    }

    // Properties from class
    const { block, player } = object;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player?.id);

    // Skip if they have permission
    if (uniqueId === player.name) {
        return;
    }

    blockPlaceReachData.set(player.id, { blockLocation: block.location, playerLocation: player.location });
}

const BeforeReachA = () => {
    // Subscribe to the before event here
    const beforePlayerPlaceCallBack = (object: PlayerPlaceBlockBeforeEvent) => {
        beforereacha(object);
    };

    // Subscribe to the after event here
    const afterPlayerPlaceCallback = (object: PlayerPlaceBlockAfterEvent) => {
        // Call the AfterReachA function with the stored data
        AfterReachA(object, blockPlaceReachData, afterPlayerPlaceCallback, beforePlayerPlaceCallBack);
    };

    // Subscribe to the before event
    world.beforeEvents.playerPlaceBlock.subscribe(beforePlayerPlaceCallBack);

    // Subscribe to the after event
    world.afterEvents.playerPlaceBlock.subscribe(afterPlayerPlaceCallback);
};

export { BeforeReachA };
