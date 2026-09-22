const fs=require('fs'),p=require('path'),h=__dirname,repo=p.resolve(h,'../../..'),endo=p.resolve(h,'../endoscopy-layout');
const coverage=JSON.parse(fs.readFileSync(p.join(repo,'artifacts/character-statics/gs-018-v1/coverage-manifest.json'))),patient=coverage.records['patient.adult.001'];
const beds={south:JSON.parse(fs.readFileSync(p.join(endo,'south.json'))),east:JSON.parse(fs.readFileSync(p.join(endo,'east.json')))},bedSprites=JSON.parse(fs.readFileSync(p.join(endo,'sprite-config.json'))),live=JSON.parse(fs.readFileSync(p.join(h,'live-p01.json')));
const selected={south:{stand:patient.poses.stand.west,sit:patient.poses.sit.west},east:{stand:patient.poses.stand.south,sit:patient.poses.sit.south}};
const b64={bedSouth:fs.readFileSync(p.join(endo,'south.webp')).toString('base64'),bedEast:fs.readFileSync(p.join(endo,'east.webp')).toString('base64'),live:fs.readFileSync(p.join(h,'live-p01.webp')).toString('base64')};
for(const view of Object.values(selected))for(const record of Object.values(view))record.data=fs.readFileSync(p.join(repo,record.file)).toString('base64');
const data={tileSize:120,liveMetrics:{width:162,height:243,sourceVisibleHeight:171,visibleHeight:216.421875,cellScale:1.265625},approvedScale:216.421875/287,beds,bedSprites,live,selected};
let js=fs.readFileSync(p.join(h,'preview.js'),'utf8').replace('__DATA__',JSON.stringify(data)).replace('__BED_SOUTH__',b64.bedSouth).replace('__BED_EAST__',b64.bedEast).replace('__LIVE__',b64.live);
const out=fs.readFileSync(p.join(h,'template.html'),'utf8').replace('__ENDOSCOPY_SCALE_SCRIPT__',js);fs.writeFileSync(p.join(h,'endoscopy-scale-comparison.html'),out);console.log(`${Buffer.byteLength(out)} bytes`);
