function loadMainPage() {
    driver
        .manage()
        .window()
        .setSize(shared.config.browser.width, shared.config.browser.height);
    return helpers.loadPage(page.startPage.url, 5);
}

const closeDisclaimer = async function() {
    await page.dialogueStartDisclaimer.waitForDisclaimerLoad();
    return await page.dialogueStartDisclaimer.clickUnderstandButton();
};

module.exports = function() {
    this.Given(/^I open wallet with one existing wallet$/, async function() {
        await loadMainPage();
        shared.wdHelper.loadWalletToStorage(shared.wallets.emptyWallet);
    });

    this.When(/^I click on dont show disclaimer again button$/, function() {
        page.dialogueStartDisclaimer.waitForDisclaimerLoad();
        return page.dialogueStartDisclaimer.clickDontShowDisclaimerButton();
    });

    this.Given(
        /^Login to wallet "([^"]*)" with password "([^"]*)"$/,
        async function(walletName, password) {
            await loadMainPage();
            let wallet = shared.wdHelper.resolve(shared.wallets, walletName);
            shared.wdHelper.loadWalletToStorage(wallet);
            await closeDisclaimer();
            await page.dialogueEnterPassword.enterPassword(password);
            return await page.dialogueEnterPassword.loginToWallet();
        },
    );

    this.Given(/^I open wallet with empty storage$/, function() {
        return loadMainPage();
    });

    this.Given(/^I have three wallet accounts$/, function() {
        loadMainPage();
        shared.wdHelper.loadWalletsToStorage(shared.config.accounts);
    });

    this.When(/^I type password "([^"]*)"$/, async function(password) {
        await page.dialogueEnterPassword.waitForPasswordPopup();
        await page.dialogueEnterPassword.enterPassword(password);
        return await page.dialogueEnterPassword.loginToWallet();
    });

    this.When(
        /^I enter value "([^"]*)" into account search field for search accounts$/,
        async function(valueForSearch) {
            await page.startPage.clickWalletsDropdown();
            return await page.startPage.searchFromWalletDropdown(
                valueForSearch,
            );
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

    this.When(/^I click I Understand button$/, async function() {
        return await closeDisclaimer();
    });

    this.When(/^I click Import Wallet button$/, async function() {
        await page.startPage.clickImportWalletButton();
        return page.dialogueImportWallet.waitImportWalletDialogue();
    });

    this.When(/^Close Create New Wallet dialogue$/, async function() {
        await page.dialogueNewWallet.waitNewWalletDialogue();
        return await page.startPage.closeCreateNewWalletDialogue();
    });
};
