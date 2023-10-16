import { World, world } from "@minecraft/server";
import CryptoJS from "../../node_modules/crypto-es/lib/index.js";

export interface WorldExtended extends World {
    /**
     * Hashes a given string with the specified salt value using SHA-3 (SHA3-256) encryption.
     *
     * @param {string} salt - Hashes information
     * @param {string} str - String to be hashed
     * @returns {string} The hashed string
     */
    hashWithSalt(salt: string, str: string): string | null;

    /**
     * Encrypts a string using AES encryption with the specified salt as the key.
     *
     * @param {string} str - The string to encrypt
     * @param {string} salt - The salt to use as the key for encryption
     * @returns {string} The encrypted string
     */
    encryptString(str: string, salt: string): string;

    /**
     * Decrypts a string using AES encryption with the specified salt as the key.
     *
     * @param {string} str - The string to decrypt
     * @param {string} salt - The salt to use for decryption
     * @returns {string} The decrypted string
     */
    decryptString(str: string, salt: string): string;

    /**
     * Converts a string to camelCase.
     * @param {string} str - The input string.
     * @returns {string} The camelCase string.
     */
    toCamelCase(str: string): string;

    /**
     * Converts a string to PascalCase.
     * @param {string} str - The input string.
     * @returns {string} The PascalCase string.
     */
    toPascalCase(str: string): string;

    /**
     * Converts a string to Title Case.
     * @param {string} str - The input string.
     * @returns {string} The Title Case string.
     */
    titleCase(str: string): string;
}

function hashWithSalt(salt: string, text: string): string | null {
    if (typeof salt !== "string") {
        return null;
    }
    const combinedString = salt + text;
    const hash = CryptoJS.SHA3(combinedString, { outputLength: 256 }).toString();
    return hash.substring(0, 50);
}

function encryptString(str: string, salt: string): string {
    const encrypted = CryptoJS.AES.encrypt(str, salt).toString();
    return "1337" + encrypted;
}

function decryptString(str: string, salt: string): string {
    str = str.slice(4); // Remove the prefix added in the encryptString function
    const decryptedBytes = CryptoJS.AES.decrypt(str, salt);
    const plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}

function toCamelCase(str: string): string {
    const regExp = /[^a-zA-Z0-9]+(.)/gi;
    return str.replace(regExp, (match) => {
        return match[1].toUpperCase();
    });
}

function toPascalCase(str: string): string {
    const camelCase = (world as WorldExtended).toCamelCase(str);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

function titleCase(str: string): string {
    return str.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase()).replace(/[-_]+(.)/g, (_, c) => " " + c.toUpperCase());
}

export function extendWorldPrototype() {
    (World.prototype as WorldExtended).hashWithSalt = function (salt: string, str: string): string | null {
        return hashWithSalt(salt, str);
    };

    (World.prototype as WorldExtended).encryptString = function (str: string, salt: string): string {
        return encryptString(str, salt);
    };

    (World.prototype as WorldExtended).decryptString = function (str: string, salt: string): string {
        return decryptString(str, salt);
    };

    (World.prototype as WorldExtended).toCamelCase = function (str: string): string {
        return toCamelCase(str);
    };

    (World.prototype as WorldExtended).toPascalCase = function (str: string): string {
        return toPascalCase(str);
    };

    (World.prototype as WorldExtended).titleCase = function (str: string): string {
        return titleCase(str);
    };
}
