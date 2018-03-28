module.exports = function() {
    this.When(/^Keystore file "([^"]*)" is selected for upload$/, function(
        filename,
    ) {
        return page.dialogueImportAccount.uploadAccountFile(filename);
    });

    this.Then(/^Account Preview is displayed$/, async function() {
        return await page.dialogueImportAccount.findPreview();
    });

    this.When(/^Fill Import Account Password field "([^"]*)"$/, async function(
        password,
    ) {
        return await page.dialogueImportAccount.fillImportAccountPassword(
            password,
        );
    });

    this.When(/^Fill Import Account Name field "([^"]*)"$/, async function(
        name,
    ) {
        return await page.dialogueImportAccount.fillImportAccountName(name);
    });

    this.When(/^Click the Add button$/, async function() {
        await page.dialogueImportAccount.clickAddImportAccountButton();
        return await page.dialogueImportAccount.verifySpinnerIsNotVisible();
    });

    this.Then(/^Add Account dialogue is displayed$/, async function() {
        return await page.dialogueImportAccount.waitImportAccountDialogue();
    });

    this.Then(
        /^Import Account File field validation error message is displayed$/,
        function() {
            return page.dialogueImportAccount.validateImportAccountFileField();
        },
    );

    this.Then(
        /^Import Account Name field validation error message is displayed$/,
        function() {
            return page.dialogueImportAccount.validateImportAccountNameField();
        },
    );

    this.Then(
        /^Import Account Password validation error message "([^"]*)" is displayed$/,
        function(errorMessage) {
            return page.dialogueImportAccount.validateImportAccountPasswordField(
                errorMessage,
            );
        },
    );

    this.Then(/^Clear Import Account Password Field$/, function() {
        return page.dialogueImportAccount.clearImportAccountPasswordField();
    });
};
