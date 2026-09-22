const PART_NAMES = ['body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];
const LIMB_NAMES = PART_NAMES.slice(1);

const fail = message => { throw new Error(`invalid reauthored source profile: ${message}`); };
const finitePoint = (value, label) => {
  if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y)) fail(`${label} must be a finite {x,y} point`);
};
const rectangle = (value, label) => {
  for (const key of ['x', 'y', 'width', 'height']) if (!Number.isInteger(value?.[key])) fail(`${label}.${key} must be an integer`);
  if (value.width <= 0 || value.height <= 0 || value.x < 0 || value.y < 0) fail(`${label} must be a positive source rectangle`);
};

export function validateSourceProfiles(document, { allowPending = false } = {}) {
  if (document?.schemaVersion !== 1) fail('schemaVersion must be 1');
  if (!document.characters || typeof document.characters !== 'object' || Array.isArray(document.characters)) fail('characters must be keyed by character id');
  for (const [characterId, character] of Object.entries(document.characters)) {
    if (character.id !== characterId) fail(`${characterId}.id must match its key`);
    if (!character.views || typeof character.views !== 'object') fail(`${characterId}.views is required`);
    for (const viewName of ['south', 'east', 'north', 'west']) {
      const view = character.views[viewName];
      if (!view) fail(`${characterId}.views.${viewName} is required`);
      if (view.status === 'pending-source-measurement' && allowPending) continue;
      if (view.status !== 'measured') fail(`${characterId}.views.${viewName}.status must be measured`);
      if (typeof view.source?.path !== 'string' || !view.source.path) fail(`${characterId}.${viewName}.source.path is required`);
      for (const key of ['width', 'height']) if (!Number.isInteger(view.source[key]) || view.source[key] <= 0) fail(`${characterId}.${viewName}.source.${key} must be positive`);
      if (!/^[a-f0-9]{64}$/.test(view.source.sha256 ?? '')) fail(`${characterId}.${viewName}.source.sha256 is required`);
      for (const key of ['width', 'height']) if (!Number.isInteger(view.targetFrame?.[key]) || view.targetFrame[key] <= 0) fail(`${characterId}.${viewName}.targetFrame.${key} must be positive`);
      finitePoint(view.targetRegistration?.bodyAnchor, `${characterId}.${viewName}.targetRegistration.bodyAnchor`);
      if (!view.parts || typeof view.parts !== 'object') fail(`${characterId}.${viewName}.parts is required`);
      for (const partName of PART_NAMES) {
        const part = view.parts[partName];
        if (!part) fail(`${characterId}.${viewName}.parts.${partName} is required`);
        rectangle(part.bounds, `${characterId}.${viewName}.${partName}.bounds`);
        if (part.bounds.x + part.bounds.width > view.source.width || part.bounds.y + part.bounds.height > view.source.height) fail(`${characterId}.${viewName}.${partName}.bounds exceeds source image`);
        if (partName === 'body') {
          finitePoint(part.anchor, `${characterId}.${viewName}.body.anchor`);
          for (const key of ['scaleX', 'scaleY']) if (!Number.isFinite(part.calibration?.[key]) || part.calibration[key] <= 0) fail(`${characterId}.${viewName}.body.calibration.${key} must be positive`);
        } else if (!Number.isFinite(part.normalizationScale) || part.normalizationScale <= 0) fail(`${characterId}.${viewName}.${partName}.normalizationScale must be positive`);
      }
      for (const partName of LIMB_NAMES) {
        const part = view.parts[partName];
        for (const anchorName of ['proximal', 'joint', 'terminal', 'end']) finitePoint(part.rig?.[anchorName], `${characterId}.${viewName}.${partName}.rig.${anchorName}`);
        if (!Number.isInteger(part.mesh?.cellSize) || part.mesh.cellSize < 1) fail(`${characterId}.${viewName}.${partName}.mesh.cellSize must be positive`);
        if (!Array.isArray(part.skinning?.jointBlendPixels) || part.skinning.jointBlendPixels.length !== 2 || part.skinning.jointBlendPixels.some(value => !Number.isFinite(value) || value < 0)) fail(`${characterId}.${viewName}.${partName}.skinning.jointBlendPixels is invalid`);
        for (const key of ['before', 'after']) if (!Number.isFinite(part.skinning?.terminalTransition?.[key]) || part.skinning.terminalTransition[key] < 0) fail(`${characterId}.${viewName}.${partName}.skinning.terminalTransition.${key} is invalid`);
      }
    }
  }
  return document;
}

export { PART_NAMES };
