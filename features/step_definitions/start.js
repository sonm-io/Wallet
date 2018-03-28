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
    this.Given(/^Wallet with one existing wallet is opened$/, async function() {
        await loadMainPage();
        shared.wdHelper.loadWalletToStorage(shared.wallets.emptyWallet);
    });

    this.When(/^Click the Dont Show Disclaimer Again button$/, function() {
        page.dialogueStartDisclaimer.waitForDisclaimerLoad();
        return page.dialogueStartDisclaimer.clickDontShowDisclaimerButton();
    });

    this.Given(
        /^Login to wallet "([^"]*)" with password "([^"]*)"$/,
        async function(walletName, password) {
            await loadMainPage();
            let wallet = shared.wdHelper.resolve(shared.wallets, walletName);
            await shared.wdHelper.loadWalletToStorage(wallet);
            await closeDisclaimer();
            await page.dialogueEnterPassword.waitForPasswordPopup();
            await page.dialogueEnterPassword.enterPassword(password);
            return await page.dialogueEnterPassword.loginToWallet();
        },
    );

    this.Given(/^Wallet with empty storage is opened$/, function() {
        return loadMainPage();
    });

    this.Given(/^Three wallet accounts are created$/, function() {
        loadMainPage();
        shared.wdHelper.loadWalletsToStorage(shared.config.accounts);
    });

    this.When(/^Fill Wallet Popup Password field "([^"]*)"/, async function(
        password,
    ) {
        await page.dialogueEnterPassword.waitForPasswordPopup();
        await page.dialogueEnterPassword.enterPassword(password);
        return await page.dialogueEnterPassword.loginToWallet();
    });

    this.When(
        /^Enter value "([^"]*)" into Account Search field for search Accounts$/,
        async function(valueForSearch) {
            await page.startPage.clickWalletsDropdown();
            return await page.startPage.searchFromWalletDropdown(
                valueForSearch,
            );
        },
    );

    this.Then(
        /^Wallets search results "([^"]*)" are displayed$/,
        async function(searchResults) {
            page.common.assertDropdownValues(
                await page.startPage.getValuesFromWalletDropdown(),
                searchResults.replace(/'/g, '"'),
            );
            return page.startPage.clearSearchWalletField();
        },
    );

    this.When(/^Wallet "([^"]*)" is selected from Wallets dropdown$/, function(
        walletName,
    ) {
        return page.startPage.selectWalletFromDropdown(walletName);
    });

    this.When(/^Click the Login button$/, function() {
        return page.startPage.clickLoginButton();
    });

    this.When(/^Click the I Understand button$/, async function() {
        return await closeDisclaimer();
    });

    this.When(/^Click the IMPORT WALLET button$/, async function() {
        await page.startPage.waitForAccountsPage();
        return await page.startPage.clickImportWalletButton();
    });

    this.When(/^Close Create New Wallet dialogue$/, async function() {
        await page.dialogueNewWallet.waitNewWalletDialogue();
        return await page.startPage.closeCreateNewWalletDialogue();
    });

    this.Then(/^Logged out from wallet$/, async function() {
        return await page.dialogueStartDisclaimer.waitForDisclaimerLoad();
    });
};
