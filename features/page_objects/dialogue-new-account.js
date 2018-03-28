module.exports = {
    elements: {
        header: by.xpath('//div/form/h3'),
        password: by.xpath('//input[@name="password"]'),
        confirmation: by.xpath('//input[@name="confirmation"]'),
        name: by.xpath('//input[@name="name"]'),
        privateKey: by.xpath('//input[@name="privateKey"]'),
        createButton: by.xpath('//button[.="Create"]'),
    },

    //wait for page loading according to displayed new account header

    waitNewAccountDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(this.elements.header))
            .getText()
            .then(text => expect(text).to.equal('New account'));
    },

    //fill account name field

    fillNewAccountAccountName: async function(name) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.name,
        )).sendKeys(name);
    },

    //validate account name field

    validateNewAccountNameField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(1) * > .sonm-form-field__help'),
            shared.messages.importAccount
                .importAccountIncorrectFileValidationMessage,
        );
    },

    //fill account password field

    fillNewAccountPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.password,
        )).sendKeys(password);
    },

    //validate account password field

    validateNewAccountPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(2) * > .sonm-form-field__help'),
            shared.messages.importAccount
                .importAccountIncorrectFileValidationMessage,
        );
    },

    //fill account password confirm field

    fillNewAccountPasswordConfirmation: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.confirmation,
        )).sendKeys(password);
    },

    //validate account confirm password field

    validateNewAccountConfirmPasswordField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(3) * > .sonm-form-field__help'),
            shared.messages.importAccount
                .importAccountIncorrectFileValidationMessage,
        );
    },

    //fill account private key field

    fillPrivateKey: async function(privateKey) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.privateKey,
        )).sendKeys(privateKey);
    },

    //create new account

    clickCreateNewAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.createButton,
        )).click();
    },
};
