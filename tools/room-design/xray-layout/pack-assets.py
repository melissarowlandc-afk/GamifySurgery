from pathlib import Path
from PIL import Image
import json
root=Path(__file__).resolve().parents[3]
atlas=Image.open(root/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'xray-furniture-atlas-01.png').convert('RGBA')
tube=Image.open(root/'Photos for Codex 2'/'Codex Rooms 2'/'GS-015'/'xray-tube-north-02.png').convert('RGBA')
items={'detector':atlas.crop((200,22,466,635)),'console':atlas.crop((101,702,603,1193)),'apron':atlas.crop((818,693,1085,1168)),'tube':tube.crop((113,69,1101,1281))}
contacts={'detector':(133,605),'console':(249,478),'apron':(129,36),'tube':(187,1196)}
w=max(i.width for i in items.values())+16;h=sum(i.height+8 for i in items.values())+8
out=Image.new('RGBA',(w,h));meta={};y=8
for k,i in items.items():
 out.alpha_composite(i,(8,y));cx,cy=contacts[k];meta[k]={'x':8,'y':y,'w':i.width,'h':i.height,'contactX':cx,'contactY':cy};y+=i.height+8
out.save(Path(__file__).with_name('xray-assets.webp'),'WEBP',quality=88,method=6,exact=True)
Path(__file__).with_name('atlas.json').write_text(json.dumps({'sources':{'atlas':'Photos for Codex 2/Codex Rooms 2/GS-015/xray-furniture-atlas-01.png','tube':'Photos for Codex 2/Codex Rooms 2/GS-015/xray-tube-north-02.png'},'crops':meta},indent=2))
