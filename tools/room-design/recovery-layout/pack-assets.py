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
    return (zone[0] + box[0], zone[1] + box[1], zone[0] + box[2], zone[1] + box[3])


def spec(source, zone, anchor_global, metric, size, seat_global=None, status=None):
    image = Image.open(source).convert('RGBA')
    visible = alpha_bbox(image, zone)
    crop = (
        max(zone[0], visible[0] - MARGIN), max(zone[1], visible[1] - MARGIN),
        min(zone[2], visible[2] + MARGIN), min(zone[3], visible[3] + MARGIN),
    )
    sprite = image.crop(crop)
    alpha = sprite.getchannel('A').point(lambda value: 0 if value < 16 else value)
    sprite.putalpha(alpha)
    result = {
        'image': sprite, 'source': source.name, 'sourceSize': image.size,
        'sourceCrop': crop, 'sourceVisibleBounds': visible, 'anchorGlobal': anchor_global,
        'anchor': (anchor_global[0] - crop[0], anchor_global[1] - crop[1]),
        'renderedMetric': metric, 'renderedSize': size,
    }
    if metric == 'solidWidth':
        result['physicalSpan'] = visible[2] - visible[0]
    elif metric == 'solidHeight':
        result['physicalSpan'] = visible[3] - visible[1]
    elif metric == 'sourceWidth':
        result['physicalSpan'] = zone[2] - zone[0]
    if seat_global:
        result.update(seatGlobal=seat_global, seat=(seat_global[0] - crop[0], seat_global[1] - crop[1]), seatStatus=status)
    return result


beds = SOURCE / 'recovery-beds-cardinal-03.png'
monitors = SOURCE / 'recovery-monitors-cardinal-01.png'
art = SOURCE / 'recovery-bay-art-01.png'
station = SOURCE / 'recovery-station-04.png'
exam_props = EXAM / 'examination-props-01.webp'

items = {
    'bedN': spec(beds, (0, 0, 768, 635), (415.5, 619), 'solidWidth', 84, (415.5, 502), 'exam-scale-calibrated'),
    'bedS': spec(beds, (768, 0, 1536, 635), (1120, 203), 'solidWidth', 84, (1120, 85), 'exam-scale-calibrated'),
    'bedW': spec(beds, (0, 635, 768, 1024), (724, 974), 'solidWidth', 186, (674, 830), 'exam-scale-calibrated'),
    'bedE': spec(beds, (768, 635, 1536, 1024), (812, 973), 'solidWidth', 186, (862, 830), 'exam-scale-calibrated'),
    'station': spec(station, (0, 0, 1254, 1254), (628, 1005), 'baseWidth', 240),
    # Exact approved Examination stool technical crop and contacts.
    'stool': spec(exam_props, (322, 69, 586, 426), (462, 426), 'sourceWidth', 60, (462, 203), 'approved-examination-contact'),
    'monitorS': spec(monitors, (0, 0, 612, 642), (346.5, 595), 'solidHeight', 112),
    'monitorN': spec(monitors, (612, 0, 1225, 642), (882.5, 595), 'solidHeight', 112),
    'monitorE': spec(monitors, (0, 642, 612, 1284), (364.5, 1209), 'solidHeight', 112),
    'monitorW': spec(monitors, (612, 642, 1225, 1284), (875.5, 1209), 'solidHeight', 112),
}

art_zones = [
    (0, 0, 443, 443), (443, 0, 887, 443), (887, 0, 1330, 443), (1330, 0, 1774, 443),
    (0, 443, 443, 887), (443, 443, 887, 887), (887, 443, 1330, 887), (1330, 443, 1774, 887),
]
art_image = Image.open(art).convert('RGBA')
for index, zone in enumerate(art_zones, 1):
    visible = alpha_bbox(art_image, zone)
    anchor = ((visible[0] + visible[2]) / 2, visible[3])
    items[f'art{index}'] = spec(art, zone, anchor, 'solidWidth', 92)

gap = 10
width = sum(item['image'].width for item in items.values()) + gap * (len(items) - 1)
height = max(item['image'].height for item in items.values())
atlas = Image.new('RGBA', (width, height))
frames = {}
x = 0
for name, item in items.items():
    image = item['image']
    atlas.alpha_composite(image, (x, 0))
    frames[name] = {
        'x': x, 'y': 0, 'w': image.width, 'h': image.height,
        'sourceFile': item['source'], 'sourceSize': list(item['sourceSize']),
        'sourceCrop': list(item['sourceCrop']), 'sourceVisibleBounds': list(item['sourceVisibleBounds']),
        'anchorGlobal': [round(value, 2) for value in item['anchorGlobal']],
    }
    x += image.width + gap

atlas.save(HERE / 'recovery.webp', 'WEBP', quality=74, method=6, exact=True)
(HERE / 'recovery.json').write_text(json.dumps({'packedSize': list(atlas.size), 'packedFrames': frames}, indent=2) + '\n', encoding='utf-8')

config = {'revision': 'recovery-6x6-eight-bay-layout-01', 'sprites': {}}
for name, item in items.items():
    value = {'anchor': [round(v, 2) for v in item['anchor']], 'renderedMetric': item['renderedMetric'], 'renderedSize': item['renderedSize']}
    if name == 'station':
        value.update(baseLeft=item['anchor'][0] - 444, baseRight=item['anchor'][0] + 444, facadeEdgeGlobalY=660, facadeHeightTargetPx=93.24)
    if 'physicalSpan' in item:
        value['physicalSpan'] = item['physicalSpan']
    if 'seat' in item:
        value.update(seatAnchor=[round(v, 2) for v in item['seat']], seatAnchorGlobal=[round(v, 2) for v in item['seatGlobal']], seatAnchorStatus=item['seatStatus'])
    config['sprites'][name] = value
(HERE / 'sprite-config.json').write_text(json.dumps(config, indent=2) + '\n', encoding='utf-8')
print(f'packed {len(items)} recovery sprites into {atlas.size}')
