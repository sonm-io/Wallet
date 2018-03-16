module.exports = function() {
    this.Given(/^Navigate to send page$/, function() {
        return page.common.navigateToSend();
    });

    //TODO refactor after adding attributes to send tab

    this.Then(/^Send link tab is disabled$/, async function() {
        return await page.accountsPage.checkSendTabIsDisabled();
    });
};
