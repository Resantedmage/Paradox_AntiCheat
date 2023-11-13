import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { NamespoofA } from "../../penrose/TickEvent/namespoof/namespoof_a.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the namespoofA command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} nameSpoofBoolean - The status of the NamespoofA module.
 * @param {boolean} setting - The status of the namespoofa custom command setting.
 */
function namespoofAHelp(player: Player, prefix: string, nameSpoofBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = nameSpoofBoolean ? "§6[§4DISABLED§6]§f" : "§6[§aENABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: namespoofa`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: namespoofa [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of NamespoofA module`,
        `    -e, --enable    Enable NamespoofA module`,
        `    -d, --disable   Disable NamespoofA module`,
        `§4[§6Description§4]§f: Toggles checks for a player's name exceeding character limitations.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}namespoofa --help`,
        `    ${prefix}namespoofa --status`,
        `    ${prefix}namespoofa --enable`,
        `    ${prefix}namespoofa --disable`,
    ]);
}

/**
 * @name namespoofA
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function namespoofA(message: ChatSendAfterEvent, args: string[]) {
    handleNamespoofA(message, args).catch((error) => {
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
 * Handles the namespoofA command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleNamespoofA(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/namespoofa.js:36)`);
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

    // Check for additional non-positional arguments
    if (args.length > 0) {
        const additionalArg = args[0].toLowerCase();

        // Handle additional arguments
        switch (additionalArg) {
            case "-h":
            case "--help":
                // Display help message
                namespoofAHelp(player, prefix, configuration.modules.namespoofA.enabled, configuration.customcommands.namespoofa);
                break;
            case "-s":
            case "--status":
                // Display current status of NamespoofA module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f NamespoofA module is currently ${configuration.modules.namespoofA.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable NamespoofA module
                if (configuration.modules.namespoofA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f NamespoofA module is already enabled`);
                } else {
                    configuration.modules.namespoofA.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6NamespoofA§f!`);
                    NamespoofA();
                }
                break;
            case "-d":
            case "--disable":
                // Disable NamespoofA module
                if (!configuration.modules.namespoofA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f NamespoofA module is already disabled`);
                } else {
                    configuration.modules.namespoofA.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4NamespoofA§f!`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}namespoofa --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}namespoofa --help for command usage.`);
    }
}
