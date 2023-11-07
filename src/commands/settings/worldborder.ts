import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { WorldBorder } from "../../penrose/TickEvent/worldborder/worldborder.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

function worldBorderHelp(player: Player, prefix: string, worldBorderBoolean: boolean, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    let moduleStatus: string;
    if (worldBorderBoolean === false) {
        moduleStatus = "§6[§4DISABLED§6]§f";
    } else {
        moduleStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: worldborder`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: worldborder <value> [optional]`,
        `§4[§6Optional§4]§f: disable, help`,
        `§4[§6Description§4]§f: Sets the world border and restricts players to that border.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}worldborder 10000 5000`,
        `    ${prefix}worldborder -o 10000 -n 5000 -e 10000`,
        `    ${prefix}worldborder -overworld 10000 -nether 5000`,
        `    ${prefix}worldborder -overworld 10000`,
        `    ${prefix}worldborder -nether 5000`,
        `    ${prefix}worldborder -n 5000`,
        `    ${prefix}worldborder disable`,
        `    ${prefix}worldborder help`,
    ]);
}

function setWorldBorder(player: Player, overworldSize: number, netherSize: number, endSize: number, configuration: ConfigInterface) {
    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has set the §6World Border§f! Overworld: §7${overworldSize}§f Nether: §7${netherSize}§f End: §7${endSize}§f`);
    configuration.modules.worldBorder.overworld = Math.abs(overworldSize);
    configuration.modules.worldBorder.nether = Math.abs(netherSize);
    configuration.modules.worldBorder.nether = Math.abs(endSize);
    configuration.modules.worldBorder.enabled = true;
    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
    WorldBorder();
}

/**
 * @name worldborder
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function worldborders(message: ChatSendAfterEvent, args: string[]) {
    if (!message) {
        return console.warn(`${new Date()} | Error: ${message} isn't defined. Did you forget to pass it? (./commands/settings/worldborder.js:38)`);
    }

    const player = message.sender;
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const prefix = getPrefix(player);

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Cache
    const length = args.length;

    if (!length || args[0].toLowerCase() === "help" || !configuration.customcommands.worldborder) {
        return worldBorderHelp(player, prefix, configuration.modules.worldBorder.enabled, configuration.customcommands.worldborder);
    }

    // Shutdown worldborder
    if (args[0] === "disable") {
        // Disable Worldborder
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled the §6World Border§f!`);
        configuration.modules.worldBorder.overworld = 0;
        configuration.modules.worldBorder.nether = 0;
        configuration.modules.worldBorder.nether = 0;
        configuration.modules.worldBorder.enabled = false;
        return;
    }

    const paramIndexes: { [key: string]: number } = {
        "-overworld": -1,
        "-o": -1,
        "-nether": -1,
        "-n": -1,
        "-end": -1,
        "-e": -1,
    };

    for (let i = 0; i < length; i++) {
        if (paramIndexes[args[i]] !== undefined) {
            paramIndexes[args[i]] = i;
        }
    }

    let overworldSize = configuration.modules.worldBorder.overworld || 0;
    let netherSize = configuration.modules.worldBorder.nether || 0;
    let endSize = configuration.modules.worldBorder.end || 0;

    for (let i = 0; i < length; i++) {
        const arg = args[i].toLowerCase();
        switch (arg) {
            case "-overworld":
            case "-o":
                overworldSize = Number(args[i + 1]);
                break;
            case "-nether":
            case "-n":
                netherSize = Number(args[i + 1]);
                break;
            case "-end":
            case "-e":
                endSize = Number(args[i + 1]);
                break;
        }
    }

    if (overworldSize || netherSize || endSize) {
        setWorldBorder(player, overworldSize as number, netherSize as number, endSize as number, configuration);
        return;
    }

    return worldBorderHelp(player, prefix, configuration.modules.worldBorder.enabled, configuration.customcommands.worldborder);
}
