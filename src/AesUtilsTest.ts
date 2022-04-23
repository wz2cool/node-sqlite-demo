import * as util from "util";
import { AesUtils } from "./AesUtils";

export class AesUtilsTest {

    public static run() {
        const saltBase64 = "lSWCXn/R8iz/6CyywXzTzg==";
        const ivBase64 = "H/l/N3r2NcpANQwOwVDK4A==";
        const pass = "408d5cfffe6639e9-000040b4-00000010-27e724f01d0e22a3-ca8e54fa";
        const encryptBase64 = "qd86CknbcwImeews/zhhKw==";

        const salt = AesUtils.toU8Array(saltBase64);
        const iv = AesUtils.toU8Array(ivBase64)
        const encrypt = AesUtils.toU8Array(encryptBase64);

        const key = AesUtils.generateKey(salt, pass);
        const resultStr = AesUtils.decryptBase64(key, iv, encryptBase64)
        console.log(resultStr);

        const resultArray = AesUtils.decryptU8Array(key, iv, encrypt);
        const resultStr2 = new util.TextDecoder().decode(resultArray);
        console.log(resultStr2);

        const base64 = Buffer.from("test test", "utf-8");
        const encrypt1 = AesUtils.encryptU8Array(key, iv, base64);
        const resultArray3 = AesUtils.decryptU8Array(key, iv, encrypt1);
        const resultStr3 = new util.TextDecoder().decode(resultArray3);
        console.log(resultStr3);
    }
}