import { DynamicPropertyManager } from "../../classes/DynamicPropertyManager.js";
import config from "../../data/config.js";
import { extendPlayerPrototype } from "../../classes/PlayerExtended/Player.js";
import { extendWorldPrototype } from "../../classes/WorldExtended/World.js";
import { world } from "@minecraft/server";

const dynamicPropertyRegistry = DynamicPropertyManager.getInstance();

type Primitive = string | number | boolean | null | undefined;

type DeepEqual<T> = T extends Primitive ? true : T extends Array<infer U> ? DeepEqualArray<U> : T extends Record<string, infer U> ? DeepEqualObject<U> : never;

type DeepEqualArray<T> = T extends Array<infer U> ? Array<DeepEqual<U>> : never;

type DeepEqualObject<T> = {
    [K in keyof T]: DeepEqual<T[K]>;
};

function deepEqual<T>(obj1: T, obj2: T): boolean {
    if (obj1 === obj2) {
        return true;
    }

    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    const keys1 = Object.keys(obj1) as Array<keyof T>;
    const keys2 = Object.keys(obj2) as Array<keyof T>;

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }

    return true;
}

interface Difference {
    [key: string]: Difference | any;
}

function diffObjects(obj1: Record<string, any>, obj2: Record<string, any>, path: string[] = []): Difference {
    const diff: Difference = {};
    for (const key in obj1) {
        const currentPath = [...path, key];

        if (typeof obj1[key] === "object" && obj1[key] !== null && obj2[key] !== null && typeof obj2[key] === "object") {
            const nestedDiff = diffObjects(obj1[key], obj2[key], currentPath);
            if (nestedDiff && Object.keys(nestedDiff).length > 0) {
                diff[key] = nestedDiff;
            }
        } else if (!deepEqual(obj1[key], obj2[key])) {
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
