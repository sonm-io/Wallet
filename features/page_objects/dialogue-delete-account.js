module.exports = {
    elements: {
        deleteAccountPopupHeader: by.className(
            'sonm-account-delete-confirmation__header',
        ),
        accountName: by.css(
            '.sonm-account-delete-confirmation *> .sonm-account-item__name-text',
        ),
        cancelButton: by.xpath('//button[.="Cancel"]'),
        deleteButton: by.xpath('//button[.="Delete"]'),
    },

    waitForDeleteAccountPopup: async function() {
        (await shared.wdHelper.findVisibleElement(
            this.elements.deleteAccountPopupHeader,
        ))
            .getText()
            .then(text =>
                expect(text).to.equal(
                    'Are you sure you want to delete this account?',
                ),
            );
    },

    verifyAccountNameForDelete: async function(accName) {
        (await shared.wdHelper.findVisibleElement(this.elements.accountName))
            .getText()
            .then(text => expect(text).to.equal(accName));
    },

    cancelDeleteAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.cancelButton,
        )).click();
    },

    clickDeleteButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.deleteButton,
        )).click();
    },
};
