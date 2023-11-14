import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { BeforeReachA } from "../../penrose/PlayerPlaceBlockBeforeEvent/reach/reach_a.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the reacha command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} reachABoolean - The status of the reachA module.
 * @param {boolean} setting - The status of the reacha custom command setting.
 */
function reachAHelp(player: Player, prefix: string, reachABoolean: boolean, setting: boolean) {
    // Determine the status of the command and module
    const commandStatus = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus = reachABoolean ? "§6[§4DISABLED§6]§f" : "§6[§aENABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: reacha`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: reacha [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of ReachA module`,
        `    -e, --enable    Enable ReachA module`,
        `    -d, --disable   Disable ReachA module`,
        `§4[§6Description§4]§f: Toggles checks for a player placing blocks beyond reach.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}reacha --help`,
        `    ${prefix}reacha --status`,
        `    ${prefix}reacha --enable`,
        `    ${prefix}reacha --disable`,
    ]);
}

/**
 * @name reachA
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function reachA(message: ChatSendAfterEvent, args: string[]) {
    handleReachA(message, args).catch((error) => {
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
 * Handles the reacha command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleReachA(message: ChatSendAfterEvent, args: string[]) {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/reacha.js:36)`);
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
            case "-h":
            case "--help":
                // Display help message
                reachAHelp(player, prefix, configuration.modules.reachA.enabled, configuration.customcommands.reacha);
                break;
            case "-s":
            case "--status":
                // Display current status of ReachA module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachA module is currently ${configuration.modules.reachA.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable ReachA module
                if (!configuration.modules.reachA.enabled) {
                    configuration.modules.reachA.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6ReachA§f!`);
                    BeforeReachA();
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachA module is already enabled`);
                }
                break;
            case "-d":
            case "--disable":
                // Disable ReachA module
                if (configuration.modules.reachA.enabled) {
                    configuration.modules.reachA.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4ReachA§f!`);
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ReachA module is already disabled`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}reacha --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}reacha --help for command usage.`);
    }
}
