import fs from "fs";
import { encryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey, importAESKey } from "../lib/AESKey";
import { importStringToKey } from "../lib/RSAKeyCreation";

export function EncryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    const messageActions = BdApi.Webpack.getByKeys("sendMessage");
    const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
    let channelId = SelectedChannelStore.getChannelId();
    let userId = userIdModule.getCurrentUser().id;
    let message = "";
    function TextInput(props) {
        return <textarea
            placeholder={props.placeholder || "Enter plaintext to encrypt"}
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
                            const privKey = await importStringToKey(privKeyFile, 'private');
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