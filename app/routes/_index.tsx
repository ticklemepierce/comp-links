import type { MetaFunction } from "@remix-run/node";
import SearchBox from "~/components/search-box";
import { useAuthContext } from '~/contexts/auth-context';
import useWCAFetch from "~/hooks/use-wca-fetch";
import { useQuery } from "@tanstack/react-query";
import Button from "~/components/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

interface UserCompsResponse {
  upcoming_competitions: ApiCompetition[];
  ongoing_competitions: ApiCompetition[];
}

export default function Index() {
  const { signIn, signedIn, user, signOut } = useAuthContext();
  const wcaApiFetch = useWCAFetch();

  const { data, isFetching } = useQuery<UserCompsResponse>({
    queryKey: ['userCompetitions'],
    queryFn:     async () =>
    await wcaApiFetch(
      `/users/${user?.id}?upcoming_competitions=true&ongoing_competitions=true`
    ),
  });
  return (
    <>
      <SearchBox />
      { !signedIn() ? 
        <Button onClick={signIn}>Sign in with WCA</Button> :
        <Button onClick={signOut}>Sign out</Button>
      }
      {
        user &&
          <>
            {data?.ongoing_competitions.map(comp => <li>{comp.name}</li>)}
            {data?.upcoming_competitions.map(comp => <li>{comp.name}</li>)}
          </>
      }

    </>
  );
}
