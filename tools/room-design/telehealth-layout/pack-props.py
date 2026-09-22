from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
image=Image.open(ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'telehealth-chairs-plants-01.png').convert('RGBA')

def component(name,bounds,ground,seat=None,pad=7):
    left,top,right,bottom=bounds; region=image.crop(bounds)
    alpha=region.getchannel('A').point(lambda v:255 if v>=32 else 0); box=alpha.getbbox()
    if not box: raise RuntimeError(name+' has no alpha')
    out=(max(0,left+box[0]-pad),max(0,top+box[1]-pad),min(image.width,left+box[2]+pad),min(image.height,top+box[3]+pad))
    data={'image':image.crop(out),'sourceBox':out,'sourceGround':[ground[0]-out[0],ground[1]-out[1]]}
    if seat: data['sourceSeat']=[seat[0]-out[0],seat[1]-out[1]]
    return data

items={
 'eastChair':component('eastChair',(0,0,512,512),(318,480),(425,293)),
 'westChair':component('westChair',(512,0,1024,512),(782,480),(665,293)),
 'northChair':component('northChair',(1024,0,1536,512),(1253,475),(1249,285)),
 'southChair':component('southChair',(0,512,512,1024),(309,975),(309,785)),
 'snakePlant':component('snakePlant',(512,512,1024,1024),(770,973)),
 'rubberPlant':component('rubberPlant',(1024,512,1536,1024),(1261,970)),
}
margin=7;width=sum(v['image'].width for v in items.values())+margin*(len(items)+1);height=max(v['image'].height for v in items.values())+margin*2
atlas=Image.new('RGBA',(width,height));cursor=margin;frames={}
for name,item in items.items():
    atlas.alpha_composite(item['image'],(cursor,margin));frames[name]={'x':cursor,'y':margin,'w':item['image'].width,'h':item['image'].height,'sourceGround':item['sourceGround']}
    if 'sourceSeat' in item: frames[name]['sourceSeat']=item['sourceSeat']
    cursor+=item['image'].width+margin
atlas.save(HERE/'props.webp','WEBP',quality=90,method=6,exact=True)
(HERE/'props.json').write_text(json.dumps({'source':'Photos for Codex 2/Codex Rooms 2/GS-015/telehealth-chairs-plants-01.png','sourceSize':list(image.size),'componentAlphaThreshold':32,'packedFrames':frames},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'frames':frames,'packedSize':atlas.size},indent=2))
