from pathlib import Path
from PIL import Image
import json

HERE=Path(__file__).resolve().parent
GS015=HERE.parents[2]/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'
MARGIN=10

def alpha_bbox(image,zone):
    alpha=image.crop(zone).getchannel('A').point(lambda value:255 if value>=16 else 0)
    box=alpha.getbbox()
    if not box: raise RuntimeError(f'no solid alpha in {zone}')
    return (zone[0]+box[0],zone[1]+box[1],zone[0]+box[2],zone[1]+box[3])

def padded(box,size):
    return (max(0,box[0]-MARGIN),max(0,box[1]-MARGIN),min(size[0],box[2]+MARGIN),min(size[1],box[3]+MARGIN))

def crop_spec(source,zone,ground,visible_override=None):
    image=Image.open(source).convert('RGBA')
    visible=visible_override or alpha_bbox(image,zone); crop=padded(visible,image.size)
    sprite=image.crop(crop); alpha=sprite.getchannel('A').point(lambda value:0 if value<16 else value); sprite.putalpha(alpha)
    return {'source':source,'image':sprite,'sourceSize':image.size,'sourceCrop':crop,'sourceVisibleBounds':visible,'groundGlobal':ground,'ground':(ground[0]-crop[0],ground[1]-crop[1])}

def equipment_specs(source):
    image=Image.open(source).convert('RGBA'); width,height=image.size
    zones={'tower':(0,0,round(width*.332),height),'cabinet':(round(width*.332),0,round(width*.708),height),'sink':(round(width*.708),0,width,height)}
    result={}
    for name,zone in zones.items():
        visible=alpha_bbox(image,zone); ground=((visible[0]+visible[2])/2,visible[3])
        result[name]=crop_spec(source,zone,ground)
    return result

def bed_specs(source,orientation):
    image=Image.open(source).convert('RGBA'); w,h=image.size
    zones={'tableEmpty':(0,0,w//2,h),'tableOccupied':(w//2,0,w,h)} if orientation=='south' else {'tableEmpty':(0,0,w,h//2),'tableOccupied':(0,h//2,w,h)}
    result={}
    for name,zone in zones.items():
        visible=alpha_bbox(image,zone)
        if orientation=='east' and source.name=='endoscopy-bed-east-02.png':
            visible={'tableEmpty':(386,15,1232,474),'tableOccupied':(384,485,1236,953)}[name]
            ground={'tableEmpty':(1161.5,474),'tableOccupied':(1162,953)}[name]
        else:
            ground=((visible[0]+visible[2])/2,visible[3])
        result[name]=crop_spec(source,zone,ground,visible)
    return result

def pack(view,specs):
    gap=12; width=sum(item['image'].width for item in specs.values())+gap*(len(specs)-1); height=max(item['image'].height for item in specs.values())
    atlas=Image.new('RGBA',(width,height)); frames={}; x=0
    for name,item in specs.items():
        sprite=item['image']; atlas.alpha_composite(sprite,(x,0)); frames[name]={'x':x,'y':0,'w':sprite.width,'h':sprite.height,'sourceFile':item['source'].name,'sourceSize':list(item['sourceSize']),'sourceCrop':list(item['sourceCrop']),'sourceVisibleBounds':list(item['sourceVisibleBounds']),'groundGlobal':[round(v,2) for v in item['groundGlobal']]};x+=sprite.width+gap
    atlas.save(HERE/f'{view}.webp','WEBP',quality=72,method=6,exact=True)
    metadata={'view':view,'packedSize':list(atlas.size),'packedFrames':frames}
    (HERE/f'{view}.json').write_text(json.dumps(metadata,indent=2)+'\n',encoding='utf-8')
    return specs,metadata

south_equipment=GS015/'endoscopy-equipment-south-01.png'
east_equipment=GS015/'endoscopy-equipment-east-01.png'
if not east_equipment.exists():
    raise FileNotFoundError(f'fresh rotated equipment atlas is required: {east_equipment}')

south={**equipment_specs(south_equipment),**bed_specs(GS015/'endoscopy-bed-south-01.png','south')}
east={**equipment_specs(east_equipment),**bed_specs(GS015/'endoscopy-bed-east-02.png','east')}
dark=GS015/'endoscopy-occupied-beds-dark-01.png'
# Approved dark occupied replacements. Empty beds stay on their prior sources.
# Contacts use the physical south foot/wheel line and east/right foot-end wheel.
south['tableOccupied']=crop_spec(dark,(0,0,560,1024),(302.5,974),(73,51,532,974))
east['tableOccupied']=crop_spec(dark,(560,0,1536,1024),(1450,825),(593,328,1527,825))
south,_=pack('south',south);east,_=pack('east',east)
heights={'south':{'tower':165,'cabinet':80,'sink':105,'tableEmpty':205,'tableOccupied':205},'east':{'tower':165,'cabinet':120,'sink':125,'tableEmpty':110,'tableOccupied':110}}
attach_global={'south':{'tableEmpty':(352.5,430),'tableOccupied':(270,175)},'east':{'tableEmpty':(810,230),'tableOccupied':(805,455)}}
config={'revision':'endoscopy-cardinal-empty-01-dark-occupied-02','views':{}}
for view,specs in [('south',south),('east',east)]:
    config['views'][view]={}
    for name,item in specs.items():
        entry={'ground':[round(item['ground'][0],2),round(item['ground'][1],2)],'renderedHeight':heights[view][name]}
        if name in attach_global[view]:
            point=attach_global[view][name]; crop=item['sourceCrop']; entry['procedureAttach']=[round(point[0]-crop[0],2),round(point[1]-crop[1],2)]
        config['views'][view][name]=entry
config['south']=config['views']['south'];config['east']=config['views']['east']
(HERE/'sprite-config.json').write_text(json.dumps(config,indent=2)+'\n',encoding='utf-8')
print('packed south/east endoscopy atlases')
