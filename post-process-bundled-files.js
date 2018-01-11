const fs = require('fs');

let indexFile = fs.readFileSync('./dist/index.html').toString().replace(`<script type="text/javascript" src="style.bundled.js"></script>`, ``);

// for (const type of ['app']) {
//     const inline = fs.readFileSync(`./dist/${type}.bundled.js`).toString();
//     indexFile = indexFile.replace(`<script type="text/javascript" src="${type}.bundled.js"></script>`, `<script type="text/javascript">${inline}</script>`);
//
//     console.log(type, inline.length);
// }

fs.writeFileSync('./dist/index.html', indexFile);
