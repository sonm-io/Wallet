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
        return await page.dialogueImportAccount.clickAddImportAccountButton();
    });

    this.Then(/^I See add account dialogue$/, async function() {
        return await page.dialogueImportAccount.waitImportAccountDialogue();
    });
};
