module.exports = {

    elements: {
        sendTab: by.xpath('//li[.="Send"]'),
        select: by.className('sonm-account-big-select'),
        selectedAccount: by.className('sonm-account-item__name-text')
    },

    navigateToSend: function () {
        return shared.wdHelper.findVisibleElement(this.elements.sendTab).click();
    },

    checkSendTabDisabled: async function () {
        const el = await shared.wdHelper.findVisibleElement(this.elements.sendTab);
        const disabled = await el.getAttribute('aria-disabled');
        const selected = await el.getAttribute('aria-selected');
        expect(selected).to.equal('false');
        expect(disabled).to.equal('true');
    },

    selectAccountFromDropdown: function (accName) {
        shared.wdHelper.findVisibleElement(this.elements.select).click();
        shared.wdHelper.findVisibleElement(by.xpath('//li[@title="' + accName + '"]')).click();
        return shared.wdHelper.findVisibleElement(this.elements.selectedAccount).getText()
            .then(text => expect(text).to.equal(accName));
    }
};