module.exports = function() {
    this.When(
        /^Account "([^"]*)" is selected From Accounts dropdown$/,
        async function(accName) {
            return await page.sendPage.selectAddressFromByName(accName);
        },
    );

    this.When(/^Fill Send To address field "([^"]*)"$/, function(address) {
        return page.sendPage.fillAddressTo(address);
    });

    this.When(/^Select currency "([^"]*)"$/, function(currency) {
        return page.sendPage.selectCurrency(currency);
    });

    this.When(/^Fill Amount field "([^"]*)"$/, function(amount) {
        return page.sendPage.setAmountField(amount);
    });

    this.When(/^Click the Next button$/, function() {
        return page.sendPage.clickNext();
    });

    this.Then(/^Send page is displayed$/, function() {
        return page.sendPage.waitForAccountDetailPageLoading();
    });

    this.Then(/^Selected Currency "([^"]*)" is displayed$/, function(currency) {
        return page.sendPage.checkSelectedCurrency(currency);
    });

    this.Then(/^Transfer Confirmation page is displayed$/, function() {
        return page.transferConfirmation.waitForAccountDetailPageLoading();
    });

    this.Then(
        /^Account From Name is "([^"]*)" and Address is "([^"]*)" is displayed$/,
        function(name, hex) {
            return page.transferConfirmation.checkAccountFrom(name, hex);
        },
    );

    this.Then(/^Account to is equal to "([^"]*)"$/, function(address) {
        return page.transferConfirmation.checkAccountTo(address);
    });

    this.Then(/^Amount is equal to "([^"]*)"$/, function(amount) {
        return page.transferConfirmation.checkAmount(amount);
    });

    this.Then(/^Gas limit is equal to "([^"]*)"$/, function(gasLimit) {
        let gasL = shared.wdHelper.resolve(shared.config, gasLimit);
        return page.transferConfirmation.checkGasLimit(gasL);
    });

    this.When(/^Fill Account Password field "([^"]*)"/, function(password) {
        return page.transferConfirmation.fillPassword(password);
    });

    this.When(/^Click the Send button$/, function() {
        return page.transferConfirmation.clickSend();
    });

    this.Then(/^Transaction Completed page is displayed$/, function() {
        return page.transactionSended.waitForPageLoading();
    });
};
