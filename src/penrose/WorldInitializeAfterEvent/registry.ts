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

    // Store the config object as a JSON string in DynamicPropertyManager
    dynamicPropertyRegistry.setProperty(undefined, "config", config);
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
