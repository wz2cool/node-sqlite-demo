import * as crypto from "crypto";
import * as util from "util";

export class AesUtils {

    public static generateKey(salt: Uint8Array, passphrase: string) {
        return crypto.pbkdf2Sync(passphrase, salt, 1000, 128 / 8, "sha1");
    }

    public static decryptBase64(key: Buffer, iv: Uint8Array, cryptedBase64: string): string {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        let decoded = decipher.update(cryptedBase64, "base64", 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    }

    public static decryptU8Array(key: Buffer, iv: Uint8Array, cryptedU8Array: Uint8Array): Buffer {
        const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.update(cryptedU8Array);
        return decipher.final();
    }

    public static toU8Array(base64: String): Uint8Array {
        return Buffer.from(base64, 'base64');
    }

    public static toHexString(byteArray: Uint8Array): string {
        return Array.from(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('')
    }
}