function checkSafari() {
    let result = true;

    window.navigator.userAgent.replace(
        /\/(\d+).(\d+).(\d+) Safari\//,
        (all, major, minor, bug) => {
            result = Number(major) >= 11;
            return '';
        },
    );

    return result;
}

export function checkBrowser() {
    try {
        return (
            (async () => {
                await Promise.resolve(1);
            })() &&
            window.matchMedia('(min-device-width: 800px)').matches &&
            localStorage &&
            ((window as any).CSS &&
                (window as any).CSS.supports('color', 'var(--primary)')) &&
            checkSafari()
        );
    } catch (e) {
        return false;
    }
}

export default checkBrowser;
