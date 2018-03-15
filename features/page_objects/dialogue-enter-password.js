module.exports = {
    elements: {
        passwordPopupHeader: by.css(
            '.sonm-login__popup-content > .sonm-login__popup-header',
        ),
        password: by.css('input[type=password]'),
        passwordFieldValidMessage: by.className('sonm-login__label-error'),
        loginToWalletButton: by.className('sonm-login__create'),
        closeDialogueButton: by.xpath(
            "//div/button[@class='sonm-icon sonm-popup__cross']",
        ),
        //closeDialogueButton: by.css(".sonm-popup.sonm-popup--dark *> .sonm-popup__inner > .sonm-popup__cross")
    },

    //wait for page loading according to displayed add account header

    waitForPasswordPopup: async function() {
        return await shared.wdHelper
            .findVisibleElement(this.elements.passwordPopupHeader)
            .getText()
            .then(text => expect(text).to.equal('Enter password'));
    },

    //fill password field

    enterPassword: async function(password) {
        return await shared.wdHelper
            .findVisibleElement(this.elements.password)
            .sendKeys(password);
    },

    //validation of password field

    validatePasswordField: function() {
        return page.common.verifyValidationErrorMessage(
            this.elements.passwordFieldValidMessage,
            shared.messages.wallet.passwordPopUpMessage,
        );
    },

    //click login button

    loginToWallet: async function() {
        await shared.wdHelper
            .findVisibleElement(this.elements.loginToWalletButton)
            .click();
    },

    //close password dialogue

    closeDialogue: function() {
        shared.wdHelper
            .findVisibleElement(this.elements.closeDialogueButton)
            .click();
    },
};
