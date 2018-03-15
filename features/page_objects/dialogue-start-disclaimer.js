module.exports = {
    elements: {
        disclaimer: by.xpath("//h1['Welcome to SONM Wallet']"),
        disDontShowAgainButton: by.xpath('//button[.="I understand, don\'t show again"]'),
        disUnderstandButton: by.xpath("//button[.='I UNDERSTAND']"),
    },

    //wait for load account page according to displayed understand button

    waitForDisclaimerLoad: function () {
        return shared.wdHelper.findVisibleElement(this.elements.disclaimer);
    },

    //click understand button for further navigation to accounts

    clickUnderstandButton: async function () {
        await shared.wdHelper.findVisibleElement(this.elements.disUnderstandButton).click();
    },

    //click dont show button for further navigation to accounts

    clickDontShowDisclaimerButton: function () {
        page.common.delay(10000);
        shared.wdHelper.findVisibleElement(this.elements.disDontShowAgainButton).click();
    },
};
