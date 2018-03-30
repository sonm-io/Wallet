module.exports = function() {
    this.When(
        /^Wallet dialogue with Name "([^"]*)" and Password "([^"]*)" and Password Confirmation "([^"]*)" is filled$/,
        async function(name, password, confirm) {
            return await page.dialogueNewWallet.fillNewWalletDialogue(
                name,
                password,
                confirm,
                shared.config.defaultNet,
            );
        },
    );

    this.When(/^Click the Create Wallet button$/, async function() {
        await page.dialogueNewWallet.waitNewWalletDialogue();
        return await page.dialogueNewWallet.createNewWalletButton();
    });

    this.When(/^Click the CREATE WALLET button$/, async function() {
        await page.startPage.waitForAccountsPage();
        return await page.startPage.createWalletFromStartPage();
    });

    this.Then(/^Fill Create New Wallet Name field "([^"]*)"$/, async function(
        walletName,
    ) {
        return await page.dialogueNewWallet.fillWalletNameField(walletName);
    });

    this.Then(
        /^Logged out from wallet and Enter Password popup is displayed$/,
        async function() {
            return await page.dialogueEnterPassword.waitForPasswordPopup();
        },
    );

    this.Then(
        /^Enter Password popup Password field validation error message is displayed$/,
        async function() {
            return await page.dialogueEnterPassword.validatePasswordField();
        },
    );

    this.Then(
        /^Create New Wallet Name validation error message "([^"]*)" is displayed$/,
        async function(errorMessage) {
            await page.dialogueNewWallet.waitNewWalletDialogue();
            return await page.dialogueNewWallet.validateCreateWalletNameField(
                errorMessage,
            );
        },
    );

    this.Then(
        /^Create New Wallet Password validation error message is displayed$/,
        function() {
            return page.dialogueNewWallet.validateCreateWalletPasswordField();
        },
    );

    this.Then(/^Fill Create New Wallet Password field "([^"]*)"$/, function(
        walletPassword,
    ) {
        return page.dialogueNewWallet.fillWalletPasswordField(walletPassword);
    });

    this.Then(
        /^Create New Wallet Confirmation Password validation error message is displayed$/,
        function() {
            return page.dialogueNewWallet.validateCreateWalletConfirmPasswordField();
        },
    );

    this.Then(
        /^Fill Create New Wallet Confirmation Password field "([^"]*)"$/,
        function(walletConfirmPassword) {
            return page.dialogueNewWallet.fillWalletConfirmPasswordField(
                walletConfirmPassword,
            );
        },
    );

    this.Then(
        /^Clear Create New Wallet Confirmation Password field$/,
        function() {
            return page.dialogueNewWallet.clearWalletConfirmPasswordField();
        },
    );

    this.Then(/^Select Network for wallet "([^"]*)"$/, function(networkName) {
        return page.dialogueNewWallet.selectNetworkValue(networkName);
    });

    this.When(/^Close Password dialogue$/, async function() {
        await page.dialogueEnterPassword.waitForPasswordPopup();
        return await page.dialogueEnterPassword.closePasswordDialogue();
    });

    this.When(/^Create New Wallet dialogue is displayed$/, async function() {
        return await page.dialogueNewWallet.waitNewWalletDialogue();
        x;
    });
};
