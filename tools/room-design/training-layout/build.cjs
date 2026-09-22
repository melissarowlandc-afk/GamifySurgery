const fs=require('fs'),p=require('path'),h=__dirname;
const metadata=JSON.parse(fs.readFileSync(p.join(h,'training.json'))),sprites=JSON.parse(fs.readFileSync(p.join(h,'sprite-config.json')));
const atlas=fs.readFileSync(p.join(h,'training.webp')).toString('base64');
const js=fs.readFileSync(p.join(h,'preview.js'),'utf8').replace('__METADATA__',JSON.stringify(metadata)).replace('__SPRITES__',JSON.stringify(sprites)).replace('__ATLAS__',atlas);
const output=fs.readFileSync(p.join(h,'template.html'),'utf8').replace('__TRAINING_SCRIPT__',js);
fs.writeFileSync(p.join(h,'training-layout.html'),output);console.log(`${Buffer.byteLength(output)} bytes`);
