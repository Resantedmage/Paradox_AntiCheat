import { world, PlayerPlaceBlockBeforeEvent, Vector3 } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { AfterReachA } from "../../PlayerPlaceBlockAfterEvent/reach/reach_a.js";

const blockPlaceReachData = new Map<string, { blockLocation: Vector3; playerLocation: Vector3 }>();

function beforereacha(object: PlayerPlaceBlockBeforeEvent) {
    // Get Dynamic Property
    const reachABoolean = dynamicPropertyRegistry.get("reacha_b");

    // Unsubscribe if disabled in-game
    if (reachABoolean === false) {
        world.beforeEvents.playerPlaceBlock.unsubscribe(beforereacha);
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

    // Call the After Event
    AfterReachA(blockPlaceReachData);
}

const BeforeReachA = () => {
    world.beforeEvents.playerPlaceBlock.subscribe(beforereacha);
};

export { BeforeReachA };
