### Checkbox

Value true:

    <Toggler value={true} />

Value false:

    <Toggler value={false} />

With title:

    <Toggler title="Professional"/>

Title before:

    <Toggler title="Professional" titleBefore />

### Radio

Value true:

    <Toggler groupName="toggler1" value={true} />

Value false:

    <Toggler groupName="toggler2" value={false} />

With title and title before in one group (try to change them):

    <div>
        <Toggler groupName="toggler3" title="Novice"/> |
        <Toggler groupName="toggler3" title="Expert" titleBefore />
    </div>

### Disabled

Disabled with true and fable value:

    <Toggler title="disabled toggler with true value" value={true}   disabled />
    <Toggler title="disabled toggler with false value" value={false} disabled />
