import { run } from './app';
import { checkBrowser } from './app/utils/check-browser';

const domLoading = new Promise(done => {
    window.addEventListener('DOMContentLoaded', done);
});
(async () => {
    await domLoading;

    if (PLATFORM) {
        // skip checking if electron
        run();
    } else {
        if (await checkBrowser()) {
            run();
        }
    }
})();
