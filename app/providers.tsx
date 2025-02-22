import { SWRConfig } from 'swr'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig 
      value={{
        refreshInterval: 30000,
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}
    >
      {children}
    </SWRConfig>
  )
}
