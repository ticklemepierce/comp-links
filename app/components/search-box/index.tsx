import { useState } from "react";
import { Combobox } from '@headlessui/react'
import { useFetchComps } from "~/hooks/use-fetch-comps";

const SearchBox = () => {
  const [fetchComps, comps] = useFetchComps();
  const [ query, setQuery ] = useState<string | undefined>();
  

  const onChange = async (val: string) => {
    setQuery(val);
    await fetchComps(val);
  }

  return (
    <form autoComplete="off" className="top-0 left-0 right-0 text-center">
      <Combobox value={query} as="div" className="w-96 mx-auto relative">
        <Combobox.Input onChange={(event) => onChange(event.target.value)} className={"border-2 rounded-full px-4 h-12 w-full"} />
        { comps && 
          <Combobox.Options static className="text-left absolute mt-1 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-2 ring-black ring-opacity-5">
            {comps && comps.map((comp: any) => (
              <Combobox.Option key={comp.id} value={comp} className="border-b border-black border-opacity-5 last:border-b-0 px-4">
                <a href={`/${comp.wca_id}`} className="leading-10">{comp.name}</a>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        }
      </Combobox>
    </form>
  )
}

export default SearchBox;