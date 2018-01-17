module.exports = {

    elements: {
        header: by.xpath('//h1[.="Transfer confirmation"]'),
        addrFromName: by.className('sonm-send-confirm__account-name'),
        addrFromHex: by.className('sonm-send-confirm__account-addr'),
        addrTo: by.className('sonm-send-confirm__account-target'),
        amount: by.xpath('//dl[@class="sonm-send-confirm__values"]/dd[1]'),
        gasLimit: by.xpath('//dl[@class="sonm-send-confirm__values"]//dd[2]'),
        password: by.xpath('//input[@placeholder="Password"]'),
        sendBtn: by.xpath('//button[.="Send"]'),
        backBtn: by.xpath('//button[.="Back"]'),
    },

    waitPageLoaded: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    checkAccountFrom: function (name, hex) {
        shared.wdHelper.findVisibleElement(this.elements.addrFromName).getText()
            .then((text) => expect(text).to.equal(name));
        return shared.wdHelper.findVisibleElement(this.elements.addrFromHex).getText()
            .then((text) => expect(text).to.equal(hex));
    },

    checkAccountTo: function (address) {
        return shared.wdHelper.findVisibleElement(this.elements.addrTo).getText()
            .then((text) => expect(text).to.equal(address));
    },

    checkAmount: function (amount) {
        return shared.wdHelper.findVisibleElement(this.elements.amount).getText()
            .then((text) => expect(text).to.equal(amount));
    },

    checkGasLimit: function (gasLimit) {
        return shared.wdHelper.findVisibleElement(this.elements.gasLimit).getText()
            .then((text) => expect(text).to.equal(gasLimit));
    },

    fillPassword: function (password) {
        return shared.wdHelper.findVisibleElement(this.elements.password).sendKeys(password);
    },

    clickSend: function () {
        return shared.wdHelper.findVisibleElement(this.elements.sendBtn).click();
    },

    clickBack: function () {
        return shared.wdHelper.findVisibleElement(this.elements.backBtn).click();
    }
};