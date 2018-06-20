Icons:

To get more icons go to: https://material.io/icons/

    const { icons } = require ('./index.tsx');
    const renderedIcons = Object.keys(icons).map(function (i) { return <div><Icon i={i} /> {i}</div> });

    <div>
        {renderedIcons}
    </div>
