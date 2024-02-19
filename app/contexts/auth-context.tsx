import { ReactNode } from 'react'

import { useState, useEffect, createContext, useContext, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useWcaContext } from './wca-context';

interface IAuthContext {
  accessToken: string | null;
  signIn: () => void;
  signOut: () => void;
  signedIn: () => boolean;
  user: User | null;
  expired: boolean;
}

const AuthContext = createContext<IAuthContext>({
  accessToken: null,
  signIn: () => {},
  signOut: () => {},
  signedIn: () => false,
  user: null,
  expired: true,
});

export default function AuthContextProvider({ children }: { children: ReactNode}) {
  const { wcaOrigin, wcaOauthOrigin, wcaOauthClientId } = useWcaContext();
  const localStorageKey = (key: string) => `comp-links.${wcaOauthClientId}.${key}`;

  const getLocalStorage = (key: string) => typeof window !== 'undefined' ? window.localStorage.getItem(localStorageKey(key)) : null;
  const setLocalStorage = (key: string, value: string) =>
    window.localStorage.setItem(localStorageKey(key), value);
  


  const [accessToken, setAccessToken] = useState(getLocalStorage('accessToken'));
  const [expirationTime, setExpirationTime] = useState(
    getLocalStorage('expirationTime')
  ); // Time at which it expires
  const [user, setUser] = useState<User | null>(() => {
    const rawUserData = getLocalStorage('user');
    return rawUserData ? (JSON.parse(rawUserData) as User) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();

  // const history = createBrowserHistory();

  const signIn = () => {
    window.localStorage.setItem('redirect', window.location.pathname);

    const params = new URLSearchParams({
      client_id: wcaOauthClientId!,
      response_type: 'token',
      redirect_uri: window.location.origin,
      scope: 'public',
      state: 'foobar',
    });

    window.location.href = `${wcaOauthOrigin}/oauth/authorize?${params.toString()}`;
  };

  const signOut = () => {
    console.log('signing out');
    setAccessToken(null);
    setExpirationTime(null);
    setUser(null);
    window.localStorage.removeItem(localStorageKey('accessToken'));
    window.localStorage.removeItem(localStorageKey('expirationTime'));
    window.localStorage.removeItem(localStorageKey('user'));
  };

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '');
    const hashParams = new URLSearchParams(hash);

    const hashParamAccessToken = hashParams.get('access_token');
    if (hashParamAccessToken) {
      setAccessToken(hashParamAccessToken);
      setLocalStorage('accessToken', hashParamAccessToken);
    }

    const hashParamExpiresIn = hashParams.get('expires_in');
    if (hashParamExpiresIn && !isNaN(parseInt(hashParamExpiresIn, 10))) {
      /* Expire the token 15 minutes before it actually does,
         this way it doesn't expire right after the user enters the page. */
      const expiresInSeconds = parseInt(hashParamExpiresIn, 10) - 15 * 60;
      const expTime = new Date(new Date().getTime() + expiresInSeconds * 1000).toISOString();
      setLocalStorage('expirationTime', expTime);
      setExpirationTime(expTime);
    }

    /* Clear the hash if there is a token. */
    if (hashParamAccessToken) {
      // history.replace({ ...window.location, hash: undefined });
      navigate(window.localStorage.getItem('redirect') || '/');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetch(
      `${wcaOrigin}/me`,
      Object.assign(
        {},
        {
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }),
        }
      )
    )
      .then(async (res) => {
        if (res.ok) {
          return (await res.json()) as {
            me: User;
          };
        } else {
          throw await res.json();
        }
      })
      .then((data) => {
        setLocalStorage('user', JSON.stringify(data.me));
        setUser(data.me);
      })
      .catch((err) => console.error(err));
  }, [accessToken]);

  const signedIn = useCallback(() => !!accessToken, [accessToken]);

  const expired = useMemo(() => {
    if (!user) {
      return false;
    }
    if (!expirationTime) {
      return true;
    }

    return Date.now() >= new Date(expirationTime).getTime();
  }, [user, expirationTime]);

  const value = {
    accessToken,
    user,
    signIn,
    signOut,
    signedIn,
    expired,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);