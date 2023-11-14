import { ChatSendAfterEvent, Player } from "@minecraft/server";
import { WorldBorder } from "../../penrose/TickEvent/worldborder/worldborder.js";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsg, sendMsgToPlayer } from "../../util.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * Provides help information for the worldborders command.
 * @param {Player} player - The player requesting help.
 * @param {string} prefix - The custom prefix for the player.
 * @param {boolean} worldBorderBoolean - The status of the worldBorder module.
 * @param {boolean} setting - The status of the worldBorder custom command setting.
 */
function worldBorderHelp(player: Player, prefix: string, worldBorderBoolean: boolean, setting: boolean): void {
    // Determine the status of the command and module
    const commandStatus: string = setting ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";
    const moduleStatus: string = worldBorderBoolean ? "§6[§aENABLED§6]§f" : "§6[§4DISABLED§6]§f";

    // Display help information to the player
    sendMsgToPlayer(player, [
        `\n§o§4[§6Command§4]§f: worldborder`,
        `§4[§6Status§4]§f: ${commandStatus}`,
        `§4[§6Module§4]§f: ${moduleStatus}`,
        `§4[§6Usage§4]§f: worldborder [options]`,
        `§4[§6Options§4]§f:`,
        `    -o, --overworld  Set the size of the overworld border`,
        `    -n, --nether     Set the size of the nether border`,
        `    -e, --end        Set the size of the end border`,
        `    -d, --disable    Disable the World Border`,
        `    -h, --help       Display this help message`,
        `§4[§6Description§4]§f: Sets the world border and restricts players to that border.`,
        `§4[§6Examples§4]§f:`,
        `    ${prefix}worldborder -o 10000 -n 5000 -e 10000`,
        `    ${prefix}worldborder -o 10000 -n 5000`,
        `    ${prefix}worldborder -d`,
        `    ${prefix}worldborder --help`,
    ]);
}

/**
 * Sets the world border sizes and enables the worldBorder module.
 * @param {Player} player - The player who is setting the world border.
 * @param {number} overworldSize - The size of the overworld border.
 * @param {number} netherSize - The size of the nether border.
 * @param {number} endSize - The size of the end border.
 * @param {ConfigInterface} configuration - The configuration object.
 */
function setWorldBorder(player: Player, overworldSize: number, netherSize: number, endSize: number, configuration: ConfigInterface): void {
    sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has set the §6World Border§f! Overworld: §7${overworldSize}§f Nether: §7${netherSize}§f End: §7${endSize}§f`);
    configuration.modules.worldBorder.overworld = Math.abs(overworldSize);
    configuration.modules.worldBorder.nether = Math.abs(netherSize);
    configuration.modules.worldBorder.end = Math.abs(endSize);
    configuration.modules.worldBorder.enabled = true;
    dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", configuration);
    WorldBorder();
}

/**
 * Parses a string value into a number, ensuring it is a valid number.
 * @param {string | undefined} value - The string value to parse.
 * @returns {number | undefined} - The parsed positive number.
 */
function parseSize(value: string | undefined): number | undefined {
    // Attempt to convert the string value to a number
    const parsedValue = Number(value);

    // Check if the conversion resulted in a valid number
    if (isNaN(parsedValue)) {
        return undefined;
    }

    // Return the parsed positive number
    return Math.abs(parsedValue);
}

/**
 * Handles the worldborders command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
export function worldborders(message: ChatSendAfterEvent, args: string[]): void {
    handleWorldBorders(message, args).catch((error) => {
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
 * Handles the worldborders command.
 * @param {ChatSendAfterEvent} message - Message object.
 * @param {string[]} args - Additional arguments provided (optional).
 */
async function handleWorldBorders(message: ChatSendAfterEvent, args: string[]): Promise<void> {
    // Validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | Error: ${message} isn't defined. Did you forget to pass it? (./commands/settings/worldborder.js:38)`);
    }

    const player: Player = message.sender;
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    if (uniqueId !== player.name) {
        return sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f You need to be Paradox-Opped to use this command.`);
    }

    const prefix: string = getPrefix(player);
    const configuration: ConfigInterface = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig") as ConfigInterface;

    // Cache
    const length = args.length;

    if (length <= 0 || ["--help", "-h"].includes(args[0].toLowerCase()) || !configuration.customcommands.worldborder) {
        return worldBorderHelp(player, prefix, configuration.modules.worldBorder.enabled, configuration.customcommands.worldborder);
    }

    // Shutdown worldborder
    if (["--disable", "-d"].includes(args[0].toLowerCase())) {
        // Disable Worldborder
        sendMsg("@a[tag=paradoxOpped]", `§f§4[§6Paradox§4]§f §7${player.name}§f has disabled the §6World Border§f!`);
        configuration.modules.worldBorder.overworld = 0;
        configuration.modules.worldBorder.nether = 0;
        configuration.modules.worldBorder.end = 0;
        configuration.modules.worldBorder.enabled = false;
        return;
    }

    let overworldSize = configuration.modules.worldBorder.overworld || 0;
    let netherSize = configuration.modules.worldBorder.nether || 0;
    let endSize = configuration.modules.worldBorder.end || 0;

    for (let i = 0; i < length; i++) {
        const arg = args[i].toLowerCase();
        switch (arg) {
            case "--overworld":
            case "-o":
                overworldSize = parseSize(args[i + 1]);
                break;
            case "--nether":
            case "-n":
                netherSize = parseSize(args[i + 1]);
                break;
            case "--end":
            case "-e":
                endSize = parseSize(args[i + 1]);
                break;
        }
    }

    if (overworldSize || netherSize || endSize) {
        setWorldBorder(player, overworldSize as number, netherSize as number, endSize as number, configuration);
        return;
    }

    sendMsgToPlayer(player, `§f§4[§6Paradox§4]§f Invalid command. Use ${prefix}salvage --help for command usage.`);
}
