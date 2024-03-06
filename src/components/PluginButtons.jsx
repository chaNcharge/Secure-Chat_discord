import DecryptButton from "./DecryptButton";
import EncryptButton from "./EncryptButton";
import PasskeyGen from "./PasskeyGen";

export default function PluginButtons() {
    return (
        <div>
            <PasskeyGen />
            <EncryptButton />
            <DecryptButton />
        </div>
    )
}