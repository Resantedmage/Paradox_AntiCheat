import { BeforeChatEvent, Player, world } from "@minecraft/server";
import config from "../../data/config.js";
import { Adventure } from "../../penrose/tickevent/gamemode/adventure.js";
import { Survival } from "../../penrose/tickevent/gamemode/survival.js";
import { dynamicPropertyRegistry } from "../../penrose/worldinitializeevent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";

function allowgmsHelp(player: Player, prefix: string, survivalGMBoolean: string | number | boolean) {
    let commandStatus: string;
    if (!config.customcommands.allowgms) {
        commandStatus = "§6[§4DISABLED§6]§r";
    } else {
        commandStatus = "§6[§aENABLED§6]§r";
    }
    let moduleStatus: string;
    if (survivalGMBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§r";
    } else {
        moduleStatus = "§6[§aENABLED§6]§r";
    }
    return sendMsgToPlayer(player, [
        `\n§4[§6Command§4]§r: allowgms`,
        `§4[§6Status§4]§r: ${commandStatus}`,
        `§4[§6Module§4]§r: ${moduleStatus}`,
        `§4[§6Usage§4]§r: allowgms [optional]`,
        `§4[§6Optional§4]§r: help`,
        `§4[§6Description§4]§r: Toggles Gamemode 0 (Survival) to be used.`,
        `§4[§6Examples§4]§r:`,
        `    ${prefix}allowgms`,
        `    ${prefix}allowgms help`,
    ]);
}

/**
 * @name allowgms
 * @param {BeforeChatEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function allowgms(message: BeforeChatEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/settings/allowGMS.js:37)");
    }

    message.cancel = true;

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.get(player.scoreboard.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§r§4[§6Paradox§4]§r You need to be Paradox-Opped to use this command.`);
    }

    // Get Dynamic Property Boolean
    const adventureGMBoolean = dynamicPropertyRegistry.get("adventuregm_b");
    const creativeGMBoolean = dynamicPropertyRegistry.get("creativegm_b");
    const survivalGMBoolean = dynamicPropertyRegistry.get("survivalgm_b");

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !config.customcommands.allowgms) {
        return allowgmsHelp(player, prefix, survivalGMBoolean);
    }

    if (survivalGMBoolean === false) {
        // Allow
        dynamicPropertyRegistry.set("survivalgm_b", true);
        world.setDynamicProperty("survivalgm_b", true);
        // Make sure at least one is allowed since this could cause serious issues if all were locked down
        // We will allow Adventure Mode in this case
        if (adventureGMBoolean === true && creativeGMBoolean === true) {
            dynamicPropertyRegistry.set("adventuregm_b", false);
            world.setDynamicProperty("adventuregm_b", false);
            sendMsg("@a[tag=paradoxOpped]", `§r§4[§6Paradox§4]§r Since all gamemodes were disallowed, Adventure mode has been enabled.`);
            Adventure();
            return;
        }
        sendMsg("@a[tag=paradoxOpped]", `§r§4[§6Paradox§4]§r ${player.nameTag}§r has disallowed §4Gamemode 0 (Survival)§r to be used!`);
        Survival();
    } else if (survivalGMBoolean === true) {
        // Deny
        dynamicPropertyRegistry.set("survivalgm_b", false);
        world.setDynamicProperty("survivalgm_b", false);
        sendMsg("@a[tag=paradoxOpped]", `§r§4[§6Paradox§4]§r ${player.nameTag}§r has allowed §6Gamemode 0 (Survival)§r to be used!`);
    }
}
