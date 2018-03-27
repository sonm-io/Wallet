module.exports = function() {
    this.When(/^I select keystore file "([^"]*)"$/, function(filename) {
        return page.dialogueImportAccount.uploadAccountFile(filename);
    });

    this.Then(/^I see preview$/, async function() {
        return await page.dialogueImportAccount.findPreview();
    });

    this.When(/^I type account password "([^"]*)"$/, async function(password) {
        return await page.dialogueImportAccount.fillImportAccountPassword(
            password,
        );
    });

    this.When(/^I type account name "([^"]*)"$/, async function(name) {
        return await page.dialogueImportAccount.fillImportAccountName(name);
    });

    this.When(/^I press button Add$/, async function() {
        await page.dialogueImportAccount.clickAddImportAccountButton();
        return await page.dialogueImportAccount.verifySpinnerIsNotVisible();
    });

    this.Then(/^I see add account dialogue$/, async function() {
        return await page.dialogueImportAccount.waitImportAccountDialogue();
    });

    this.Then(
        /^I see import account file validation error message$/,
        function() {
            return page.dialogueImportAccount.validateImportAccountFileField();
        },
    );

    this.Then(
        /^I see import account name validation error message$/,
        function() {
            return page.dialogueImportAccount.validateImportAccountNameField();
        },
    );

    this.Then(
        /^I see import account password validation error message "([^"]*)"$/,
        function(errorMessage) {
            return page.dialogueImportAccount.validateImportAccountPasswordField(
                errorMessage,
            );
        },
    );

    this.Then(/^I clear import account password field$/, function() {
        return page.dialogueImportAccount.clearImportAccountPasswordField();
    });
};
