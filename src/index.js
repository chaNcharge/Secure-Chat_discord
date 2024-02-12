import SettingsComponent from "./settingscomponent";
import EncryptInput from "./EncryptInput";

const element = BdApi.DOM.parseHTML("<div>");
const target = document.querySelector(".channelTextArea__2e60f");

export default class test {
    start() {
        // Called when the plugin is activated (including after reloads)
        BdApi.alert("Hello World!", "This is my first plugin!");
        target.append(element);
        BdApi.ReactDOM.render(BdApi.React.createElement(EncryptInput), element);
    }
    stop() {
        // Called when the plugin is deactivated
        BdApi.ReactDOM.unmountComponentAtNode(element);
    }

    getSettingsPanel() {
        return SettingsComponent;
    }
}