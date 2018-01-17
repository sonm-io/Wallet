module.exports = {

    elements: {
        header: by.xpath('//h1[.="Account"]'),
        sendEtherBtn: by.xpath('//button[@name="0x"]'),
        sendSnmBtn: by.xpath('//button[@name="0x06bda3cf79946e8b32a0bb6a3daa174b577c55b5"]'),
        historyBtn: by.xpath('//button[.="View operation history"]')
    },

    waitPageLoaded: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    clickSendEthereum: function () {
        return shared.wdHelper.findVisibleElement(this.elements.sendEtherBtn).click();
    },

    clickSendSnm: function () {
        return shared.wdHelper.findVisibleElement(this.elements.sendSnmBtn).click();
    },

    clickSendCustom: function (tokenAddress) {
        return shared.wdHelper.findVisibleElement(('//button[@name="' + tokenAddress + '"]')).click();
    },

    viewHistory: function () {
        return shared.wdHelper.findVisibleElement(this.elements.historyBtn).click();
    }
};