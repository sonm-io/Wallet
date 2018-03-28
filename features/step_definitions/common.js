module.exports = function() {
    this.Given(/^Navigate to Send page$/, async function() {
        return await page.common.navigateToSendTab();
    });

    //TODO refactor after adding attributes to send tab

    this.Then(/^Send link tab is disabled$/, async function() {
        return await page.accountsPage.checkSendTabIsDisabled();
    });

    this.Then(/^Notification contained text "([^"]*)" is displayed$/, function(
        text,
    ) {
        return page.common.verifyNotificationText(text);
    });

    this.Then(/^Close Notification$/, function() {
        return page.common.closeNotification();
    });
};
