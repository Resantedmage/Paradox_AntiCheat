import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { OPS } from "../../penrose/TickEvent/oneplayersleep/oneplayersleep.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the ops command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} opsBoolean - The status of the OPS module.
 * @param {boolean} setting - The status of the ops custom command setting.
 */
function opsHelp(player: Player, prefix: string, opsBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = opsBoolean ? "§6[§4DISABLED§6]§f" : "§6[§aENABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: ops`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: ops [options]`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of OPS module`,
        `    -e, --enable    Enable OPS module`,
        `    -d, --disable   Disable OPS module`,
        `§4[§6Description§4]§f: Toggles One Player Sleep (OPS) for all online players.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}ops --help`,
        `    ${prefix}ops --status`,
        `    ${prefix}ops --enable`,
        `    ${prefix}ops --disable`,
    ]);
}

/**
 * @name ops
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function ops(message: ChatSendAfterEvent, args: string[]) {
    handleOps(message, args).catch((error) => {
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
 * Handles the ops command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleOps(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/oneplayersleep.js:36)`);
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
                opsHelp(player, prefix, configuration.modules.ops.enabled, configuration.customcommands.ops);
                break;
            case "-s":
            case "--status":
                // Display current status of OPS module
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f OPS module is currently ${configuration.modules.ops.enabled ? "§aENABLED" : "§4DISABLED"}§f.`);
                break;
            case "-e":
            case "--enable":
                // Enable OPS module
                if (configuration.modules.ops.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f OPS module is already enabled`);
                } else {
                    configuration.modules.ops.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6OPS§f!`);
                    OPS();
                }
                break;
            case "-d":
            case "--disable":
                // Disable OPS module
                if (!configuration.modules.ops.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f OPS module is already disabled`);
                } else {
                    configuration.modules.ops.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4OPS§f!`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid argument. Use ${prefix}ops --help for command usage.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}ops --help for command usage.`);
    }
}
