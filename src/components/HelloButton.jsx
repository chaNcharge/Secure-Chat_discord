/**
 * Template file for creating a component that demonstrates how to use the BdApi.UI.showConfirmationModal method.
 * This component displays a button that, when clicked, opens a modal dialog with a text input field.
 * 
 * @module EncryptInput
 * @author [Ethan Cha]
 */

/**
 * Component that renders a button. When clicked, it opens a modal dialog with a text input field.
 * @returns {JSX.Element} The rendered button component.
 */

/* Template file only */



export default function EncryptInput() {
     /**
     * Handles the click event of the button by opening a modal dialog with a text input field.
     */
    function handleClick() {
         /**
         * Functional component that renders a text input field.
         * @param {Object} props - The properties for the text input.
         * @param {string} [props.placeholder] - The placeholder text for the input.
         * @param {Function} [props.onChange] - The function to be called when the input changes.
         * @returns {JSX.Element} - The rendered text input field.
         */
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