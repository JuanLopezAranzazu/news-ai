export function useApi() {
  const config = useRuntimeConfig()

  const client = $fetch.create({
    baseURL: config.public.apiBase
  })

  return client
}
