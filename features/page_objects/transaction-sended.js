module.exports = {

    elements: {
        header: by.xpath('//h1[.="Transaction has been sent"]'),
    },

    waitPageLoaded: function () {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    clickOpenHistory: function () {
        return shared.wdHelper.findVisibleElement(this.elements.newAccountButton).click();
    },

    clickSendTransaction: function () {
        return shared.wdHelper.findVisibleElement(this.elements.addAccountButton).click();
    }
};