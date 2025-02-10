import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useAccounts() {
  const { data, error, isLoading } = useSWR('/api/accounts', fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })

  return {
    accounts: data,
    isLoading,
    error
  }
}
