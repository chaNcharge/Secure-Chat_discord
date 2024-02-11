/* 
HEADER:
This is a file for Secure discord project this file hold the encytion and decyption functions using AES.
This will allow users to send messages back and forth encytped once key is shared. 
e2e.js will use RSA and a random key generator to allow users to Verify that only the intended user gets the Message

Please Note infromation  and resources used in this file will be listed in the links below
1) https://cryptojs.gitbook.io/docs/
2) https://nodejs.org/api/crypto.html
3) https://developer.ibm.com/articles/secure-javascript-applications-with-web-crypto-api/
*/
const crypto = require('crypto');

// Function to generate a secure key from passphrase
function generateKey(passphrase) {
  return crypto.createHash('sha256').update(passphrase).digest();
}

// AES encryption function
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

// AES decryption function
function decryptMessage(encryptedMessage, passphrase, iv) {
  const key = generateKey(passphrase);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));
  let decrypted = decipher.update(encryptedMessage, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Example usage:
const secretPassphrase = 'supersecretPassphrase'; // Replace with your secret passphrase

// Sender encrypts the message
const senderMessage = "Hello, receiver!";
const { iv, encryptedMessage } = encryptMessage(senderMessage, secretPassphrase);
console.log("Encrypted message:", encryptedMessage);
console.log("Initialization Vector (IV):", iv);

// Receiver decrypts the message
const decryptedMessage = decryptMessage(encryptedMessage, secretPassphrase, iv);
console.log("Decrypted message:", decryptedMessage);
