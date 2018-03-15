module.exports = function() {
    this.Then(/^I should see accounts page$/, function() {
        return page.accountsPage.waitForAccountPageLoading();
    });

    this.When(/^I press import account$/, function() {
        return page.accountsPage.importAccount();
    });

    this.When(/^I press create new account$/, function() {
        return page.accountsPage.createNewAccount();
    });

    this.Then(/^I should see account "([^"]*)" in accounts list$/, function(name) {
        return page.accountsPage.findAccountInList(name);
    });

    this.When(/^I open account "([^"]*)" details$/, function(name) {
        return page.accountsPage.clickOnAccountInList(name);
    });

    this.When(/^I press logout button$/, function() {
        return page.accountsPage.logoutFromWallet();
    });
};
