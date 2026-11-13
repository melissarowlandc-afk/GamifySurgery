/** Two-step rollout: ship the dialect-aware reader with plain writes first.
 * Enable only in a later release whose rollback floor includes this reader.
 * One build constant is shared by main, engine and codec realms. */
export const LOCAL_STORAGE_COMPRESSION_WRITES = false;
