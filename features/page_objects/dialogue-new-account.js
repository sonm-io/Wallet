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
        closeCreateNewAccountDialogueButton: by.xpath(
            '//div[@class="sonm-popup__inner"]/button',
        ),
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

    verifyCreateNewAccountNameFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(
                this.elements.newAccountNameField,
            )).length,
        ).to.equal(0);
    },

    //fill account password field

    validateNewAccountNameField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(1) * > .sonm-form-field__help'),
            shared.messages.createAccount.createAccountNameValidationMessage,
        );
    },

    //validate account password field

    fillNewAccountPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPasswordField,
        )).sendKeys(password);
    },

    verifyCreateNewAccountPasswordFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(
                this.elements.newAccountPasswordField,
            )).length,
        ).to.equal(0);
    },

    //fill account password confirm field

    validateNewAccountPasswordField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(2) * > .sonm-form-field__help'),
            errorMessage,
        );
    },

    //validate account confirm password field

    fillNewAccountPasswordConfirmation: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPasswordConfirmationField,
        )).sendKeys(password);
    },

    verifyCreateNewAccountConfirmationPasswordFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(
                this.elements.newAccountPasswordConfirmationField,
            )).length,
        ).to.equal(0);
    },

    //clear New Account Confirmation Password Field

    validateNewAccountConfirmationPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(3) * > .sonm-form-field__help'),
            shared.messages.createAccount
                .createAccountConfirmPasswordValidationMessage,
        );
    },

    //fill account private key field

    clearNewAccountPasswordField: async function() {
        return page.common.clearInputField(
            this.elements.newAccountPasswordField,
        );
    },

    //create new account

    fillNewAccountPrivateKeyField: async function(privateKey) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.newAccountPrivateKeyField,
        )).sendKeys(privateKey);
    },

    verifyCreateNewAccountPrivateKeyFieldIsEmpty: async function() {
        return await expect(
            (await page.common.verifyFieldLength(
                this.elements.newAccountPrivateKeyField,
            )).length,
        ).to.equal(0);
    },

    //close create new account dialogue

    clickCreateNewAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.createNewAccountButton,
        )).click();
    },

    closeCreateNewAccountDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.closeCreateNewAccountDialogueButton,
        )).click();
    },
};
