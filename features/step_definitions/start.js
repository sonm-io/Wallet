module.exports = function() {
    this.Given(/^I open wallet with one existing wallet$/, function() {
        driver
            .manage()
            .window()
            .setSize(shared.config.browser.width, shared.config.browser.height);
        helpers.loadPage(page.startPage.url, 5);
        shared.wdHelper.loadWalletToStorage(shared.wallets.emptyWallet);
    });

    this.Given(/^Login to wallet "([^"]*)" with password "([^"]*)"$/, function(
        walletName,
        password,
    ) {
        driver
            .manage()
            .window()
            .setSize(
                shared.wallets.browser.width,
                shared.wallets.browser.height,
            );
        helpers.loadPage(page.startPage.url, 5);
        let wallet = shared.wdHelper.resolve(shared.wallets, walletName);
        shared.wdHelper.loadWalletToStorage(wallet);
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.loginToWallet();
    });

    this.When(/^I click on dont show disclaimer again button$/, function() {
        page.dialogueStartDisclaimer.waitForDisclaimerLoad();
        return page.dialogueStartDisclaimer.clickDontShowDisclaimerButton();
    });

    this.Given(/^I open wallet with empty storage$/, function() {
        helpers.loadPage(page.startPage.url, 5);
    });

    this.Given(/^I have three wallet accounts$/, function() {
        driver
            .manage()
            .window()
            .setSize(shared.config.browser.width, shared.config.browser.height);
        helpers.loadPage(page.startPage.url, 5);
        shared.wdHelper.loadWalletsToStorage(shared.config.accounts);
    });

    this.When(/^I type password "([^"]*)"$/, function(password) {
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.loginToWallet();
    });

    this.When(
        /^I enter value "([^"]*)" into account search field for search accounts$/,
        function(valueForSearch) {
            page.startPage.clickWalletsDropdown();
            return page.startPage.searchFromWalletDropdown(valueForSearch);
        },
    );

    this.Then(/^I get wallets search results "([^"]*)"$/, async function(
        searchResults,
    ) {
        page.common.assertDropdownValues(
            await page.startPage.getValuesFromWalletDropdown(),
            searchResults.replace(/'/g, '"'),
        );
        return page.startPage.clearSearchWalletField();
    });

    this.When(/^I select wallet name "([^"]*)" from dropdown$/, function(
        walletName,
    ) {
        return page.startPage.selectWalletFromDropdown(walletName);
    });

    this.When(/^I click login button$/, function() {
        return page.startPage.clickLoginButton();
    });

    this.When(/^I click I Understand button$/, function() {
        page.dialogueStartDisclaimer.waitForDisclaimerLoad();
        return page.dialogueStartDisclaimer.clickUnderstandButton();
    });

    this.When(/^Click Import Wallet button$/, function() {
        return page.startPage.clickImportWalletButton();
    });

    this.When(/^Close Create New Wallet dialogue$/, function() {
        page.dialogueNewWallet.waitNewWalletDialogue();
        return page.startPage.closeCreateNewWalletDialogue();
    });
};
