function loadWalletContent(wallet) {
    //shared.config.DEBUG && console.log("window.localStorage.setItem('" + wallet.key + "','" + wallet.value + "')");
    return driver.executeScript("window.localStorage.setItem('" + wallet.key + "','" + wallet.value + "')");
}

function loadWalletName(wallet) {
    return driver.executeScript("window.localStorage.setItem('sonm_wallets','" + JSON.stringify(wallet.name) + "')");
}

module.exports = {
    findVisibleElement: function (locator, timeout = 10) {
        let element = driver.wait(until.elementLocated(locator), timeout * 2000);
        driver.wait(until.elementIsVisible(element));
        return element;
    },

    findVisibleElements: function (locator, timeout = 10) {
        return driver.wait(until.elementsLocated(locator), timeout * 1000);
    },

    waitElementNotVisible: function (locator, timeout = 20) {
        let element = driver.wait(until.elementLocated(locator), timeout * 1000);
        return driver.wait(until.stalenessOf(element), timeout * 1000);
    },

    loadWalletToStorage: function (wallet) {
        loadWalletName(wallet);
        return loadWalletContent(wallet);
    },

    loadWalletsToStorage: function (wallets) {
        //shared.config.DEBUG && console.log("window.localStorage.setItem('sonm_wallets','" + JSON.stringify(wallets.names) + "')");
        driver.executeScript("window.localStorage.setItem('sonm_wallets','" + JSON.stringify(wallets.names) + "')");
        wallets.content.forEach(function (element) {
            loadWalletContent(element);
        });
    },

    //doesn't work
    loadHideDisclaimerToStorage: function () {
        driver.executeScript(
            "window.localStorage.setItem('sonm-hide-disclaimer','1')",
        );
    },

    resolve: function (o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, ''); // strip a leading dot
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
    },
};
