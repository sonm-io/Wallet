module.exports = function () {
    this.When(/^I Select wallet file for import "([^"]*)"$/, async function (walletName) {
        await page.dialogueImportWallet.selectWalletFileForImport(walletName);
    });

    this.When(/^I fill wallet name field "([^"]*)" for Import Wallet$/, function (importWalletName) {
        return page.dialogueImportWallet.fillImportWalletNameField(importWalletName);
    });

    this.When(/^I fill password field "([^"]*)" for Import Wallet$/, function (importWalletPassword) {
        return page.dialogueImportWallet.fillImportWalletPasswordField(importWalletPassword);
    });

    this.When(/^I click Import Wallet$/, function () {
        return page.dialogueImportWallet.importWallet();
    });

    this.Then(/^I see import wallet validation error message$/, function () {
        return page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletIncorrectFileValidationMessage);
    });

    this.Then(/^I see import wallet name validation error message$/, function () {
        return page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletSameNameValidationMessage);
    });

    this.Then(/^I see import wallet password validation error message$/, function () {
        return page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletIncorrectPasswordValidationMessage);
    });
};