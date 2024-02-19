import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({
  params,
}: LoaderFunctionArgs) {
  return [ 
    {
      label: 'WCA Live',
      link: `https://live.worldcubeassociation.org/link/competitions/${params.comp}`,
    }, {
      label: 'Competition Groups',
      link: `https://www.competitiongroups.com/competitions/${params.comp}`,
    }, {
      label: 'WCA Competition Page',
      link: `https://www.worldcubeassociation.org/competitions/${params.comp}`,
    }
  ]
}

export default function Users() {
  const links = useLoaderData<typeof loader>();
  return (
    <ul>
      {links.map(({label, link}) => (
        <li key={label}>
          <a href={link}>{link}</a>
        </li>
      ))}
    </ul>
  );
}