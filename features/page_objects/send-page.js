module.exports = {
    elements: {
        header: by.xpath('//h1[.="Send"]'),
        sendTo: by.xpath('//input[@placeholder="Address"]'),
        amount: by.xpath('//input[@placeholder="Amount"]'),
        amountAddMaximumBtn: by.xpath('//button[.="Add maximum"]'),
        gasLimit: by.id('gasLimit'),
        gasPrice: by.id('gasPrice'),
        gasPriceLowBtn: by.xpath('//input[@type="radio"][@value="low"]'),
        gasPriceNormalBtn: by.xpath('//input[@type="radio"][@value="normal"]'),
        gasPriceHiBtn: by.xpath('//input[@type="radio"][@value="high"]'),
        NextBtn: by.xpath('//button[.="NEXT"]'),
        currencySelect: by.className('sonm-currency-big-select__option'),
        selectedCurrency: by.className('sonm-currency-item__name'),
        sendTab: by.xpath('//li[.="Send"]'),
        select: by.className('sonm-account-big-select'),
        selectedAccount: by.className('sonm-account-item__name-text'),
    },

    //wait for loading account page according to displayed header

    waitForAccountDetailPageLoading: function() {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    //select address from dropdown

    selectAddressFromByName: function(accName) {
        //return page.common.selectAccountFromDropdown(accName);

        return page.common.selectFromStandardDropdown(
            this.elements.select,
            by.xpath('//li[@title="' + accName + '"]'),
            this.elements.selectedAccount,
            accName,
        );
    },

    //fill field send address to

    fillAddressTo: async function(address) {
        return (await shared.wdHelper
            .findVisibleElement(this.elements.sendTo))
            .sendKeys(address);
    },

    //fill amount field

    setAmountField: async function(amount) {
        return (await shared.wdHelper
            .findVisibleElement(this.elements.amount))
            .sendKeys(amount);
    },

    // click next button

    clickNext: async function() {
        return (await shared.wdHelper
            .findVisibleElement(this.elements.NextBtn))
            .click();
    },

    //verify selected currency

    checkSelectedCurrency: async function(currency) {
        return (await shared.wdHelper
            .findVisibleElement(this.elements.selectedCurrency))
            .getText()
            .then(text => expect(text).to.equal(currency));
    },

    //select currency from dropdown

    selectCurrency: async function(currency) {
        (await shared.wdHelper
            .findVisibleElement(this.elements.currencySelect))
            .click();
        (await shared.wdHelper.findVisibleElement(by.xpath('//li[@title="' + currency + '"]'))).click();
        return this.checkSelectedCurrency(currency);
    },
};
