module.exports = {
    elements: {
        header: by.className('sonm-form__header'),
        selectWalletImportField: by.xpath('//input[@type="file"]'),
        walletNameField: by.xpath('//input[@name="newName"]'),
        walletPassword: by.xpath('//input[@name="password"]'),
        importWalletButton: by.xpath("//button[.='Import']"),
        validationMessage: by.css('.sonm-form__row *> .sonm-form-field__help'),
    },

    waitImportWalletDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(this.elements.header))
            .getText()
            .then(text => expect(text).to.equal('Import wallet'));
    },

    //select wallet file for further import

    selectWalletFileForImport: function(walletName) {
        let targetFile = process.cwd() + '/features/shared_objects/' + walletName;
        console.log(targetFile);
        return driver
            .wait(until.elementLocated(this.elements.selectWalletImportField))
            .sendKeys(targetFile);
    },

    //fill name field for wallet file

    fillImportWalletNameField: async function(walletName) {
        (await shared.wdHelper.findVisibleElement(
            this.elements.walletPassword,
        )).click();
        return (await shared.wdHelper.findVisibleElement(
            this.elements.walletNameField,
        )).sendKeys(walletName);
    },

    //fill password field for wallet file

    fillImportWalletPasswordField: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.walletPassword,
        )).sendKeys(password);
    },

    validateImportWalletFileField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-form__row:nth-of-type(2) *> .sonm-form-field__help'), errorMessage);
    },

    validateImportWalletNameField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-form__row:nth-of-type(3) *> .sonm-form-field__help'), errorMessage);
    },

    validateImportWalletPasswordField: async function(errorMessage) {
        return await page.common.verifyValidationErrorMessage(by.css('.sonm-form__row:nth-of-type(1) *> .sonm-form-field__help'), errorMessage);
    },

    //import wallet

    importWallet: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.importWalletButton,
        )).click();
    },
};
