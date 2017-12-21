const fs = require('fs');

let indexFile = fs.readFileSync('./front/docs/index.html').toString().replace(`<script type="text/javascript" src="style.bundled.js"></script>`, ``);

// for (const type of ['app']) {
//     //const inline = fs.readFileSync(`./front/dist/${type}.bundled.js`).toString('base64');
//     //indexFile = indexFile.replace(`<script type="text/javascript" src="${type}.bundled.js"></script>`, new Buffer(`<script type="text/javascript" src="data:text/javascript;base64,${inline}"></script>`));
//
//     const inline = fs.readFileSync(`./front/dist/${type}.bundled.js`).toString();
//     indexFile = indexFile.replace(`<script type="text/javascript" src="${type}.bundled.js"></script>`, `<script type="text/javascript">${inline}</script>`);
//
//     console.log(type, inline.length);
// }

fs.writeFileSync('./front/docs/index.html', indexFile);
