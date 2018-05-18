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

    <Toggler name="toggler1" value={true} />

Value false:

    <Toggler name="toggler2" value={false} />

With title and title before in one group (try to change them):

    <div>
        <Toggler name="toggler3" title="Novice"/> |
        <Toggler name="toggler3" title="Expert" titleBefore />
    </div>
