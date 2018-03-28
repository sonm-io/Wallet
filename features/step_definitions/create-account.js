module.exports = function() {
    this.Then(/^Create New Account dialogue is displayed$/, async function() {
        return await page.dialogueNewAccount.waitNewAccountDialogue();
    });

    this.When(
        /^Fill Create New Account Password field "([^"]*)"/,
        async function(password) {
            return await page.dialogueNewAccount.fillNewAccountPassword(
                password,
            );
        },
    );

    this.When(
        /^Fill Create New Account Password Confirmation field "([^"]*)"/,
        async function(password) {
            return await page.dialogueNewAccount.fillNewAccountPasswordConfirmation(
                password,
            );
        },
    );

    this.When(/^Fill Create New Account Name field "([^"]*)"/, async function(
        name,
    ) {
        return await page.dialogueNewAccount.fillNewAccountAccountName(name);
    });

    this.When(/^Click the Create button$/, async function() {
        return await page.dialogueNewAccount.clickCreateNewAccountButton();
    });

    this.When(/^Fill Private Key field "([^"]*)"$/, async function(privateKey) {
        return await page.dialogueNewAccount.fillPrivateKey(privateKey);
    });
};
