import fs from "fs";
import { decryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey, importAESKey } from "../lib/AESKey";
import { importStringToKey } from "../lib/RSAKeyCreation";

export function DecryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    const messageActions = BdApi.Webpack.getByKeys("sendMessage");
    const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
    let channelId = SelectedChannelStore.getChannelId();
    let userId = userIdModule.getCurrentUser().id;
    let ciphertextStr = "";
    function TextInput(props) {
        return <textarea
            placeholder={props.placeholder || "Paste ciphertext JSON to decrypt"}
            onChange={props?.onChange}
        />;
    }

    function sendMessage(content) {
        messageActions.sendMessage(SelectedChannelStore.getChannelId(), {
            content,
            invalidEmojis: [],
            tts: false,
            validNonShortcutEmojis: []
        });
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
                                const privKey = await importStringToKey(privKeyFile, 'private');
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