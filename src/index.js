import SettingsComponent from "./components/settingscomponent";
import EncryptInput from "./components/EncryptInput";
import fs from "fs";
import { createKeyPair } from "./lib/RSAKeyCreation";

const element = BdApi.DOM.parseHTML("<div>");
const target = document.querySelector(".channelTextArea__2e60f");
const pluginDirectory = BdApi.Plugins.folder + "/SecureChat";

export default class test {
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
            createKeyPair(pluginDirectory, id);
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