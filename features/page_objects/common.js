module.exports = {
    elements: {
        sendTab: by.xpath('//li[.="Send"]'),
        select: by.className('sonm-account-big-select'),
        selectedAccount: by.className('sonm-account-item__name-text'),
    },

    //navigate to send tab

    navigateToSend: function () {
        return shared.wdHelper.findVisibleElement(this.elements.sendTab).click();
    },

    //delay for functions

    delay: function (ms) {
        return function (x) {
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    },

    //verify that element is displayed on page

    checkElementIsDisabled: async function (el, cssValue, expectedCssValue) {
        const webElement = await shared.wdHelper.findVisibleElement(el);
        const actualCssValue = await webElement.getCssValue(cssValue);
        return await expect(actualCssValue).to.equal(expectedCssValue);
    },

    //select value from dropdown

    selectFromStandardDropdown: function (element, dropdownItem, selectedItem, name) {
        shared.wdHelper.findVisibleElement(element).click();
        shared.wdHelper.findVisibleElement(dropdownItem).click();
        return shared.wdHelper.findVisibleElement(selectedItem).getText()
            .then(text => expect(text).to.equal(name));
    },

    //get all values from dropdown

    getValuesFromDropdown: async function (dropdown, dropdownValue) {
        await shared.wdHelper.findVisibleElement(dropdown).click();
        let values = await shared.wdHelper.findVisibleElements(dropdownValue);
        let valuesText = [];
        for (let i = 0; i < values.length; i++) {
            valuesText.push(await values[i].getText());
        }
        return await valuesText;
    },

    //click on dropdown

    clickDropdown: async function (element) {
        await shared.wdHelper.findVisibleElement(element).click();
    },

    //assert array to string

    assertDropdownValues: async function (arrayOne, searchValue) {
        return await expect(JSON.stringify(arrayOne)).to.equal(searchValue);
    },

    //enter value into dropdown for search

    enterValueForSearch: async function (dropdownSearchField, searchValue) {
        await shared.wdHelper
            .findVisibleElement(dropdownSearchField)
            .sendKeys(searchValue);
    },

    //verify that validation error message is displayed

    verifyValidationErrorMessage: async function (element, messageText) {
        return await shared.wdHelper
            .findVisibleElement(element)
            .getText()
            .then(validMessageText =>
                expect(validMessageText).to.equal(messageText),
            );
    },

    //clear input field

    clearInputField: async function (field) {
        return await shared.wdHelper.findVisibleElement(field).clear();
    },

    test: async function () {
        const webElement = await shared.wdHelper.findVisibleElement(
            by.css('.sonm-spinner__svg.sonm-load-mask__spinner'),
        );
        const actualCssValue = await webElement.getCssValue('overflow');
        console.log(actualCssValue);
        driver.wait(until.equals(expect(actualCssValue).to.equal('hidden')));
        console.log(await expect(actualCssValue).to.equal('hidden'));
    },
};
