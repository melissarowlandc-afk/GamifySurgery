from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'waiting-west-atlas-01.png'
BENCH_SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'waiting-bench-east-02.png'
OUT=Path(__file__).with_name('waiting-west-assets.webp')
META=Path(__file__).with_name('west-atlas.json')
regions={'benchE':(0,0,613,642),'chairN':(613,0,1226,642),'chairS':(0,642,613,1283),'tableV':(613,642,1226,1283)}
source=Image.open(SOURCE).convert('RGBA'); crops={}
for name,region in regions.items():
    image=source.crop(region); alpha=image.getchannel('A').point(lambda v:255 if v>=32 else 0); bbox=alpha.getbbox()
    if bbox is None: raise RuntimeError(name)
    l=max(0,bbox[0]-3); t=max(0,bbox[1]-3); r=min(image.width,bbox[2]+3); b=min(image.height,bbox[3]+3)
    crops[name]=image.crop((l,t,r,b))
bench_source=Image.open(BENCH_SOURCE).convert('RGBA'); alpha=bench_source.getchannel('A').point(lambda v:255 if v>=32 else 0); bbox=alpha.getbbox();l=max(0,bbox[0]-3);t=max(0,bbox[1]-3);r=min(bench_source.width,bbox[2]+3);b=min(bench_source.height,bbox[3]+3);crops['benchE']=bench_source.crop((l,t,r,b))
padding=8;width=max(i.width for i in crops.values())+padding*2;height=sum(i.height+padding for i in crops.values())+padding
atlas=Image.new('RGBA',(width,height)); meta={}; y=padding
for name,image in crops.items():
    atlas.alpha_composite(image,(padding,y));meta[name]={'x':padding,'y':y,'w':image.width,'h':image.height};y+=image.height+padding
atlas.save(OUT,'WEBP',quality=88,method=6,exact=True)
META.write_text(json.dumps({'source':str(SOURCE.relative_to(ROOT)),'sourceSize':list(source.size),'benchSource':str(BENCH_SOURCE.relative_to(ROOT)),'benchSourceSize':list(bench_source.size),'alphaThreshold':32,'atlasSize':list(atlas.size),'crops':meta},indent=2),encoding='utf-8')
print(json.dumps({'bytes':OUT.stat().st_size,'atlasSize':list(atlas.size),'crops':meta},indent=2))
