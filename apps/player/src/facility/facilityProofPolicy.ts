/** QA production artifacts opt in at build time as well as at runtime. Normal
 * production builds never expose the Phaser handle, regardless of URL flags. */
export function facilityProofEnabled(development: boolean, qaProductionBuild: boolean, search: string): boolean {
  return (development || qaProductionBuild) && new URLSearchParams(search).has("facility-gait-proof");
}
