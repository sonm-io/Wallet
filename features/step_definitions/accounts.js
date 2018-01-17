module.exports = function () {

    this.Then(/^I should see accounts page$/, function () {
        return page.accountsPage.waitPageLoaded();
    });

    this.When(/^I press Add account$/, function () {
        return page.accountsPage.clickAddAccount();
    });

    this.When(/^I press New account$/, function () {
        return page.accountsPage.clickNewAccount();
    });

    this.Then(/^I should see account "([^"]*)" in accounts list$/, function (name) {
        return page.accountsPage.findAccountInList(name);
    });

    this.When(/^I open account "([^"]*)" details$/, function (name) {
        return page.accountsPage.clickOnAccountInList(name);
    });

    this.When(/^I click on send ethereum button$/, function () {
        return page.accountDetailPage.clickSendEthereum();
    });

    this.When(/^I click on send sonm button$/, function () {
        return page.accountDetailPage.clickSendSnm();
    });

    this.Then(/^I should see add account dialogue$/, function () {
        return page.dialogueAddAccount.waitDialogue();
    });

    this.When(/^I select keystore file "([^"]*)"$/, function (filename) {
        return page.dialogueAddAccount.uploadAccountFile(filename);
    });

    this.Then(/^I see preview$/, function () {
        return page.dialogueAddAccount.findPreview();
    });

    this.When(/^I type account password "([^"]*)"$/, function (password) {
        return page.dialogueAddAccount.fillPassword(password)
    });

    this.When(/^I type account name "([^"]*)"$/, function (name) {
        return page.dialogueAddAccount.fillAccountName(name);
    });

    this.When(/^I press button Add$/, function () {
        return page.dialogueAddAccount.clickAddButton();
    });

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

};
