module.exports = function() {
    this.Then(
        /^Click the Edit Account button next to "([^"]*)" Name$/,
        async function(accName) {
            return await page.accountsPageAccountItem.clickOnEditAccountNameButton(
                accName,
            );
        },
    );

    this.Then(/^Clear Account Name field$/, async function() {
        return await page.accountsPageAccountItem.clearAccountNameField();
    });

    this.When(
        /^Fill Account "([^"]*)" Name field with new "([^"]*)" Name$/,
        async function(accName, newAccountName) {
            return await page.accountsPageAccountItem.fillAccountNameField(
                accName,
                newAccountName,
            );
        },
    );

    this.Then(
        /^Account Name is "([^"]*)" is present in Accounts list$/,
        async function(newAccountName) {
            return await page.accountsPageAccountItem.verifyAccountPresence(
                newAccountName,
            );
        },
    );

    this.When(/^Press ENTER button$/, async function() {
        return await page.accountsPageAccountItem.applyEditChanges();
    });

    this.When(/^Click the Delete Account button$/, async function() {
        return await page.dialogueDeleteAccount.clickDeleteButton();
    });

    this.Then(/^Delete Account dialogue is displayed$/, async function() {
        return await page.dialogueDeleteAccount.waitForDeleteAccountPopup();
    });

    this.Then(/^Account "([^"]*)" Name for Delete is correct$/, async function(
        accName,
    ) {
        return await page.dialogueDeleteAccount.verifyAccountNameForDelete(
            accName,
        );
    });

    this.Then(
        /^Account "([^"]*)" is not present in Accounts list$/,
        async function(accName) {
            return await page.accountsPageAccountItem.verifyAccountIsDeleted(
                accName,
            );
        },
    );

    this.Then(
        /^Click the Delete Account button next to "([^"]*)" Name$/,
        async function(accName) {
            return await page.accountsPageAccountItem.clickDeleteAccountButton(
                accName,
            );
        },
    );

    this.When(/^Click the Cancel Delete Account button$/, async function() {
        return await page.dialogueDeleteAccount.cancelDeleteAccountButton();
    });

    this.Then(/^Account was not created$/, async function() {
        return expect(
            (await page.accountsPageAccountItem.getAccountsCount()).length,
        ).to.equal(2);
    });
};
