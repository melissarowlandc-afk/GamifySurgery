from pathlib import Path
import json
from PIL import Image

ROOT=Path(__file__).resolve().parents[3]
SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'minor-procedure-furniture-atlas-01.png'
TABLE_SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'minor-procedure-table-north-02.png'
LAMP_SOURCE=ROOT/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'minor-procedure-wall-light-01.png'
OUT=Path(__file__).with_name('minor-procedure-assets.webp')
META=Path(__file__).with_name('atlas.json')
source=Image.open(SOURCE).convert('RGBA')
boxes={
    'trolley':(123,615,412,944),
    'sink':(598,579,863,965),
    'cabinet':(148,977,388,1454),
    'stool':(597,1040,863,1467),
}
contacts={
    'table':(277.5,1212),'trolley':(143,306),
    'sink':(134,342),'cabinet':(120,435),'stool':(132,423),
}
seat_points={'table':(277.5,901),'stool':(132,207)}
table_source=Image.open(TABLE_SOURCE).convert('RGBA')
lamp_source=Image.open(LAMP_SOURCE).convert('RGBA')
crops={name:source.crop(box) for name,box in boxes.items()}
crops={'table':table_source.crop((235,143,790,1359)),**crops,'wallLamp':lamp_source.crop((398,159,867,1053))}
contacts['wallLamp']=(227,171)
padding=8;width=max(image.width for image in crops.values())+padding*2;height=sum(image.height+padding for image in crops.values())+padding
atlas=Image.new('RGBA',(width,height));meta={};y=padding
for name,image in crops.items():
    atlas.alpha_composite(image,(padding,y));cx,cy=contacts[name];meta[name]={'x':padding,'y':y,'w':image.width,'h':image.height,'contactX':cx,'contactY':cy};
    if name in seat_points:meta[name]['seatX'],meta[name]['seatY']=seat_points[name]
    y+=image.height+padding
atlas.save(OUT,'WEBP',quality=88,method=6,exact=True)
META.write_text(json.dumps({'source':str(SOURCE.relative_to(ROOT)),'sourceSize':list(source.size),'tableSource':str(TABLE_SOURCE.relative_to(ROOT)),'tableSourceSize':list(table_source.size),'tableSourceBox':[235,143,790,1359],'wallLampSource':str(LAMP_SOURCE.relative_to(ROOT)),'wallLampSourceSize':list(lamp_source.size),'wallLampSourceBox':[398,159,867,1053],'sourceBoxes':boxes,'atlasSize':list(atlas.size),'crops':meta,'contactMethod':'measured non-shadow floor contacts; wallLamp contactX/contactY is its source mounting point; table/stool seat-rise review recorded separately'},indent=2),encoding='utf-8')
print(json.dumps({'bytes':OUT.stat().st_size,'atlasSize':list(atlas.size),'crops':meta},indent=2))
