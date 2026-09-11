import type { Category, News, PaginatedNews, Source } from "~/types/news";

export function useNewsList(params: {
  page: Ref<number>;
  categoryId: Ref<string | undefined>;
  search: Ref<string>;
}) {
  const api = useApi();

  const query = computed(() => ({
    page: params.page.value,
    categoryId: params.categoryId.value || undefined,
    search: params.search.value || undefined,
  }));

  const { data, status, refresh, error } = useAsyncData<PaginatedNews>(
    () => `news-${JSON.stringify(query.value)}`,
    () => api<PaginatedNews>("/news", { query: query.value }),
    { watch: [query] }
  );

  return { data, status, refresh, error };
}

export function useNewsDetail(id: string) {
  const api = useApi();
  return useAsyncData<News>(`news-${id}`, () => api<News>(`/news/${id}`));
}

export function useCategories() {
  const api = useApi();
  return useAsyncData<Category[]>("categories", () => api<Category[]>("/categories"));
}

export function useSources() {
  const api = useApi();
  return useAsyncData<Source[]>("sources", () => api<Source[]>("/sources"));
}

export async function triggerScrape(sourceId?: string) {
  const api = useApi();
  const path = sourceId ? `/scrape/${sourceId}` : "/scrape";
  return api(path, { method: "POST" });
}

export async function regenerateSummary(newsId: string) {
  const api = useApi();
  return api<News>(`/news/${newsId}/summarize`, { method: "POST" });
}
