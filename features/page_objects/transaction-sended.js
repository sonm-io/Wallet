module.exports = {
    elements: {
        header: by.xpath('//h1[.="Transaction has been sent"]'),
    },

    waitForAccountDetailPageLoading: function() {
        return shared.wdHelper.findVisibleElement(this.elements.header);
    },

    clickOpenHistory: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.createNewAccountButton)
            .click();
    },

    clickSendTransaction: function() {
        return shared.wdHelper
            .findVisibleElement(this.elements.importAccountButton)
            .click();
    },
};
