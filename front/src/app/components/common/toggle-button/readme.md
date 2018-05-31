Unchecked:

    <ToggleButton title="title" value={false} />

Checked:

    <ToggleButton title="title" value={true} />

Disabled:

    <ToggleButton title="with true value"  value={true}  disabled />
    <ToggleButton title="with false value" value={false} disabled />

Group:

    <div>
      <ToggleButton groupName="status" title="poor" />
      <ToggleButton groupName="status" title="casual" />
      <ToggleButton groupName="status" title="rich" />
    </div>

Multiselect group:

    <div>
      <ToggleButton name="poor" title="poor" />
      <ToggleButton name="casual" title="casual" />
      <ToggleButton name="rich" title="rich" />
    </div>
