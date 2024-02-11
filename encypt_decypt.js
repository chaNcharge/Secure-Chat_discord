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

//Import Modules with UTF-16 input and output
const CryptoJS = require('crypto-js');

// AES encryption function
function encryptMessage(message, passphrase) 
{
  // Encrypt the message 
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf16.parse(message), CryptoJS.enc.Utf16.parse(passphrase)).toString();
  return encrypted;
}

// AES decryption function with UTF-16 input and output
function decryptMessage(encryptedMessage, passphrase)
{
   // Decrypt the message
   const decrypted = CryptoJS.AES.decrypt(encryptedMessage, CryptoJS.enc.Utf16.parse(passphrase)).toString(CryptoJS.enc.Utf16);
   return decrypted;
}

// Example usage:
const secretPassphrase = 'supersecretPassphrase'; // Replace with your secret passphrase

// Sender encrypts the message
const senderMessage = "Hello, receiver!";
const encryptedMessage = encryptMessage(senderMessage, secretPassphrase);
console.log("Encrypted message:", encryptedMessage);

// Receiver decrypts the message
const decryptedMessage = decryptMessage(encryptedMessage, secretPassphrase);
console.log("Decrypted message:", decryptedMessage);