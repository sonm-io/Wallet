module.exports = function() {
    this.Then(/^I should see new account dialogue$/, async function() {
        return await page.dialogueNewAccount.waitNewAccountDialogue();
    });

    this.When(/^I type new account password "([^"]*)"$/, async function(
        password,
    ) {
        return await page.dialogueNewAccount.fillPassword(password);
    });

    this.When(
        /^I type new account password confirmation "([^"]*)"$/,
        async function(password) {
            return await page.dialogueNewAccount.fillPasswordConfirmation(
                password,
            );
        },
    );

    this.When(/^I type new account name "([^"]*)"$/, async function(name) {
        return await page.dialogueNewAccount.fillAccountName(name);
    });

    this.When(/^I press button Create$/, async function() {
        return await page.dialogueNewAccount.clickCreateButton();
    });

    this.When(/^I type private key "([^"]*)"$/, async function(privateKey) {
        return await page.dialogueNewAccount.fillPrivateKey(privateKey);
    });
};
