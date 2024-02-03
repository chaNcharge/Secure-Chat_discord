/**
 * @name SecureChat
 * @author Ethan Cha, Daniel Willard
 * @description Describe the basic functions. Maybe a support server link.
 * @version 0.0.1
 */

class MyComponent extends BdApi.React.Component {
    render() {
        return BdApi.React.createElement("button", { className: "my-component" }, "Hello World!");
    }
}

const element = BdApi.DOM.parseHTML("<div>");
const target = document.querySelector(".channelTextArea__2e60f");

module.exports = class SecureChat {
    start() {
        // Called when the plugin is activated (including after reloads)
        BdApi.alert("Hello World!", "This is my first plugin!");
        target.append(element);
        BdApi.ReactDOM.render(BdApi.React.createElement(MyComponent), element);
    }

    stop() {
        // Called when the plugin is deactivated
        BdApi.ReactDOM.unmountComponentAtNode(element);
    }
}