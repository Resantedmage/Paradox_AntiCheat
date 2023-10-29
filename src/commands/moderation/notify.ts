import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

function notifyHelp(player: Player, prefix: string, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: notify`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: notify [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Toggles cheat notifications like a toggle.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}notify`,
        `        §4- §6Toggle cheat notifications§f`,
        `    ${prefix}notify help`,
        `        §4- §6Show command help§f`,
    ]);
}

/**
 * @name notify
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function notify(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/notify.js:26)");
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.notify) {
        return notifyHelp(player, prefix, configuration.customcommands.notify);
    }

    const tagBoolean = player.hasTag("notify");

    // Disable
    if (tagBoolean) {
        player.removeTag("notify");
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You have disabled cheat notifications.`);
    }

    // Enable
    if (!tagBoolean) {
        player.addTag("notify");
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You have enabled cheat notifications.`);
    }
}
