import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player, world } from "@minecraft/server";
import { IllegalItemsA } from "../../penrose/TickEvent/illegalitems/illegalitems_a.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the illegalitemsA command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} illegalItemsABoolean - The status of the illegalItemsA module.
 * @param {boolean} setting - The status of the illegalItemsA custom command setting.
 */
function illegalItemsAHelp(player: Player, prefix: string, illegalItemsABoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = illegalItemsABoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: illegalitemsa`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: illegalitemsa [options]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Options§4]§f:`,
        `    -h, --help      Display this help message`,
        `    -s, --status    Display the current status of IllegalItemsA module`,
        `    -e, --enable    Enable IllegalItemsA module`,
        `    -d, --disable   Disable IllegalItemsA module`,
        `§4[§6Description§4]§f: Toggles checks for players who have illegal items in their inventory.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}illegalitemsa --help`,
        `    ${prefix}illegalitemsa --status`,
        `    ${prefix}illegalitemsa --enable`,
        `    ${prefix}illegalitemsa --disable`,
    ]);
}

/**
 * Handles the illegalitemsA command.
 * @name illegalitemsA
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function illegalitemsA(message: ChatSendAfterEvent, args: string[]) {
    handleIllegalItemsA(message, args).catch((error) => {
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
 * Handles the execution of the illegalitemsA command.
 * @param {ChatSendAfterEvent} message - The message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleIllegalItemsA(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + `Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/illegalitemsa.js:36)`);
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
                return illegalItemsAHelp(player, prefix, configuration.modules.illegalitemsA.enabled, configuration.customcommands.illegalitemsa);
            case "-s":
            case "--status":
                // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f IllegalItemsA module is currently ${configuration.modules.illegalitemsA.enabled ? "enabled" : "disabled"}`);
                break;
            case "-e":
            case "--enable":
                // Handle enable flag
                if (configuration.modules.illegalitemsA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f IllegalItemsA module is already enabled.`);
                } else {
                    configuration.modules.illegalitemsA.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    const nohasTag = world.getPlayers({ excludeTags: ["illegalitemsA"] });
                    for (const temp of nohasTag) {
                        temp.addTag("illegalitemsA");
                    }
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6IllegalItemsA§f!`);
                    IllegalItemsA();
                }
                break;
            case "-d":
            case "--disable":
                // Handle disable flag
                if (!configuration.modules.illegalitemsA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f IllegalItemsA module is already disabled.`);
                } else {
                    configuration.modules.illegalitemsA.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    const hasTag = world.getPlayers({ tags: ["illegalitemsA"] });
                    for (const temp of hasTag) {
                        temp.removeTag("illegalitemsA");
                    }
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4IllegalItemsA§f!`);
                }
                break;
            default:
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}illegalitemsa --help for more information.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}illegalitemsa --help for more information.`);
    }
}
