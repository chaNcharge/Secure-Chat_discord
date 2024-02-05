// Function to generate a random encryption key
function generateKey() {
    return window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }
  
  // Function to encrypt a message
  async function encryptMessage(message, key) {
    const encodedMessage = new TextEncoder().encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encodedMessage
    );
  
    return {
      iv: iv,
      data: new Uint8Array(encryptedData),
    };
  }
  
  // Function to decrypt a message
  async function decryptMessage(encryptedMessage, key) {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: encryptedMessage.iv,
      },
      key,
      encryptedMessage.data
    );
  
    return new TextDecoder().decode(decryptedData);
  }
  
  // Example usage
  (async () => {
    const key = await generateKey();
    const plaintext = "Hello, world!";
    const encryptedMessage = await encryptMessage(plaintext, key);
    console.log("Encrypted message:", encryptedMessage);
    const decryptedMessage = await decryptMessage(encryptedMessage, key);
    console.log("Decrypted message:", decryptedMessage);
  })();