// Diagnostic only: inherit the shipped player config and its unchanged deadline.
import {fileURLToPath} from 'node:url';
import base from '../../apps/player/vite.config.ts';
export default {
  ...base,
  root:fileURLToPath(new URL('../../apps/player',import.meta.url)),
  test:{...base.test,setupFiles:[...(base.test?.setupFiles??[]),fileURLToPath(new URL('./question-flags-entry-release.setup.ts',import.meta.url))]},
};
