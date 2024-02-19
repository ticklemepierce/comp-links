import { request, gql } from 'graphql-request';
import { useState } from "react";
import debounce from 'debounce';

const liveEndpoint = 'https://live.worldcubeassociation.org/api';

export const useFetchComps = () => {
  const [comps, setComps] = useState<any>();

  const graphqlFetch = async (name: string) => {
    const query = gql`
      query Competitions($filter: String!) {
        competitions(filter: $filter, limit: 10) {
          id
          name
          wca_id
        }
      }
    `;
    const data: any = await request(liveEndpoint, query, {
      filter: name,
    });

    setComps(data.competitions);
  };

  const debouncedGraphqlFetch = debounce(graphqlFetch, 250);

  const fetch = async (name: string) => {
    if (name === '' || name == null ) {
      return setComps([]);
    }

    await debouncedGraphqlFetch(name);
  }


  return [fetch, comps];
}