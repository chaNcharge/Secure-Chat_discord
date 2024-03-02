import { encryptAESKey } from "../lib/AESKey";
import fs from "fs";
import { importStringToKey } from "../lib/RSAKeyCreation";

export default function PasskeyGen() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const pubKeyFile = fs.readFileSync(`${pluginDirectory}/public-12345.pem`, 'utf8');
    const id = 12345; // Placeholder, see index.js

    function handleClick() {
        BdApi.UI.showConfirmationModal(
            "Create Key",
            `This will generate an AES key that is encrypted with your public key. You can safely send this to the person you are currently messaging. ID: ${id}`,
            {
                confirmText: "Create",
                cancelText: "Cancel",
                onConfirm: () => {
                    (async () => {
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
                        // Encrypt the new AES key
                        const encryptedAESkey = await encryptAESKey(aesKey, pubKey);
                        fs.writeFileSync(`${pluginDirectory}/${id}.key`, encryptedAESkey);
                        BdApi.UI.showToast(`AES key encrypted and saved as ${id}.key`, { type: "success" });
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