module.exports = function() {
    this.Given(/^Navigate to send page$/, async function() {
        return await page.common.navigateToSendTab();
    });

    //TODO refactor after adding attributes to send tab

    this.Then(/^Send link tab is disabled$/, async function() {
        return await page.accountsPage.checkSendTabIsDisabled();
    });

    this.Then(/^I should see notification contained text "([^"]*)"$/, function(
        text,
    ) {
        return page.common.verifyNotificationText(text);
    });

    this.Then(/^I close notification$/, function() {
        return page.common.closeNotification();
    });
};
