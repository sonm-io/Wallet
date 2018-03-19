module.exports = {

    elements: {
        header: by.xpath('//div/form/h3'),
        password: by.xpath('//input[@name="password"]'),
        confirmation: by.xpath('//input[@name="confirmation"]'),
        name: by.xpath('//input[@name="name"]'),
        privateKey: by.xpath('//input[@name="privateKey"]'),
        createButton: by.xpath('//button[.="Create"]')
    },

    waitNewAccountDialogue: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.header)).getText()
            .then((text) => expect(text).to.equal('New account'));
    },

    fillPassword: async function (password) {
        return (await shared.wdHelper.findVisibleElement(this.elements.password)).sendKeys(password);
    },

    fillPasswordConfirmation: async function (password) {
        return (await shared.wdHelper.findVisibleElement(this.elements.confirmation)).sendKeys(password);
    },

    fillAccountName: async function (name) {
        return (await shared.wdHelper.findVisibleElement(this.elements.name)).sendKeys(name);
    },

    fillPrivateKey: async function (privateKey) {
        return (await shared.wdHelper.findVisibleElement(this.elements.privateKey)).sendKeys(privateKey);
    },

    clickCreateButton: async function () {
        return (await shared.wdHelper.findVisibleElement(this.elements.createButton)).click();
    },
};


// console.log("current dir = " + targetFile);