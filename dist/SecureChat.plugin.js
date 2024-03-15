/**
 * @name SecureChat
 * @description Describe the basic functions. Maybe a support server link.
 * @author Ethan Cha, Daniel Willard
 * @version 1.0.0
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/components/DecryptButton.jsx":
/*!******************************************!*\
  !*** ./src/components/DecryptButton.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DecryptButton: () => (/* binding */ DecryptButton)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/hybridencrypt */ "./src/lib/hybridencrypt.js");
/* harmony import */ var _lib_AESKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/AESKey */ "./src/lib/AESKey.js");
/* harmony import */ var _lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/RSAKeyCreation */ "./src/lib/RSAKeyCreation.js");




function DecryptButton() {
  const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
  const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
  const messageActions = BdApi.Webpack.getByKeys("sendMessage");
  const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
  let channelId = SelectedChannelStore.getChannelId();
  let userId = userIdModule.getCurrentUser().id;
  let ciphertextStr = "";
  function TextInput(props) {
    return BdApi.React.createElement("textarea", {
      style: {
        width: 'calc(100% - 4px)',
        height: '80px',
        resize: 'none'
      },
      placeholder: props.placeholder || "Paste ciphertext JSON to decrypt",
      onChange: props?.onChange
    });
  }
  BdApi.UI.showConfirmationModal("Decrypt Text: Make sure you have already exchanged AES keys first!", BdApi.React.createElement(TextInput, {
    placeholder: "Paste ciphertext JSON to decrypt",
    onChange: event => {
      ciphertextStr = event.target.value;
    }
  }), {
    confirmText: "Decrypt",
    cancelText: "Cancel",
    onConfirm: () => {
      try {
        const ciphertextObj = JSON.parse(ciphertextStr);
        (async () => {
          try {
            // only run this block of code if PRIVATE-<channel-id>.key is NOT present in pluginDirectory, non-private key is encrypted
            if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(`${pluginDirectory}/PRIVATE-${channelId}.key`)) {
              const aesKeyFile = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, 'utf8');
              const aesKey = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_2__.importAESKey)(aesKeyFile);
              const decryptedText = await (0,_lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__.decryptMessage)(aesKey, ciphertextObj.ciphertext, ciphertextObj.iv);
              BdApi.UI.alert("Decrypted Text", decryptedText);
            } else {
              // Runs when no unencrypted aes key exists, aka you received an encrypted key and can decrypt it with YOUR private key
              console.log("Decrypting AES key");
              const encryptedAESkey = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, 'utf8');
              const privKeyFile = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/private-${userId}.pem`, 'utf8');
              const privKey = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_3__.importRSAKey)(privKeyFile, 'private');
              const decryptedAESkey = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_2__.decryptAESKey)(encryptedAESkey, privKey);
              const decryptedText = await (0,_lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__.decryptMessage)(decryptedAESkey, ciphertextObj.ciphertext, ciphertextObj.iv);
              BdApi.UI.alert("Decrypted text", decryptedText);
            }
          } catch (error) {
            BdApi.UI.alert("Error", "Invalid ciphertext, key, or key not found for this channel.");
            console.error(error);
          }
        })();
      } catch (error) {
        BdApi.UI.alert("Error", "Invalid JSON format. Make sure you copied and pasted the ciphertext object correctly");
      }
    },
    onCancel: () => console.log("Pressed 'Cancel' or escape")
  });
}

/***/ }),

/***/ "./src/components/EncryptButton.jsx":
/*!******************************************!*\
  !*** ./src/components/EncryptButton.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EncryptButton: () => (/* binding */ EncryptButton)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/hybridencrypt */ "./src/lib/hybridencrypt.js");
/* harmony import */ var _lib_AESKey__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/AESKey */ "./src/lib/AESKey.js");
/* harmony import */ var _lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../lib/RSAKeyCreation */ "./src/lib/RSAKeyCreation.js");




function EncryptButton() {
  const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
  const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
  const messageActions = BdApi.Webpack.getByKeys("sendMessage");
  const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
  let channelId = SelectedChannelStore.getChannelId();
  let userId = userIdModule.getCurrentUser().id;
  let message = "";
  function TextInput(props) {
    return BdApi.React.createElement("textarea", {
      style: {
        width: 'calc(100% - 4px)',
        height: '80px',
        resize: 'none'
      },
      placeholder: props.placeholder || "Enter plaintext to encrypt",
      onChange: props?.onChange
    });
  }
  function sendMessage(content) {
    messageActions.sendMessage(SelectedChannelStore.getChannelId(), {
      content,
      invalidEmojis: [],
      tts: false,
      validNonShortcutEmojis: []
    });
  }
  BdApi.UI.showConfirmationModal("Encrypt Text: Make sure you have already exchanged AES keys first!", BdApi.React.createElement(TextInput, {
    placeholder: "Enter plaintext to encrypt...",
    onChange: event => {
      message = event.target.value;
    }
  }), {
    confirmText: "Send",
    cancelText: "Cancel",
    onConfirm: () => {
      (async () => {
        try {
          // only run this block of code if PRIVATE-<channel-id>.key is NOT present in pluginDirectory, non-private key is encrypted
          if (fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(`${pluginDirectory}/PRIVATE-${channelId}.key`)) {
            const aesKeyFile = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, 'utf8');
            const aesKey = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_2__.importAESKey)(aesKeyFile);
            const encryptedTextObj = await (0,_lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__.encryptMessage)(aesKey, message);
            sendMessage("```" + JSON.stringify(encryptedTextObj) + "```");
          } else {
            // Runs when no unencrypted aes key exists, aka you received an encrypted key and can decrypt it with YOUR private key
            console.log("Decrypting AES key");
            const encryptedAESkey = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, 'utf8');
            const privKeyFile = fs__WEBPACK_IMPORTED_MODULE_0___default().readFileSync(`${pluginDirectory}/private-${userId}.pem`, 'utf8');
            const privKey = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_3__.importRSAKey)(privKeyFile, 'private');
            const decryptedAESkey = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_2__.decryptAESKey)(encryptedAESkey, privKey);
            const encryptedTextObj = await (0,_lib_hybridencrypt__WEBPACK_IMPORTED_MODULE_1__.encryptMessage)(decryptedAESkey, message);
            sendMessage("```" + JSON.stringify(encryptedTextObj) + "```");
          }
        } catch (error) {
          BdApi.UI.alert("Error", "Invalid key, or key not found for this channel. Generate a new key");
          console.error(error);
        }
      })();
    },
    onCancel: () => console.log("Pressed 'Cancel' or escape")
  });
}

/***/ }),

/***/ "./src/components/PasskeyGen.jsx":
/*!***************************************!*\
  !*** ./src/components/PasskeyGen.jsx ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PasskeyGen: () => (/* binding */ PasskeyGen)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_AESKey__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib/AESKey */ "./src/lib/AESKey.js");
/* harmony import */ var _lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/RSAKeyCreation */ "./src/lib/RSAKeyCreation.js");



function PasskeyGen() {
  const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
  const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
  const channelId = SelectedChannelStore.getChannelId();
  const keyExists = fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(pluginDirectory + `/PRIVATE-${channelId}.key`) || fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(pluginDirectory + `/PUBLIC-${channelId}.key`);

  // Note to user
  BdApi.UI.showConfirmationModal("Create Key", keyExists ? `You already have a key that exists for channel ID ${channelId}, are you sure you want to create a new key? This will __overwrite__ your existing key and you will not be able to decrypt older messages!` : `This will generate an AES key that is encrypted with the recipient's public key (recipient must send you this). This only needs to be done once per user by one user. This will only work in this DM. **DO NOT SEND THE KEY THAT BEGINS WITH \`PRIVATE-\`**`, {
    confirmText: "Create",
    cancelText: "Cancel",
    // Insert public key
    onConfirm: () => {
      BdApi.UI.showConfirmationModal("Insert recipient's public key", BdApi.React.createElement("input", {
        type: "file",
        accept: ".pem",
        id: "fileInput"
      }), {
        confirmText: "Submit",
        cancelText: "Cancel",
        // Process public key
        onConfirm: async () => {
          const fileInput = document.getElementById('fileInput');
          const file = fileInput.files[0]; // Get the first file from the input
          if (!file) {
            console.error("No file selected");
            return;
          }
          const reader = new FileReader();
          reader.onload = async event => {
            const pubKeyFile = event.target.result; // Contents of the file
            const pubKey = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_2__.importRSAKey)(pubKeyFile, 'public');
            // Generate a new random key
            const aesKey = await window.crypto.subtle.generateKey({
              name: "AES-GCM",
              length: 256
            }, true, ["encrypt", "decrypt"]);

            // Personal unencrypted copy so the sender can encrypt/decrypt their own messages. They will not send this
            const aesKeyStr = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_1__.exportAESKey)(aesKey);
            fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, aesKeyStr);
            // Encrypt the new AES key
            const encryptedAESkey = await (0,_lib_AESKey__WEBPACK_IMPORTED_MODULE_1__.encryptAESKey)(aesKey, pubKey);
            fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, encryptedAESkey);
            BdApi.UI.showToast(`AES key created. Send the PUBLIC-${channelId}.key file to recipient`, {
              type: "success",
              timeout: 8000
            });
            // Further processing with pubKey
          };
          reader.readAsText(file);
        },
        onCancel: () => console.log("Pressed 'Cancel' or escape")
      });
    },
    onCancel: () => console.log("Pressed 'Cancel' or escape")
  });
}

/***/ }),

/***/ "./src/components/PluginButtons.jsx":
/*!******************************************!*\
  !*** ./src/components/PluginButtons.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PluginButtons)
/* harmony export */ });
/* harmony import */ var _DecryptButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DecryptButton */ "./src/components/DecryptButton.jsx");
/* harmony import */ var _EncryptButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./EncryptButton */ "./src/components/EncryptButton.jsx");
/* harmony import */ var _PasskeyGen__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./PasskeyGen */ "./src/components/PasskeyGen.jsx");



function PluginButtons() {
  function renderContextMenu() {
    return BdApi.ContextMenu.buildMenu([{
      id: "create-key",
      label: "Create Key",
      onClick: () => {
        (0,_PasskeyGen__WEBPACK_IMPORTED_MODULE_2__.PasskeyGen)();
      }
    }, {
      id: "encrypt",
      label: "Encrypt Text",
      onClick: () => {
        (0,_EncryptButton__WEBPACK_IMPORTED_MODULE_1__.EncryptButton)();
      }
    }, {
      id: "decrypt",
      label: "Decrypt Ciphertext",
      onClick: () => {
        (0,_DecryptButton__WEBPACK_IMPORTED_MODULE_0__.DecryptButton)();
      }
    }]);
  }
  return BdApi.React.createElement("div", {
    id: "button-container",
    onContextMenu: e => BdApi.ContextMenu.open(e, renderContextMenu())
  }, BdApi.React.createElement("svg", {
    id: "svg-button",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "-5 -1 30 22",
    width: "44",
    height: "44"
  }, BdApi.React.createElement("path", {
    d: "M 16 6 A 1 1 0 0 0 4 6 V 13 A 1 1 0 0 1 16 13 V 6 H 14 V 13 H 16 M 4 13 H 6 V 6 H 4 V 9 A 1 1 0 0 0 16 17 A 1 1 0 0 0 4 9 V 6 H 6 A 1 1 0 0 1 14 5 V 7 A 1 0.1 0 0 0 6 7 M 11 14 V 16 A 1 1 0 0 1 9 16 V 14 A 1 0.3 0 0 0 11 14 M 9 14 A 1 1 0 0 1 11 11 A 1 1 0 0 1 9 14 M 4 13 A 1 1 0 0 0 16 13 M 13 13 V 18 H 7 V 13 M 6 13 H 7 V 10 M 14 13 H 13 M 13 10 V 13 V 10 H 7",
    stroke: "#7e8289",
    "stroke-width": "0",
    fill: "#b5bac1"
  })));
}

/***/ }),

/***/ "./src/lib/AESKey.js":
/*!***************************!*\
  !*** ./src/lib/AESKey.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decryptAESKey: () => (/* binding */ decryptAESKey),
/* harmony export */   encryptAESKey: () => (/* binding */ encryptAESKey),
/* harmony export */   exportAESKey: () => (/* binding */ exportAESKey),
/* harmony export */   importAESKey: () => (/* binding */ importAESKey)
/* harmony export */ });
/* harmony import */ var _ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArrayBuffer */ "./src/lib/ArrayBuffer.js");
/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */



/**
 * Encrypt AES key with RSA public key using Web Crypto API's SubtleCrypto interface
 * @param {CryptoKey} aesKey The AES key to encrypt
 * @param {CryptoKey} publicKey The RSA public key for encryption
 * @returns {Promise<string>} A promise resolving to the encrypted key as a base64-encoded string
 */
async function encryptAESKey(aesKey, publicKey) {
    const exportedKey = await window.crypto.subtle.exportKey('raw', aesKey);
    const encryptedPassphraseBuffer = await window.crypto.subtle.encrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, publicKey, exportedKey);
    return btoa((0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(encryptedPassphraseBuffer));
}

/**
 * Decrypt AES Key with RSA private key using Web Crypto API's SubtleCrypto interface
 * @param {string} encryptedAESKey The encrypted AES key as a base64-encoded string
 * @param {CryptoKey} privateKey The private key for decryption
 * @returns {Promise<CryptoKey>} A promise resolving to the decrypted passphrase
 */
async function decryptAESKey(encryptedAESKey, privateKey) {
    const encryptedAESKeyBuffer = (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.str2ab)(atob(encryptedAESKey));
    const decryptedAESKeyBuffer = await window.crypto.subtle.decrypt({
        name: 'RSA-OAEP',
        hash: { name: 'SHA-256' },
    }, privateKey, encryptedAESKeyBuffer);
    return window.crypto.subtle.importKey(
        'raw',
        decryptedAESKeyBuffer,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
}

/**
 * Export the given key and write it into the "exported-key" space as a base64 encoded string.
 * Note this is not encrypted
 */
async function exportAESKey(key) {
    const exported = await window.crypto.subtle.exportKey("raw", key);
    return btoa((0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(exported));
}

/**
 * Import an unencrypted raw AES secret key from a base64 encoded string containing the raw bytes.
 * Takes an base64 encoded string containing the bytes, and returns a Promise
 * that will resolve to a CryptoKey representing the secret key.
 */
async function importAESKey(rawKey) {
    const key = (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.str2ab)(atob(rawKey));
    return window.crypto.subtle.importKey("raw", key, "AES-GCM", true, [
        "encrypt",
        "decrypt",
    ]);
}

/***/ }),

/***/ "./src/lib/ArrayBuffer.js":
/*!********************************!*\
  !*** ./src/lib/ArrayBuffer.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ab2str: () => (/* binding */ ab2str),
/* harmony export */   str2ab: () => (/* binding */ str2ab)
/* harmony export */ });
/** 
* Convert an ArrayBuffer into a string
* from https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
*/
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/*
Convert a string into an ArrayBuffer
from https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
*/
function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

/***/ }),

/***/ "./src/lib/RSAKeyCreation.js":
/*!***********************************!*\
  !*** ./src/lib/RSAKeyCreation.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createKeyPair: () => (/* binding */ createKeyPair),
/* harmony export */   exportRSAKey: () => (/* binding */ exportRSAKey),
/* harmony export */   importRSAKey: () => (/* binding */ importRSAKey)
/* harmony export */ });
/* harmony import */ var _ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArrayBuffer */ "./src/lib/ArrayBuffer.js");
/**
 * Most functions borrowed from examples at SubtleCrypto docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto
 */



/**
 * Creates RSA keypair using Web Crypto API's SubtleCrypto interface.
 * @param {number} modulusLength The length of the modulus in bits
 * @returns {Promise<CryptoKeyPair>} A promise that resolves to an object containing the public and private keys
 */
async function createKeyPair(modulusLength) {
    let keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: modulusLength,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
    );
    return keyPair;
}

/**
 * Export key CryptoKey RSA object to string
 * @param {CryptoKey} key The CryptoKey object to export
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<string>} A promise resolving to a string encoded in base64 of the key object
 */
async function exportRSAKey(key, keyType) {
    if (keyType === "public") {
        const exported = await window.crypto.subtle.exportKey("spki", key);
        const exportedAsString = (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;
        return pemExported;
    } else {
        const exported = await window.crypto.subtle.exportKey("pkcs8", key);
        const exportedAsString = (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(exported);
        const exportedAsBase64 = window.btoa(exportedAsString);
        const pemExported = `-----BEGIN PRIVATE KEY-----\n${exportedAsBase64}\n-----END PRIVATE KEY-----`;
        return pemExported;
    }
}

/**
 * Import base64 encoded string of a CryptoKey RSA object
 * @param {string} pem A CryptoKey base64 encoded string
 * @param {string} keyType Two options, "public" or "private" depending on type of key format
 * @returns {Promise<CryptoKey>} A promise resolving to a CryptoKey object
 */
async function importRSAKey(pem, keyType) {
    // fetch the part of the PEM string between header and footer
    const pemHeader = keyType === "public" ? "-----BEGIN PUBLIC KEY-----" : "-----BEGIN PRIVATE KEY-----";
    const pemFooter = keyType === "public" ? "-----END PUBLIC KEY-----" : "-----END PRIVATE KEY-----";
    const pemContents = pem.substring(
        pemHeader.length,
        pem.length - pemFooter.length - 1,
    );
    // base64 decode the string to get the binary data
    const binaryDerString = window.atob(pemContents);
    // convert from a binary string to an ArrayBuffer
    const binaryDer = (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.str2ab)(binaryDerString);

    return window.crypto.subtle.importKey(
        keyType === "public" ? "spki" : "pkcs8",
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256",
        },
        true,
        keyType === "public" ? ["encrypt"] : ["decrypt"]
    );
}

/***/ }),

/***/ "./src/lib/hybridencrypt.js":
/*!**********************************!*\
  !*** ./src/lib/hybridencrypt.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   decryptMessage: () => (/* binding */ decryptMessage),
/* harmony export */   encryptMessage: () => (/* binding */ encryptMessage)
/* harmony export */ });
/* harmony import */ var _ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ArrayBuffer */ "./src/lib/ArrayBuffer.js");


/**
 * Encrypt a message with an AES CryptoKey object
 * @param {CryptoKey} key 
 * @param {string} message 
 * @returns {Promise<{ciphertext: string, iv: number[]}>} 
 * A promise resolving to a an object of base64 encoded AES encrypted text
 * with an iv in a Uint8Array
 */
async function encryptMessage(key, message) {
    const encoded = getMessageEncoding(message);
    // iv will be needed for decryption
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encoded,
    )
    return {
        ciphertext: btoa((0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(ciphertext)),
        iv: Array.from(iv)
    };
}

/**
 * Decrypt ciphertext with an AES CryptoKey object and iv
 * @param {CryptoKey} key 
 * @param {string} ciphertext 
 * @param {number[]} iv 
 * @returns {Promise<string>} A promise resolving to a string of decrypted text
 */
async function decryptMessage(key, ciphertext, iv) {
    // The iv value is the same as that used for encryption
    const ivUint8 = new Uint8Array(iv);
    const textbuffer = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: ivUint8 }, key, (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.str2ab)(atob(ciphertext)));
    return (0,_ArrayBuffer__WEBPACK_IMPORTED_MODULE_0__.ab2str)(textbuffer);
} 

function getMessageEncoding(message) {
    let enc = new TextEncoder();
    return enc.encode(message);
}


/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SecureChat)
/* harmony export */ });
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! fs */ "fs");
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/RSAKeyCreation */ "./src/lib/RSAKeyCreation.js");
/* harmony import */ var _components_PluginButtons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/PluginButtons */ "./src/components/PluginButtons.jsx");




const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

function createElements() {
    const filter = BdApi.Webpack.Filters.byStrings("ChannelTextAreaButtons");
    const ChannelTextAreaButtons = BdApi.Webpack.getModule(m => filter(m.type));
    BdApi.Patcher.after("debug", ChannelTextAreaButtons, "type", (_, __, res) => {
        const myElement = BdApi.React.createElement(_components_PluginButtons__WEBPACK_IMPORTED_MODULE_2__["default"]);
        res.props.children.push(myElement);
    });
}

class SecureChat {
    start() {
        // Called when the plugin is activated (including after reloads)
        if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(pluginDirectory)) {
            fs__WEBPACK_IMPORTED_MODULE_0___default().mkdirSync(pluginDirectory);
        }
        const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
        const id = userIdModule.getCurrentUser().id;
        // Create public and private keypair for user if it does not exist
        if (!fs__WEBPACK_IMPORTED_MODULE_0___default().existsSync(pluginDirectory + `/public-${id}.pem`)) {
            console.log("Key pair does not exist, creating new pair");
            BdApi.UI.showToast("Key pair does not exist, creating new pair", { type: "info" });
            // Note this is an async function, .then or await is needed here, I chose .then for concision
            (async () => {
                const keyPair = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_1__.createKeyPair)(4096);
                const publicKeyString = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_1__.exportRSAKey)(keyPair.publicKey, "public");
                const privateKeyString = await (0,_lib_RSAKeyCreation__WEBPACK_IMPORTED_MODULE_1__.exportRSAKey)(keyPair.privateKey, "private");
                fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(`${pluginDirectory}/public-${id}.pem`, publicKeyString);
                fs__WEBPACK_IMPORTED_MODULE_0___default().writeFileSync(`${pluginDirectory}/private-${id}.pem`, privateKeyString);
                BdApi.alert("Key Pair Generated", "To begin end to end encryption, open the SecureChat folder in your plugins folder and send your **PUBLIC** key to who you want to begin E2EE with, then click on Create Password. **Never send your private key to anyone!**");
                createElements();
            })();
        } else {
            createElements();
        }
    }
    stop() {
        // Called when the plugin is deactivated
        BdApi.Patcher.unpatchAll("debug")
    }
}
})();

module.exports = __webpack_exports__["default"];
/******/ })()
;