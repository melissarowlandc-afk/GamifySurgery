from pathlib import Path
from PIL import Image
import hashlib,json

HERE=Path(__file__).resolve().parent
REPO=HERE.parents[2]
SOURCE=REPO/'apps'/'player'/'public'/'art'/'characters'/'patients-v1'
FILES={'west':'patients-left-idle-v1.png','south':'patients-front-idle-v1.png'}
frames={};sprites=[];x=0
for direction,name in FILES.items():
    path=SOURCE/name; raw=path.read_bytes(); image=Image.open(path).convert('RGBA')
    assert image.size==(640,1920)
    sprite=image.crop((0,0,128,192)); bbox=sprite.getchannel('A').getbbox()
    frames[direction]={'x':x,'y':0,'w':128,'h':192,'sourceFile':name,'sourceSize':[640,1920],'sourceCell':[0,0,128,192],'visibleBounds':list(bbox),'sourceSha256':hashlib.sha256(raw).hexdigest()}
    sprites.append(sprite);x+=128
atlas=Image.new('RGBA',(256,192));atlas.alpha_composite(sprites[0],(0,0));atlas.alpha_composite(sprites[1],(128,0));atlas.save(HERE/'live-p01.webp','WEBP',lossless=True,method=6)
(HERE/'live-p01.json').write_text(json.dumps({'identity':'patient.adult.001','runtimeCell':[128,192],'floorAnchor':[64,181],'frames':frames},indent=2)+'\n',encoding='utf-8')
print('packed exact P01 live West/South idle cells')
