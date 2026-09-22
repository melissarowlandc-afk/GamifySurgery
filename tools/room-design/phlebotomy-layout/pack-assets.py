from pathlib import Path
import json
import shutil
from PIL import Image, ImageDraw

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
EAST_SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'phlebotomy-furniture-east-02.png'
WINDOW_SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'phlebotomy-curtained-window-02.png'

east=Image.open(EAST_SOURCE).convert('RGBA')
window=Image.open(WINDOW_SOURCE).convert('RGBA')

def threshold_bbox(image, bounds, threshold=32, padding=8):
    left,top,right,bottom=bounds
    region=image.crop(bounds)
    alpha=region.getchannel('A').point(lambda value:255 if value>=threshold else 0)
    box=alpha.getbbox()
    if not box:
        raise RuntimeError(f'no alpha component in {bounds}')
    x0=max(left+box[0]-padding,0); y0=max(top+box[1]-padding,0)
    x1=min(left+box[2]+padding,image.width); y1=min(top+box[3]+padding,image.height)
    return (x0,y0,x1,y1)

partitions={'chair':(0,0,720,east.height),'stool':(720,0,1240,east.height),'sink':(1240,0,east.width,east.height)}
boxes={name:threshold_bbox(east,bounds) for name,bounds in partitions.items()}
global_contacts={
    'chair':{'ground':(390,823),'seat':(610,542)},
    'stool':{'ground':(951,824),'seat':(952,449)},
    'sink':{'ground':(1510,844)},
}
crops={name:east.crop(box) for name,box in boxes.items()}
padding=8
atlas_width=sum(image.width for image in crops.values())+padding*(len(crops)+1)
atlas_height=max(image.height for image in crops.values())+padding*2
packed=Image.new('RGBA',(atlas_width,atlas_height))
frames={}; cursor=padding
for name,image in crops.items():
    packed.alpha_composite(image,(cursor,padding))
    x0,y0,_,_=boxes[name]
    frames[name]={'x':cursor,'y':padding,'w':image.width,'h':image.height}
    frames[name]['sourceGround']=[global_contacts[name]['ground'][0]-x0,global_contacts[name]['ground'][1]-y0]
    if 'seat' in global_contacts[name]:
        frames[name]['sourceSeat']=[global_contacts[name]['seat'][0]-x0,global_contacts[name]['seat'][1]-y0]
    cursor+=image.width+padding

if not (HERE/'east-01.webp').exists():
    shutil.copy2(HERE/'east.webp',HERE/'east-01.webp')
if not (HERE/'east-01.json').exists():
    shutil.copy2(HERE/'east.json',HERE/'east-01.json')
packed.save(HERE/'east.webp','WEBP',quality=90,method=6,exact=True)
(HERE/'east.json').write_text(json.dumps({
    'source':str(EAST_SOURCE.relative_to(ROOT)).replace('\\','/'),
    'sourceSize':list(east.size),
    'sourceBoxes':boxes,
    'componentAlphaThreshold':32,
    'packedFrames':{name:{key:value for key,value in frame.items() if key in ('x','y','w','h')} for name,frame in frames.items()},
    'sourceContacts':{name:{key:value for key,value in frame.items() if key in ('sourceGround','sourceSeat')} for name,frame in frames.items()},
},indent=2),encoding='utf-8')

window_box=threshold_bbox(window,(0,0,window.width,window.height))
window_crop=window.crop(window_box)
if not (HERE/'window-01.webp').exists():
    shutil.copy2(HERE/'window.webp',HERE/'window-01.webp')
if not (HERE/'window-01.json').exists():
    shutil.copy2(HERE/'window.json',HERE/'window-01.json')
window_crop.save(HERE/'window.webp','WEBP',quality=88,method=6,exact=True)
(HERE/'window.json').write_text(json.dumps({
    'source':str(WINDOW_SOURCE.relative_to(ROOT)).replace('\\','/'),
    'sourceSize':list(window.size),
    'sourceBox':window_box,
    'componentAlphaThreshold':32,
    'packedFrame':{'x':0,'y':0,'w':window_crop.width,'h':window_crop.height},
},indent=2),encoding='utf-8')

config_path=HERE/'sprite-config.json'
config=json.loads(config_path.read_text(encoding='utf-8'))
for name,frame in frames.items():
    config['east'][name]['ground']=frame['sourceGround']
    if 'sourceSeat' in frame:
        config['east'][name]['seat']=frame['sourceSeat']
config_path.write_text(json.dumps(config,indent=2)+"\n",encoding='utf-8')

review=east.copy(); draw=ImageDraw.Draw(review)
for name,points in global_contacts.items():
    for kind,color in [('ground',(220,60,48,255)),('seat',(35,105,190,255))]:
        if kind not in points: continue
        x,y=points[kind]; draw.ellipse((x-10,y-10,x+10,y+10),outline=color,width=5); draw.line((x-16,y,x+16,y),fill=color,width=3); draw.line((x,y-16,x,y+16),fill=color,width=3)
review.save(HERE/'evidence'/'east-02-contact-registration.png')
print(json.dumps({'eastBoxes':boxes,'eastFrames':frames,'windowBox':window_box,'eastBytes':(HERE/'east.webp').stat().st_size,'windowBytes':(HERE/'window.webp').stat().st_size},indent=2))
