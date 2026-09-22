const fs=require('fs'),p=require('path'),h=__dirname;
const data={south:JSON.parse(fs.readFileSync(p.join(h,'south.json'))),east:JSON.parse(fs.readFileSync(p.join(h,'east.json')))};
const sprites=JSON.parse(fs.readFileSync(p.join(h,'sprite-config.json'))),contract=JSON.parse(fs.readFileSync(p.join(h,'handoff-contract.json')));
const b64={south:fs.readFileSync(p.join(h,'south.webp')).toString('base64'),east:fs.readFileSync(p.join(h,'east.webp')).toString('base64')};
let js=fs.readFileSync(p.join(h,'preview.js'),'utf8').replace('__DATA__',JSON.stringify(data)).replace('__SPRITES__',JSON.stringify(sprites)).replace('__CONTRACT__',JSON.stringify(contract)).replace('__SOUTH__',b64.south).replace('__EAST__',b64.east);
const output=fs.readFileSync(p.join(h,'template.html'),'utf8').replace('__ENDOSCOPY_SCRIPT__',js);
fs.writeFileSync(p.join(h,'endoscopy-layout.html'),output);console.log(`${Buffer.byteLength(output)} bytes`);
