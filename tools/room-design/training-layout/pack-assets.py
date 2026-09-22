from pathlib import Path
from PIL import Image
import json

HERE = Path(__file__).resolve().parent
SOURCE = HERE.parents[2] / 'Photos for Codex 2' / 'Codex Rooms 2' / 'GS-015'
EXAM = HERE.parent / 'examination-layout'
MARGIN = 8

def alpha_bbox(image, zone):
    alpha = image.crop(zone).getchannel('A').point(lambda value: 255 if value >= 16 else 0)
    box = alpha.getbbox()
    if not box:
        raise RuntimeError(f'no alpha in {zone}')
    return zone[0]+box[0], zone[1]+box[1], zone[0]+box[2], zone[1]+box[3]

def spec(source, zone, anchor_global, metric, size, physical_span=None, seat_global=None, seat_status=None):
    image = Image.open(source).convert('RGBA')
    visible = alpha_bbox(image, zone)
    crop = (max(zone[0], visible[0]-MARGIN), max(zone[1], visible[1]-MARGIN), min(zone[2], visible[2]+MARGIN), min(zone[3], visible[3]+MARGIN))
    sprite = image.crop(crop)
    alpha = sprite.getchannel('A').point(lambda value: 0 if value < 16 else value)
    sprite.putalpha(alpha)
    result = {'image':sprite,'source':source.name,'sourceSize':image.size,'sourceCrop':crop,'sourceVisibleBounds':visible,
              'anchorGlobal':anchor_global,'anchor':(anchor_global[0]-crop[0],anchor_global[1]-crop[1]),
              'renderedMetric':metric,'renderedSize':size}
    if physical_span is not None: result['physicalSpan']=physical_span
    if seat_global:
        result.update(seatGlobal=seat_global,seat=(seat_global[0]-crop[0],seat_global[1]-crop[1]),seatStatus=seat_status)
    return result

bench = SOURCE / 'training-bench-01.png'
decor = SOURCE / 'training-decor-01.png'
exam_props = EXAM / 'examination-props-01.webp'
items = {
  # Physical base feet span is used instead of the padded alpha bbox.
  'bench': spec(bench,(0,0,1448,1086),(723,950),'baseWidth',204),
  'cabinetAnatomy': spec(decor,(0,0,470,1024),(240,951),'solidHeight',165,859),
  'whiteboard': spec(decor,(470,0,1120,1024),(798,690),'solidWidth',100,580),
  'skeleton': spec(decor,(1120,0,1536,1024),(1320,1000),'solidHeight',185,985),
  # Exact approved Examination stool crop and contacts.
  'stool': spec(exam_props,(322,69,586,426),(462,426),'sourceWidth',60,264,(462,203),'approved-examination-contact'),
}

gap=10
width=sum(item['image'].width for item in items.values())+gap*(len(items)-1)
height=max(item['image'].height for item in items.values())
atlas=Image.new('RGBA',(width,height)); frames={}; x=0
for name,item in items.items():
    image=item['image']; atlas.alpha_composite(image,(x,0))
    frames[name]={'x':x,'y':0,'w':image.width,'h':image.height,'sourceFile':item['source'],'sourceSize':list(item['sourceSize']),
                  'sourceCrop':list(item['sourceCrop']),'sourceVisibleBounds':list(item['sourceVisibleBounds']),'anchorGlobal':[round(v,2) for v in item['anchorGlobal']]}
    x+=image.width+gap
atlas.save(HERE/'training.webp','WEBP',quality=74,method=6,exact=True)
(HERE/'training.json').write_text(json.dumps({'packedSize':list(atlas.size),'packedFrames':frames},indent=2)+'\n',encoding='utf-8')
config={'revision':'training-3x3-hands-on-lab-01','sprites':{}}
for name,item in items.items():
    value={'anchor':[round(v,2) for v in item['anchor']],'renderedMetric':item['renderedMetric'],'renderedSize':item['renderedSize']}
    if name=='bench': value.update(baseLeft=item['anchor'][0]-(723-180),baseRight=item['anchor'][0]+(1260-723),worktopAnchor=[item['anchor'][0],495-item['sourceCrop'][1]],worktopGlobal=[723,495],worktopStatus='measured-front-worktop-edge')
    if 'physicalSpan' in item: value['physicalSpan']=item['physicalSpan']
    if 'seat' in item: value.update(seatAnchor=[round(v,2) for v in item['seat']],seatAnchorGlobal=[round(v,2) for v in item['seatGlobal']],seatAnchorStatus=item['seatStatus'])
    config['sprites'][name]=value
(HERE/'sprite-config.json').write_text(json.dumps(config,indent=2)+'\n',encoding='utf-8')
print(f'packed {len(items)} Training sprites into {atlas.size}')
