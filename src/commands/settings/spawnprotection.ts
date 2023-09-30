import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import config from "../../data/config.js";
import { ChatSendAfterEvent, Player, Vector, Vector3, world } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { SpawnProtection } from "../../penrose/TickEvent/spawnprotection/spawnProtection.js";

function spawnprotectionHelp(player: Player, prefix: string, spawnProtectionBoolean: string | number | boolean | Vector3) {
    let commandStatus: string;
    if (!config.customcommands.spawnprotection) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    let moduleStatus: string;
    if (spawnProtectionBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§f";
    } else {
        moduleStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: spawnprotection`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: spawnprotection [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Enables or disables the protection module when configured to prevent players building/mining within the area.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}spawnprotection disable`,
        `    ${prefix}spawnprotection help`,
        `    ${prefix}spawnprotection 54 69 -16 90`,
        `    ${prefix}spawnprotection x y z r`,
    ]);
}

/**
 * @name spawnprotection
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function spawnprotection(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/spawnprotection.js:36)");
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    // Get Dynamic Property Boolean
    const spawnProtectionBoolean = dynamicPropertyRegistry.get("spawnProtection_b") as boolean;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !config.customcommands.spawnprotection) {
        return spawnprotectionHelp(player, prefix, spawnProtectionBoolean);
    }

    if (spawnProtectionBoolean === false) {
        // Allow
        if (args.length < 4) {
            return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f invalid arguments provided please check you are supplying x y z radius, for example 10 64 -10 90`);
        }
        dynamicPropertyRegistry.set("spawnProtection_b", true);
        world.setDynamicProperty("spawnProtection_b", true);
        const vector3 = new Vector(Number(args[0]), Number(args[1]), Number(args[2]));
        dynamicPropertyRegistry.set("spawnProtection_V3", vector3);
        world.setDynamicProperty("spawnProtection_V3", vector3);
        dynamicPropertyRegistry.set("spawnProtection_Radius", Math.abs(Number(args[3])));
        world.setDynamicProperty("spawnProtection_Radius", Math.abs(Number(args[3])));
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6Spawn Protection§f!`);
        SpawnProtection();
    }
    if (argCheck && args[0].toLowerCase() === "disable") {
        // Deny
        dynamicPropertyRegistry.set("spawnProtection_b", false);
        world.setDynamicProperty("spawnProtection_b", false);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Spawn Protection§f!`);
    }
}
