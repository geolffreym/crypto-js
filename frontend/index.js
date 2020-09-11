/**
 * Copyright (c) 2020 ZorrillosDev

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 *
 */

export default class Crypto {

    constructor() {
        if (!window.crypto) throw Error('Crypto not supported.')
        // Keep attribute private crypto handler
        this._crypt = window.crypto.subtle
        this._sign = {
            modulusLength: 2048, name: "RSA-OAEP",
            hash: {name: "SHA-1"}
        };
    }

    base64StringToArrayBuffer(base64) {
        let binary_string = atob(base64);
        return this.stringToArrayBuffer(binary_string)
    }

    stringToArrayBuffer(binary_string) {
        let len = binary_string.length;
        let bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    convertPemToBinary(pem) {
        let encoded = ''
        let lines = pem.split('\n');
        lines.map((line) => {
            if (line.trim().length > 0 &&
                line.search('-BEGIN RSA PUBLIC KEY-') < 0 &&
                line.search('-BEGIN PUBLIC KEY-') < 0 &&
                line.search('-END PUBLIC KEY-') < 0 &&
                line.search('-END RSA PUBLIC KEY-') < 0) {
                encoded += line.trim()
            }
        })
        return encoded
    }

    checkJSON(str) {
        try {
            return new Uint8Array(
                JSON.parse(str)
            ).buffer
        } catch (e) {
            return str
        }
    }

    str2abUtf8(myString) {
        console.log(this.checkJSON(myString));
        return new TextEncoder('utf8').encode(
            this.checkJSON(myString)
        )
    }

    arrayBufferToBase64String(arrayBuffer) {
        let byteString = '';
        let byteArray = new Uint8Array(arrayBuffer)
        for (let i = 0; i < byteArray.byteLength; i++) {
            byteString += String.fromCharCode(byteArray[i]);
        }
        return btoa(byteString);
    }

    importKey(pem) {
        let key = this.convertPemToBinary(pem)
        key = this.base64StringToArrayBuffer(key)
        return this._crypt.importKey('spki', key,
            this._sign, false, ["encrypt"]
        )
    }

    crypt(data, pub) {
        return new Promise((res) => {
            this.importKey(pub).then((key) => {
                this._crypt.encrypt(
                    this._sign, key, this.str2abUtf8(data),
                ).then(res).catch((e) => console.log(e))
            })
        })
    }

    decrypt() {

    }
}

// Global crypto
window.CryptoObj = new Crypto()