import { encryptAESKey } from "../lib/AESKey";
import fs from "fs";
import { importStringToKey } from "../lib/RSAKeyCreation";

export default function PasskeyGen() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

    function handleClick() {
        const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");
        const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
        let channelId = SelectedChannelStore.getChannelId();
        let userId = userIdModule.getCurrentUser().id;
        BdApi.UI.showConfirmationModal(
            "Create Key",
            `This will generate an AES key that is encrypted with the current DM's public key. This only needs to be done once per user by one user. This will only work in this channel ID: ${channelId} **DO NOT SEND THE KEY THAT BEGINS WITH \`PRIVATE-\`**`,
            {
                confirmText: "Create",
                cancelText: "Cancel",
                onConfirm: () => {
                    (async () => {
                        // TODO: Change to use recipient's user id, have them enter in the received public key file with system file dialog
                        const pubKeyFile = fs.readFileSync(`${pluginDirectory}/public-${userId}.pem`, 'utf8');
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
                        fs.writeFileSync(`${pluginDirectory}/PRIVATE-${channelId}.key`, encryptedAESkey);
                        // Encrypt the new AES key
                        const encryptedAESkey = await encryptAESKey(aesKey, pubKey);
                        fs.writeFileSync(`${pluginDirectory}/${channelId}.key`, encryptedAESkey);
                        BdApi.UI.showToast(`AES key encrypted and saved as ${channelId}.key`, { type: "success" });
                    })();
                },
                onCancel: () => console.log("Pressed 'Cancel' or escape")
            }
        );
    }

    return (
        <button className="my-component" onClick={handleClick}>
            Create Key
        </button>
    )
}