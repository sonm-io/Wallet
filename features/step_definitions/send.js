module.exports = function () {
    this.When(/^I select account from by name "([^"]*)"$/, function (accName) {
        return page.sendPage.selectAddressFromByName(accName);
    });

    this.When(/^I type into send to field address "([^"]*)"$/, function (address) {
        return page.sendPage.fillAddressTo(address);
    });

    this.When(/^I select currency "([^"]*)"$/, function (currency) {
        return page.sendPage.selectCurrency(currency);
    });

    this.When(/^I set amount "([^"]*)"$/, function (amount) {
        return page.sendPage.setAmountField(amount);
    });

    this.When(/^I click Next$/, function () {
        return page.sendPage.clickNext();
    });

    this.Then(/^I should see send page$/, function () {
        return page.sendPage.waitForAccountDetailPageLoading();
    });

    this.Then(/^I should see selected currency is "([^"]*)"$/, function (currency) {
        return page.sendPage.checkSelectedCurrency(currency);
    });

    this.Then(/^I should see Transfer confirmation page$/, function () {
        return page.transferConfirmation.waitForAccountDetailPageLoading();
    });

    this.Then(/^Account from name is "([^"]*)" and address is "([^"]*)"$/, function (name, hex) {
        return page.transferConfirmation.checkAccountFrom(name, hex);
    });

    this.Then(/^Account to is equal to "([^"]*)"$/, function (address) {
        return page.transferConfirmation.checkAccountTo(address);
    });

    this.Then(/^Amount is equal to "([^"]*)"$/, function (amount) {
        return page.transferConfirmation.checkAmount(amount);
    });

    this.Then(/^Gas limit is equal to "([^"]*)"$/, function (gasLimit) {
        let gasL = shared.wdHelper.resolve(shared.config, gasLimit);
        return page.transferConfirmation.checkGasLimit(gasL);
    });

    this.When(/^I type password "([^"]*)" into confirmation section$/, function (password) {
        return page.transferConfirmation.fillPassword(password);
    });

    this.When(/^I click send button$/, function () {
        return page.transferConfirmation.clickSend();
    });

    this.Then(/^I should see Transaction has been sent page$/, function () {
        return page.transactionSended.waitForAccountDetailPageLoading();
    });
};
