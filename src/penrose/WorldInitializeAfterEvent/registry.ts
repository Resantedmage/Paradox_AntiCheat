import { DynamicPropertyManager } from "../../classes/DynamicPropertyManager.js";
import config from "../../data/config.js";
import { extendPlayerPrototype } from "../../classes/PlayerExtended/Player.js";
import { extendWorldPrototype } from "../../classes/WorldExtended/World.js";
import { world } from "@minecraft/server";

const dynamicPropertyRegistry = DynamicPropertyManager.getInstance();

function registry() {
    // Extend Prototypes here
    extendPlayerPrototype();
    extendWorldPrototype();

    // Check if the "config" property already exists
    const existingConfig = dynamicPropertyRegistry.getProperty(undefined, "config");

    if (!existingConfig || JSON.stringify(existingConfig) !== JSON.stringify(config)) {
        // "config" property doesn't exist or there are changes
        dynamicPropertyRegistry.setProperty(undefined, "config", config);
    }
}

const Registry = () => {
    return new Promise<void>((resolve) => {
        world.afterEvents.worldInitialize.subscribe(() => {
            registry();
            resolve(); // Resolve the promise when the registry function is done.
        });
    });
};

export { Registry, dynamicPropertyRegistry };
