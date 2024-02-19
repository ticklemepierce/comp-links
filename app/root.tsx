import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import AuthContextProvider from "./contexts/auth-context";
import WcaContextProvider from "./contexts/wca-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLoaderData } from "@remix-run/react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const WCA_ORIGIN = 'https://api.worldcubeassociation.org';
const WCA_OAUTH_ORIGIN = 'https://worldcubeassociation.org';


export async function loader() {
  console.log(WCA_ORIGIN);
  return {
    wcaOrigin: WCA_ORIGIN,
    wcaOauthOrigin: WCA_OAUTH_ORIGIN,
    wcaOauthClientId: process.env.WCA_OAUTH_CLIENT_ID,
  }
}

export default function App() {
  const queryClient = new QueryClient();
  const wcaContextValue = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <WcaContextProvider value={wcaContextValue}>
            <AuthContextProvider>
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <LiveReload />
            </AuthContextProvider>
          </WcaContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
