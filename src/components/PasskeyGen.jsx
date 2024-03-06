import fs from "fs";
import { encryptAESKey, exportAESKey } from "../lib/AESKey";
import { importStringToKey } from "../lib/RSAKeyCreation";

export function PasskeyGen() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
    let channelId = SelectedChannelStore.getChannelId();
    // Note to user
    BdApi.UI.showConfirmationModal(
        "Create Key",
        `This will generate an AES key that is encrypted with the recipient's public key (recipient must send you this). This only needs to be done once per user by one user. This will only work in this DM. **DO NOT SEND THE KEY THAT BEGINS WITH \`PRIVATE-\`**`,
        {
            confirmText: "Create",
            cancelText: "Cancel",
            // Insert public key
            onConfirm: () => {
                BdApi.UI.showConfirmationModal(
                    "Insert recipient's public key",
                    <input type="file" accept=".pem" id="fileInput" />,
                    {
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
                            reader.onload = async (event) => {
                                const pubKeyFile = event.target.result; // Contents of the file
                                const pubKey = await importStringToKey(pubKeyFile, 'public');
                                // Generate a new random key
                                const aesKey = await window.crypto.subtle.generateKey(
                                    {
                                        name: "AES-GCM",
                                        length: 256,
                                    },
                                    true,
                                    ["encrypt", "decrypt"],
                                );

                                // Personal unencrypted copy so the sender can encrypt/decrypt their own messages. They will not send this
                                const aesKeyStr = await exportAESKey(aesKey);
                                fs.writeFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, aesKeyStr);
                                // Encrypt the new AES key
                                const encryptedAESkey = await encryptAESKey(aesKey, pubKey);
                                fs.writeFileSync(`${pluginDirectory}/PUBLIC-${channelId}.key`, encryptedAESkey);
                                BdApi.UI.showToast(`AES key created. Send the PUBLIC-${channelId}.key file to recipient`, { type: "success" });
                                // Further processing with pubKey
                            };
                            reader.readAsText(file);
                        },
                        onCancel: () => console.log("Pressed 'Cancel' or escape")
                    }
                )
            },
            onCancel: () => console.log("Pressed 'Cancel' or escape")
        }
    );
}