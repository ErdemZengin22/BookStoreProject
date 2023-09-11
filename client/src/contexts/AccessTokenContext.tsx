import { createContext, useState, ReactNode } from "react";

/**
 * For using TypeScript and the Context API,
 * @see https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context
 */

/**
 * This needs to match whatever is placed inside the "value" below.
 * @see <AccessTokenContext.Provider value={{ ... }) >
 */
type AccessTokenContextType = {
  getToken: Function;
  hasToken: Function;
  login: Function;
  logout: Function;
};

type AccessTokenProviderProps = {
  children: ReactNode;
};

export const AccessTokenContext = createContext<AccessTokenContextType>(
  /**
   * This is to avoid type issues with TypeScript.
   * If I don't do this, I am going to need to type check for "login"
   * and all other functions wherever they are used.
   * This needs to meet the "AccessTokenContextType" declaration above.
   */
  {
    getToken: () => null,
    hasToken: () => null,
    login: () => null,
    logout: () => null,
  }
);

export function AccessTokenProvider({ children }: AccessTokenProviderProps) {
  /**
   * Storing the JWT token in the Context API
   */
  const [token, setToken] = useState("");

  /**
   * @returns JWT token. Use to determine if the user is logged in.
   */
  const getToken = () => token;
  /**
   *
   * @returns {boolean} whether or not the token is stored in the Context API.
   * In other words, whether or not the user is logged in.
   */
  const hasToken = (): boolean => !!token;

  /**
   * We login by setting the token.
   * @param {string} token
   */
  const login = (token: string) => {
    setToken(token);
  };
  /**
   * Logs the user out by clearing the token from state
   */
  const logout = () => {
    setToken("");
  };

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
