import SettingsComponent from "./components/settingscomponent";
import fs from "fs";
import { createKeyPair, exportKeyToString, importStringToKey } from "./lib/RSAKeyCreation";
import PluginButtons from "./components/PluginButtons";

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

function createElements() {
    const filter = BdApi.Webpack.Filters.byStrings("ChannelTextAreaButtons");
    const ChannelTextAreaButtons = BdApi.Webpack.getModule(m => filter(m.type));
    BdApi.Patcher.after("debug", ChannelTextAreaButtons, "type", (_, __, res) => {
        const myElement = BdApi.React.createElement(PluginButtons);
        res.props.children.push(myElement);
    });
}

export default class SecureChat {
    start() {
        // Called when the plugin is activated (including after reloads)
        if (!fs.existsSync(pluginDirectory)) {
            fs.mkdirSync(pluginDirectory);
        }
        const userIdModule = BdApi.Webpack.getModule(BdApi.Webpack.Filters.byKeys("getCurrentUser"));
        const id = userIdModule.getCurrentUser().id;
        // Create public and private keypair for user if it does not exist
        if (!fs.existsSync(pluginDirectory + `/public-${id}.pem`)) {
            console.log("Key pair does not exist, creating new pair");
            BdApi.UI.showToast("Key pair does not exist, creating new pair", {type: "info"});
            // Note this is an async function, .then or await is needed here, I chose .then for concision
            (async () => {
                const keyPair = await createKeyPair(4096);
                const publicKeyString = await exportKeyToString(keyPair.publicKey, "public");
                const privateKeyString = await exportKeyToString(keyPair.privateKey, "private");
                fs.writeFileSync(`${pluginDirectory}/public-${id}.pem`, publicKeyString);
                fs.writeFileSync(`${pluginDirectory}/private-${id}.pem`, privateKeyString);
                BdApi.alert("Key Pair Generated", "To begin end to end encryption, open the SecureChat folder in your plugins folder and send your **PUBLIC** key to who you want to begin E2EE with, then click on Create Password. **Never send your private key to anyone!**");
                createElements();
            })();
        } else {
            createElements();
        }
    }
    stop() {
        // Called when the plugin is deactivated
        BdApi.Patcher.unpatchAll("debug")
    }

    getSettingsPanel() {
        return SettingsComponent;
    }
}