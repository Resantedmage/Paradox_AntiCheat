import { ChatSendAfterEvent } from "@minecraft/server";
import { dynamicPropertyRegistry } from "../../penrose/WorldInitializeAfterEvent/registry.js";
import { getPrefix, sendMsgToPlayer } from "../../util.js";
import { nonstaffhelp } from "./nonstaffhelp.js";
import ConfigInterface from "../../interfaces/Config.js";

/**
 * @name help
 * @param {ChatSendAfterEvent} message - Message object
 */
export function help(message: ChatSendAfterEvent) {
    // validate that required params are defined
    if (!message) {
        return console.warn(`${new Date()} | ` + "Error: ${message} isnt defined. Did you forget to pass it? (./commands/moderation/help.js:8)");
    }

    const player = message.sender;

    // Check for custom prefix
    const prefix = getPrefix(player);

    // Get unique ID
    const uniqueId = dynamicPropertyRegistry.getProperty(player, player?.id);

    // Make sure the user has permissions to run the command
    // if not then show them non staff commands
    if (uniqueId !== player.name) {
        return nonstaffhelp(message);
    }

    const configuration = dynamicPropertyRegistry.getProperty(undefined, "config") as ConfigInterface;

    // Make sure the help command wasn't disabled
    if (configuration.customcommands.help === false) {
        configuration.customcommands.help = true;
        dynamicPropertyRegistry.setProperty(undefined, "config", configuration);
    }

    const textDisabled = "Command §4DISABLED§f.";

    return sendMsgToPlayer(player, [
        `§l§o§6[§4Paradox AntiCheat Command Help§6]§r§o`,
        ` `,
        `§l§o§6[§4Moderation Commands§6]§r§o`,
        `§6${prefix}help§f - Shows this help page.`,
        `§6${prefix}ban§f - ${configuration.customcommands.ban ? `Ban the specified user.` : textDisabled}`,
        `§6${prefix}autoban§f - ${configuration.customcommands.autoban ? `Will ban players automaticaly if they have a violation above 50.` : textDisabled}`,
        `§6${prefix}unban§f - ${configuration.customcommands.unban ? `Allows specified players to join if banned (Doesn't include global ban).` : textDisabled}`,
        `§6${prefix}kick§f - ${configuration.customcommands.kick ? `Kick the specified user.` : textDisabled}`,
        `§6${prefix}mute§f - ${configuration.customcommands.mute ? `Mute the specified user.` : textDisabled}`,
        `§6${prefix}unmute§f - ${configuration.customcommands.unmute ? `Unmute the specified user.` : textDisabled}`,
        `§6${prefix}notify§f - ${configuration.customcommands.notify ? `Toggles cheat notifications.` : textDisabled}`,
        `§6${prefix}credits§f - Shows credits, thats it.`,
        `§6${prefix}op§f - ${configuration.customcommands.op ? `Op's player in Paradox AntiCheat features.` : textDisabled}`,
        `§6${prefix}deop§f - ${configuration.customcommands.deop ? `Revokes Op player in Paradox AntiCheat features.` : textDisabled}`,
        `§6${prefix}modules§f - ${configuration.customcommands.modules ? `View all enabled or disabled modules.` : textDisabled}`,
        `§6${prefix}prefix§f - Change the prefix for commands. Max is two characters.`,
        `§6${prefix}prefix reset§f - Reset the prefix for commands.`,
        `§6${prefix}lockdown§f - ${configuration.customcommands.lockdown ? `Kicks player's from server excluding Staff for maintenance.` : textDisabled}`,
        `§6${prefix}punish§f - ${configuration.customcommands.punish ? `Removes all items from player's inventory and ender chest.` : textDisabled}`,
        `§6${prefix}tpa§f - ${configuration.customcommands.tpa ? `Teleport to a player or vice versa.` : textDisabled}`,
        `§6${prefix}despawn§f - ${configuration.customcommands.despawn ? `Despawns all or specified entities if they exist.` : textDisabled}`,
        ` `,
        `§l§o§6[§4Optional Features§6]§r§o`,
        `§6${prefix}allowgma§f - ${configuration.customcommands.allowgma ? `Toggles Gamemode 2(Adventure) to be used.` : textDisabled}`,
        `§6${prefix}allowgmc§f - ${configuration.customcommands.allowgmc ? `Toggles Gamemode 1(Creative) to be used.` : textDisabled}`,
        `§6${prefix}allowgms§f - ${configuration.customcommands.allowgms ? `Toggles Gamemode 0(Survival) to be used.` : textDisabled}`,
        `§6${prefix}removecb§f - ${configuration.customcommands.removecommandblocks ? `Toggles Anti Command Blocks (Clears all when enabled).` : textDisabled}`,
        `§6${prefix}bedrockvalidate§f - ${configuration.customcommands.bedrockvalidate ? `Checks validation of bedrock.` : textDisabled}`,
        `§6${prefix}overridecbe§f - ${configuration.customcommands.overidecommandblocksenabled ? `Forces the commandblocksenabled gamerule to be enabled or disabled at all times.` : textDisabled}`,
        `§6${prefix}worldborder <value>§f - ${configuration.customcommands.worldborder ? `Sets the World Border for Overworld, Nether or End.` : textDisabled}`,
        `§6${prefix}autoclicker§f - ${configuration.customcommands.autoclicker ? `Toggles Anti Autoclicker.` : textDisabled}`,
        `§6${prefix}jesusa§f - ${configuration.customcommands.jesusa ? `Checks if player's are walking on water and lava.` : textDisabled}`,
        `§6${prefix}enchantedarmor§f - ${configuration.customcommands.enchantedarmor ? `Toggles Anti Enchanted Armor for all players.` : textDisabled}`,
        `§6${prefix}antikillaura§f - ${configuration.customcommands.antikillaura ? `Toggles checks for attacks outside a 90 degree angle.` : textDisabled}`,
        `§6${prefix}antikb§f - ${configuration.customcommands.antikb ? `Toggles Anti Knockback for all players.` : textDisabled}`,
        `§6${prefix}badpackets1§f - ${configuration.customcommands.badpackets1 ? `Checks message length for each broadcast.` : textDisabled}`,
        `§6${prefix}spammera§f - ${configuration.customcommands.spammera ? `Checks if message is sent while moving.` : textDisabled}`,
        `§6${prefix}spammerb§f - ${configuration.customcommands.spammerb ? `Checks if message is sent while swinging.` : textDisabled}`,
        `§6${prefix}spammerc§f - ${configuration.customcommands.spammerc ? `Checks if message is sent while using items.` : textDisabled}`,
        `§6${prefix}antispam§f - ${configuration.customcommands.antispam ? `Checks for spamming in chat with 2 second cooldown.` : textDisabled}`,
        `§6${prefix}namespoofa§f - ${configuration.customcommands.namespoofa ? `Checks if player's name exceeds character limitations.` : textDisabled}`,
        `§6${prefix}namespoofb§f - ${configuration.customcommands.namespoofb ? `Checks if player's name has Non ASCII characters.` : textDisabled}`,
        `§6${prefix}reacha§f - ${configuration.customcommands.reacha ? `Checks if player's place blocks beyond reach.` : textDisabled}`,
        `§6${prefix}reachb§f - ${configuration.customcommands.reachb ? `Checks if player's attack beyond reach.` : textDisabled}`,
        `§6${prefix}speeda§f - ${configuration.customcommands.speeda ? `Checks if player's are speed hacking.` : textDisabled}`,
        `§6${prefix}flya§f - ${configuration.customcommands.flya ? `Checks if player's are flying in survival.` : textDisabled}`,
        `§6${prefix}illegalitemsa§f - ${configuration.customcommands.illegalitemsa ? `Checks if player's have illegal items in inventory.` : textDisabled}`,
        `§6${prefix}illegalitemsb§f - ${configuration.customcommands.illegalitemsb ? `Checks if player's place illegal items.` : textDisabled}`,
        `§6${prefix}illegalitemsc§f - ${configuration.customcommands.illegalitemsc ? `Checks for illegal dropped items in the world.` : textDisabled}`,
        `§6${prefix}illegalenchant§f - ${configuration.customcommands.illegalenchant ? `Checks items for illegal enchants.` : textDisabled}`,
        `§6${prefix}illegallores§f - ${configuration.customcommands.illegallores ? `Checks for illegal lores in items.` : textDisabled}`,
        `§6${prefix}invalidsprinta§f - ${configuration.customcommands.invalidsprinta ? `Toggles checks for illegal sprint with blindness.` : textDisabled}`,
        `§6${prefix}stackban§f - ${configuration.customcommands.stackban ? `Checks if player's have illegal stacks over 64.` : textDisabled}`,
        `§6${prefix}antiscaffolda§f - ${configuration.customcommands.antiscaffolda ? `Checks player's for illegal scaffolding.` : textDisabled}`,
        `§6${prefix}antinukera§f - ${configuration.customcommands.antinukera ? `Checks player's for nuking blocks.` : textDisabled}`,
        `§6${prefix}xraya§f - ${configuration.customcommands.xraya ? `Notify's staff when and where player's mine specific ores.` : textDisabled}`,
        `§6${prefix}chatranks§f - ${configuration.customcommands.chatranks ? `Toggles chat ranks.` : textDisabled}`,
        `§6${prefix}antishulker§f - ${configuration.customcommands.antishulker ? `Toggles shulkers in the world.` : textDisabled}`,
        `§6${prefix}ops§f - ${configuration.customcommands.ops ? `Toggles One Player Sleep (OPS) for all online players.` : textDisabled}`,
        `§6${prefix}salvage§f - ${configuration.customcommands.salvage ? `Toggles new salvage system [Experimental].` : textDisabled}`,
        `§6${prefix}badpackets2§f - ${configuration.customcommands.badpackets2 ? `Toggles checks for invalid selected slots by player.` : textDisabled}`,
        `§6${prefix}clearlag§f - ${configuration.customcommands.clearlag ? `Clears items and entities with timer.` : textDisabled}`,
        `§6${prefix}antifalla§f - ${configuration.customcommands.antifalla ? `Toggles checks for taking no fall damage in survival.` : textDisabled}`,
        `§6${prefix}showrules§f - ${configuration.customcommands.showrules ? `Toggles showing the rules when the player loads in for the first time.` : textDisabled}`,
        `§6${prefix}afk§f - ${configuration.customcommands.afk ? `Kicks players that are AFK for ${configuration.modules.afk.minutes} minutes.` : textDisabled}`,
        `§6${prefix}antiphasea§f - ${configuration.customcommands.antiphasea ? `Toggles checks for players phasing through blocks.` : textDisabled}`,
        `§6${prefix}spawnprotection§f - ${configuration.customcommands.spawnprotection ? `Enables area protection to prevent building/mining.` : textDisabled}`,
        ` `,
        `§l§o§6[§4Tools and Utilites§6]§r§o`,
        `§6${prefix}give§f - ${configuration.customcommands.give ? `Gives player items.` : textDisabled}`,
        `§6${prefix}ecwipe§f - ${configuration.customcommands.ecwipe ? `Clears a players ender chest.` : textDisabled}`,
        `§6${prefix}fly§f - ${configuration.customcommands.fly ? `Toggles fly mode in survival.` : textDisabled}`,
        `§6${prefix}freeze§f - ${configuration.customcommands.freeze ? `Freeze a player and make it so they cant move.` : textDisabled}`,
        `§6${prefix}stats§f - ${configuration.customcommands.stats ? `View a specific players anticheat logs.` : textDisabled}`,
        `§6${prefix}fullreport§f - ${configuration.customcommands.fullreport ? `View everyones anticheat logs.` : textDisabled}`,
        `§6${prefix}vanish§f - ${configuration.customcommands.vanish ? `Toggles vanish (Used for spying on suspects).` : textDisabled}`,
        `§6${prefix}chatranks§f - ${configuration.customcommands.chatranks ? `Toggles chat ranks.` : textDisabled}`,
        `§6${prefix}clearchat§f - ${configuration.customcommands.clearchat ? `Clears chat.` : textDisabled}`,
        `§6${prefix}invsee§f - ${configuration.customcommands.invsee ? `Lists all the items in the usernames inventory.` : textDisabled}`,
        `§6${prefix}sethome§f - ${configuration.customcommands.sethome ? `Saves current coordinates as home.` : textDisabled}`,
        `§6${prefix}gohome§f - ${configuration.customcommands.gohome ? `Teleport back to saved home coordinates.` : textDisabled}`,
        `§6${prefix}listhome§f - ${configuration.customcommands.listhome ? `Shows your list of saved locations.` : textDisabled}`,
        `§6${prefix}delhome§f - ${configuration.customcommands.delhome ? `Deletes a saved location from list.` : textDisabled}`,
        `§6${prefix}hotbar§f - ${configuration.customcommands.hotbar ? `Toggles hotbar message for all players. Optional: Message` : textDisabled}`,
        `§6${prefix}paradoxui§f - ${configuration.customcommands.paradoxiu ? `Shows GUI for main menu.` : textDisabled}`,
        `§6${prefix}tpr§f - ${configuration.customcommands.tpr ? `Will send requests to tp to players.` : textDisabled}`,
        `§6${prefix}biome§f - ${configuration.customcommands.biome ? `Sends the current biome and direction the player is facing.` : textDisabled}`,
        `§6${prefix}rank§f - ${configuration.customcommands.rank ? `Gives one or more ranks to a specified player or resets it.` : textDisabled}`,
        `§6${prefix}version§f - Will print to chat the currently installed version of paradox.`,
        `§6${prefix}channel create <channel> [password?]§f - ${configuration.customcommands.channel ? `Create a new chat channel (with optional password).` : textDisabled}`,
        `§6${prefix}channel delete <channel> [password?]§f - ${configuration.customcommands.channel ? `Delete an existing chat channel (with optional password).` : textDisabled}`,
        `§6${prefix}channel join <channel> [password?]§f - ${configuration.customcommands.channel ? `Join an existing chat channel (with optional password).` : textDisabled}`,
        `§6${prefix}channel invite <channel> <player>§f - ${configuration.customcommands.channel ? `Invite a player to join your chat channel.` : textDisabled}`,
        `§6${prefix}channel handover <channel> <player>§f - ${configuration.customcommands.channel ? `Transfer ownership of a chat channel.` : textDisabled}`,
        `§6${prefix}channel leave§f - ${configuration.customcommands.channel ? `Leave the current chat channel.` : textDisabled}`,
        `§6${prefix}channel members§f - ${configuration.customcommands.channel ? `List members of the current chat channel.` : textDisabled}`,
        `§6${prefix}pvp§f - ${configuration.customcommands.pvp ? `Enable or disable PvP mode.` : textDisabled}`,

        ` `,
        `§l§o§6[§4Debugging Utilites§6]§r§o`,
        `§6${prefix}listitems§f - ${configuration.debug ? `Prints every item in the game and their max stack.` : textDisabled}`,
        ` `,
        `§l§o§6[§4For more info execute the command with help§6]§f`,
    ]);
}
