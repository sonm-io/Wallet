modxports = function() {
    this.When(
        /^I create wallet with name "([^"]*)" and password "([^"]*)" and password confirmation "([^"]*)"$/,
        async function(name, password, confirm) {
            return await page.dialogueNewWallet.fillNewWalletDialogue(
                name,
                password,
                confirm,
                shared.config.defaultNet,
            );
        },
    );

    this.When(/^I click Create New Wallet button$/, async function() {
        await page.dialogueNewWallet.waitNewWalletDialogue();
        return await page.dialogueNewWallet.createNewWalletButton();
    });

    this.When(/^I close password dialogue$/, async function() {
        await page.dialogueEnterPassword.waitForPasswordPopup();
        return await page.dialogueEnterPassword.closeDialogue();
    });

    this.When(/^I press Create wallet$/, async function() {
        await page.startPage.waitForAccountsPage();
        return await page.startPage.createWalletFromStartPage();
    });

    this.Then(/^I fill wallet name field "([^"]*)"$/, async function(
        walletName,
    ) {
        return await page.dialogueNewWallet.fillWalletNameField(walletName);
    });

    this.Then(/^I log out from wallet$/, async function() {
        return await page.dialogueStartDisclaimer.waitForDisclaimerLoad();
    });

    this.Then(
        /^I log out from wallet and see enter password popup$/,
        async function() {
            return await page.dialogueEnterPassword.waitForPasswordPopup();
        },
    );

    this.Then(
        /^I should see password field validation error$/,
        async function() {
            return await page.dialogueEnterPassword.validatePasswordField();
        },
    );

    this.Then(
        /^I see wallet name validation error message "([^"]*)"$/,
        async function(errorMessage) {
            await page.dialogueNewWallet.waitNewWalletDialogue();
            return await page.dialogueNewWallet.validateCreateWalletNameField(
                errorMessage,
            );
        },
    );

    this.Then(/^I see wallet password validation error message$/, function() {
        return page.dialogueNewWallet.validateCreateWalletPasswordField();
    });

    this.Then(/^I fill password field "([^"]*)"$/, function(walletPassword) {
        return page.dialogueNewWallet.fillWalletPasswordField(walletPassword);
    });

    this.Then(
        /^I see wallet confirm password validation error message$/,
        function() {
            return page.dialogueNewWallet.validateCreateWalletConfirmPasswordField();
        },
    );

    this.Then(/^I fill confirm password name field "([^"]*)"$/, function(
        walletConfirmPassword,
    ) {
        return page.dialogueNewWallet.fillWalletConfirmPasswordField(
            walletConfirmPassword,
        );
    });

    this.Then(/^I clear confirm password field$/, function() {
        return page.dialogueNewWallet.clearWalletConfirmPasswordField();
    });

    this.Then(/^Select network for wallet "([^"]*)"$/, function(networkName) {
        return page.dialogueNewWallet.selectNetworkValue(networkName);
    });
};
