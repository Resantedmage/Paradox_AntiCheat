import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { KillAura } from "../../penrose/EntityHitEntityAfterEvent/killaura.js";
import ConfigInterface from "../../interfaces/Config.js";

function auraCheckHelp(player: Player, prefix: string, antiKillAuraBoolean: boolean, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    let moduleStatus: string;
    if (antiKillAuraBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§f";
    } else {
        moduleStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: antikillaura`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: antikillaura [optional]`,
        `§4[§6Optional§4]§f: username, help`,
        `§4[§6Description§4]§f: Toggles checks for attacks outside a 90 degree angle.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}antikillaura ${player.name}`,
        `    ${prefix}antikillaura help`,
    ]);
}

/**
 * @name auracheck
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function auracheck(message: ChatSendAfterEvent, args: string[]) {
    handleAuraCheck(message, args).catch((error) => {
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

async function handleAuraCheck(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/utility/auracheck.js:29)");
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    // Get Dynamic Property Boolean
    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.antikillaura) {
        return auraCheckHelp(player, prefix, configuration.modules.antiKillAura.enabled, configuration.customcommands.antikillaura);
    }

    if (configuration.modules.antiKillAura.enabled === true) {
        // Deny
        configuration.modules.antiKillAura.enabled = false;
        dynamicPropertyRegistry.setProperty(undefined, "config", configuration);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4AntiKillAura§f!`);
    } else if (configuration.modules.antiKillAura.enabled === false) {
        // Allow
        configuration.modules.antiKillAura.enabled = true;
        dynamicPropertyRegistry.setProperty(undefined, "config", configuration);
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6AntiKillAura§f!`);
        KillAura();
    }
}
