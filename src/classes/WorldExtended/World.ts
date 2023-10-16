import { World } from "@minecraft/server";
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
}
