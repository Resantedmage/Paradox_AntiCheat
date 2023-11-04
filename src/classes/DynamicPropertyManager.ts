import { world, Vector3, Player, Entity } from "@minecraft/server";

type PropertyValue = string | number | boolean | Vector3 | object;

export class DynamicPropertyManager {
    private static instance: DynamicPropertyManager | null = null;
    private propertyCache: Map<string, PropertyValue> = new Map<string, PropertyValue>();

    private constructor() {
        if (DynamicPropertyManager.instance) {
            return DynamicPropertyManager.instance;
        }
        DynamicPropertyManager.instance = this;
    }

    public static getInstance(): DynamicPropertyManager {
        if (!DynamicPropertyManager.instance) {
            DynamicPropertyManager.instance = new DynamicPropertyManager();
        }
        return DynamicPropertyManager.instance;
    }

    setProperty(player: Player | undefined, name: string, value: PropertyValue): void {
        // Update the cache with the new value
        this.propertyCache.set(name, value);

        const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
        let currentIndex = 0;
        let remainingValue = serializedValue;

        while (remainingValue.length > 0) {
            const chunk = remainingValue.slice(0, 32766);
            const propertyName = currentIndex === 0 ? name : `${name}_${currentIndex}`;

            if (player) {
                player.setDynamicProperty(propertyName, chunk);
            } else {
                world.setDynamicProperty(propertyName, chunk);
            }

            remainingValue = remainingValue.slice(32766);
            currentIndex++;
        }
    }

    getProperty(player: Player | undefined, name: string): PropertyValue | undefined {
        // Check the cache first
        if (this.propertyCache.has(name)) {
            return this.propertyCache.get(name);
        }

        let serializedValue: string | undefined = player ? (player.getDynamicProperty(name) as string) : (world.getDynamicProperty(name) as string);

        let index = 0;
        while (true) {
            const propertyName = `${name}_${index}`;
            const partValue = player ? player.getDynamicProperty(propertyName) : world.getDynamicProperty(propertyName);
            if (partValue === undefined) {
                break;
            }
            serializedValue = serializedValue ? serializedValue + (partValue as string) : (partValue as string);
            index++;
        }

        if (serializedValue) {
            const deserializedValue = JSON.parse(serializedValue);
            // Cache the value for future access
            this.propertyCache.set(name, deserializedValue);
            return deserializedValue;
        }

        return undefined;
    }

    deleteProperty(player: Player | Entity | undefined, name: string): void {
        // Clear the cache for the deleted property
        this.propertyCache.delete(name);

        let index = 0;
        while (true) {
            const dynamicPropertyName = `${name}_${index}`;
            const existingValue = player ? player.getDynamicProperty(dynamicPropertyName) : world.getDynamicProperty(dynamicPropertyName);
            if (existingValue === undefined) {
                break;
            }

            if (player) {
                player.setDynamicProperty(dynamicPropertyName, undefined);
            } else {
                world.setDynamicProperty(dynamicPropertyName, undefined);
            }

            index++;
        }
    }

    /**
     * Check if a dynamic property exists for a specific player by its name.
     * @param player The player object.
     * @param name The name of the property.
     * @returns True if the property exists, false otherwise.
     */
    hasProperty(player: Player, name: string): boolean {
        // Check for the existence of the property in the dynamic property registry
        return player.getDynamicProperty(name) !== undefined;
    }
}
