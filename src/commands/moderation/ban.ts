import { ChatSendAfterEvent, Player, world } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

function banHelp(player: Player, prefix: string, setting: boolean) {
    let commandStatus: string;
    if (!setting) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }
    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: ban`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: ban [optional]`,
        `§4[§6Optional§4]§f: username, reason, help`,
        `§4[§6Description§4]§f: Bans the specified user and optionally gives a reason.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}ban ${player.name}`,
        `        §4- §6Ban ${player.name} without specifying a reason§f`,
        `    ${prefix}ban ${player.name} Hacker!`,
        `        §4- §6Ban ${player.name} with the reason "Hacker!"§f`,
        `    ${prefix}ban ${player.name} Caught exploiting!`,
        `        §4- §6Ban ${player.name} with the reason "Caught exploiting!"§f`,
        `    ${prefix}ban help`,
        `        §4- §6Show command help§f`,
    ]);
}

/**
 * @name ban
 * @param {ChatSendAfterEvent} message - Message object
 * @param {array} args - Additional arguments provided (optional).
 */
export function ban(message: ChatSendAfterEvent, args: string[]) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? ./commands/moderation/ban.js:31)");
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Are there arguements
    if (!args.length) {
        return banHelp(player, prefix, configuration.customcommands.ban);
    }

    // Was help requested
    const argCheck = args[0];
    if ((argCheck && args[0].toLowerCase() === "help") || !configuration.customcommands.ban) {
        return banHelp(player, prefix, configuration.customcommands.ban);
    }

    // Modify the argument handling
    let playerName = args.shift();
    let reason = "No reason specified";
    if (args.length > 0) {
        reason = args.join(" ");
        // Remove double quotes from the beginning and end of the reason if present
        reason = reason.replace(/(^"|"$)/g, "");
    }

    // Remove double quotes from the player name if present
    playerName = playerName.replace(/(^"|"$)/g, "");

    // try to find the player requested
    let member: Player;
    const players = world.getPlayers();
    for (const pl of players) {
        if (pl.name.toLowerCase().includes(playerName.toLowerCase().replace(/"|\\|@/g, ""))) {
            member = pl;
            break;
        }
    }

    // Check if player exists
    if (!member) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Couldn't find that player!`);
    }

    // make sure they dont ban themselves
    if (member === player) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You cannot ban yourself.`);
    }

    try {
        member.addTag("Reason:" + reason);
        member.addTag("By:" + player.name);
        member.addTag("isBanned");
    } catch (error) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f I was unable to ban that player! Error: ${error}`);
    }
    return sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has banned §7${member.name}§f. Reason: §7${reason}§f`);
}
