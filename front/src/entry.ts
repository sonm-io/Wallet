import { run } from './app';

const domLoading = new Promise(done => { window.addEventListener('DOMContentLoaded', done); });

async function checkBrowser() {
    return localStorage;
        // && (CSS.supports('--fake-var', '0')); // safari return false
}

(async () => {
    await domLoading;

    if (await checkBrowser()) {
        run();
    }
})();
