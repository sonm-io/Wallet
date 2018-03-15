module.exports = function () {
    this.Then(/^I should see new account dialogue$/, function () {
        return page.dialogueNewAccount.waitDialogue();
    });

    this.When(/^I type new account password "([^"]*)"$/, function (password) {
        return page.dialogueNewAccount.fillPassword(password);
    });

    this.When(/^I type new account password confirmation "([^"]*)"$/, function (password) {
        return page.dialogueNewAccount.fillPasswordConfirmation(password);
    });

    this.When(/^I type new account name "([^"]*)"$/, function (name) {
        return page.dialogueNewAccount.fillAccountName(name);
    });

    this.When(/^I press button Create$/, function () {
        return page.dialogueNewAccount.clickCreateButton();
    });

    this.When(/^I type private key "([^"]*)"$/, function (privateKey) {
        return page.dialogueNewAccount.fillPrivateKey(privateKey);
    });
};