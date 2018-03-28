module.exports = {
    elements: {
        disclaimer: by.className('sonm-login__spin'),
        disUnderstandButton: by.xpath(
            '//div[@class="sonm-disclaimer__buttons"]/button[.="I UNDERSTAND"]',
        ),
        disDontShowAgainButton: by.xpath(
            '//div[@class="sonm-disclaimer__buttons"]/button[.="I understand, don\'t show again"]',
        ),
    },

    //wait for load account page according to displayed understand button

    waitForDisclaimerLoad: async function() {
        return await shared.wdHelper.waitElementIsNotVisible(
            this.elements.disclaimer,
        );
    },

    //click understand button for further navigation to accounts

    clickUnderstandButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.disUnderstandButton,
        )).click();
    },

    //click dont show button for further navigation to accounts

    clickDontShowDisclaimerButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.disDontShowAgainButton,
        )).click();
    },
};
