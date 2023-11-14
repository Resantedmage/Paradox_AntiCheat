import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { ReachB } from "../../penrose/EntityHitEntityAfterEvent/reach_b.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the reachb command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} reachBBoolean - The status of the reachB module.
 * @param {boolean} setting - The status of the reachb custom command setting.
 */
function reachBHelp(player: Player, prefix: string, reachBBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = reachBBoolean ? "§6[§4DISABLED§6]§f" : "§6[§aENABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: reachb`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: reachb [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of ReachB module`,
        `    -e, --enable    Enable ReachB module`,
        `    -d, --disable   Disable ReachB module`,
        `§4[§6Description§4]§f: Toggles checks for a player's attacking beyond reach.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}reachb --help`,
        `    ${prefix}reachb --status`,
        `    ${prefix}reachb --enable`,
        `    ${prefix}reachb --disable`,
    ]);
}

/**
 * @name reachB
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function reachB(message: ChatSendAfterEvent, args: string[]): void {
    handleReachB(message, args).catch((error) => {
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
}

/**
 * Handles the reachb command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleReachB(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/reachb.js:36)`);
    }

    const player: Player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration: ConfigInterface = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix: string = getPrefix(player);

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg: string = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
            case "-h":
            case "--help":
                // Display help message
                reachBHelp(player, prefix, configuration.modules.reachB.enabled, configuration.customcommands.reachb);
                break;
            case "-s":
            case "--status":
                // Display current status of ReachB module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachB module is currently ${configuration.modules.reachB.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable ReachB module
                if (!configuration.modules.reachB.enabled) {
                    configuration.modules.reachB.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6ReachB§f!`);
                    ReachB();
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachB module is already enabled`);
                }
                break;
            case "-d":
            case "--disable":
                // Disable ReachB module
                if (configuration.modules.reachB.enabled) {
                    configuration.modules.reachB.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4ReachB§f!`);
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachB module is already disabled`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}reachb --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}reachb --help for command usage.`);
    }
}
