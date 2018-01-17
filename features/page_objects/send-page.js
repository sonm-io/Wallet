module.exports = {

    elements: {
        header: by.xpath('//h1[.="Send"]'),
        sendTo: by.id('toAddress'),
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
    },

    waitPageLoaded: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    selectAddressFromByName: function (accName) {
        return page.common.selectAccountFromDropdown(accName);
    },

    fillAddressTo: function (address) {
        return shared.wdHelper.findVisibleElement(this.elements.sendTo).sendKeys(address);
    },

    setAmountField: function (amount) {
        return shared.wdHelper.findVisibleElement(this.elements.amount).sendKeys(amount);
    },

    clickNext: function () {
        return shared.wdHelper.findVisibleElement(this.elements.NextBtn).click();
    },

    checkSelectedCurrency: function (currency) {
        return shared.wdHelper.findVisibleElement(this.elements.selectedCurrency).getText()
            .then((text) => expect(text).to.equal(currency));
    },

    selectCurrency: function (currency) {
        shared.wdHelper.findVisibleElement(this.elements.currencySelect).click();
        shared.wdHelper.findVisibleElement(by.xpath('//li[@title="' + currency + '"]')).click();
        return this.checkSelectedCurrency(currency);
    }

};