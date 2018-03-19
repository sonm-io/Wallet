module.exports = {
    elements: {
        header: by.xpath('//h1[.="Account"]'),
        sendEtherBtn: by.xpath('//button[@name="0x"]'),
        sendSnmBtn: by.xpath(
            '//button[@name="0x06bda3cf79946e8b32a0bb6a3daa174b577c55b5"]',
        ),
        historyBtn: by.xpath('//button[.="View operation history"]'),
        tokensRequestAcPass: by.xpath('//input[@type="password"]'),
        requestTokensBtn: by.xpath('//button[@type="submit"]'),
    },

    //wait for load account page according to displayed header

    waitForAccountDetailPageLoading: function() {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    //send ethereum to

    clickSendEthereum: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.sendEtherBtn)
            .click();
    },

    //send SNM to

    clickSendSnm: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.sendSnmBtn)
            .click();
    },

    //send custom to

    clickSendCustom: function(tokenAddress) {
        return shared.wdHelper
            .findVisibleElement('//button[@name="' + tokenAddress + '"]')
            .click();
    },

    //navigate to viewHistory page

    viewHistory: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.historyBtn)
            .click();
    },

    //fill account password for further token request

    fillTokenRequestPasswordField: function(acPassword) {
        return shared.wdHelper
            .findVisibleElement(this.elements.tokensRequestAcPass)
            .sendKeys(acPassword);
    },

    //request tokens

    clickOnRequestTokensButton: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.requestTokensBtn)
            .click();
    },
};
