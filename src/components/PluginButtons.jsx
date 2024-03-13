/**
 * PluginButtons module provides functions to create buttons for encrypting, decrypting, and generating passkeys.
 * Icon designed by Daniel Willard code by ethan Cha
 * 
 * @module PluginButtons
 * @author [Ethan Cha, Daniel Willard]
 */

import { DecryptButton } from "./DecryptButton";
import { EncryptButton } from "./EncryptButton";
import { PasskeyGen } from "./PasskeyGen";


/**
 * Function to render a context menu with options for creating a key, encrypting text, and decrypting ciphertext.
 * 
 * @returns {JSX.Element} The rendered context menu.
 */
export default function PluginButtons() {
    /**
     * Function to render the context menu options.
     * 
     * @returns {ContextMenuOption[]} An array of context menu options.
     */
    function renderContextMenu() {
        return BdApi.ContextMenu.buildMenu([
            {
                id: "create-key",
                label: "Create Key",
                onClick: () => { 
                    PasskeyGen();
                }
            },
            {
                id: "encrypt",
                label: "Encrypt Text",
                onClick: () => {
                    EncryptButton();
                }
            },
            {
                id: "decrypt",
                label: "Decrypt Ciphertext",
                onClick: () => {
                    DecryptButton();
                }
            }
        ]);
    }

    return (
        <div id="button-container" onContextMenu={e => BdApi.ContextMenu.open(e, renderContextMenu())}>
            <svg id="svg-button" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -1 30 22" width="44" height="44">
                <path d="M 16 6 A 1 1 0 0 0 4 6 V 13 A 1 1 0 0 1 16 13 V 6 H 14 V 13 H 16 M 4 13 H 6 V 6 H 4 V 9 A 1 1 0 0 0 16 17 A 1 1 0 0 0 4 9 V 6 H 6 A 1 1 0 0 1 14 5 V 7 A 1 0.1 0 0 0 6 7 M 11 14 V 16 A 1 1 0 0 1 9 16 V 14 A 1 0.3 0 0 0 11 14 M 9 14 A 1 1 0 0 1 11 11 A 1 1 0 0 1 9 14 M 4 13 A 1 1 0 0 0 16 13 M 13 13 V 18 H 7 V 13 M 6 13 H 7 V 10 M 14 13 H 13 M 13 10 V 13 V 10 H 7" stroke="#7e8289" stroke-width="0" fill="#b5bac1" />
            </svg>
        </div>
    )
}