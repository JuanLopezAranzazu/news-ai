<script setup lang="ts">
const page = ref(1)
const categoryId = ref<string | undefined>(undefined)
const search = ref('')

watch([categoryId, search], () => {
  page.value = 1
})

const { data: categories } = useCategories()
const { data, status, refresh } = useNewsList({ page, categoryId, search })

const scraping = ref(false)
async function handleScrape() {
  scraping.value = true
  try {
    await triggerScrape()
    await refresh()
  } finally {
    scraping.value = false
  }
}
</script>

<template>
  <div class="space-y-8">
    <section
      class="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
    >
      <div>
        <h1 class="font-display text-3xl sm:text-4xl">
          Últimas noticias
        </h1>
        <p class="byline mt-1">
          {{ data?.total ?? 0 }} artículos · clasificados automáticamente
        </p>
      </div>

      <UButton
        icon="i-lucide-refresh-cw"
        color="neutral"
        variant="outline"
        :loading="scraping"
        @click="handleScrape"
      >
        Actualizar fuentes
      </UButton>
    </section>

    <NewsFilters
      :categories="categories ?? []"
      :model-category-id="categoryId"
      :model-search="search"
      @update:model-category-id="(v) => (categoryId = v)"
      @update:model-search="(v) => (search = v)"
    />

    <section
      v-if="status === 'pending'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <USkeleton
        v-for="i in 6"
        :key="i"
        class="h-72 w-full rounded-sm"
      />
    </section>

    <section
      v-else-if="data?.items.length"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <NewsCard
        v-for="item in data.items"
        :key="item.id"
        :news="item"
      />
    </section>

    <UAlert
      v-else
      icon="i-lucide-inbox"
      title="Sin resultados"
      description="No hay noticias que coincidan con estos filtros. Prueba a actualizar las fuentes o cambiar la búsqueda."
      color="neutral"
      variant="soft"
    />

    <div
      v-if="data && data.totalPages > 1"
      class="flex justify-center pt-4"
    >
      <UPagination
        v-model:page="page"
        :page-size="data.pageSize"
        :total="data.total"
      />
    </div>
  </div>
</template>
