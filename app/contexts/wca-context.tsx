import { ReactNode, createContext, useContext } from 'react';

const WCA_ORIGIN = 'https://api.worldcubeassociation.org';
const WCA_OAUTH_ORIGIN = 'https://worldcubeassociation.org';

interface IWcaContext {
  wcaOrigin: string,
  wcaOauthOrigin: string,
  wcaOauthClientId?: string | undefined,
}

const WcaContext = createContext<IWcaContext>({
  wcaOrigin: WCA_ORIGIN,
  wcaOauthOrigin: WCA_OAUTH_ORIGIN,
});

export default function WcaContextProvider({ children, value }: { children: ReactNode, value: IWcaContext}) {
  return <WcaContext.Provider value={value}>{children}</WcaContext.Provider>;
}

export const useWcaContext = () => useContext(WcaContext);