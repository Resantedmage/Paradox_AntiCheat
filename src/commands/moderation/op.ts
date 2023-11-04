import { ChatSendAfterEvent, Player, world } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import { WorldExtended } from "../../classes/WorldExtended/World.js";
import ConfigInterface from "../../interfaces/Config.js";

function opHelp(player: Player, prefix: string, configuration: ConfigInterface) {
    let commandStatus: string;
    if (!configuration.customcommands.op) {
        commandStatus = "§6[§4DISABLED§6]§f";
    } else {
        commandStatus = "§6[§aENABLED§6]§f";
    }

    const passwordDescription = configuration.encryption.password ? `§4- §6Use your password to gain Paradox-Op§f` : `§4- §6Give yourself Paradox-Op§f`;
    const commandUsage = configuration.encryption.password ? `${prefix}op <password>` : `${prefix}op`;

    return sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: op`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Usage§4]§f: ${prefix}op [optional]`,
        `§4[§6Optional§4]§f: username, help`,
        `§4[§6Description§4]§f: Grants permission to use Paradox AntiCheat features.`,
        `§4[§6Examples§4]§f:`,
        `    ${commandUsage}`,
        `        ${passwordDescription}`,
        `    ${prefix}op help`,
        `        §4- §6Show command help§f`,
        `    ${prefix}op <player>`,
        `        §4- §6Grant Paradox-Op to another player§f`,
    ]);
}

/**
 * @name op
 * @param {ChatSendAfterEvent} message - Message object
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function op(message: ChatSendAfterEvent, args: string[]) {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/op.js:30)");
    }

    const operator = message.sender;

    const prefix = getPrefix(operator);

    const operatorHash = operator.getDynamicProperty("hash");
    const operatorSalt = operator.getDynamicProperty("salt");

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;

    if (!operatorHash || !operatorSalt || (operatorHash !== (world as WorldExtended).hashWithSalt(operatorSalt as string, configuration.encryption.password || operator.id) && (world as WorldExtended).isValidUUID(operatorSalt as string))) {
        if (!configuration.encryption.password) {
            if (!operator.isOp()) {
                return sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f You need to be Operator to use this command.`);
            }
        }
    }

    // Check if args is null, empty, or for help
    if (args[0]?.toLowerCase() === "help") {
        return opHelp(operator, prefix, configuration);
    }

    if (args.length >= 1 && operatorHash === (world as WorldExtended).hashWithSalt(operatorSalt as string, configuration.encryption.password || operator.id)) {
        // Operator wants to grant "Paradox-Op" to another player
        const targetPlayerName = args.join(" "); // Combine all arguments into a single string
        // Try to find the player requested
        let targetPlayer: Player;
        if (args.length) {
            const players = world.getPlayers();
            for (const pl of players) {
                if (pl.name.toLowerCase().includes(targetPlayerName.toLowerCase().replace(/"|\\|@/g, ""))) {
                    targetPlayer = pl;
                    break;
                }
            }
        }

        if (targetPlayer) {
            const targetHash = targetPlayer.getDynamicProperty("hash");

            if (targetHash === undefined) {
                const targetSalt = (world as WorldExtended).generateRandomUUID();
                targetPlayer.setDynamicProperty("salt", targetSalt);

                // Use either the operator's ID or the encryption password as the key
                const targetKey = configuration.encryption.password ? configuration.encryption.password : targetPlayer.id;

                // Generate the hash
                const newHash = (world as WorldExtended).hashWithSalt(targetSalt, targetKey);

                targetPlayer.setDynamicProperty("hash", newHash);

                dynamicPropertyRegistry.setProperty(targetPlayer, targetPlayer.id, targetPlayer.name);

                sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f You have granted Paradox-Op to §7${targetPlayer.name}§f.`);
                sendMsgToPlayer(targetPlayer, `§f§4[§6Paradox§4]§f You are now op!`);
                sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${targetPlayer.name}§f is now Paradox-Opped.`);
                targetPlayer.addTag("paradoxOpped");
            } else {
                sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f §7${targetPlayer.name}§f is already Paradox-Opped.`);
            }
        } else {
            sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f Could not find player §7${targetPlayerName}§f.`);
        }
    } else if (args.length === 0 && !configuration.encryption.password) {
        // Operator wants to change their own password
        const targetSalt = (world as WorldExtended).generateRandomUUID();

        // Use either the operator's ID or the encryption password as the key
        const key = configuration.encryption.password ? configuration.encryption.password : operator.id;

        // Generate the hash
        const newHash = (world as WorldExtended).hashWithSalt(targetSalt, key);

        operator.setDynamicProperty("hash", newHash);
        operator.setDynamicProperty("salt", targetSalt);
        operator.addTag("paradoxOpped");

        sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f You are now Paradox-Opped!`);

        dynamicPropertyRegistry.setProperty(operator, operator.id, operator.name);

        return;
    } else if (args.length === 1 && configuration.encryption.password) {
        // Allow the user to gain Paradox-Op using the password
        if (configuration.encryption.password === args[0]) {
            const targetSalt = (world as WorldExtended).generateRandomUUID();

            // Generate the hash using the provided password
            const newHash = (world as WorldExtended).hashWithSalt(targetSalt, args[0]);

            operator.setDynamicProperty("hash", newHash);
            operator.setDynamicProperty("salt", targetSalt);
            operator.addTag("paradoxOpped");

            sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f You are now Paradox-Opped using the password.`);
            dynamicPropertyRegistry.setProperty(operator, operator.id, operator.name);
        } else {
            // Incorrect password
            sendMsgToPlayer(operator, `§f§4[§6Paradox§4]§f Incorrect password. You need to be Operator to use this command.`);
        }
    } else {
        return opHelp(operator, prefix, configuration);
    }
}
