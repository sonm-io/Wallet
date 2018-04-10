module.exports = {
    elements: {
        newAccountPopupHeader: by.className(
            'sonm-form sonm-accounts-create-account__form',
        ),
        newAccountNameField: by.xpath('//input[@name="name"]'),
        newAccountPasswordField: by.xpath('//input[@name="password"]'),
        newAccountConfirmPasswordField: by.xpath(
            '//input[@name="confirmation"]',
        ),
        newAccountPrivateKeyField: by.xpath('//input[@name="privateKey"]'),
        createNewAccountButton: by.xpath('//button[.="Create"]'),
    },

    //wait for page loading according to displayed add account header

    waitForCreateNewAccountDialogue: async function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.newAccountPopupHeader)
            .getText()
            .then(text => expect(text).to.equal('New account'));
        //return await driver.wait(until.elementTextIs(driver.wait(until.elementLocated(this.elements.newAccountPopupHeader)), 'New account'), 80000);
    },

    //fill account name field

    fillNewAccountNameField: function(accountName) {
        return shared.wdHelper
            .findVisibleElement(this.elements.newAccountNameField)
            .sendKeys(accountName);
    },

    //fill account password field

    fillNewAccountPasswordField: function(password) {
        return shared.wdHelper
            .findVisibleElement(this.elements.newAccountPasswordField)
            .sendKeys(password);
    },

    //fill account confirm password field

    fillNewAccountConfirmPasswordField: function(confirmPassword) {
        return shared.wdHelper
            .findVisibleElement(this.elements.newAccountConfirmPasswordField)
            .sendKeys(confirmPassword);
    },

    //fill private key field

    fillPrivateKeyField: function(privateKey) {
        return shared.wdHelper
            .findVisibleElement(this.elements.newAccountPrivateKeyField)
            .sendKeys(privateKey);
    },

    //create new account

    createNewAccout: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.createNewAccountButton)
            .click();
    },
};
