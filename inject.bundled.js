const fs = require('fs');

let indexFile = fs.readFileSync('./front/dist/index.html').toString();

for (const type of ['app', 'style']) {
	const inline = fs.readFileSync(`./front/dist/${type}.bundled.js`).toString('base64');
	indexFile = indexFile.replace(`<script type="text/javascript" src="${type}.bundled.js"></script>`, new Buffer(`<script type="text/javascript" src="data:text/javascript;base64,${inline}"></script>`));
	console.log(type, inline.length);
}

fs.writeFileSync('./front/dist/index.html', indexFile);