module.exports = {
    elements: {
        passwordPopupHeader: by.xpath('//form/h3'),
        //passwordPopupHeader: by.xpath('//form[@class="sonm-login__popup-content"]'),
        password: by.xpath('//div[@class="sonm-login__label"]/input'),
        passwordFieldValidMessage: by.className('sonm-login__label-error'),
        loginToWalletButton: by.className('sonm-login__create'),
        closePasswordDialogueButton: by.xpath(
            '//div[@class="sonm-popup__inner"]/button',
        ),
    },

    //wait for page loading according to displayed add account header

    waitForPasswordPopup: async function() {
        (await shared.wdHelper.findVisibleElement(
            this.elements.passwordPopupHeader,
        ))
            .getText()
            .then(text => expect(text).to.equal('Enter password'));
        return await shared.wdHelper.findVisibleElement(
            this.elements.loginToWalletButton,
        );
    },

    //close password dialogue

    closePasswordDialogue: async function() {
        (await shared.wdHelper.findVisibleElement(
            this.elements.closePasswordDialogueButton,
        )).click();
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
};
