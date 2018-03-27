module.exports = {
    elements: {
        passwordPopupHeader: by.xpath(
            '//form[@class="sonm-login__popup-content"]/h3',
        ),
        password: by.xpath('//div[@class="sonm-login__label"]/input'),
        passwordFieldValidMessage: by.className('sonm-login__label-error'),
        loginToWalletButton: by.className('sonm-login__create'),
        closeDialogueButton: by.xpath(
            '//div[@class="sonm-popup__inner"]/button[@class="sonm-icon sonm-popup__cross"]',
        ),
    },

    //wait for page loading according to displayed add account header

    waitForPasswordPopup: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.passwordPopupHeader,
        ))
            .getText()
            .then(text => expect(text).to.equal('Enter password'));
    },

    //fill password field

    enterPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.password,
        )).sendKeys(password);
    },

    //validation of password field

    validatePasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            this.elements.passwordFieldValidMessage,
            shared.messages.wallet.passwordPopUpMessage,
        );
    },

    //click login button

    loginToWallet: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.loginToWalletButton,
        )).click();
    },

    //close password dialogue

    closeDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.closeDialogueButton,
        )).click();
    },
};
