module.exports = function () {
    this.When(/^I create wallet with name "([^"]*)" and password "([^"]*)" and password confirmation "([^"]*)"$/, function (name, password, confirm) {
        return page.dialogueNewWallet.fillNewWalletDialogue(name, password, confirm, shared.config.defaultNet,);
    });

    this.When(/^I click add new wallet button$/, function () {
        page.dialogueNewWallet.waitNewWalletDialogue();
        return page.dialogueNewWallet.createNewWalletButton();
    });

    this.When(/^I close password dialogue$/, async function () {
        await page.dialogueEnterPassword.waitForPasswordPopup();
        return page.dialogueEnterPassword.closeDialogue();
    });

    this.When(/^I press Create wallet$/, async function () {
        await page.startPage.waitForAccountsPage();
        return await page.startPage.createWalletFromStartPage();
    });

    this.Then(/^I fill wallet name field "([^"]*)"$/, function (walletName) {
        return page.dialogueNewWallet.fillWalletNameField(walletName);
    });

    this.Then(/^I log out from wallet$/, function () {
        return page.dialogueStartDisclaimer.waitForDisclaimerLoad();
    });

    this.Then(/^I log out from wallet and see enter password popup$/, async function () {
        return await page.dialogueEnterPassword.waitForPasswordPopup();
    });

    this.Then(/^I should see password field validation error$/, function () {
        return page.dialogueEnterPassword.validatePasswordField();
    });

    this.Then(/^I see wallet name validation error message "([^"]*)"$/, function (errorMessage) {
        return page.dialogueNewWallet.validateCreateWalletNameField(errorMessage);
    });

    this.Then(/^I see wallet password validation error message$/, function () {
        return page.dialogueNewWallet.validateCreateWalletPasswordField();
    });

    this.Then(/^I fill password field "([^"]*)"$/, function (walletPassword) {
        return page.dialogueNewWallet.fillWalletPasswordField(walletPassword);
    });

    this.Then(/^I see wallet confirm password validation error message$/, function () {
        return page.dialogueNewWallet.validateCreateWalletConfirmPasswordField();
    });

    this.Then(/^I fill confirm password name field "([^"]*)"$/, function (walletConfirmPassword,) {
        return page.dialogueNewWallet.fillWalletConfirmPasswordField(walletConfirmPassword);
    });

    this.Then(/^I clear confirm password field$/, function () {
        return page.dialogueNewWallet.clearWalletConfirmPasswordField();
    });

    this.Then(/^Select network for wallet "([^"]*)"$/, function (networkName) {
        return page.dialogueNewWallet.selectNetworkValue(networkName);
    });
};
