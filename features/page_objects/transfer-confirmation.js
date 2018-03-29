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

    //wait for load account page according to displayed header

    waitForAccountDetailPageLoading: function() {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    //verify account form

    checkAccountFrom: async function(name, hex) {
        (await shared.wdHelper.findVisibleElement(this.elements.addrFromName))
            .getText()
            .then(text => expect(text).to.equal(name));
        return (await shared.wdHelper.findVisibleElement(
            this.elements.addrFromHex,
        ))
            .getText()
            .then(text => expect(text).to.equal(hex));
    },

    //verify send account to

    checkAccountTo: async function(address) {
        return (await shared.wdHelper.findVisibleElement(this.elements.addrTo))
            .getText()
            .then(text => expect(text).to.equal(address));
    },

    //verify amount

    checkAmount: async function(amount) {
        return (await shared.wdHelper.findVisibleElement(this.elements.amount))
            .getText()
            .then(text => expect(text).to.equal(amount));
    },

    //verify gas limit amount

    checkGasLimit: async function(gasLimit) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.gasLimit,
        ))
            .getText()
            .then(text => expect(text).to.equal(gasLimit));
    },

    //fill account password field

    fillPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.password,
        )).sendKeys(password);
    },

    //click send button

    clickSend: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.sendBtn,
        )).click();
    },

    //go to previous page

    clickBack: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.backBtn,
        )).click();
    },
};
