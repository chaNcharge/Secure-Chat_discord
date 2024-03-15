# Secure Chat Plugin

Secure Chat is a plugin for BetterDiscord, a popular Discord customization framework. This plugin adds the ability for messages to be sent with end-to-end encryption, ensuring that your conversations remain private and secure.

## Features

- **End-to-End Encryption:** Messages sent using this plugin are encrypted before being sent, ensuring that only the intended recipient can decrypt and read them.
- **User-Friendly Interface:** The plugin seamlessly integrates into the Discord interface, providing a familiar experience for users.
- **Secure and Private:** The encryption algorithm used is robust and ensures the confidentiality of your messages. No one and least of all Discord should not be able to read your messages.
- **Easy Installation:** Simply install BetterDiscord and place the plugin file in the appropriate folder to start using Secure Chat.

## Installation

To use Secure Chat, follow these steps:

1. Install BetterDiscord: [BetterDiscord](https://betterdiscord.app/)
2. Download the Secure Chat plugin file ([SecureChat.plugin.js](https://github.com/DJ-Willard/Secure-Chat_discord/blob/main/dist/SecureChat.plugin.js)).
3. Open Discord and go to 'SETTINGS->PLUGINS"
4. Click the folder icon to open the plugins directory
5. Place SecureChat.plugin.js plugin file into the BetterDiscord plugins folder.
6. Enable the SecureChat plugin. Your personal keypair will generate, this will take a second.
7. Open a direct message and start by right clicking the lock icon

### Build Instuctions

1. npm install
2. npm run build

## Usage

Once installed:

1. Open a direct message with the user you want to communicate securely with.
2. Right click the lock icon to pull up the encryption menu
3. Click "Generate Key" and load your friends requested public key they send in the chat that you download. Ask them for it if necessary.
4. Inside of the plugins directory, there will be a subdirectory named "SecureChat" containing a pair of `.key` files. Send your PUBLIC key. **Anything labeled PRIVATE never leaves your computer**
5. The receiver should download the key and add it to their plugin directory. End to end encryption is ready at this point

To send a message:
1. Right click the lock icon to bring up the menu again and click "Encrypt Message" and type any message into the text box.
2. Click "Send" to send the encrypted message.
3. The recipient and you can decrypt the message by copying the sent JSON code block and pasting it in "Decrypt Message"

## Contributions

This plugin was developed by a team of two individuals:

- **Project Lead,  Programmer and Researcher:** [Ethan Cha]
- **Project Documentation and icon builder:** [Daniel Willard]


If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on our GitHub repository.

## License

Secure Chat is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this plugin as per the terms of the license.

## Reference Links for Developers
1. [BetterDiscord Docs](https://docs.betterdiscord.app/)
2. [BetterDiscord Github](https://github.com/BetterDiscord/BetterDiscord/)
3. [SubtleCrypto Documentation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/)

## Similar Projects if Interested

1. [Discryptor](https://www.discryptor.io/)
2. [DiscordCrypt](https://github.com/leogx9r/DiscordCrypt)
3. [SimpleDiscordCrypt](https://gitlab.com/An0/SimpleDiscordCrypt)
