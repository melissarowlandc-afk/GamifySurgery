from pathlib import Path
from PIL import Image
import json

HERE=Path(__file__).resolve().parent
SOURCE=HERE.parents[2]/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'
MARGIN=8
def crop_spec(path,zone,anchor,size,metric='baseWidth',physical=None):
    image=Image.open(path).convert('RGBA')
    alpha=image.crop(zone).getchannel('A').point(lambda x:255 if x>=16 else 0)
    bbox=alpha.getbbox()
    if not bbox: raise RuntimeError('empty zone '+str(zone))
    visible=(zone[0]+bbox[0],zone[1]+bbox[1],zone[0]+bbox[2],zone[1]+bbox[3])
    crop=(max(zone[0],visible[0]-MARGIN),max(zone[1],visible[1]-MARGIN),min(zone[2],visible[2]+MARGIN),min(zone[3],visible[3]+MARGIN))
    sprite=image.crop(crop); sprite.putalpha(sprite.getchannel('A').point(lambda x:0 if x<16 else x))
    return {'image':sprite,'source':path.name,'sourceSize':image.size,'crop':crop,'visible':visible,'anchor':(anchor[0]-crop[0],anchor[1]-crop[1]),'anchorGlobal':anchor,'size':size,'metric':metric,'physical':physical}

items={
  # Contact is the measured cabinet feet baseline, not the padded canvas edge.
  'island':crop_spec(SOURCE/'coffee-island-01.png',(0,0,1254,1254),(627,1155),120,'baseWidth'),
  'print1':crop_spec(SOURCE/'coffee-wall-art-01.png',(0,0,887,887),(443,849),70,'height'),
  'print2':crop_spec(SOURCE/'coffee-wall-art-01.png',(887,0,1774,887),(1330,849),70,'height'),
}
gap=10; width=sum(x['image'].width for x in items.values())+gap*(len(items)-1); height=max(x['image'].height for x in items.values())
atlas=Image.new('RGBA',(width,height)); frames={}; x=0
for name,item in items.items():
    atlas.alpha_composite(item['image'],(x,0)); frames[name]={'x':x,'y':0,'w':item['image'].width,'h':item['image'].height,'sourceFile':item['source'],'sourceSize':list(item['sourceSize']),'sourceCrop':list(item['crop']),'sourceVisibleBounds':list(item['visible']),'anchorGlobal':list(item['anchorGlobal'])}; x+=item['image'].width+gap
atlas.save(HERE/'coffee.webp','WEBP',quality=74,method=6,exact=True)
(HERE/'coffee.json').write_text(json.dumps({'packedSize':list(atlas.size),'packedFrames':frames},indent=2)+'\n',encoding='utf8')
config={'revision':'coffee-kiosk-2x2-01','sprites':{}}
for name,item in items.items():
    value={'anchor':list(item['anchor']),'renderedMetric':item['metric'],'renderedSize':item['size']}
    if name=='island': value.update(baseLeft=item['anchor'][0]-(627-280),baseRight=item['anchor'][0]+(1000-627),worktopAnchor=[item['anchor'][0],660-item['crop'][1]],worktopGlobal=[627,660],worktopStatus='measured-front-counter-edge')
    config['sprites'][name]=value
(HERE/'sprite-config.json').write_text(json.dumps(config,indent=2)+'\n',encoding='utf8')
print('packed',len(items),'Coffee Kiosk sprites into',atlas.size)
