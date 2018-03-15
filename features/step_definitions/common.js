module.exports = function() {
    this.Given(/^Navigate to send page$/, function() {
        return page.common.navigateToSend();
    });

    //TODO refactor after adding attributes to send tab

    this.Then(/^Send link tab is disabled$/, function() {
        return page.accountsPage.checkSendTabIsDisabled();
    });
};
