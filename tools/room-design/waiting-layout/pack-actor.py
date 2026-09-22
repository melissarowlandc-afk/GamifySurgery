from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
BASE=ROOT/'apps'/'player'/'public'/'art'/'characters'/'patients-v1'
OUT=Path(__file__).with_name('waiting-actor.webp'); META=Path(__file__).with_name('actor-atlas.json')
frames={}
for direction in ('front','back','left','right'):
    for phase in ('a','b'):
        name=f'{direction}{phase.upper()}'
        source=BASE/f'patients-{direction}-walk-{phase}-v1.png'
        image=Image.open(source).convert('RGBA').crop((384,0,512,192))
        frames[name]=(image,source)
atlas=Image.new('RGBA',(256,768));meta={}
for index,(name,(image,source)) in enumerate(frames.items()):
    x=(index%2)*128;y=(index//2)*192;atlas.alpha_composite(image,(x,y));meta[name]={'x':x,'y':y,'w':128,'h':192,'source':str(source.relative_to(ROOT))}
atlas.save(OUT,'WEBP',lossless=True,method=6,exact=True)
META.write_text(json.dumps({'identity':3,'sourceCrop':[384,0,128,192],'floorAnchor':[64,181],'authoredFrameTiles':[1.35,2.025],'atlasSize':list(atlas.size),'frames':meta},indent=2),encoding='utf-8')
print(json.dumps({'bytes':OUT.stat().st_size,'atlasSize':list(atlas.size)},indent=2))
