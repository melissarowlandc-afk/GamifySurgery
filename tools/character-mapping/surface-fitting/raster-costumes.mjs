import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { assertCostume, COSTUMES } from './costumes.mjs';

const RASTER_ASSETS = Symbol.for('gamify-surgery.surface-fitting.raster-assets');
const greenSource = COSTUMES['patient.adult.046'].source;
const graySource = COSTUMES['retained.gray-braid'].source;
const crop = (x, y, width, height) => ({ x, y, width, height });
const box = (width, height) => [[[0, 0], [width, 0], [width, height], [0, height]]];
const raster = (asset, x1, y1, x2, y2, sides, sourceAxes = 'xy', coverCaps = false, views = ['south']) => ({
  kind: 'raster', asset, x1, y1, x2, y2, sourceAxes, interpolation: 'linear', views, ...(sides ? { sides } : {}), ...(coverCaps ? { coverCaps: true } : {}),
});
const oneView = (view, asset, x1, y1, x2, y2, sides, sourceAxes = 'xy', coverCaps = false) =>
  raster(asset, x1, y1, x2, y2, sides, sourceAxes, coverCaps, [view]);
const asset = (x, y, width, height, polygons, purpose, keyBackground = true) => ({
  crop: crop(x, y, width, height), polygons, purpose, ...(keyBackground ? {} : { keyBackground: false }),
});

const GREEN_OTHER_VIEW_ASSETS = {
  eastHead: asset(384, 69, 58, 71, [[[5, 0], [50, 0], [57, 13], [57, 62], [48, 70], [8, 70], [0, 61], [0, 12]]], 'Tight East skull interior with source eye, brow, skin, bald crown, and in-bounds fringe.', false),
  eastHeadEdge: asset(378, 66, 78, 77, [[[0, 18], [29, 7], [34, 70], [8, 76], [0, 68]], [[65, 25], [78, 28], [78, 61], [64, 65]]], 'East hair, ear, nose, and moustache pixels extending beyond the approved head surface.'),
  eastMoustache: asset(433, 126, 18, 12, box(18, 12), 'East white moustache lobes and dark lower outline.', false),
  eastNeck: asset(425, 105, 6, 8, box(6, 8), 'East clean cheek skin for the neck.'),
  eastTorsoKnit: asset(392, 158, 14, 20, box(14, 20), 'East cardigan knit underpaint.'),
  eastTorso: asset(398, 139, 55, 99, [[[8, 0], [43, 0], [54, 18], [54, 98], [18, 98], [18, 88], [1, 88], [0, 18]]], 'East cardigan profile with collar, opening, buttons, hem, and shading; the lower-left source hand is excluded.'),
  eastSleeve: asset(380, 148, 20, 75, box(20, 75), 'East profile sage sleeve and cuff.'),
  eastHand: asset(386, 215, 29, 31, box(29, 31), 'East source hand skin.'),
  eastThigh: asset(389, 248, 27, 30, box(27, 30), 'East pants-only brown trouser thigh below the source hand.'),
  eastShin: asset(389, 264, 27, 42, box(27, 42), 'East brown trouser shin.'),
  eastFoot: asset(386, 298, 67, 24, box(67, 24), 'East profile brown shoe and pale sole.'),
  westHead: asset(618, 69, 58, 75, [[[7, 0], [52, 0], [58, 13], [58, 65], [50, 74], [9, 74], [0, 65], [0, 13]]], 'Tight West skull interior with source eye, brow, skin, bald crown, and in-bounds fringe.', false),
  westHeadEdge: asset(604, 66, 80, 86, [[[47, 7], [80, 18], [80, 76], [55, 84]], [[0, 28], [15, 25], [17, 70], [0, 69]]], 'West hair, ear, nose, and moustache pixels extending beyond the approved head surface.'),
  westMoustache: asset(607, 126, 18, 12, box(18, 12), 'West white moustache lobes and dark lower outline.', false),
  westNeck: asset(626, 105, 6, 8, box(6, 8), 'West clean cheek skin for the neck.'),
  westTorsoKnit: asset(664, 160, 14, 20, box(14, 20), 'West cardigan knit underpaint.'),
  westTorso: asset(618, 140, 52, 102, [[[10, 0], [44, 0], [51, 19], [51, 78], [39, 78], [39, 101], [1, 101], [0, 19]]], 'West cardigan profile with collar, opening, buttons, hem, and shading; the lower-right source hand is excluded.'),
  westSleeve: asset(669, 150, 20, 74, box(20, 74), 'West profile sage sleeve and cuff.'),
  westHand: asset(663, 215, 28, 31, box(28, 31), 'West source hand skin.'),
  westThigh: asset(641, 248, 28, 30, box(28, 30), 'West pants-only brown trouser thigh below the source hand.'),
  westShin: asset(641, 265, 28, 41, box(28, 41), 'West brown trouser shin.'),
  westFoot: asset(615, 298, 70, 24, box(70, 24), 'West profile brown shoe and pale sole.'),
  northHead: asset(848, 70, 59, 63, [[[5, 0], [54, 0], [59, 10], [59, 54], [51, 62], [8, 62], [0, 54], [0, 10]]], 'Tight North skull interior with bald crown and white rear fringe.', false),
  northHeadEdge: asset(839, 66, 77, 86, [[[0, 28], [18, 25], [20, 82], [0, 77]], [[57, 25], [77, 28], [77, 77], [55, 82]]], 'North ears and white side-fringe extensions only.'),
  northNeck: asset(868, 139, 8, 8, box(8, 8), 'North source cardigan collar texture for the rear neck bridge.'),
  northTorsoKnit: asset(850, 155, 14, 20, box(14, 20), 'North cardigan knit underpaint.'),
  northTorso: asset(845, 139, 66, 101, [[[9, 0], [57, 0], [65, 18], [65, 100], [1, 100], [0, 18]]], 'North cloth-only cardigan back, seams, and hem ribbing.'),
  northUpperRight: asset(827, 151, 18, 38, box(18, 38), 'North viewer-left upper sleeve.'),
  northForeRight: asset(826, 182, 19, 43, box(19, 43), 'North viewer-left forearm and cuff.'),
  northHandRight: asset(822, 218, 26, 29, box(26, 29), 'North viewer-left source hand.'),
  northUpperLeft: asset(911, 151, 18, 38, box(18, 38), 'North viewer-right upper sleeve.'),
  northForeLeft: asset(911, 182, 19, 43, box(19, 43), 'North viewer-right forearm and cuff.'),
  northHandLeft: asset(908, 218, 26, 29, box(26, 29), 'North viewer-right source hand.'),
  northThighRight: asset(850, 231, 27, 40, box(27, 40), 'North viewer-left trouser thigh.'),
  northShinRight: asset(850, 265, 27, 42, box(27, 42), 'North viewer-left trouser shin.'),
  northFootRight: asset(840, 298, 42, 24, box(42, 24), 'North viewer-left shoe and sole.'),
  northThighLeft: asset(886, 231, 27, 40, box(27, 40), 'North viewer-right trouser thigh.'),
  northShinLeft: asset(886, 265, 27, 42, box(27, 42), 'North viewer-right trouser shin.'),
  northFootLeft: asset(881, 298, 43, 24, box(43, 24), 'North viewer-right shoe and sole.'),
};

const GRAY_OTHER_VIEW_ASSETS = {
  eastHead: asset(377, 62, 64, 77, [[[7, 0], [54, 0], [63, 9], [64, 62], [56, 71], [45, 76], [12, 76], [2, 68], [0, 14]]], 'Tight East skull interior with swept silver hair, warm face, black glasses, and eye.', false),
  eastHeadEdge: asset(369, 54, 84, 90, [[[0, 29], [31, 1], [39, 87], [3, 74]], [[70, 20], [84, 22], [81, 76], [67, 80]]], 'East silver hair, ear, glasses, and nose pixels outside the approved head surface.'),
  eastNeck: asset(417, 111, 6, 8, box(6, 8), 'East clean warm cheek skin for the neck.'),
  eastBraid: asset(369, 110, 28, 104, [[[4, 0], [23, 0], [27, 12], [26, 90], [20, 103], [7, 101], [1, 88], [0, 12]]], 'Tight East source braid behind the head, with connected silver mass and dark strand outlines.'),
  eastTorsoCoat: asset(385, 160, 14, 20, box(14, 20), 'East charcoal coat underpaint.'),
  eastTorso: asset(395, 137, 61, 108, [[[8, 0], [50, 0], [60, 18], [60, 107], [20, 107], [20, 80], [1, 80], [0, 18]]], 'East charcoal coat, blouse edge, belt, pocket, seams, and shading; the lower-left source hand is excluded.'),
  eastCoat: asset(395, 137, 61, 114, [[[8, 0], [50, 0], [60, 18], [60, 113], [20, 113], [20, 80], [1, 80], [0, 18]]], 'East long-coat panel with the adjacent lower-left source hand excluded.'),
  eastSleeve: asset(375, 148, 21, 80, box(21, 80), 'East charcoal sleeve and cuff.'),
  eastHand: asset(386, 218, 28, 30, box(28, 30), 'East warm hand texture.'),
  eastThigh: asset(400, 252, 25, 30, box(25, 30), 'East pants-only dark trouser thigh below the source hand.'),
  eastShin: asset(400, 270, 25, 37, box(25, 37), 'East dark trouser shin.'),
  eastFoot: asset(387, 302, 66, 28, box(66, 28), 'East profile dark shoe and brown sole.'),
  westHead: asset(599, 62, 63, 77, [[[8, 0], [55, 0], [63, 10], [62, 65], [54, 72], [44, 76], [11, 76], [2, 68], [0, 12]]], 'Tight West skull interior with swept silver hair, warm face, black glasses, and eye.', false),
  westHeadEdge: asset(588, 54, 83, 90, [[[44, 1], [83, 20], [78, 72], [58, 76]], [[0, 27], [15, 20], [17, 79], [2, 77]]], 'West silver hair, ear, glasses, and nose pixels outside the approved head surface.'),
  westNeck: asset(618, 111, 6, 8, box(6, 8), 'West clean warm cheek skin for the neck.'),
  westBraid: asset(660, 110, 28, 104, [[[1, 0], [20, 0], [27, 12], [27, 88], [21, 101], [8, 103], [2, 91], [0, 12]]], 'Tight West source braid behind the head, with connected silver mass and dark strand outlines.'),
  westTorsoCoat: asset(658, 160, 14, 20, box(14, 20), 'West charcoal coat underpaint.'),
  westTorso: asset(586, 137, 60, 108, [[[12, 0], [54, 0], [59, 19], [59, 78], [42, 78], [42, 107], [1, 107], [0, 19]]], 'West charcoal coat, blouse edge, belt, pocket, seams, and shading; the lower-right source hand is excluded.'),
  westCoat: asset(586, 137, 60, 114, [[[12, 0], [54, 0], [59, 19], [59, 78], [42, 78], [42, 113], [1, 113], [0, 19]]], 'West long-coat panel with the adjacent lower-right source hand excluded.'),
  westSleeve: asset(650, 148, 21, 80, box(21, 80), 'West charcoal sleeve and cuff.'),
  westHand: asset(648, 218, 29, 30, box(29, 30), 'West warm hand texture.'),
  westThigh: asset(625, 252, 25, 30, box(25, 30), 'West pants-only dark trouser thigh below the source hand.'),
  westShin: asset(625, 270, 25, 37, box(25, 37), 'West dark trouser shin.'),
  westFoot: asset(611, 302, 67, 28, box(67, 28), 'West profile dark shoe and brown sole.'),
  northHead: asset(840, 63, 65, 72, [[[7, 0], [57, 0], [64, 8], [65, 60], [57, 68], [48, 71], [14, 71], [5, 68], [0, 60], [0, 9]]], 'Tight North skull interior with the complete silver crown.', false),
  northHeadEdge: asset(829, 54, 86, 89, [[[0, 25], [22, 0], [29, 87], [2, 79]], [[65, 0], [86, 18], [86, 78], [58, 88]]], 'North silver side hair and ears outside the approved head surface.'),
  northNeck: asset(868, 137, 8, 8, box(8, 8), 'North source charcoal collar texture for the rear neck bridge.'),
  northBraid: asset(860, 110, 31, 115, [[[3, 0], [26, 0], [30, 12], [30, 98], [24, 113], [8, 114], [1, 99], [0, 12]]], 'Tight North centered source braid with connected silver mass and dark interlocking strands.', false),
  northTorsoCoat: asset(850, 160, 14, 20, box(14, 20), 'North charcoal coat underpaint.'),
  northTorso: asset(844, 137, 63, 111, [[[8, 0], [55, 0], [62, 19], [62, 110], [1, 110], [0, 19]]], 'North cloth-only charcoal coat back with central seam, pockets, and shading.'),
  northCoat: asset(844, 137, 63, 115, [[[8, 0], [55, 0], [62, 19], [62, 114], [1, 114], [0, 19]]], 'North cloth-only complete long-coat back panel.'),
  northUpperRight: asset(826, 151, 19, 40, box(19, 40), 'North viewer-left upper sleeve.'),
  northForeRight: asset(825, 183, 20, 45, box(20, 45), 'North viewer-left forearm and cuff.'),
  northHandRight: asset(821, 219, 27, 30, box(27, 30), 'North viewer-left warm hand.'),
  northUpperLeft: asset(910, 151, 19, 40, box(19, 40), 'North viewer-right upper sleeve.'),
  northForeLeft: asset(910, 183, 20, 45, box(20, 45), 'North viewer-right forearm and cuff.'),
  northHandLeft: asset(907, 219, 27, 30, box(27, 30), 'North viewer-right warm hand.'),
  northThighRight: asset(850, 239, 26, 39, box(26, 39), 'North viewer-left dark trouser thigh.'),
  northShinRight: asset(850, 271, 26, 38, box(26, 38), 'North viewer-left dark trouser shin.'),
  northFootRight: asset(840, 302, 42, 28, box(42, 28), 'North viewer-left dark shoe.'),
  northThighLeft: asset(887, 239, 26, 39, box(26, 39), 'North viewer-right dark trouser thigh.'),
  northShinLeft: asset(887, 271, 26, 38, box(26, 38), 'North viewer-right dark trouser shin.'),
  northFootLeft: asset(882, 302, 42, 28, box(42, 28), 'North viewer-right dark shoe.'),
};

// Coordinates below select pixels only. They describe no target joints, anatomy,
// offsets, envelopes, or motion. The source is the immutable owner-approved PNG.
export const GREEN_SOUTH_SOURCE_UV = Object.freeze({
  coordinateSpace: 'immutable-source-pixels',
  assets: {
    ...GREEN_OTHER_VIEW_ASSETS,
    head: {
      crop: crop(121, 69, 63, 74),
      polygons: [[[7, 0], [55, 0], [62, 16], [62, 58], [52, 73], [10, 73], [0, 58], [0, 16]]],
      purpose: 'Painted face, eyes, brows, moustache, bald crown, and in-bounds white fringe.',
    },
    headSides: {
      crop: crop(110, 62, 92, 88),
      polygons: [[[0, 34], [15, 31], [17, 70], [1, 72]], [[76, 31], [92, 34], [91, 72], [75, 70]]],
      purpose: 'Source side fringe and ears extending beyond the shared head surface.',
    },
    neck: { crop: crop(150, 80, 8, 10), polygons: box(8, 10), purpose: 'Interior source skin texture without chin outline or source silhouette geometry.' },
    torsoKnit: { crop: crop(125, 174, 14, 20), polygons: box(14, 20), purpose: 'Interior source cardigan knit underpaint for the approved torso shoulder corners.' },
    torso: {
      crop: crop(116, 136, 76, 101),
      polygons: [[[24, 0], [52, 0], [72, 20], [74, 99], [2, 99], [4, 20]]],
      purpose: 'Cardigan knit, cream pointed collar, V opening, placket, buttons, and hem ribbing.',
    },
    upperRight: { crop: crop(106, 151, 14, 34), polygons: box(14, 34), purpose: 'Viewer-left interior source upper sleeve for the anatomical right arm.' },
    foreRight: { crop: crop(105, 181, 15, 39), polygons: box(15, 39), purpose: 'Viewer-left source forearm knit and cuff ribbing.' },
    handRight: { crop: crop(103, 226, 22, 20), polygons: box(22, 20), purpose: 'Viewer-left source hand skin texture, clipped to the shared palm.' },
    upperLeft: { crop: crop(189, 151, 14, 34), polygons: box(14, 34), purpose: 'Viewer-right interior source upper sleeve for the anatomical left arm.' },
    foreLeft: { crop: crop(189, 181, 15, 39), polygons: box(15, 39), purpose: 'Viewer-right source forearm knit and cuff ribbing.' },
    handLeft: { crop: crop(184, 226, 23, 20), polygons: box(23, 20), purpose: 'Viewer-right source hand skin texture, clipped to the shared palm.' },
    thighRight: { crop: crop(124, 232, 24, 34), polygons: box(24, 34), purpose: 'Viewer-left interior brown trouser thigh texture.' },
    shinRight: { crop: crop(124, 260, 24, 32), polygons: box(24, 32), purpose: 'Viewer-left interior brown trouser shin texture.' },
    footRight: { crop: crop(112, 299, 44, 22), polygons: box(44, 22), purpose: 'Viewer-left brown shoe and pale sole.' },
    thighLeft: { crop: crop(158, 232, 24, 34), polygons: box(24, 34), purpose: 'Viewer-right interior brown trouser thigh texture.' },
    shinLeft: { crop: crop(158, 260, 24, 32), polygons: box(24, 32), purpose: 'Viewer-right interior brown trouser shin texture.' },
    footLeft: { crop: crop(152, 299, 48, 22), polygons: box(48, 22), purpose: 'Viewer-right brown shoe and pale sole.' },
  },
});

export const GREEN_SOUTH_RASTER_COSTUME = {
  id: 'patient.adult.046.raster-source-uv',
  source: greenSource,
  palette: { ...COSTUMES['patient.adult.046'].palette, skin: '#e3ac6e', skinLight: '#e7b87d' },
  sourceUV: GREEN_SOUTH_SOURCE_UV,
  surfaces: {
    head: [raster('head', -1, -1, 1, 1), ...['east', 'west', 'north'].map(view => oneView(view, `${view}Head`, -1, -1, 1, 1))],
    neck: [raster('neck', -1, -1, 1, 1), ...['east', 'west', 'north'].map(view => oneView(view, `${view}Neck`, -1, -1, 1, 1))],
    torso: [raster('torsoKnit', -1, 0, 1, 1), raster('torso', -1, 0, 1, 1), ...['east', 'west', 'north'].flatMap(view => [oneView(view, `${view}TorsoKnit`, -1, 0, 1, 1), oneView(view, `${view}Torso`, -1, 0, 1, 1)])],
    upperArm: [raster('upperLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('upperRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Sleeve`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northUpperLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northUpperRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    forearm: [raster('foreLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('foreRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Sleeve`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northForeLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northForeRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    hand: [raster('handLeft', -1, -1, 1, 1, ['left']), raster('handRight', -1, -1, 1, 1, ['right']), ...['east', 'west'].map(view => oneView(view, `${view}Hand`, -1, -1, 1, 1)), oneView('north', 'northHandLeft', -1, -1, 1, 1, ['left']), oneView('north', 'northHandRight', -1, -1, 1, 1, ['right'])],
    thigh: [raster('thighLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('thighRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Thigh`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northThighLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northThighRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    shin: [raster('shinLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('shinRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Shin`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northShinLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northShinRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    foot: [raster('footLeft', 0, -0.8, 1, 0.8, ['left']), raster('footRight', 1, -0.8, 0, 0.8, ['right']), oneView('east', 'eastFoot', 0, -0.8, 1, 0.8), oneView('west', 'westFoot', 1, -0.8, 0, 0.8), oneView('north', 'northFootLeft', 0, -0.8, 1, 0.8, ['left']), oneView('north', 'northFootRight', 1, -0.8, 0, 0.8, ['right'])],
  },
  attachments: [
    {
      id: 'source-side-fringe-and-ears', anchor: 'headBase', layer: 'head-back',
      bounds: { left: -47, top: -89, right: 47, bottom: 2 }, primitives: [],
      views: {
        south: { primitives: [raster('headSides', -46, -88, 46, 0)] },
        east: { primitives: [oneView('east', 'eastHeadEdge', -45, -86, 45, 0)] },
        west: { primitives: [oneView('west', 'westHeadEdge', -45, -86, 45, 0)] },
        north: { primitives: [oneView('north', 'northHeadEdge', -45, -86, 45, 0)] },
      },
    },
    {
      id: 'source-profile-moustache', anchor: 'headBase', layer: 'head-front',
      bounds: { left: -48, top: -40, right: 48, bottom: -4 }, primitives: [],
      views: {
        east: { primitives: [oneView('east', 'eastMoustache', 26, -18, 45, -5)] },
        west: { primitives: [oneView('west', 'westMoustache', -45, -18, -26, -5)] },
      },
    },
  ],
};

export const GRAY_SOUTH_SOURCE_UV = Object.freeze({
  coordinateSpace: 'immutable-source-pixels',
  assets: {
    ...GRAY_OTHER_VIEW_ASSETS,
    head: {
      crop: crop(118, 62, 67, 82), keyBackground: false,
      polygons: [[[12, 0], [49, 0], [64, 10], [66, 55], [58, 75], [45, 81], [12, 81], [2, 72], [0, 17]]],
      purpose: 'Warm painted face, black rectangular glasses, dark eyes, and complete swept silver crown.',
    },
    headSides: {
      crop: crop(111, 54, 87, 91),
      polygons: [[[1, 24], [21, 1], [25, 90], [3, 84]], [[63, 1], [85, 18], [86, 77], [65, 90]]],
      purpose: 'Swept silver side hair and ears extending beyond the shared head ellipse.',
    },
    braid: {
      crop: crop(158, 111, 45, 94),
      polygons: [[[7, 5], [35, 5], [42, 23], [39, 75], [30, 88], [17, 84], [8, 65], [5, 24]]],
      purpose: 'Complete source silver braid, including dark outline and interlocking painted strands.',
    },
    neck: { crop: crop(148, 92, 8, 10), polygons: box(8, 10), purpose: 'Interior source warm skin texture without facial outlines.' },
    torsoCoat: { crop: crop(124, 174, 14, 20), polygons: box(14, 20), purpose: 'Interior charcoal coat texture underpainting the approved torso.' },
    torso: {
      crop: crop(112, 140, 86, 103),
      polygons: [[[17, 0], [68, 0], [84, 20], [85, 101], [1, 101], [2, 20]]],
      purpose: 'Source charcoal lapels, cream blouse, placket, belt, buckle, pockets, seams, and coat shading.',
    },
    coatTails: {
      crop: crop(116, 140, 77, 104),
      polygons: [[[10, 5], [35, 5], [35, 88], [28, 101], [2, 99], [0, 25]], [[42, 5], [67, 5], [77, 25], [75, 99], [49, 101], [42, 88]]],
      purpose: 'Source long charcoal coat panels extending below the shared torso in front of the legs.',
    },
    upperRight: { crop: crop(108, 151, 15, 34), polygons: box(15, 34), purpose: 'Viewer-left interior charcoal upper sleeve.' },
    foreRight: { crop: crop(107, 181, 16, 40), polygons: box(16, 40), purpose: 'Viewer-left charcoal forearm and cuff texture.' },
    handRight: { crop: crop(104, 226, 22, 21), polygons: box(22, 21), purpose: 'Viewer-left warm hand texture clipped to the shared palm.' },
    upperLeft: { crop: crop(188, 151, 15, 34), polygons: box(15, 34), purpose: 'Viewer-right interior charcoal upper sleeve.' },
    foreLeft: { crop: crop(188, 181, 16, 40), polygons: box(16, 40), purpose: 'Viewer-right charcoal forearm and cuff texture.' },
    handLeft: { crop: crop(185, 226, 22, 21), polygons: box(22, 21), purpose: 'Viewer-right warm hand texture clipped to the shared palm.' },
    thighRight: { crop: crop(124, 239, 25, 35), polygons: box(25, 35), purpose: 'Viewer-left interior dark brown trouser thigh.' },
    shinRight: { crop: crop(124, 269, 25, 36), polygons: box(25, 36), purpose: 'Viewer-left interior dark brown trouser shin.' },
    footRight: { crop: crop(113, 302, 43, 27), polygons: box(43, 27), purpose: 'Viewer-left dark brown shoe and sole.' },
    thighLeft: { crop: crop(158, 239, 25, 35), polygons: box(25, 35), purpose: 'Viewer-right interior dark brown trouser thigh.' },
    shinLeft: { crop: crop(158, 269, 25, 36), polygons: box(25, 36), purpose: 'Viewer-right interior dark brown trouser shin.' },
    footLeft: { crop: crop(153, 302, 43, 27), polygons: box(43, 27), purpose: 'Viewer-right dark brown shoe and sole.' },
  },
});

export const GRAY_SOUTH_RASTER_COSTUME = {
  id: 'retained.gray-braid.raster-source-uv',
  source: graySource,
  palette: { ...COSTUMES['retained.gray-braid'].palette, skin: '#d49a62', skinLight: '#e0aa70' },
  sourceUV: GRAY_SOUTH_SOURCE_UV,
  surfaces: {
    head: [raster('head', -1, -1, 1, 1), ...['east', 'west', 'north'].map(view => oneView(view, `${view}Head`, -1, -1, 1, 1))],
    neck: [raster('neck', -1, -1, 1, 1), ...['east', 'west', 'north'].map(view => oneView(view, `${view}Neck`, -1, -1, 1, 1))],
    torso: [raster('torsoCoat', -1, 0, 1, 1), raster('torso', -1, 0, 1, 1), ...['east', 'west', 'north'].flatMap(view => [oneView(view, `${view}TorsoCoat`, -1, 0, 1, 1), oneView(view, `${view}Torso`, -1, 0, 1, 1)])],
    upperArm: [raster('upperLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('upperRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Sleeve`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northUpperLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northUpperRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    forearm: [raster('foreLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('foreRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Sleeve`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northForeLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northForeRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    hand: [raster('handLeft', -1, -1, 1, 1, ['left']), raster('handRight', -1, -1, 1, 1, ['right']), ...['east', 'west'].map(view => oneView(view, `${view}Hand`, -1, -1, 1, 1)), oneView('north', 'northHandLeft', -1, -1, 1, 1, ['left']), oneView('north', 'northHandRight', -1, -1, 1, 1, ['right'])],
    thigh: [raster('thighLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('thighRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Thigh`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northThighLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northThighRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    shin: [raster('shinLeft', 0, -1, 1, 1, ['left'], 'yx', true), raster('shinRight', 0, -1, 1, 1, ['right'], 'yx', true), ...['east', 'west'].map(view => oneView(view, `${view}Shin`, 0, -1, 1, 1, undefined, 'yx', true)), oneView('north', 'northShinLeft', 0, -1, 1, 1, ['left'], 'yx', true), oneView('north', 'northShinRight', 0, -1, 1, 1, ['right'], 'yx', true)],
    foot: [raster('footLeft', 0, -0.8, 1, 0.8, ['left']), raster('footRight', 1, -0.8, 0, 0.8, ['right']), oneView('east', 'eastFoot', 0, -0.8, 1, 0.8), oneView('west', 'westFoot', 1, -0.8, 0, 0.8), oneView('north', 'northFootLeft', 0, -0.8, 1, 0.8, ['left']), oneView('north', 'northFootRight', 1, -0.8, 0, 0.8, ['right'])],
  },
  attachments: [
    { id: 'source-long-coat-panels', anchor: 'neckBase', layer: 'torso-back', bounds: { left: -48, top: 5, right: 48, bottom: 124 }, primitives: [], views: { south: { primitives: [raster('coatTails', -43, 7, 43, 117)] }, east: { primitives: [oneView('east', 'eastCoat', -43, 7, 43, 122)] }, west: { primitives: [oneView('west', 'westCoat', -43, 7, 43, 122)] }, north: { primitives: [oneView('north', 'northCoat', -46, 7, 46, 122)] } } },
    { id: 'source-silver-hair-and-ears', anchor: 'headBase', layer: 'head-back', bounds: { left: -48, top: -92, right: 48, bottom: 4 }, primitives: [], views: { south: { primitives: [raster('headSides', -45, -89, 45, 1)] }, east: { primitives: [oneView('east', 'eastHeadEdge', -45, -88, 45, 1)] }, west: { primitives: [oneView('west', 'westHeadEdge', -45, -88, 45, 1)] }, north: { primitives: [oneView('north', 'northHeadEdge', -45, -88, 45, 1)] } } },
    { id: 'source-silver-braid-front', anchor: 'headBase', layer: 'head-front', bounds: { left: 10, top: -47, right: 45, bottom: 60 }, primitives: [], views: { south: { primitives: [raster('braid', 12, -45, 43, 58)] } } },
    { id: 'source-silver-braid-back', anchor: 'headBase', layer: 'head-back', bounds: { left: -50, top: -48, right: 50, bottom: 84 }, primitives: [], views: { east: { primitives: [oneView('east', 'eastBraid', -48, -45, -8, 74)] }, west: { primitives: [oneView('west', 'westBraid', 8, -45, 48, 74)] }, north: { primitives: [oneView('north', 'northBraid', -19, -43, 19, 82)] } } },
  ],
};

function keyConnectedNeutralBackground(canvas) {
  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Uint8Array(canvas.width * canvas.height);
  const queue = new Uint32Array(seen.length);
  let head = 0, tail = 0;
  const isBackground = pixel => {
    const offset = pixel * 4;
    const values = [image.data[offset], image.data[offset + 1], image.data[offset + 2]];
    return Math.min(...values) >= 150 && Math.max(...values) - Math.min(...values) <= 32;
  };
  const add = pixel => { if (!seen[pixel] && isBackground(pixel)) { seen[pixel] = 1; queue[tail++] = pixel; } };
  for (let x = 0; x < canvas.width; x += 1) { add(x); add((canvas.height - 1) * canvas.width + x); }
  for (let y = 0; y < canvas.height; y += 1) { add(y * canvas.width); add(y * canvas.width + canvas.width - 1); }
  while (head < tail) {
    const pixel = queue[head++], x = pixel % canvas.width, y = Math.floor(pixel / canvas.width);
    if (x) add(pixel - 1); if (x + 1 < canvas.width) add(pixel + 1);
    if (y) add(pixel - canvas.width); if (y + 1 < canvas.height) add(pixel + canvas.width);
  }
  for (let pixel = 0; pixel < seen.length; pixel += 1) if (seen[pixel]) image.data[pixel * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
}

function extractAsset(image, spec) {
  const canvas = createCanvas(spec.crop.width, spec.crop.height), context = canvas.getContext('2d');
  context.drawImage(image, spec.crop.x, spec.crop.y, spec.crop.width, spec.crop.height, 0, 0, spec.crop.width, spec.crop.height);
  if(spec.keyBackground!==false)keyConnectedNeutralBackground(canvas);
  const mask = createCanvas(canvas.width, canvas.height), maskContext = mask.getContext('2d');
  maskContext.fillStyle = '#fff';
  for (const polygon of spec.polygons) {
    maskContext.beginPath();
    polygon.forEach(([x, y], index) => index ? maskContext.lineTo(x, y) : maskContext.moveTo(x, y));
    maskContext.closePath(); maskContext.fill();
  }
  context.globalCompositeOperation = 'destination-in'; context.drawImage(mask, 0, 0);
  context.globalCompositeOperation = 'source-over';
  if (spec.edgePadY) {
    const padded = createCanvas(canvas.width, canvas.height + spec.edgePadY * 2), paddedContext = padded.getContext('2d');
    paddedContext.drawImage(canvas, 0, spec.edgePadY);
    paddedContext.drawImage(canvas, 0, 0, canvas.width, 1, 0, 0, canvas.width, spec.edgePadY);
    paddedContext.drawImage(canvas, 0, canvas.height - 1, canvas.width, 1, 0, spec.edgePadY + canvas.height, canvas.width, spec.edgePadY);
    return padded;
  }
  return canvas;
}

export async function loadRasterCostume(costume, repositoryRoot) {
  assertCostume(costume);
  const sourcePath = resolve(repositoryRoot, costume.source.path), bytes = readFileSync(sourcePath);
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (actualHash !== costume.source.sha256) throw new Error(`source hash mismatch for ${costume.id}`);
  const sourceImage = await loadImage(sourcePath), assets = {};
  for (const [id, spec] of Object.entries(costume.sourceUV.assets)) assets[id] = extractAsset(sourceImage, spec);
  Object.defineProperty(costume, RASTER_ASSETS, { value: Object.freeze(assets), enumerable: false, configurable: true });
  return costume;
}

export function rasterAssets(costume) { return costume[RASTER_ASSETS]; }

assertCostume(GREEN_SOUTH_RASTER_COSTUME);
assertCostume(GRAY_SOUTH_RASTER_COSTUME);


