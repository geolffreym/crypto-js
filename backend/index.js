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

const Crypto = require('./lib/crypto');
const CryptoObj = new Crypto();

// console.log(CryptoObj.getPair())

const pv = '-----BEGIN ENCRYPTED PRIVATE KEY-----\n' +
    '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\n' +
    '-----END ENCRYPTED PRIVATE KEY-----\n'


let buffer = new Buffer(
    'Xkth5Kvd/almzTi0ZW3w+2AN3ovhTGL5hsYKyBSgWMTUHnJOyv389pVnMsOdZVpSzP7lsaK24fFiLsQv+m3goA0W9w2G2XAS9tKYVzcxDKr5QM4kqnQuuyZU8Ext4pkDG7sV8mFM8TMbsePVanCFe/SKZGxLP75FThh0wwWUV8rCNXFMqLCUX/6epwh8qWRM0xf/+AyGygOoh8v3bAgcZZMVE61Gfs0kS+jN7RG/n0l+M8MeD9bOpoBG20/yk/30nPry08Dit6tKS+trtGiWcq2124swnYccPaNQbjuzv7qbDMlPadfmNTYx1tzStB2AyWHQeNWf3dj5UVQeqsC2tA==',
    'ascii'
    )
console.log(CryptoObj.decrypt(pv, buffer));