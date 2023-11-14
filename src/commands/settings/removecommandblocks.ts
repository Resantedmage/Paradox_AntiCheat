import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ScoreManager } from "../../classes/ScoreManager.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the removecb command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {number} commandblocksscore - The current score for the 'commandblocks' objective.
 * @param {boolean} setting - The status of the removecommandblocks custom command setting.
 */
function removeCBEHelp(player: Player, prefix: string, commandblocksscore: number, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = commandblocksscore <= 0 ? "§6[§4DISABLED§6]§f" : "§6[§aENABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: removecb`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: removecb [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of Anti Command Blocks module`,
        `    -e, --enable    Enable Anti Command Blocks module`,
        `    -d, --disable   Disable Anti Command Blocks module`,
        `§4[§6Description§4]§f: Toggles Anti Command Blocks (Clears all when enabled).`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}removecb --help`,
        `    ${prefix}removecb --status`,
        `    ${prefix}removecb --enable`,
        `    ${prefix}removecb --disable`,
    ]);
}

/**
 * @name removecb
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function removecb(message: ChatSendAfterEvent, args: string[]): void {
    handleRemoveCB(message, args).catch((error) => {
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
 * Handles the removecb command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleRemoveCB(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/removeCommandBlocks.js:33)`);
    }

    const player: Player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const commandblocksscore: number = ScoreManager.getScore("commandblocks", player);

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
                removeCBEHelp(player, prefix, commandblocksscore, configuration.customcommands.removecommandblocks);
                break;
            case "-s":
            case "--status":
                // Display current status of Anti Command Blocks module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Anti Command Blocks module is currently ${commandblocksscore <= 0 ? "§4DISABLED" : "§aENABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable Anti Command Blocks module
                if (commandblocksscore <= 0) {
                    player.runCommand(`scoreboard players set paradox:config commandblocks 1`);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6Anti Command Blocks§f!`);
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Anti Command Blocks module is already enabled`);
                }
                break;
            case "-d":
            case "--disable":
                // Disable Anti Command Blocks module
                if (commandblocksscore <= 0) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Anti Command Blocks module is already disabled`);
                } else {
                    player.runCommand(`scoreboard players set paradox:config commandblocks 0`);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Anti Command Blocks§f!`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}removecb --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}removecb --help for command usage.`);
    }
}
