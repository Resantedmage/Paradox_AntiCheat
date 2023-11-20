import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { SpawnProtection } from "../../penrose/TickEvent/spawnprotection/spawnProtection.js";
import ConfigInterface from "../../interfaces/Config.js";

function spawnprotectionHelp(player: Player, prefix: string, spawnProtectionBoolean: boolean, setting: boolean) {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = spawnProtectionBoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: spawnprotection`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: spawnprotection [options]`,
        `§4[§6Description§4]§f: Toggles area protection to limit building/mining.`,
        `§4[§6Options§4]§f:`,
        `    -d, --disable`,
        `       §4[§7Disable spawn protection§4]§f`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of stackBan module§4]§f`,
        `    <x> <y> <z> <r>`,
        `       §4[§7Set spawn protection with center coordinates (x, y, z) and radius (r)§4]§f`,
        `    ~ ~ ~ <r>`,
        `       §4[§7Set spawn protection with player's location and radius (r)§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}spawnprotection --disable`,
        `    ${prefix}spawnprotection --help`,
        `    ${prefix}spawnprotection --status`,
        `    ${prefix}spawnprotection 54 69 -16 90`,
        `    ${prefix}spawnprotection ~ ~ ~ 90`,
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
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if (!argCheck || ["--help", "-h"].includes(args[0].toLowerCase()) || !configuration.customcommands.spawnprotection) {
        return spawnprotectionHelp(player, prefix, configuration.modules.spawnprotection.enabled, configuration.customcommands.spawnprotection);
    }

    if (argCheck && ["--disable", "-d"].includes(args[0].toLowerCase())) {
        // Deny
        configuration.modules.spawnprotection.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Spawn Protection§f!`);
        return;
    }

    if (argCheck && ["--status", "-s"].includes(args[0].toLowerCase())) {
        // Display current status of SpawnProtection module
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f SpeedA module is currently ${configuration.modules.spawnprotection.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
        return;
    }

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
    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
    const messageAction = configuration.modules.spawnprotection.enabled ? "has updated" : "has enabled";
    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f ${messageAction} §6Spawn Protection§f!`);
    SpawnProtection();
    return;
}
