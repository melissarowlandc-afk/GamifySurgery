import { createContext, useContext } from "react";

/** The provider remounts its children when account ownership changes. */
export const AuthAccountContext = createContext<string | null>(null);

export interface AuthAccountActions {
  email: string;
  signOut: () => Promise<boolean | void>;
  /** An account-scoped save owner may finish local durability before auth leaves. */
  signOutGuard?: { current: (() => Promise<void>) | null };
  pending: boolean;
  message: string | null;
}
export const AuthAccountActionsContext = createContext<AuthAccountActions | null>(null);
export const useAuthAccountActions = () => useContext(AuthAccountActionsContext);

export function useAuthAccountId(): string | null {
  return useContext(AuthAccountContext);
}
