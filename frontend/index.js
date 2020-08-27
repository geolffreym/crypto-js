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
        window.crypto = window.crypto || window.msCrypto
        if (!window.crypto) throw Error('Crypto not supported.')
        // Keep attribute private crypto handler
        this._crypt = window.crypto.subtle
        this._sign = {
            name: "RSASSA-PSS",
            modulusLength: 2048,
            extractable: false,
            publicExponent: 0x10001
        }

    }

    base64StringToArrayBuffer(b64str) {
        let byteStr = atob(b64str)
        let bytes = new Uint8Array(byteStr.length)
        for (let i = 0; i < byteStr.length; i++) {
            bytes[i] = byteStr.charCodeAt(i)
        }
        return bytes.buffer
    }

    convertPemToBinary(pem) {
        let encoded = ''
        let lines = pem.split('\n')
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().length > 0 &&
                lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
                lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
                lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
                lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
                encoded += lines[i].trim()
            }
        }
        return this.base64StringToArrayBuffer(encoded)
    }

    importKey() {
        this._crypt.importKey('spki', this._sign, {
            name: "RSA-OAEP"
        }, false, ["encrypt"])
    }

    crypt(data, pub) {
        this._crypt.encrypt(
            {
                name: 'RSA-PSS'
            }, pub, data
        )
    }

}