import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { ShowRules } from "../../gui/showrules/showrules.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the showrules command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} showrulesBoolean - The status of the showrules module.
 * @param {boolean} setting - The status of the showrules custom command setting.
 */
function showrulesHelp(player: Player, prefix: string, showrulesBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = showrulesBoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: showrules`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: showrules [options]`,
        `§4[§6Description§4]§f: Toggles showing the rules when the player loads in for the first time.`,
        `§4[§6Options§4]§f:`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of ShowRules module§4]§f`,
        `    -e, --enable`,
        `       §4[§7Enable ShowRules module§4]§f`,
        `    -d, --disable`,
        `       §4[§7Disable ShowRules module§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}showrules --help`,
        `    ${prefix}showrules --status`,
        `    ${prefix}showrules --enable`,
        `    ${prefix}showrules --disable`,
    ]);
}

/**
 * @name showrules
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function showrules(message: ChatSendAfterEvent, args: string[]): void {
    handleShowRules(message, args).catch((error) => {
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
 * Handles the showrules command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleShowRules(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/showrules.js:36)`);
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
                showrulesHelp(player, prefix, configuration.modules.showrules.enabled, configuration.customcommands.showrules);
                break;
            case "-s":
            case "--status":
                // Display current status of ShowRules module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ShowRules module is currently ${configuration.modules.showrules.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable ShowRules module
                if (!configuration.modules.showrules.enabled) {
                    configuration.modules.showrules.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f ${player.name}§f has enabled §6ShowRules§f!`);
                    ShowRules();
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ShowRules module is already enabled`);
                }
                break;
            case "-d":
            case "--disable":
                // Disable ShowRules module
                if (configuration.modules.showrules.enabled) {
                    configuration.modules.showrules.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f ${player.name}§f has disabled §4ShowRules§f!`);
                } else {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f ShowRules module is already disabled`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}showrules --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}showrules --help for command usage.`);
    }
}
