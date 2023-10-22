import crypto from "node:crypto";

import {Err, KResult, Ok} from "./errors";

export function encryptDataWithKey(secretData: string, key: Uint8Array): Uint8Array {
    const algorithm = 'aes-256-gcm';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(secretData, 'utf8');
    encrypted = Buffer.concat([iv, encrypted, cipher.final()]);
    return new Uint8Array(encrypted);
}

export function decryptDataWithKey(encrypted: Uint8Array, key: Uint8Array): string {
    const algorithm = 'aes-256-gcm';
    const iv = encrypted.slice(0, 16);
    const encData = encrypted.slice(16);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encData);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return new TextDecoder().decode(decrypted);
}
