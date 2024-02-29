const CryptoJS = require('crypto-js');
const NodeRSA = require('node-rsa');

console.log("Generating RSA key pairs for Alice and Bob...");

// Generate RSA key pair for Alice
const aliceKeys = new NodeRSA({ b: 2048 });
const alicePublicKey = aliceKeys.exportKey('pkcs1-public-pem');
const alicePrivateKey = aliceKeys.exportKey('pkcs1-private-pem');

// Generate RSA key pair for Bob
const bobKeys = new NodeRSA({ b: 2048 });
const bobPublicKey = bobKeys.exportKey('pkcs1-public-pem');
const bobPrivateKey = bobKeys.exportKey('pkcs1-private-pem');

console.log("RSA key pairs generation complete.");

// Encrypt passphrase with Bob's public key
function encryptPassphrase(passphrase, publicKey) {
    const key = new NodeRSA(publicKey, 'pkcs1-public-pem');
    return key.encrypt(passphrase, 'base64');
}

// Decrypt passphrase with Bob's private key
function decryptPassphrase(encryptedPassphrase, privateKey) {
    const key = new NodeRSA(privateKey, 'pkcs1-private-pem');
    return key.decrypt(encryptedPassphrase, 'utf8');
}

// AES encryption function (using decrypted passphrase)
function encryptMessage(message, passphrase) {
    const encrypted = CryptoJS.AES.encrypt(message, passphrase).toString();
    return encrypted;
}

// AES decryption function (using decrypted passphrase)
function decryptMessage(encryptedMessage, passphrase) {
    const decrypted = CryptoJS.AES.decrypt(encryptedMessage, passphrase).toString(CryptoJS.enc.Utf8);
    return decrypted;
}

// Example usage (simulates how the functions can be used between two parties)
// Public keys will be sent over insecure channel before anything else
const senderMessage = "Hello, receiver!";
console.log("Original message:", senderMessage);

// Alice encrypts passphrase with Bob's public key, then sends to Bob
const secretPassphrase = "youshallnotpass";
const encryptedPassphrase = encryptPassphrase(secretPassphrase, bobPublicKey);
// Send encryptedPassphrase to Bob here (done over insecure channel)

// Bob receives encrypted passphrase from Alice, then decrypts passphrase with Bob's private key
const decryptedPassphrase = decryptPassphrase(encryptedPassphrase, bobPrivateKey);
console.log("Decrypted passphrase:", decryptedPassphrase.toString());
// Now they should both have the passphrase, successfully shared over an insecure channel

// Sender (Alice) encrypts the message with secretPassphrase
const encryptedMessage = encryptMessage(senderMessage, decryptedPassphrase.toString());
console.log("Encrypted message:", encryptedMessage);

// Receiver (Bob) decrypts the message using decrypted passphrase
const decryptedMessage = decryptMessage(encryptedMessage, decryptedPassphrase.toString());
console.log("Decrypted message:", decryptedMessage);
