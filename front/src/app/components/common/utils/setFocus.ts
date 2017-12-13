interface IHasFocus {
    focus: () => void;
}

export function setFocus(node: IHasFocus | null) {
    if (!node) { return; }

    node.focus();
}

export default setFocus;
