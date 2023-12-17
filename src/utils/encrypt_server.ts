import crypto from "node:crypto";

import { Err, KResult, Ok } from "./errors";

export function encryptDataWithKey(
    secretData: string,
    key: Uint8Array,
): Uint8Array {
    const algorithm = "aes-256-gcm";
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(secretData, "utf8"),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();
    return Uint8Array.from(Buffer.concat([iv, authTag, encrypted]));
}

export function decryptDataWithKey(
    encrypted: Uint8Array,
    key: Uint8Array,
): string {
    const algorithm = "aes-256-gcm";
    const iv = encrypted.slice(0, 16);
    const authTag = encrypted.slice(16, 32);
    const encData = encrypted.slice(32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([
        decipher.update(encData),
        decipher.final(),
    ]);
    return new TextDecoder().decode(decrypted);
}
