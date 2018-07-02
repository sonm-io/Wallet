KycListView:

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const correctPassword = 'password';

const state = observable({
    list: require('./sub/kyc-list-item/mock-data.js'),
    kycLinks: {},
    selectedIndex: -1,
    validationMessage: undefined,

    // private
    clearValidationMessage: action.bound(function() {
        this.validationMessage = undefined;
    }),

    // handlers
    handleClickItem: action.bound(function(index) {
        if (this.selectedIndex !== index) {
            this.clearValidationMessage();
        }
        this.selectedIndex = index;
    }),
    handleCloseBottom: action.bound(function() {
        this.selectedIndex = -1;
        this.clearValidationMessage();
    }),
    handleSubmitPassword: action.bound(function(itemIndex, password) {
        const dataItem = {};
        if (password === correctPassword) {
            this.kycLinks[this.list[itemIndex].id] = '/link/to/service';
            this.kycLinks = Object.assign({}, this.kycLinks);
        } else {
            this.validationMessage = 'Invalid password.';
        }
    }),
});

const Container = observer(() => (
    <KycListView
        list={state.list}
        kycLinks={state.kycLinks}
        validationMessage={state.validationMessage}
        selectedIndex={state.selectedIndex}
        onClickItem={state.handleClickItem}
        onCloseBottom={state.handleCloseBottom}
        onSubmitPassword={state.handleSubmitPassword}
    />
));

const StateInfo = observer(() => (
    <div>Correct password: {correctPassword}</div>
));

<div>
    <StateInfo />
    <Container />
</div>;
```
