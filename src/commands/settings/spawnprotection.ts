import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { SpawnProtection } from "../../penrose/TickEvent/spawnprotection/spawnProtection.js";
import ConfigInterface from "../../interfaces/Config.js";

function spawnprotectionHelp(player: Player, prefix: string, spawnProtectionBoolean: boolean, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
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
        `§4[§6Description§4]§f: Toggles area protection to limit building/mining.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}spawnprotection disable`,
        `    ${prefix}spawnprotection help`,
        `    ${prefix}spawnprotection 54 69 -16 90`,
        `    ${prefix}spawnprotection ~ ~ ~ 90`,
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
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    // Get Dynamic Property Boolean
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if (!argCheck || (argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.spawnprotection) {
        return spawnprotectionHelp(player, prefix, configuration.modules.spawnprotection.enabled, configuration.customcommands.spawnprotection);
    }

    if (configuration.modules.spawnprotection.enabled === false || (configuration.modules.spawnprotection.enabled === true && argCheck && args[0].toLowerCase() !== "disable")) {
        // Allow
        if (args.length < 4) {
            return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid arguments provided. Please include x y z radius, for example: 10 64 -10 90.`);
        }

        let [x, y, z, radius] = args.slice(0, 4).map((arg) => (arg === "~" ? arg : parseFloat(arg)));

        if ((x !== "~" && isNaN(x as number)) || (y !== "~" && isNaN(y as number)) || (z !== "~" && isNaN(z as number)) || isNaN(radius as number)) {
            return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid arguments provided. Please make sure x, y, z, and radius are valid numbers.`);
        }

        if (x === "~") {
            x = Math.ceil(player.location.x);
        }
        if (y === "~") {
            y = Math.ceil(player.location.y);
        }
        if (z === "~") {
            z = Math.ceil(player.location.z);
        }

        const vector3 = { x: x, y: y, z: z };
        configuration.modules.spawnprotection.enabled = true;
        configuration.modules.spawnprotection.vector3 = vector3;
        configuration.modules.spawnprotection.radius = Math.abs(radius as number);
        dynamicPropertyRegistry.setProperty(undefined, "config", configuration);
        const messageAction = configuration.modules.spawnprotection.enabled ? "has updated" : "has enabled";
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f ${messageAction} §6Spawn Protection§f!`);
        SpawnProtection();
        return;
    }

    if (argCheck && args[0].toLowerCase() === "disable") {
        // Deny
        configuration.modules.spawnprotection.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "config", configuration);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Spawn Protection§f!`);
    }
}
