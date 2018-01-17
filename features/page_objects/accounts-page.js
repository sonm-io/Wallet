module.exports = {

    elements: {
        addAccountButton: by.xpath('//button[.="Add account"]'),
        newAccountButton: by.xpath('//button[.="New account"]'),
        walletsHeader: by.className('sonm-wallets__header'),
        balanceHeader: by.className('sonm-currency-balance-list__header'),
        accountNames: by.className('sonm-account-item__name-text')
    },

    waitPageLoaded: function () {
        return shared.wdHelper.findVisibleElement(this.elements.addAccountButton);
    },

    clickNewAccount: function () {
        return shared.wdHelper.findVisibleElement(this.elements.newAccountButton).click();
    },

    clickAddAccount: function () {
        return shared.wdHelper.findVisibleElement(this.elements.addAccountButton).click();
    },

    findAccountInList: function (name) {
        return shared.wdHelper.findVisibleElements(by.xpath('//span[@class="sonm-account-item__name-text"][.="' + name + '"]'))
            .then(elements => expect(elements.length).to.equal(1));
    },

    clickOnAccountInList: function (name) {
        return shared.wdHelper.findVisibleElement(by.xpath('//div[@class="sonm-deletable-item__children"][.//span[contains(text(), "' + name + '")]]//a[@href="#"]')).click();
    },
};