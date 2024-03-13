/**
 * Module for decrypting messages securely in Discord using AES and RSA encryption.
 * 
 * This module provides a function called DecryptButton, which when called, prompts the user to input ciphertext
 * message to be decrypted. If the user has already exchanged AES keys with the sender, the ciphertext is decrypted
 * with the AES key. If not, the module handles the decryption of the AES key using the user's private RSA key
 * and then decrypts the ciphertext before displaying the plaintext message.
 * 
 * @module SecureMessageDecryption
 * @author [Ethan Cha]
 */

import fs from "fs";
import { decryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey, importAESKey } from "../lib/AESKey";
import { importRSAKey } from "../lib/RSAKeyCreation";

/**
 * Prompts the user to input ciphertext message, decrypts it, and displays the plaintext message.
 */
export function DecryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
    let channelId = SelectedChannelStore.getChannelId();
    let userId = userIdModule.getCurrentUser().id;
    let ciphertextStr = "";
    
    /**
     * Function to create a text input area for entering ciphertext.
     * @param {Object} props - The properties for the text input.
     * @param {string} [props.placeholder] - The placeholder text for the input.
     * @param {Function} [props.onChange] - The function to be called when the input changes.
     * @returns {JSX.Element} - The text input area.
     */
    function TextInput(props) {
        return <textarea
            style={{ width: 'calc(100% - 4px)', height: '80px', resize: 'none' }}
            placeholder={props.placeholder || "Paste ciphertext JSON to decrypt"}
            onChange={props?.onChange}
        />;
    }

    BdApi.UI.showConfirmationModal(
        "Decrypt Text: Make sure you have already exchanged AES keys first!",
        <TextInput
            placeholder="Paste ciphertext JSON to decrypt"
            onChange={event => {
                ciphertextStr = event.target.value;
            }}
        />,
        {
            confirmText: "Decrypt",
            cancelText: "Cancel",
            onConfirm: () => {
                try {
                    const ciphertextObj = JSON.parse(ciphertextStr);
                    (async () => {
                        try {
                            // only run this block of code if PRIVATE-<channel-id>.key is NOT present in pluginDirectory, non-private key is encrypted
                            if (fs.existsSync(`${pluginDirectory}/PRIVATE-${channelId}.key`)) {
                                const aesKeyFile = fs.readFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, 'utf8');
                                const aesKey = await importAESKey(aesKeyFile);
                                const decryptedText = await decryptMessage(aesKey, ciphertextObj.ciphertext, ciphertextObj.iv);
                                BdApi.UI.alert("Decrypted Text", decryptedText);
                            } else {
                                // Runs when no unencrypted aes key exists, aka you received an encrypted key and can decrypt it with YOUR private key
                                console.log("Decrypting AES key");
                                const encryptedAESkey = fs.readFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, 'utf8');
                                const privKeyFile = fs.readFileSync(`${pluginDirectory}/private-${userId}.pem`, 'utf8');
                                const privKey = await importRSAKey(privKeyFile, 'private');
                                const decryptedAESkey = await decryptAESKey(encryptedAESkey, privKey)

                                const decryptedText = await decryptMessage(decryptedAESkey, ciphertextObj.ciphertext, ciphertextObj.iv);
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
        }
    );
}