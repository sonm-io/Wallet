module.exports = {
    elements: {
        header: by.xpath('//form/h3'),
        selectKeystore: by.xpath('//input[@type="file"]'),
        accountName: by.xpath('//input[@name="name"]'),
        accountPassword: by.xpath('//input[@name="password"]'),
        addButton: by.xpath('//button[.="Add"]'),
        preview: by.className('sonm-accounts-add-account__preview-ct'),
        fileField: by.xpath('//input[@type="file"]'),
    },

    //wait for page loading according to displayed add account header

    waitImportAccountDialogue: async function() {
        return (await shared.wdHelper.findVisibleElement(this.elements.header))
            .getText()
            .then(text => expect(text).to.equal('Add account'));
    },

    //upload account file

    uploadAccountFile: function(filename = 'for_upload.json') {
        let targetFile = process.cwd() + '/features/shared_objects/' + filename;
        return driver
            .wait(until.elementLocated(this.elements.fileField))
            .sendKeys(targetFile);
    },

    findPreview: async function() {
        return await shared.wdHelper.findVisibleElement(this.elements.preview);
    },

    //enter account name

    fillImportAccountName: async function(name) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountName,
        )).sendKeys(name);
    },

    //enter account password

    fillImportAccountPassword: async function(password) {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.accountPassword,
        )).sendKeys(password);
    },

    //click add account button

    clickAddImportAccountButton: async function() {
        return (await shared.wdHelper.findVisibleElement(
            this.elements.addButton,
        )).click();
    },
};
