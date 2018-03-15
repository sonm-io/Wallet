function loadMainPage() {
    driver.manage().window().setSize(shared.config.browser.width, shared.config.browser.height);
    return helpers.loadPage(page.startPage.url, 5);
}

function closeDisclaimer() {
    page.dialogueStartDisclaimer.waitForDisclaimerLoad();
    return page.dialogueStartDisclaimer.clickUnderstandButton();
}

module.exports = function () {
    this.Given(/^I open wallet with one existing wallet$/, function () {
        loadMainPage();
        return shared.wdHelper.loadWalletToStorage(shared.wallets.emptyWallet);
    });

    this.When(/^I click on dont show disclaimer again button$/, function () {
        page.dialogueStartDisclaimer.waitForDisclaimerLoad();
        return page.dialogueStartDisclaimer.clickDontShowDisclaimerButton();
    });

    this.Given(/^Login to wallet "([^"]*)" with password "([^"]*)"$/, function (walletName, password,) {
        loadMainPage();
        let wallet = shared.wdHelper.resolve(shared.wallets, walletName);
        shared.wdHelper.loadWalletToStorage(wallet);
        closeDisclaimer();
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.loginToWallet();
    });

    this.Given(/^I open wallet with empty storage$/, function () {
        return loadMainPage();
    });

    this.Given(/^I have three wallet accounts$/, function () {
        loadMainPage();
        shared.wdHelper.loadWalletsToStorage(shared.config.accounts);
        return closeDisclaimer();
    });

    this.When(/^I type password "([^"]*)"$/, function (password) {
        page.dialogueEnterPassword.enterPassword(password);
        return page.dialogueEnterPassword.loginToWallet();
    });

    this.When(/^I enter value "([^"]*)" into account search field for search accounts$/,
        function (valueForSearch) {
            page.startPage.clickWalletsDropdown();
            return page.startPage.searchFromWalletDropdown(valueForSearch);
        },
    );

    this.Then(/^I get wallets search results "([^"]*)"$/, async function (searchResults,) {
        page.common.assertDropdownValues(
            await page.startPage.getValuesFromWalletDropdown(),
            searchResults.replace(/'/g, '"'),
        );
        return page.startPage.clearSearchWalletField();
    });

    this.When(/^I select wallet name "([^"]*)" from dropdown$/, function (walletName,) {
        return page.startPage.selectWalletFromDropdown(walletName);
    });

    this.When(/^I click login button$/, function () {
        return page.startPage.clickLoginButton();
    });

    this.When(/^I click I Understand button$/, function () {
        return closeDisclaimer();
    });

    this.When(/^I click Import Wallet button$/, function () {
        return page.startPage.clickImportWalletButton();
    });

    this.When(/^Close Create New Wallet dialogue$/, function () {
        page.dialogueNewWallet.waitNewWalletDialogue();
        return page.startPage.closeCreateNewWalletDialogue();
    });
};
