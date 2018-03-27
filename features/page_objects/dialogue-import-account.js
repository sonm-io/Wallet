module.exports = {
    elements: {
        header: by.xpath('//form/h3'),
        selectKeystore: by.xpath('//input[@type="file"]'),
        accountNameField: by.xpath('//input[@name="name"]'),
        accountPasswordField: by.xpath('//input[@name="password"]'),
        addButton: by.xpath('//button[.="Add"]'),
        preview: by.className('sonm-accounts-add-account__preview-ct'),
        fileField: by.xpath('//input[@type="file"]'),
    },

    //wait for page loading according to displayed add account header

    waitImportAccountDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(this.elements.header))
            .getText()
            .then(text => expect(text).to.equal('Add account'));
    },

    verifySpinnerIsNotVisible: async function() {
        // let el = await driver.findElement(by.css('.sonm-app > .sonm-load-mask'));
        // return await driver.wait(until.elementIsNotVisible(el));
        await shared.wdHelper.waitElementIsNotVisible(
            by.css('.sonm-app > .sonm-load-mask'),
        );
    },

    //upload account file

    uploadAccountFile: function(filename = 'for_upload.json') {
        let targetFile = process.cwd() + '/features/shared_objects/' + filename;
        return driver
            .wait(until.elementLocated(this.elements.fileField))
            .sendKeys(targetFile);
    },

    //import account preview

    findPreview: async function() {
        return await shared.wdHelper.findVisibleElement(this.elements.preview);
    },

    //enter account name

    fillImportAccountName: async function(name) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountNameField,
        )).sendKeys(name);
    },

    //enter account password

    fillImportAccountPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountPasswordField,
        )).sendKeys(password);
    },

    //validation of account file

    validateImportAccountFileField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(1) * > .sonm-form-field__help'),
            shared.messages.importAccount
                .importAccountIncorrectFileValidationMessage,
        );
    },

    //validation of account name field

    validateImportAccountNameField: async function() {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(2) * > .sonm-form-field__help'),
            shared.messages.importAccount.importAccountNameValidationMessage,
        );
    },

    //validation of account password field

    validateImportAccountPasswordField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(
            by.css('.sonm-form__row:nth-of-type(3) * > .sonm-form-field__help'),
            errorMessage,
        );
    },

    clearImportAccountPasswordField: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountPasswordField,
        )).clear();
    },

    //click add account button

    clickAddImportAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.addButton,
        )).click();
    },
};
