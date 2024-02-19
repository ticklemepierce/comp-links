import { useCallback } from 'react';
import { useAuthContext } from '~/contexts/auth-context';
import { useWcaContext } from '~/contexts/wca-context';

export default function useWCAFetch() {
  const { accessToken } = useAuthContext();
  const { wcaOrigin } = useWcaContext();

  return useCallback(async (path: string, fetchOptions: RequestInit = {}) => {
      const res = await fetch(
        `${wcaOrigin}${path}`,
        Object.assign({}, fetchOptions, {
          headers: new Headers({
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          }),
        })
      );

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      return (await res.json());
    },
    [accessToken]
  );
}