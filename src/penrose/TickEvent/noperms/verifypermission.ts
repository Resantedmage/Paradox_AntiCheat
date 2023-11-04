import { world, EntityQueryOptions, system } from "@minecraft/server";
import config from "../../../data/config.js";
import { sendMsg } from "../../../util.js";
import { dynamicPropertyRegistry } from "../../WorldInitializeAfterEvent/registry.js";
import { WorldExtended } from "../../../classes/WorldExtended/World.js";

function verifypermission() {
    const filter: EntityQueryOptions = {
        tags: ["paradoxOpped"],
    };
    const filteredPlayers = world.getPlayers(filter);
    // Let's check the players for illegal permissions
    for (const player of filteredPlayers) {
        // Check for hash/salt and validate password
        const hash = player.getDynamicProperty("hash");
        const salt = player.getDynamicProperty("salt");

        // Use either the operator's ID or the encryption password as the key
        const key = config.encryption.password ? config.encryption.password : player.id;

        // Generate the hash
        const encode = (world as WorldExtended).hashWithSalt(salt as string, key);
        if (encode && encode === hash) {
            // Make sure their unique ID exists in case of a reload
            if (dynamicPropertyRegistry.hasProperty(player, player.id) === false) {
                dynamicPropertyRegistry.setProperty(player, player.id, player.name);
            }
            continue;
        } else {
            player.setDynamicProperty("hash");
            player.setDynamicProperty("salt");
            dynamicPropertyRegistry.deleteProperty(player, player.id);
            player.removeTag("paradoxOpped");
        }

        sendMsg("@a[tag=notify]", `§f§4[§6Paradox§4]§f §7${player.name}§f had unauthorized permissions. Permissions removed!`);
    }
}

/**
 * We store the identifier in a variable
 * to cancel the execution of this scheduled run
 * if needed to do so.
 */
export const VerifyPermission = system.runInterval(() => {
    verifypermission();
}, 20);
