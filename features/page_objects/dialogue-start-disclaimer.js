module.exports = {
    elements: {
        disclaimer: by.className('sonm-login__spin'),
        disUnderstandButton: by.xpath('//button[.="I UNDERSTAND"]'),
        disDontShowAgainButton: by.xpath(
            '//button[.="I understand, don\'t show again"]',
        ),
        buttonsElement: by.xpath('//div[@class="sonm-disclaimer__buttons"]'),
    },

    //wait for load account page according to displayed understand button

    waitForDisclaimerLoad: async function() {
        await shared.wdHelper.waitElementIsNotVisible(this.elements.disclaimer);
        return await shared.wdHelper.findVisibleElement(
            this.elements.buttonsElement,
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
