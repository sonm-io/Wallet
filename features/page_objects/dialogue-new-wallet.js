module.exports = {
    elements: {
        header: by.xpath('//div/form/h3'),
        nwName: by.xpath('//input[@name="newName"]'),
        nwPass: by.xpath('//input[@name="newPassword"]'),
        nwPassConfirm: by.xpath('//input[@name="newPasswordConfirmation"]'),
        createNewWallet: by.className('sonm-login__create'),
        networkField: by.css('div.sonm-login__network-type > div'),
        selectedNetwork: by.css('div.sonm-login__network-type div > div > div.sonm-select-selection-selected-value'),
    },

    waitNewWalletDialogue: async function () {
        return await driver.wait(until.elementLocated(this.elements.header)).getText()
            .then(text => expect(text).to.equal('New wallet'));
    },

    //fill all fields in new wallet dialogue and create wallet

    fillNewWalletDialogue: async function (walletName, pass, confirm, chainname) {
        await shared.wdHelper.findVisibleElement(this.elements.nwName).sendKeys(walletName);
        await shared.wdHelper.findVisibleElement(this.elements.nwPass).sendKeys(pass);
        await shared.wdHelper.findVisibleElement(this.elements.nwPassConfirm).sendKeys(confirm);
        return await page.common.selectFromStandardDropdown(this.elements.networkField,
            by.xpath('//li[.="' + chainname + '"]'),
            this.elements.selectedNetwork, chainname);
    },

    //fill wallet name field

    fillWalletNameField: function (walletName) {
        return shared.wdHelper.findVisibleElement(this.elements.nwName).sendKeys(walletName);
    },

    //fill password wallet field

    fillWalletPasswordField: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.nwPass).sendKeys(password);
    },

    //fill confirm password wallet field

    fillWalletConfirmPasswordField: function (confirmPassword) {
        return shared.wdHelper.findVisibleElement(this.elements.nwPassConfirm).sendKeys(confirmPassword);
    },

    selectNetworkValue: function (chainname) {
        return page.common.selectFromStandardDropdown(this.elements.networkField,
            by.xpath('//li[.="' + chainname + '"]'), this.elements.selectedNetwork, chainname);
    },

    //clear wallet password field

    clearWalletConfirmPasswordField: function () {
        return page.common.clearInputField(this.elements.nwPassConfirm);
    },

    //click create wallet button for further creating wallet

    createNewWalletButton: async function () {
        await shared.wdHelper.findVisibleElement(this.elements.createNewWallet).click();
    },

    //TODO refactor

    //validate correct wallet name

    validateCreateWalletNameField: async function (errorMessage) {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-login__label:nth-of-type(1) > .sonm-login__label-error'),
            errorMessage);
    },

    //validate correct wallet password

    validateCreateWalletPasswordField: async function () {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-login__label:nth-of-type(2) > .sonm-login__label-error'),
            shared.messages.wallet.walletPasswordValidationMessage);
    },

    //validate correct wallet confirm password

    validateCreateWalletConfirmPasswordField: async function () {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-login__label:nth-of-type(3) > .sonm-login__label-error'),
            shared.messages.wallet.walletConfirmPasswordValidationMessage);
    },
};
