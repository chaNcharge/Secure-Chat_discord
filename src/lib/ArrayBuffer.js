/*
Description:
    ab2str(buf): Converts an ArrayBuffer buf into a string. 
    It utilizes the String.fromCharCode method along with apply to achieve this conversion.

    str2ab(str): Converts a string str into an ArrayBuffer. 
    It creates a new ArrayBuffer with a length equal to the length of the input string, 
    then populates it with the UTF-8 character codes of the string using a Uint8Array.

Author: Ethan Cha
*/

/**
 * Converts an ArrayBuffer into a string.
 * Adapted from: https://developer.chrome.com/blog/how-to-convert-arraybuffer-to-and-from-string/
 * 
 * @param {ArrayBuffer} buf The ArrayBuffer to convert.
 * @returns {string} The resulting string.
 */
export function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
}

/**
 * Converts a string into an ArrayBuffer.
 * Adapted from: https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
 * 
 * @param {string} str The string to convert.
 * @returns {ArrayBuffer} The resulting ArrayBuffer.
 */
export function str2ab(str) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}