/**
 * Module for encrypting and sending messages securely in Discord using AES and RSA encryption.
 * 
 * This module provides a function called EncryptButton, which when called, prompts the user to input plaintext
 * message to be encrypted. If the user has already exchanged AES keys with the recipient, the message is encrypted
 * with the AES key and sent. If not, the module handles the decryption of the AES key using the user's private RSA key
 * and then encrypts the message before sending.
 * 
 * @module SecureMessageEncryption
 * @author [Ethan Cha]
 */

import fs from "fs";
import { encryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey, importAESKey } from "../lib/AESKey";
import { importRSAKey } from "../lib/RSAKeyCreation";

/**
 * Prompts the user to input plaintext message, encrypts it, and sends it securely.
 */
export function EncryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    const messageActions = BdApi.Webpack.getByKeys("sendMessage");
    const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
    let channelId = SelectedChannelStore.getChannelId();
    let userId = userIdModule.getCurrentUser().id;
    let message = "";
    /**
     * Function to create a text input area.
     * @param {Object} props - The properties for the text input.
     * @param {string} [props.placeholder] - The placeholder text for the input.
     * @param {Function} [props.onChange] - The function to be called when the input changes.
     * @returns {JSX.Element} - The text input area.
     */
    function TextInput(props) {
        return <textarea
            style={{ width: 'calc(100% - 4px)', height: '80px', resize: 'none'}}
            placeholder={props.placeholder || "Enter plaintext to encrypt"}
            onChange={props?.onChange}
        />;
    }

     /**
     * Sends a message to the selected channel.
     * @param {string} content - The content of the message to send.
     */
    function sendMessage(content) {
        messageActions.sendMessage(SelectedChannelStore.getChannelId(), {
            content,
            invalidEmojis: [],
            tts: false,
            validNonShortcutEmojis: []
        });
    }

    BdApi.UI.showConfirmationModal(
        "Encrypt Text: Make sure you have already exchanged AES keys first!",
        <TextInput
            placeholder="Enter plaintext to encrypt..."
            onChange={event => {
                message = event.target.value;
            }}
        />,
        {
            confirmText: "Send",
            cancelText: "Cancel",
            onConfirm: () => {
                (async () => {
                    try {
                        // only run this block of code if PRIVATE-<channel-id>.key is NOT present in pluginDirectory, non-private key is encrypted
                        if (fs.existsSync(`${pluginDirectory}/PRIVATE-${channelId}.key`)) {
                            const aesKeyFile = fs.readFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, 'utf8');
                            const aesKey = await importAESKey(aesKeyFile);
                            const encryptedTextObj = await encryptMessage(aesKey, message);
                            sendMessage("```" + JSON.stringify(encryptedTextObj) + "```");
                        } else {
                            // Runs when no unencrypted aes key exists, aka you received an encrypted key and can decrypt it with YOUR private key
                            console.log("Decrypting AES key");
                            const encryptedAESkey = fs.readFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, 'utf8');
                            const privKeyFile = fs.readFileSync(`${pluginDirectory}/private-${userId}.pem`, 'utf8');
                            const privKey = await importRSAKey(privKeyFile, 'private');
                            const decryptedAESkey = await decryptAESKey(encryptedAESkey, privKey)

                            const encryptedTextObj = await encryptMessage(decryptedAESkey, message);
                            sendMessage("```" + JSON.stringify(encryptedTextObj) + "```");
                        }
                    } catch (error) {
                        BdApi.UI.alert("Error", "Invalid key, or key not found for this channel. Generate a new key");
                        console.error(error);
                    }
                })();
            },
            onCancel: () => console.log("Pressed 'Cancel' or escape")
        }
    );
}