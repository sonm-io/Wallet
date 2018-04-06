module.exports = {
    elements: {
        newAccountPopupHeader: by.xpath('//form/h3'),
        newAccountNameField: by.xpath('//input[@name="name"]'),
        newAccountPasswordField: by.xpath('//input[@name="password"]'),
        newAccountPasswordConfirmationField: by.xpath(
            '//input[@name="confirmation"]',
        ),
        newAccountPrivateKeyField: by.xpath('//input[@name="privateKey"]'),
        createNewAccountButton: by.xpath('//button[.="Create"]'),
    },

    //wait for page loading according to displayed new account header

    waitNewAccountDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPopupHeader,
        ))
            .getText()
            .then(text => expect(text).to.equal('New account'));
    },

    //fill account name field

    fillNewAccountAccountName: async function(name) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountNameField,
        )).sendKeys(name);
    },

    //validate account name field

    validateNewAccountNameField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(1) * > .sonm-form-field__help'),
            shared.messages.createAccount.createAccountNameValidationMessage,
        );
    },

    //fill account password field

    fillNewAccountPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPasswordField,
        )).sendKeys(password);
    },

    //validate account password field

    validateNewAccountPasswordField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(2) * > .sonm-form-field__help'),
            errorMessage,
        );
    },

    //fill account password confirm field

    fillNewAccountPasswordConfirmation: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPasswordConfirmationField,
        )).sendKeys(password);
    },

    //validate account confirm password field

    validateNewAccountConfirmationPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(3) * > .sonm-form-field__help'),
            shared.messages.createAccount
                .createAccountConfirmPasswordValidationMessage,
        );
    },

    //clear New Account Confirmation Password Field

    clearNewAccountPasswordField: async function() {
        return page.common.clearInputField(
            this.elements.newAccountPasswordField,
        );
    },

    //fill account private key field

    fillPrivateKey: async function(privateKey) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPrivateKeyField,
        )).sendKeys(privateKey);
    },

    //create new account

    clickCreateNewAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.createNewAccountButton,
        )).click();
    },
};
