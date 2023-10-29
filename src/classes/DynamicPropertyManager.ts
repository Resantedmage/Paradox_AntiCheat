import { world, Vector3, Player } from "@minecraft/server";

type PropertyValue = string | number | boolean | Vector3 | object;

export class DynamicPropertyManager {
    private static instance: DynamicPropertyManager | null = null; // Singleton instance

    private constructor() {
        // Initialize the Singleton instance
        if (DynamicPropertyManager.instance) {
            return DynamicPropertyManager.instance;
        }
        DynamicPropertyManager.instance = this;
    }

    /**
     * Get the Singleton instance of the DynamicPropertyManager class.
     * If an instance doesn't exist, it will be created.
     * @returns The Singleton instance of DynamicPropertyManager.
     */
    public static getInstance(): DynamicPropertyManager {
        if (!DynamicPropertyManager.instance) {
            DynamicPropertyManager.instance = new DynamicPropertyManager();
        }
        return DynamicPropertyManager.instance;
    }

    /**
     * Set a dynamic property with a name and value for a specific player or globally.
     * @param player The player object (use undefined for global properties).
     * @param name The name of the property.
     * @param value The value of the property.
     */
    setProperty(player: Player | undefined, name: string, value: PropertyValue): void {
        const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
        let currentIndex = 0;
        let remainingValue = serializedValue;

        while (remainingValue.length > 0) {
            const chunk = remainingValue.slice(0, 32766);
            const propertyName = currentIndex === 0 ? name : `${name}_${currentIndex}`;

            // Conditionally select the appropriate method
            if (player) {
                player.setDynamicProperty(propertyName, chunk);
            } else {
                world.setDynamicProperty(propertyName, chunk);
            }

            remainingValue = remainingValue.slice(32766);
            currentIndex++;
        }
    }

    /**
     * Get the value of a dynamic property by its name for a specific player or globally.
     * @param player The player object (use undefined for global properties).
     * @param name The name of the property.
     * @returns The value of the property or undefined if it doesn't exist.
     */
    getProperty(player: Player | undefined, name: string): PropertyValue | undefined {
        let serializedValue: string | undefined = player ? (player.getDynamicProperty(name) as string) : (world.getDynamicProperty(name) as string);

        // Check for properties with prefixes
        let index = 0;
        while (true) {
            const propertyName = `${name}_${index}`;
            const partValue = player ? player.getDynamicProperty(propertyName) : world.getDynamicProperty(propertyName);
            if (partValue === undefined) {
                break;
            }
            // Join the split parts
            serializedValue = serializedValue ? serializedValue + (partValue as string) : (partValue as string);
            index++;
        }

        if (serializedValue) {
            return JSON.parse(serializedValue);
        }

        return undefined;
    }

    /**
     * Delete a dynamic property and its affiliated properties for a specific player or globally by name.
     * @param player The player object (use undefined for global properties).
     * @param name The name of the property to delete.
     */
    deleteProperty(player: Player | undefined, name: string): void {
        let index = 0;
        while (true) {
            const dynamicPropertyName = `${name}_${index}`;
            const existingValue = player ? player.getDynamicProperty(dynamicPropertyName) : world.getDynamicProperty(dynamicPropertyName);
            if (existingValue === undefined) {
                break; // Stop the loop when there are no more properties to delete
            }

            // Conditionally select the appropriate method
            if (player) {
                player.setDynamicProperty(dynamicPropertyName, undefined);
            } else {
                world.setDynamicProperty(dynamicPropertyName, undefined);
            }

            index++;
        }
    }
}
