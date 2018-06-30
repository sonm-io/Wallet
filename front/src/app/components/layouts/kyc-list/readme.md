KycListView:

```js
const { observable, action, useStrict, toJS } = mobx;
const { observer } = mobxReact;

const correctPassword = 'password';

const state = observable({
    list: require('./sub/kyc-list-item/mock-data.js'),
    data: {},
    selectedIndex: -1,

    // private
    clearValidationMessage: action.bound(function() {
        const data = this.data;
        Object.keys(data).forEach(function(id) {
            data[id].validationMessage = undefined;
        });
        this.data = Object.assign({}, data);
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
            dataItem.kycLink = '/link/to/service';
        } else {
            dataItem.validationMessage = 'Invalid password.';
        }
        this.data[this.list[itemIndex].id] = dataItem;
        this.data = Object.assign({}, this.data);
    }),
});

const Container = observer(() => (
    <KycListView
        list={state.list}
        data={state.data}
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
