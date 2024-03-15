# Secure Discord Plugin

Secure Discord is a plugin for BetterDiscord, a popular Discord customization framework. This plugin adds a text box in direct messages for end-to-end encryption, ensuring that your conversations remain private and secure.

## Features

- **End-to-End Encryption:** Messages sent using this plugin are encrypted before being sent, ensuring that only the intended recipient can decrypt and read them.
- **User-Friendly Interface:** The plugin seamlessly integrates into the Discord interface, providing a familiar experience for users.
- **Security:** The encryption algorithm used is robust and ensures the confidentiality of your messages.
- **Easy Installation:** Simply install the BetterDiscord framework and place the plugin file in the appropriate folder to start using Secure Discord.

## Installation

To use Secure Discord, follow these steps:

1. Install BetterDiscord: [BetterDiscord](https://betterdiscord.app/)
2. Download the Secure Discord plugin file ([SecureChat.plugin.js](https://github.com/DJ-Willard/Secure-Chat_discord/blob/main/dist/SecureChat.plugin.js)).
3. Open Discord and go to 'SETTINGS->PLUGINS"
4. Click the folder icon.
5. Place SecureChat.plugin.js plugin file into the BetterDiscord plugins folder.
6. Enable the SCureChat plugin.
7. Restart Discord.
8. Open a direct message and start using the secure text box provided by the plugin.

### Build Instuctions (if needed)

To rebuild the webpack if edited please run the fallowing in command line:

1. npm install
2. npm run build

## Usage

Once installed, using Secure Discord is straightforward:

1. Open a direct message with the user you want to communicate securely with.
2. You will notice a new lock icon at the bottom  left of the chat interface.
3. right click the icon to pull up the encryption menu
4. left click generate key and load your friends requested  public key they send in the chat that you download.
5.  inside of the directory 'C:\..\AppData\Roaming\BetterDiscord\plugins\SecureChat' send the public key generated. 
6. the reciever should download the key and add it to the the fallowing directory  'C:\..\AppData\Roaming\BetterDiscord\plugins\SecureChat' it can be accessed in the "setting->Plugin' area if you are having difficultly finding it.
7. Type your message in the secure text box provided after right clicking the icon and left clicking the encypt text.
8. Press Enter to send the encrypted message.
9.  The recipient will be able to decrypt and read the message using the Secure Discord plugin installed on their end by left clicking the copy icon on the sent message in the top right corner  and then pasting it into the decrypt text box after right clicking the icon and left clicking  decrypt ciphertext. 

## Contributions

This plugin was developed by a team of two individuals:

- **Project Lead,  Programmer and Researcher:** [Ethan Cha]
- **Project Documentation and icon builder:** [Daniel Willard]


If you encounter any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request on our GitHub repository.

## License

Secure Discord is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute this plugin as per the terms of the license.

## Referance Links for Developers
1. [BetterDiscord Plugin Developer Docs](https://docs.betterdiscord.app/plugins/)
2. [BetterDiscord Github](https://github.com/BetterDiscord/BetterDiscord)
3. [BetterDiscord Creating Plugin Developer Docs](https://docs.betterdiscord.app/plugins/basics/creating-a-plugin/)
4. [Discord Support](https://support.discord.com/hc/en-us)
5. [SubtleCypto Documentation](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/decrypt)
6. [Node.js Encyption](https://www.sohamkamani.com/nodejs/rsa-encryption/)

## Similar Projects if Interested

1. [Discryptor](https://www.discryptor.io/)
2. [DiscordCrypt](https://github.com/leogx9r/DiscordCrypt)
