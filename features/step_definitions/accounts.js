module.exports = function() {
    this.Then(/^I should see accounts page$/, async function() {
        return await page.accountsPage.waitForAccountPageLoading();
    });

    this.When(/^I press import account$/, async function() {
        return await page.accountsPage.importAccount();
    });

    this.When(/^I press create new account$/, function() {
        return page.accountsPage.createNewAccount();
    });

    this.Then(/^I should see account "([^"]*)" in accounts list$/, function(name) {
        return page.accountsPage.findAccountInList(name);
    });

    this.Then(/^I should see account "([^"]*)" in accounts list with hash "([^"]*)"$/, function(name, hash) {
        return page.accountsPage.findAccountInListWithHash(name, hash);
    });

    this.When(/^I open account "([^"]*)" details$/, function(name) {
        return page.accountsPage.clickOnAccountInList(name);
    });

    this.When(/^I press logout button$/, async function() {
        return await page.accountsPage.logoutFromWallet();
    });
};
