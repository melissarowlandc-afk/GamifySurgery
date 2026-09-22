from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'ultrasound-furniture-atlas-02.png'
WALL_PRINT=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'ultrasound-wall-print-01.png'
OUT=Path(__file__).with_name('ultrasound-assets.webp')
META=Path(__file__).with_name('atlas.json')
im=Image.open(SOURCE).convert('RGBA')
wall=Image.open(WALL_PRINT).convert('RGBA')
# Threshold-32 component bounds, padded 8px. Contacts are measured at the floor
# supports/casters; table seating sits on the front mattress lip at the east foot.
boxes={
    'table':(37,258,787,607),
    'console':(841,38,1181,651),
    'cabinet':(221,654,538,1242),
    'stool':(764,731,1115,1247),
}
crops={name:im.crop(box) for name,box in boxes.items()}
# Wall print alpha >=32 bounds (155,250,940,1212), padded 8px. It has a
# center registration point because it belongs wholly in the N2 wall face.
crops['wallPrint']=wall.crop((147,242,948,1220))
contacts={
    'table':(378,341),
    'console':(144,604),
    'cabinet':(158,580),
    'stool':(175,508),
    'wallPrint':(401,489),
}
seat_points={'table':(669.6666666667,167),'stool':(175,236)}
padding=8
width=max(image.width for image in crops.values())+padding*2
height=sum(image.height+padding for image in crops.values())+padding
packed=Image.new('RGBA',(width,height))
meta={}; y=padding
for name,image in crops.items():
    packed.alpha_composite(image,(padding,y))
    cx,cy=contacts[name]
    meta[name]={'x':padding,'y':y,'w':image.width,'h':image.height,'contactX':cx,'contactY':cy}
    if name in seat_points:
        meta[name]['seatX'],meta[name]['seatY']=seat_points[name]
    y+=image.height+padding
packed.save(OUT,'WEBP',quality=88,method=6,exact=True)
META.write_text(json.dumps({
  'sources':{'furnitureAtlas':str(SOURCE.relative_to(ROOT)),'wallPrint':str(WALL_PRINT.relative_to(ROOT))},
  'sourceSizes':{'furnitureAtlas':list(im.size),'wallPrint':list(wall.size)},
  'sourceBoxes':boxes,
  'componentAlphaThreshold':32,
  'atlasSize':list(packed.size),
  'crops':meta,
  'contactMethod':'measured supports/casters; horizontal-table east-foot seat is the south/front mattress lip, not the elevated pillow or outer sprite edge; wall print is center-registered in the N2 wall face',
},indent=2),encoding='utf-8')
print(json.dumps({'bytes':OUT.stat().st_size,'atlasSize':list(packed.size),'crops':meta},indent=2))

