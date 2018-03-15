module.exports = {
    elements: {
        addTokenButton: by.xpath("//button[.='Add token']"),
        tokenNameField: by.xpath("//input[@name='address']"),
        closePopup: by.className('sonm-popup__cross'),
    },

    //fill token name's field

    enterTokenName: function(tokenName) {
        return shared.wdHelper.findVisibleElement(this.elements.tokenNameField).sendKeys(tokenName);
    },

    //verify that add token button is disabled

    checkAddTokenButtonIsDisabled: function() {
        return page.common.checkElementIsDisabled(this.elements.addTokenButton, 'cursor', 'not-allowed');
    },

    //click on add token button and add token to tokens list

    addToken: function() {
        return shared.wdHelper.findVisibleElement(this.elements.addTokenButton).click();
    },
};
