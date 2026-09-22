from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
HERE=Path(__file__).resolve().parent
desk=Image.open(ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'telehealth-desks-cardinal-02.png').convert('RGBA')
window=Image.open(HERE.parent/'phlebotomy-layout'/'window.webp').convert('RGBA')

def crop_alpha(image,bounds,pad=5):
    left,top,right,bottom=bounds
    region=image.crop(bounds); box=region.getchannel('A').point(lambda p:255 if p>=32 else 0).getbbox()
    if not box: raise RuntimeError('empty component')
    out=(max(0,left+box[0]-pad),max(0,top+box[1]-pad),min(image.width,left+box[2]+pad),min(image.height,top+box[3]+pad))
    return image.crop(out),out

# Separate newly authored cardinal views; no bitmap rotation in the proof.
south, south_box=crop_alpha(desk,(0,0,885,desk.height))
west, west_box=crop_alpha(desk,(885,0,desk.width,desk.height))
margin=6
atlas=Image.new('RGBA',(south.width+west.width+3*margin,max(south.height,west.height)+2*margin))
atlas.alpha_composite(south,(margin,margin)); atlas.alpha_composite(west,(south.width+2*margin,margin))
atlas.save(HERE/'telehealth.webp','WEBP',quality=90,method=6,exact=True)
frames={'south':{'x':margin,'y':margin,'w':south.width,'h':south.height,'ground':[1.5,1.5],'sourceGround':[462-south_box[0],778-south_box[1]],'physicalBaseSpan':425,'renderedBaseWidth':120},'west':{'x':south.width+2*margin,'y':margin,'w':west.width,'h':west.height,'ground':[1,2],'sourceGround':[1338-west_box[0],780-west_box[1]],'physicalBaseSpan':435,'renderedBaseWidth':120}}
(HERE/'telehealth.json').write_text(json.dumps({'source':'Photos for Codex 2/Codex Rooms 2/GS-015/telehealth-desks-cardinal-02.png','sourceSize':list(desk.size),'sourceBoxes':{'south':south_box,'west':west_box},'packedFrames':frames},indent=2)+'\n',encoding='utf-8')
window.save(HERE/'window.webp','WEBP',quality=88,method=6,exact=True)
(HERE/'window.json').write_text(json.dumps({'source':'tools/room-design/phlebotomy-layout/window.webp','sourceMetadata':'tools/room-design/phlebotomy-layout/window.json','packedFrame':{'x':0,'y':0,'w':window.width,'h':window.height}},indent=2)+'\n',encoding='utf-8')
print(json.dumps({'deskSize':desk.size,'southBox':south_box,'westBox':west_box,'packed':atlas.size,'window':window.size},indent=2))
