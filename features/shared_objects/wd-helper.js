module.exports = {
    findVisibleElement: function (locator, timeout = 10) {
        let element = driver.wait(until.elementLocated(locator), timeout * 1000);
        driver.wait(until.elementIsVisible(element));
        return element;
    },

    findVisibleElements: function (locator, timeout = 10) {
        return driver.wait(until.elementsLocated(locator), timeout * 1000);
    },

    loadWalletToStorage: function (wallet) {
        driver.executeScript("window.localStorage.setItem('sonm_wallets','[\"" + wallet.name + "\"]')");
        return driver.executeScript("window.localStorage.setItem('" + wallet.key + "','" + wallet.value + "')");
    },

    resolve: function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        let a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            let k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

};