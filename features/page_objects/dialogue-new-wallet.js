module.exports = {
    elements: {
        newWalletPopuoHeader: by.xpath(
            '//form[@class="sonm-login__popup-content"]/h3',
        ),
        nwName: by.xpath('//input[@name="newName"]'),
        nwPass: by.xpath('//input[@name="newPassword"]'),
        nwPassConfirm: by.xpath('//input[@name="newPasswordConfirmation"]'),
        closeNewWalletDialogue: by.xpath(
            '//div[@class="sonm-popup__inner"]/button',
        ),
        createNewWallet: by.xpath(
            '//div[@class="sonm-popup__inner"]//button[.="CREATE WALLET"]',
        ),
        networkField: by.css('div.sonm-login__network-type > div'),
        selectedNetwork: by.css(
            'div.sonm-login__network-type div > div > div.sonm-select-selection-selected-value',
        ),
        closeCreateNewWalletDialogueButton: by.xpath(
            '//div[@class="sonm-popup__inner"]/button',
        ),
    },

    waitNewWalletDialogue: async function() {
        (await shared.wdHelper.findVisibleElement(
            this.elements.newWalletPopuoHeader,
        ))
            .getText()
            .then(text => expect(text).to.equal('New wallet'));
        return await shared.wdHelper.findVisibleElement(
            this.elements.createNewWallet,
        );
    },

    closeCreateNewWalletDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.closeNewWalletDialogue,
        )).click();
    },

    //fill all fields in new wallet dialogue and create wallet

    fillNewWalletDialogue: async function(
        walletName,
        pass,
        confirm,
        chainname,
    ) {
        (await shared.wdHelper.findVisibleElement(
            this.elements.nwName,
        )).sendKeys(walletName);
        (await shared.wdHelper.findVisibleElement(
            this.elements.nwPass,
        )).sendKeys(pass);
        (await shared.wdHelper.findVisibleElement(
            this.elements.nwPassConfirm,
        )).sendKeys(confirm);
        return await page.common.selectFromStandardDropdown(
            this.elements.networkField,
            by.xpath('//li[.="' + chainname + '"]'),
            this.elements.selectedNetwork,
            chainname,
        );
    },

    //fill wallet name field

    fillWalletNameField: async function(walletName) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.nwName,
        )).sendKeys(walletName);
    },

    //validate correct wallet name

    validateCreateWalletNameField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(
            by.css(
                '.sonm-login__label:nth-of-type(1) > .sonm-login__label-error',
            ),
            errorMessage,
        );
    },

    //verify that import wallet file field is empty or not

    verifyCreateNewWalletNameFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(this.elements.nwName)).length,
        ).to.equal(0);
    },

    //fill password wallet field

    fillWalletPasswordField: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.nwPass,
        )).sendKeys(password);
    },

    //validate correct wallet password

    validateCreateWalletPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css(
                '.sonm-login__label:nth-of-type(2) > .sonm-login__label-error',
            ),
            shared.messages.wallet.walletPasswordValidationMessage,
        );
    },

    //verify that import wallet file field is empty or not

    verifyCreateNewWalletPasswordFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(this.elements.nwPass)).length,
        ).to.equal(0);
    },

    //fill confirm password wallet field

    fillWalletConfirmPasswordField: async function(confirmPassword) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.nwPassConfirm,
        )).sendKeys(confirmPassword);
    },

    //validate correct wallet confirm password

    validateCreateWalletConfirmPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css(
                '.sonm-login__label:nth-of-type(3) > .sonm-login__label-error',
            ),
            shared.messages.wallet.walletConfirmPasswordValidationMessage,
        );
    },

    //verify that import wallet file field is empty or not

    verifyCreateNewWalletConfirmationPasswordFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(this.elements.nwPassConfirm))
                .length,
        ).to.equal(0);
    },

    selectNetworkValue: function(chainname) {
        return page.common.selectFromStandardDropdown(
            this.elements.networkField,
            by.xpath('//li[.="' + chainname + '"]'),
            this.elements.selectedNetwork,
            chainname,
        );
    },

    //clear wallet password field

    clearWalletConfirmPasswordField: function() {
        return page.common.clearInputField(this.elements.nwPassConfirm);
    },

    //click create wallet button for further creating wallet

    createNewWalletButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.createNewWallet,
        )).click();
    },
};
