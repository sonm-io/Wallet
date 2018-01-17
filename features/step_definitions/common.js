module.exports = function () {

    this.Given(/^Navigate to send page$/, function () {
        return page.common.navigateToSend();
    });

    this.Then(/^Send link is disabled$/, function () {
        return page.common.checkSendTabDisabled()
    });
};