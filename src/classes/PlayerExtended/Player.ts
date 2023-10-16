import { GameMode, Player, world } from "@minecraft/server";

export interface PlayerExtended extends Player {
    /**
     * Checks if the player is in the specified game mode.
     * @param {string} gamemode - The game mode to check (e.g., "creative").
     * @returns {boolean} Returns true if the player is in the specified game mode, false otherwise.
     */
    isGameMode(gamemode: string): boolean;

    /**
     * Gets the game mode of the player.
     * @returns {string | undefined} The game mode of the player as a string, or undefined if the player is not found.
     */
    getGameMode(): string | undefined;
}

function isPlayerInGameMode(player: Player, gamemode: string): boolean {
    return world.getPlayers({ name: player.name, gameMode: gamemode as GameMode }).length > 0;
}

function getGameModeForPlayer(player: Player): string | undefined {
    const playerName = player.name;
    const gamemodeValues = Object.values(GameMode);

    for (const gamemode of gamemodeValues) {
        const gameModePlayer = world.getPlayers({ name: playerName, gameMode: gamemode });

        if (gameModePlayer.length > 0) {
            switch (gamemode) {
                case GameMode.creative:
                    return "creative";
                case GameMode.survival:
                    return "survival";
                case GameMode.adventure:
                    return "adventure";
                case GameMode.spectator:
                    return "spectator";
            }
        }
    }

    return undefined;
}

export function extendPlayerPrototype() {
    (Player.prototype as PlayerExtended).isGameMode = function (gamemode) {
        return isPlayerInGameMode(this, gamemode);
    };

    (Player.prototype as PlayerExtended).getGameMode = function () {
        return getGameModeForPlayer(this);
    };
}
