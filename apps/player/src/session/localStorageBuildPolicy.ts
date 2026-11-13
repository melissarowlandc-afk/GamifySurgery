/** Release 38 enables compression after the reader-first rollout.
 * The rollback floor (release 36+) includes the plain/compressed/mixed reader.
 * One build constant is shared by main, engine and codec realms. */
export const LOCAL_STORAGE_COMPRESSION_WRITES = true;
