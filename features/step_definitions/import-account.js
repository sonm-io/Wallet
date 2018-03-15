module.exports = function () {
    this.When(/^I select keystore file "([^"]*)"$/, function (filename) {
        return page.dialogueImportAccount.uploadAccountFile(filename);
    });

    this.Then(/^I see preview$/, function () {
        return page.dialogueImportAccount.findPreview();
    });

    this.When(/^I type account password "([^"]*)"$/, function (password) {
        return page.dialogueImportAccount.fillPassword(password);
    });

    this.When(/^I type account name "([^"]*)"$/, function (name) {
        return page.dialogueImportAccount.fillAccountName(name);
    });

    this.When(/^I press button Add$/, function () {
        return page.dialogueImportAccount.clickAddButton();
    });

    this.Then(/^I should see add account dialogue$/, function () {
        return page.dialogueImportAccount.waitDialogue();
    });
};