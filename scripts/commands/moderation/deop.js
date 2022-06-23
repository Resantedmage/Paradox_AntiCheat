/* eslint no-var: "off"*/
/* eslint no-redeclare: "off"*/
import { world } from "mojang-minecraft";
import config from "../../data/config.js";
import { crypto, getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";

const World = world;

function deopHelp(player, prefix) {
    let commandStatus;
    if (!config.customcommands.deop) {
        commandStatus = "§6[§4DISABLED§6]§r";
    } else {
        commandStatus = "§6[§aENABLED§6]§r";
    }
    return sendMsgToPlayer(player, [
        `§4[§6Command§4]§r: deop`,
        `§4[§6Status§4]§r: ${commandStatus}`,
        `§4[§6Usage§4]§r: deop [optional]`,
        `§4[§6Optional§4]§r: username, help`,
        `§4[§6Description§4]§r: Revokes permission to use Paradox AntiCheat features.`,
        `§4[§6Examples§4]§r:`,
        `    ${prefix}deop ${player.nameTag}`,
        `    ${prefix}deop help`,
    ])
}

/**
 * @name deop
 * @param {object} message - Message object
 * @param {array} args - Additional arguments provided (optional).
 */
export function deop(message, args) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/op.js:9)");
    }

    message.cancel = true;

    let player = message.sender;

    // Check for hash/salt and validate password
    let hash = player.getDynamicProperty('hash');
    let salt = player.getDynamicProperty('salt');
    let encode;
    try {
        encode = crypto(salt, config.modules.encryption.password);
    } catch (error) {}
    
    // make sure the user has permissions to run the command
    if (hash === undefined || encode !== hash) {
        return sendMsgToPlayer(player, `§r§4[§6Paradox§4]§r You need to be Paradox-Opped to use this command.`);
    }

    // Check for custom prefix
    let prefix = getPrefix(player);

    // Was help requested
    let argCheck = args[0];
    if (argCheck && args[0].toLowerCase() === "help" || !config.customcommands.deop) {
        return deopHelp(player, prefix);
    }

    // Are there arguements
    if (!args.length) {
        return deopHelp(player, prefix);
    }
    
    // try to find the player requested
    let member;
    if (args.length) {
        for (let pl of World.getPlayers()) {
            if (pl.nameTag.toLowerCase().includes(args[0].toLowerCase().replace(/"|\\|@/g, ""))) {
                member = pl;
            }
        }
    }
    
    if (!member) {
        return sendMsgToPlayer(player, `§r§4[§6Paradox§4]§r Couldnt find that player!`);
    }

    // Check for hash/salt and validate password from member
    let memberHash = member.getDynamicProperty('hash');
    let memberSalt = member.getDynamicProperty('salt');
    let memberEncode;
    try {
        memberEncode = crypto(memberSalt, config.modules.encryption.password);
    } catch (error) {}

    if (memberHash !== undefined && memberHash === memberEncode) {
        member.removeDynamicProperty('hash');
        member.removeDynamicProperty('salt');
        member.removeTag('paradoxOpped');
        sendMsg('@a[tag=paradoxOpped]', `§r§4[§6Paradox§4]§r ${member.nameTag} is no longer Paradox-Opped.`)
        return sendMsgToPlayer(member, `§r§4[§6Paradox§4]§r Your OP status has been revoked!`);
    }
    return sendMsgToPlayer(player, `§r§4[§6Paradox§4]§r ${member.nameTag} never had permission to use Paradox.`);
}
