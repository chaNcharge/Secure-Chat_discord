import fs from "fs";
import { decryptMessage } from "../lib/hybridencrypt";
import { decryptAESKey, importAESKey } from "../lib/AESKey";
import { importStringToKey } from "../lib/RSAKeyCreation";

export default function DecryptButton() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

    function handleClick() {
        // TODO: Move this to a context menu if possible
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
                    const ciphertextObj = JSON.parse(ciphertextStr);
                    (async () => {
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
                    })();
                },
                onCancel: () => console.log("Pressed 'Cancel' or escape")
            }
        );
    }

    return (
        <button className="my-component" onClick={handleClick}>
            Decrypt
        </button>
    )
}