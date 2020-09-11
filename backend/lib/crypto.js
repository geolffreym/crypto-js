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

require('dotenv').config()
const crypto = require('crypto')
const ENV = process.env

module.exports = class Crypto {

    constructor(params = null) {
        /***
         * Initialize Crypto object
         * @param {Map} params - Crypto settings
         */
        if (params && !(params instanceof Map))
            throw new Error('WeakMap instance needed as params')
        this.p = params || this.buildParamsFromEnv()

    }

    buildParamsFromEnv() {
        /***
         * Get params from .env file
         * @return {Map}
         */
        return new Map(
            Array.from(
                this.paramsIterator()
            )
        )
    }

    * paramsIterator() {
        /***
         * Params generator from .env file
         * @return {Iterable}
         */
        for (const p of Object.keys(ENV)) {
            if (/CRYPTO_/gm.test(p))
                yield [p.toLowerCase(), ENV[p]]

        }
    }

    decrypt(privateKey, dataBuffer) {
        /***
         * Return decrypted string
         * @param {Buffer}
         * @return {String}
         */
        return crypto.privateDecrypt(
            {
                key: privateKey.toString(),
                padding: crypto.RSA_PKCS1_PADDING,
                passphrase: this.p.get('crypto_pv_passphrase')
            }, dataBuffer
        )
    }

    convertPemToBinary(pem) {
        let encoded = ''
        let lines = pem.split('\n');
        lines.map((line) => {
            if (line.trim().length > 0 &&
                line.search('-BEGIN ENCRYPTED PRIVATE KEY-') < 0 &&
                line.search('-END ENCRYPTED PRIVATE KEY-') < 0) {
                encoded += line.trim()
            }
        })
        return encoded
    }

    getPair() {
        /***
         * Generate PV and PUB Keys based on settings
         * @return {Object}
         */
        return crypto.generateKeyPairSync(
            this.p.get('crypto_type'), {
                // The standard secure default length for RSA keys is 2048 bits
                modulusLength: 2048,
                publicKeyEncoding: {
                    type: this.p.get('crypto_pub_type'),
                    format: this.p.get('crypto_format')
                },
                privateKeyEncoding: {
                    type: this.p.get('crypto_pv_type'),
                    format: this.p.get('crypto_format'),
                    cipher: this.p.get('crypto_pv_cipher'),
                    passphrase: this.p.get('crypto_pv_passphrase')
                }
            }
        )
    }

}
