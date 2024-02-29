import { encryptPassphrase } from "../lib/Passphrase";
import fs from "fs";
import { importStringToKey } from "../lib/RSAKeyCreation";

export default function PasskeyGen() {
    const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";
    const pubKeyFile = fs.readFileSync(`${pluginDirectory}/public-12345.pem`, 'utf8');
    const id = 12345; // Placeholder, see index.js

    function handleClick() {
        function PasswordInput(props) {
            return <input
                type="text"
                placeholder={props.placeholder || "Search..."}
                onChange={props?.onChange}
            />;
        }
        BdApi.UI.showConfirmationModal(
            "Create Key",
            <PasswordInput
                placeholder="Enter password..."
                onChange={event => {
                    console.log(event.target.value);
                    (async () => {
                        const pubKey = await importStringToKey(pubKeyFile, 'public');
                        const encryptedPassword = await encryptPassphrase(event.target.value, pubKey);
                        fs.writeFileSync(`${pluginDirectory}/${id}.key`, encryptedPassword);
                    })();
                }}
            />,
            {
                confirmText: "Create",
                cancelText: "Cancel",
                onConfirm: () => console.log("Pressed Create, notify to send key to user here."),
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