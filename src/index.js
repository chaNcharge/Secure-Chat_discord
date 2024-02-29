import SettingsComponent from "./components/settingscomponent";
import fs from "fs";
import { createKeyPair, exportKeyToString, importStringToKey } from "./lib/RSAKeyCreation";
import PasskeyGen from "./components/PasskeyGen";

const element = BdApi.DOM.parseHTML("<div>");
const target = document.querySelector(".channelTextArea__2e60f");
const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

const messageActions = BdApi.Webpack.getByKeys("sendMessage");
const SelectedChannelStore = BdApi.Webpack.getStore("SelectedChannelStore");

function sendMessage(content) {
    messageActions.sendMessage(SelectedChannelStore.getChannelId(), {
        content,
        invalidEmojis: [],
        tts: false,
        validNonShortcutEmojis: []
    });
}

export default class SecureChat {
    start() {
        // Called when the plugin is activated (including after reloads)
        // TODO: Find a better way to add this element to Discord, think its somewhere in the docs but haven't focused on it
        target.append(element);
        BdApi.ReactDOM.render(BdApi.React.createElement(PasskeyGen), element);
        if (!fs.existsSync(pluginDirectory)) {
            fs.mkdirSync(pluginDirectory);
        }

        // Placeholder id for now, replace with BdAPI to get user id somehow soon
        const id = 12345
        // Create public and private keypair for user if it does not exist
        if (!fs.existsSync(pluginDirectory + "/public-12345.pem")) {
            console.log("Key pair does not exist, creating new pair");
            // Note this is an async function, .then or await is needed here, I chose .then for concision
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
            BdApi.alert("Key Pair Generated", "To begin end to end encryption, open the SecureChat folder in your plugins folder and send your **PUBLIC** key to who you want to begin E2EE with, then click on Create Password. **Never send your private key to anyone!**");
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