import { createContext, useState, ReactNode } from "react";
type AccessTokenContextType = {
  getToken: Function;
  hasToken: Function;
  login: Function;
  logout: Function;
};

type AccessTokenProviderProps = {
  children: ReactNode;
};
// Create a context for handling access tokens.
export const AccessTokenContext = createContext<AccessTokenContextType>(
  {
    getToken: () => null,
    hasToken: () => null,
    login: () => null,
    logout: () => null,
  }
);
// Provider component for the AccessTokenContext.
export function AccessTokenProvider({ children }: AccessTokenProviderProps) {
  // State management for the access token.
  const [token, setToken] = useState("");
  // Define utility functions for token operations.
  const getToken = () => token;
  const hasToken = (): boolean => !!token;
  const login = (token: string) => {
    setToken(token);
  };
  const logout = () => {
    setToken("");
  };
// Provide the context values to child components.
  return (
    <AccessTokenContext.Provider
      value={{
        getToken,
        hasToken,
        login,
        logout,
      }}
    >
      {children}
    </AccessTokenContext.Provider>
  );
}
