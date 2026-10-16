/** Null retains the historical unowned prototype namespace, byte for byte. */
export function accountStorageKey(baseKey: string, accountId: string | null = null): string {
  return accountId === null ? baseKey : `${baseKey}.account.${encodeURIComponent(accountId)}`;
}
