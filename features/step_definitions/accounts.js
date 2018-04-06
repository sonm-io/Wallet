module.exports = function() {
    this.Then(/^Accounts page is displayed$/, async function() {
        return await page.accountsPage.waitForAccountPageLoading();
    });

    this.When(/^Click the Import Account button$/, async function() {
        return await page.accountsPage.importAccount();
    });

    this.When(/^Click the Create Account button$/, function() {
        return page.accountsPage.createNewAccount();
    });

    this.Then(/^Account "([^"]*)" is present in Accounts list$/, function(
        name,
    ) {
        return page.accountsPage.findAccountInList(name);
    });

    this.Then(
        /^Account "([^"]*)" is present in Accounts list with hash "([^"]*)"$/,
        function(name, hash) {
            return page.accountsPage.findAccountInListWithHash(name, hash);
        },
    );

    this.When(/^Open Account "([^"]*)" details$/, function(name) {
        return page.accountsPage.clickOnAccountInList(name);
    });

    this.When(/^Click the Logout button$/, async function() {
        return await page.accountsPage.logoutFromWallet();
    });
};
