const webdriver = require('selenium-webdriver');

//get Account index in list for further operations (delete, edit etc.)

const getAccountPosition = async function(accForDelete) {
    let accountElements = await shared.wdHelper.findVisibleElements(
        by.css('.sonm-accounts__list-item *> .sonm-account-item__name-wrapper'),
    );
    for (let i = 0; i < accountElements.length; i++) {
        if ((await accountElements[i].getText()) === accForDelete) {
            var index = (await i) + 1;
        } else {
            console.log('Element not found');
        }
        return await index;
    }
};

module.exports = {
    elements: {
        accountName: by.className('sonm-account-item__name-text'),
        accountNameEditButton: by.css('.sonm-account-item__edit-button'),
        accountNameEditField: by.className('sonm-account-item__edit-name'),
        showPrivateKeyButton: by.xpath('//a[@href="#show-private-key"]'),
        deleteAccountButton: by.css('.sonm-accounts__list-item > button'),
    },

    //click on Edit button for further account editing

    clickOnEditAccountNameButton: async function(accountName) {
        return (await shared.wdHelper.findVisibleElement(
            by.xpath('//span[.="' + accountName + '"]/button'),
        )).click();
    },

    //clear account name field

    clearAccountNameField: async function() {
        return page.common.clearInputField(this.elements.accountNameEditField);
    },

    //fill account name field

    fillAccountNameField: async function(accName, newAccountName) {
        return (await shared.wdHelper.findVisibleElement(
            by.xpath('//input[@value="' + accName + '"]'),
        )).sendKeys(newAccountName);
    },

    //apply changes after editing name

    applyEditChanges: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountNameEditField,
        )).sendKeys(webdriver.Key.ENTER);
    },

    //verify that account is edited

    verifyAccountPresence: async function(editedName) {
        return await shared.wdHelper.findVisibleElement(
            by.xpath('//span/span[.="' + editedName + '"]'),
        );
    },

    //TODO refactor

    verifyAccountIsDeleted: async function(deletedAccName) {
        let account = await driver.wait(
            until.stalenessOf(
                driver.findElement(
                    by.xpath('//span/span[.="' + deletedAccName + '"]'),
                ),
            ),
        );
        await expect(account).to.equal(true);
    },

    clickDeleteAccountButton: async function(accForDelete) {
        return (await shared.wdHelper.findVisibleElement(
            by.css(
                '.sonm-accounts__list-item:nth-of-type(' +
                    (await getAccountPosition(accForDelete)) +
                    ') > button',
            ),
        )).click();
    },

    //TODO refactor

    getAccountsCount: async function() {
        return await shared.wdHelper.findVisibleElements(
            by.css(
                '.sonm-accounts__list-item *> .sonm-account-item__name-wrapper',
            ),
        );
    },
};
