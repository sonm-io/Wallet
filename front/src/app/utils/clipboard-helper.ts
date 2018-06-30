const copyInput = createInput();

function createInput() {
    const input: HTMLInputElement = document.createElement('input');

    input.style.position = 'fixed';
    input.style.left = '-1000px';
    input.style.top = '0';

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(input);
    });

    return input;
}

export function copyToClipboard(value: string) {
    copyInput.value = value;
    copyInput.select();
    document.execCommand('Copy');
}
