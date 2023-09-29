import { world, system, Vector3 } from "@minecraft/server";
import { getGamemode } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";

async function spawnProtection(id: number) {
    // Get Dynamic Property
    const spawnProtectionBoolean = dynamicPropertyRegistry.get("spawnProtection_b");

    // Unsubscribe if disabled in-game
    if (!spawnProtectionBoolean) {
        system.clearRun(id);
        return;
    }
    //Center of world spawn.
    const centerXYZ: Vector3 = dynamicPropertyRegistry.get("spawnProtection_V3") as Vector3;
    //The Radius to check within
    const radius: number = dynamicPropertyRegistry.get("spawnProtection_Radius") as number;

    const players = world.getPlayers();
    for (const player of players) {
        const uniqueId = dynamicPropertyRegistry.get(player?.id);
        // Skip if they have permission
        if (uniqueId === player.name) {
            continue;
        }

        if (player.dimension.id === "minecraft:overworld") {
            const { x, y, z } = player.location;
            const distance: number = Math.sqrt(Math.pow(x - centerXYZ.x, 2) + Math.pow(y - centerXYZ.y, 2) + Math.pow(z - centerXYZ.z, 2));

            if (distance <= radius) {
                let currentGamemode = getGamemode(player);
                if (currentGamemode !== "adventure") {
                    await player.runCommandAsync(`/gamemode a @s`);
                }
            } else {
                let currentGamemode = getGamemode(player);
                if (currentGamemode !== "survival") {
                    await player.runCommandAsync(`/gamemode s @s`);
                }
            }
        }
    }
}

export function SpawnProtection() {
    const spawnProtectionId = system.runInterval(() => {
        spawnProtection(spawnProtectionId);
    }, 40);
}
