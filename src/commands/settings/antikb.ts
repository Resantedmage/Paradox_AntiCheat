import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { AntiKnockbackA } from "../../penrose/TickEvent/knockback/antikb_a.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the AntiKnockback command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} antikbBoolean - The status of AntiKnockback module.
 * @param {boolean} setting - The status of the AntiKnockback custom command setting.
 */
function antikbHelp(player: Player, prefix: string, configuration: ConfigInterface): void {
    const commandStatus: string = configuration.customcommands.antikb ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = configuration.modules.antikbA.enabled ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: antikb`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: antikb [options]`,
        `§4[§6Description§4]§f: Allows toggling of Anti Knockback for all players.`,
        `§4[§6Options§4]§f:`,
        `    -h, --help`,
        `       §4[§7Display this help message§4]§f`,
        `    -s, --status`,
        `       §4[§7Display the current status of AntiKnockback module§4]§f`,
        `    -e, --enable`,
        `       §4[§7Enable AntiKnockback module§4]§f`,
        `    -d, --disable`,
        `       §4[§7Disable AntiKnockback module§4]§f`,
        `    -v <value>, --velocity <value>`,
        `       §4[§7Change velocity intensity§4]§f`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}antikb --help`,
        `    ${prefix}antikb --status`,
        `    ${prefix}antikb --enable`,
        `    ${prefix}antikb --disable`,
        `    ${prefix}antikb --velocity ${configuration.modules.antikbA.velocityIntensity}`,
    ]);
}

/**
 * Handles the AntiKnockback command.
 * @param {ChatSendAfterEvent} message - The message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function antikb(message: ChatSendAfterEvent, args: string[]): void {
    handleAntiKnockback(message, args).catch((error) => {
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

async function handleAntiKnockback(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | Error: ${message} isn't defined. Did you forget to pass it? (./commands/settings/antikb.js:36)`);
    }

    const player = message.sender;

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
        return;
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
                return antikbHelp(player, prefix, configuration);
            case "-s":
            case "--status":
            // Handle status flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiKnockback module is currently ${configuration.modules.antikbA.enabled ? "enabled" : "disabled"}`);
                break;
            case "-e":
            case "--enable":
            // Handle enable flag
                if (configuration.modules.antikbA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiKnockback module is already enabled.`);
                } else {
                    configuration.modules.antikbA.enabled = true;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has enabled §6Anti Knockback§f!`);
                    AntiKnockbackA();
                }
                break;
            case "-d":
            case "--disable":
            // Handle disable flag
                if (!configuration.modules.antikbA.enabled) {
                    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f AntiKnockback module is already disabled.`);
                } else {
                    configuration.modules.antikbA.enabled = false;
                    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled §4Anti Knockback§f!`);
                }
                break;
            case "-v":
            case "--velocity": {
            // Handle velocity flag
                const numberConvert = Number(args[1]);
                if (isNaN(numberConvert)) {
                    return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}antikb --help for more information.`);
                }
                configuration.modules.antikbA.velocityIntensity = numberConvert;
                dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
                sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has updated §6Anti Knockback§f velocity to §6${numberConvert}§f!`);
                break;
            }
            default:
            // Handle unrecognized flag
                sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid option. Use ${prefix}antikb --help for more information.`);
                break;
        }
    } else {
        sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}antikb --help for more information.`);
    }
}
