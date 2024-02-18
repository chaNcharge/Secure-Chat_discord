const crypto = require('crypto');

console.log("Generating diffie hellman keys... (this may take a minute)");
// Generate Diffie-Hellman keys for Alice
const alice = crypto.createDiffieHellman(2048); // You can adjust the key size as needed
const aliceKeys = alice.generateKeys();

// Generate Diffie-Hellman keys for Bob
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKeys = bob.generateKeys();

console.log("Exchanging keys...");

// Exchange public keys between Alice and Bob
const aliceSecret = alice.computeSecret(bobKeys);
const bobSecret = bob.computeSecret(aliceKeys);

console.log("Keys exchanged, use as passphrase");

// Now both Alice and Bob have the shared secret, which they can use as the passphrase
const secretPassphrase = aliceSecret.toString('base64'); // Convert shared secret to passphrase

// Function to generate a secure key from passphrase
function generateKey(passphrase) {
    return crypto.createHash('sha256').update(passphrase).digest();
}

// AES encryption function (using secretPassphrase)
function encryptMessage(message, passphrase) {
    const key = generateKey(passphrase);
    const iv = crypto.randomBytes(16); // Generate a random IV (Initialization Vector)
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(message, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return {
        iv: iv.toString('base64'), // Convert IV to base64 string for storage/transfer
        encryptedMessage: encrypted
    };
}

// AES decryption function (using exchangedPassphrase)
function decryptMessage(encryptedMessage, passphrase, iv) {
    const key = generateKey(passphrase);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
    let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Example usage:
// Sender (Alice) encrypts the message with secretPassphrase
const senderMessage = "Hello, receiver!";
const { iv, encryptedMessage } = encryptMessage(senderMessage, secretPassphrase);
console.log("Encrypted message:", encryptedMessage);
console.log("Initialization Vector (IV):", iv);
console.log(secretPassphrase);

// Receiver (Bob) decrypts the message using exchangedPassphrase
const decryptedMessage = decryptMessage(encryptedMessage, bobSecret.toString('base64'), iv);
console.log("Decrypted message:", decryptedMessage);
