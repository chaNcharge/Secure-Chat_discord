/* Template file only */

export default function EncryptInput() {
    function handleClick() {
        function MySearchInput(props) {
            return <input
                type="text"
                placeholder={props.placeholder || "Search..."}
                onChange={props?.onChange}
            />;
        }
        BdApi.UI.showConfirmationModal(
            "Input Test",
            <MySearchInput
                placeholder="Find..."
                onChange={event => console.log(event)}
            />,
            {
                confirmText: "Search",
                cancelText: "Nevermind",
                onConfirm: () => console.log("Pressed 'Search'"),
                onCancel: () => console.log("Pressed 'Nevermind' or escape")
            }
        );
    }

    return (
        <button className="my-component" onClick={handleClick}>
            Hello World!
        </button>
    )
}