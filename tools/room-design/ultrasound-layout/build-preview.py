from pathlib import Path
import base64
import json

HERE=Path(__file__).resolve().parent
template=(HERE/'ultrasound-layout.template.html').read_text(encoding='utf-8')
script=(HERE/'ultrasound-preview.js').read_text(encoding='utf-8')
asset=base64.b64encode((HERE/'ultrasound-assets.webp').read_bytes()).decode('ascii')
crop_config=json.loads((HERE/'atlas.json').read_text(encoding='utf-8'))['crops']
script=script.replace('__ULTRASOUND_ATLAS__',asset).replace('__CROP_CONFIG__',json.dumps(crop_config,separators=(',',':')))
output=template.replace('__ULTRASOUND_SCRIPT__',script)
(HERE/'ultrasound-layout.html').write_text(output,encoding='utf-8')
print(f'wrote {len(output.encode("utf-8"))} bytes')
