module.exports = function() {
    this.When(/^I Select wallet file for import$/, async function() {
        await page.dialogueImportWallet.selectWalletFileForImport();
    });

    this.When(
        /^I fill wallet name field "([^"]*)" for Imported Wallet$/,
        function(importWalletName) {
            return page.dialogueImportWallet.fillImportWalletNameField(
                importWalletName,
            );
        },
    );

    this.When(/^I fill password field "([^"]*)" for Imported Wallet$/, function(
        importWalletPassword,
    ) {
        return page.dialogueImportWallet.fillImportWalletPasswordField(
            importWalletPassword,
        );
    });

    this.When(/^I click Import Wallet$/, function() {
        return page.dialogueImportWallet.importWallet();
    });
};
