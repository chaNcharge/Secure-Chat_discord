export default function SettingsComponent({ disabled = false }) {
    const [isDisabled, setDisabled] = BdApi.React.useState(disabled);
    return <button className="my-component" disabled={isDisabled}>
        "Hello World!"
    </button>;
}