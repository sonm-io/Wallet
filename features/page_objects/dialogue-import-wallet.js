module.exports = {
    elements: {
        header: by.className('sonm-form__header'),
        selectWalletImportField: by.xpath('//input[@type="file"]'),
        walletNameField: by.xpath('//input[@name="newName"]'),
        walletPassword: by.xpath('//input[@name="password"]'),
        importWalletButton: by.xpath("//button[.='Import']"),
        validationMessage: by.css('.sonm-form__row *> .sonm-form-field__help'),
    },

    waitDialogue: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.header)
            .getText()
            .then(text => expect(text).to.equal('Import wallet'));
    },

    //select wallet file for further import

    selectWalletFileForImport: function() {
        let targetFile =
            process.cwd() + '/features/shared_objects/sonm-wallet-45te.json';
        return driver
            .wait(until.elementLocated(this.elements.selectWalletImportField))
            .sendKeys(targetFile);
    },

    //fill name field for wallet file

    fillImportWalletNameField: function(walletName) {
        shared.wdHelper
            .findVisibleElement(this.elements.walletPassword)
            .click();
        return shared.wdHelper
            .findVisibleElement(this.elements.walletNameField)
            .sendKeys(walletName);
    },

    //fill password field for wallet file

    fillImportWalletPasswordField: function(password) {
        shared.wdHelper
            .findVisibleElement(this.elements.walletPassword)
            .click();
        return shared.wdHelper
            .findVisibleElement(this.elements.walletPassword)
            .sendKeys(password);
    },

    validateField: function(errorMessage) {
        return page.common.verifyValidationErrorMessage(
            this.elements.passwordFieldValidMessage,
            errorMessage,
        );
    },

    //import wallet

    importWallet: function() {
        shared.wdHelper
            .findVisibleElement(this.elements.importWalletButton)
            .click();
    },
};
