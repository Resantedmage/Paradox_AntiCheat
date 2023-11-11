import { DynamicPropertyManager } from "../../classes/DynamicPropertyManager.js";
import config from "../../data/config.js";
import { extendPlayerPrototype } from "../../classes/PlayerExtended/Player.js";
import { extendWorldPrototype } from "../../classes/WorldExtended/World.js";
import { world } from "@minecraft/server";

const dynamicPropertyRegistry = DynamicPropertyManager.getInstance();

function diffObjects(obj1: Record<string, any>, obj2: Record<string, any>): Record<string, any> {
    const diff: Record<string, any> = {};

    for (const key in obj1) {
        if (typeof obj1[key] === "object") {
            const nestedDiff = diffObjects(obj1[key], obj2[key]);
            if (Object.keys(nestedDiff).length > 0) {
                diff[key] = nestedDiff;
            }
        } else if (obj1[key] !== obj2[key]) {
            diff[key] = obj1[key];
        }
    }

    return diff;
}

function registry() {
    return new Promise<void>((resolve) => {
        // Extend Prototypes here
        extendPlayerPrototype();
        extendWorldPrototype();

        // Check if the "config" property already exists
        const existingConfig = dynamicPropertyRegistry.getProperty(undefined, "paradoxConfig");
        // Check if the "backupConfig" property already exists
        const backupConfig = dynamicPropertyRegistry.getProperty(undefined, "paradoxBackupConfig");

        if (!existingConfig) {
            // Create the "config" property with the new value
            dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", config);
            // Create the backup with the current "config"
            dynamicPropertyRegistry.setProperty(undefined, "paradoxBackupConfig", config);
            resolve();
            return;
        }

        if (!backupConfig) {
            // Create the backup with the current "config"
            dynamicPropertyRegistry.setProperty(undefined, "paradoxBackupConfig", config);
            resolve();
            return;
        }

        // Determine what has changed in the "config" compared to the backup
        const changes = diffObjects(config, backupConfig as object);

        if (Object.keys(changes).length > 0) {
            // Update the backup with the current "config"
            dynamicPropertyRegistry.setProperty(undefined, "paradoxBackupConfig", config);

            // Merge the changes into the "config" property
            const mergedConfig = { ...(existingConfig as object), ...changes };

            dynamicPropertyRegistry.setProperty(undefined, "paradoxConfig", mergedConfig);
        }

        resolve();
    });
}

const Registry = () => {
    return new Promise<void>((resolve, reject) => {
        world.afterEvents.worldInitialize.subscribe(async () => {
            await registry()
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    });
};

export { Registry, dynamicPropertyRegistry };
