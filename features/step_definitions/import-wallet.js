module.exports = function () {
    this.When(/^I Select wallet file for import "([^"]*)"$/, async function (walletName) {
        return await page.dialogueImportWallet.selectWalletFileForImport(walletName);
    });

    this.When(/^I fill wallet name field "([^"]*)" for Import Wallet$/, async function (importWalletName) {
        return await page.dialogueImportWallet.fillImportWalletNameField(importWalletName);
    });

    this.When(/^I fill password field "([^"]*)" for Import Wallet$/, async function (importWalletPassword) {
        return await page.dialogueImportWallet.fillImportWalletPasswordField(importWalletPassword);
    });

    this.When(/^I click Import Wallet$/, async function () {
        return await page.dialogueImportWallet.importWallet();
    });

    this.Then(/^I see import wallet validation error message$/, async function () {
        return await page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletIncorrectFileValidationMessage);
    });

    this.Then(/^I see import wallet name validation error message$/, async function () {
        return await page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletSameNameValidationMessage);
    });

    this.Then(/^I see import wallet password validation error message$/, async function () {
        return await page.dialogueImportWallet.validateField(shared.messages.importWallet.importWalletIncorrectPasswordValidationMessage);
    });
};