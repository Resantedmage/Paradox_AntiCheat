import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { paradoxui } from "../../gui/paradoxui.js";
import { ShowRules } from "../../gui/showrules/showrules.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import ConfigInterface from "../../interfaces/Config.js";

function paradoxuiHelp(player: Player, prefix: string, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: paradoxui`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: paradoxui [optional]`,
        `§4[§6Optional§4]§f: help`,
        `§4[§6Description§4]§f: Shows GUI for main menu.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}paradoxui`,
        `        §4- §6Open the Paradox main menu GUI§f`,
        `    ${prefix}paradoxui help`,
        `        §4- §6Show command help§f`,
    ]);
}

/**
 * @name paradoxUI
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function paradoxUI(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/paradoxui.js:36)");
    }

    const player = message.sender;

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    //check to see if the player has the rules tag incase they have been able to call the UI command before the
    // rules have been displayed.
    if (player.hasTag("ShowRulesOnJoin") && configuration.modules.showrules.enabled === true) {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You have not agreed to the rules. Please try once these have been displayed.`);
        return ShowRules();
    }

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.paradoxiu) {
        return paradoxuiHelp(player, prefix, configuration.customcommands.paradoxiu);
    }

    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Close chat window for ParadoxUI.`);
    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has requested §6ParadoxUI§f!`);
    paradoxui(player);
}
