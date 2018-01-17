module.exports = function () {

    this.When(/^I open wallet with one existing wallet$/, function () {
        driver.manage().window().setSize(shared.wallets.browser.width, shared.wallets.browser.height);
        helpers.loadPage(page.startPage.url, 5);
        return shared.wdHelper.loadWalletToStorage(shared.wallets.emptyWallet);
    });

    this.When(/^I type password "([^"]*)"$/, function (password) {
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.clickLogin();
    });

    this.When(/^I open wallet with empty storage$/, function () {
        return helpers.loadPage(page.startPage.url, 5);
    });

    this.When(/^I create wallet with name "([^"]*)" and password "([^"]*)" and password confirmation "([^"]*)"$/, function (name, password, confirm) {
        return page.dialogueNewWallet.fillNewWalletDialogue(name, password, confirm);
    });

    this.When(/^I confirm add new wallet$/, function () {
        return page.dialogueNewWallet.confirmCreateNewWallet();
    });

    this.When(/^I close password dialogue$/, function () {
        return page.dialogueEnterPassword.closeDialogue();
    });

    this.When(/^I press Add wallet$/, function () {
        return page.startPage.clickAddWallet();
    });

    this.Given(/^Login to wallet "([^"]*)" with password "([^"]*)"$/, function (walletName, password) {
        driver.manage().window().setSize(shared.wallets.browser.width, shared.wallets.browser.height);
        helpers.loadPage(page.startPage.url, 5);
        let wallet = shared.wdHelper.resolve(shared.wallets, walletName);
        shared.wdHelper.loadWalletToStorage(wallet);
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.clickLogin();
    });
};