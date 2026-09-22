from pathlib import Path
import base64,json
p=Path(__file__).resolve().parent
s=(p/'xray-preview.js').read_text().replace('__XRAY_ATLAS__',base64.b64encode((p/'xray-assets.webp').read_bytes()).decode()).replace('__CROP_CONFIG__',json.dumps(json.loads((p/'atlas.json').read_text())['crops'],separators=(',',':')))
(p/'xray-layout.html').write_text((p/'xray-layout.template.html').read_text().replace('__XRAY_SCRIPT__',s))
