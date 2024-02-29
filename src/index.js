import SettingsComponent from "./components/settingscomponent";
import EncryptInput from "./components/EncryptInput";
import fs from "fs";
import { createKeyPair, exportKeyToString } from "./lib/RSAKeyCreation";

const element = BdApi.DOM.parseHTML("<div>");
const target = document.querySelector(".channelTextArea__2e60f");
const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

export default class SecureChat {
    start() {
        // Called when the plugin is activated (including after reloads)
        target.append(element);
        BdApi.ReactDOM.render(BdApi.React.createElement(EncryptInput), element);
        if (!fs.existsSync(pluginDirectory)) {
            fs.mkdirSync(pluginDirectory);
        }
        // Placeholder id for now, replace with BdAPI to get user id somehow soon
        const id = 12345
        // Create public and private keypair for user if it does not exist
        if (!fs.existsSync(pluginDirectory + "/public-12345.pem")) {
            console.log("Key pair does not exist, creating new pair");
            // Note this is an async function, .then or await is needed here, I chose .then
            createKeyPair(4096)
                .then((keyPair) => {
                    exportKeyToString(keyPair.publicKey, "public")
                        .then((publicKeyString) => {
                            fs.writeFileSync(`${pluginDirectory}/public-${id}.pem`, publicKeyString);
                        })
                        .catch((error) => {
                            console.error("Failed to export public key:", error);
                        });

                    exportKeyToString(keyPair.privateKey, "private")
                        .then((privateKeyString) => {
                            fs.writeFileSync(`${pluginDirectory}/private-${id}.pem`, privateKeyString);
                        })
                        .catch((error) => {
                            console.error("Failed to export private key:", error);
                        });
                })
                .catch((error) => {
                    console.error("Key generation failed:", error);
                });
        }
    }
    stop() {
        // Called when the plugin is deactivated
        BdApi.ReactDOM.unmountComponentAtNode(element);
    }

    getSettingsPanel() {
        return SettingsComponent;
    }
}