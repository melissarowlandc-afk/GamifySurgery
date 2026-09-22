const fs=require('fs'),p=require('path'),h=__dirname;
const data=JSON.parse(fs.readFileSync(p.join(h,'evs.json')));
const sprites=JSON.parse(fs.readFileSync(p.join(h,'sprite-config.json')));
const atlas=fs.readFileSync(p.join(h,'evs.webp')).toString('base64');
const js=fs.readFileSync(p.join(h,'preview.js'),'utf8').replace('__DATA__',JSON.stringify(data)).replace('__SPRITES__',JSON.stringify(sprites)).replace('__ATLAS__',atlas);
const output=fs.readFileSync(p.join(h,'template.html'),'utf8').replace('__EVS_SCRIPT__',js);
fs.writeFileSync(p.join(h,'evs-layout.html'),output);
console.log(`${Buffer.byteLength(output)} bytes`);
