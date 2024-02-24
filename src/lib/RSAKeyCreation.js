const crypto = require("crypto");
const fs = require("fs");

/**
 * Creates RSA keypair in the given `filepath` and appends user ID
 * at the end of the file name. ID should be the user's Discord user ID.
 * @param {string} filepath The directory to where the keys will be generated
 * @param {string | number} id The user id of the user, to be appended in the file name
 */
export function createKeyPair(filepath, id) {
    const keys = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    });
    fs.writeFileSync(filepath + `/public-${id}.pem`, keys.publicKey);
    fs.writeFileSync(filepath + `/private-${id}.pem`, keys.privateKey);
    // Notify user to send public key to other user here
}