<script setup lang="ts">
const route = useRoute()
const id = route.params.id as string

const { data: news, status, refresh } = useNewsDetail(id)

const regenerating = ref(false)
async function handleRegenerate() {
  regenerating.value = true
  try {
    await regenerateSummary(id)
    await refresh()
  } finally {
    regenerating.value = false
  }
}

const publishedLabel = computed(() => {
  const date = news.value?.publishedAt || news.value?.createdAt
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const paragraphs = computed(() =>
  (news.value?.content ?? '').split('\n\n').filter(p => p.trim().length > 0)
)
</script>

<template>
  <div
    v-if="status === 'pending'"
    class="max-w-2xl mx-auto space-y-4"
  >
    <USkeleton class="h-8 w-2/3" />
    <USkeleton class="h-64 w-full" />
    <USkeleton
      v-for="i in 4"
      :key="i"
      class="h-4 w-full"
    />
  </div>

  <article
    v-else-if="news"
    class="max-w-2xl mx-auto"
  >
    <UButton
      to="/"
      icon="i-lucide-arrow-left"
      variant="link"
      color="neutral"
      size="sm"
      class="px-0 mb-6"
    >
      Volver a portada
    </UButton>

    <div class="flex items-center gap-2 mb-3">
      <UBadge
        v-if="news.category"
        color="primary"
        variant="subtle"
        size="xs"
      >
        {{ news.category.name }}
      </UBadge>
      <span class="byline">{{ news.source.name }}</span>
    </div>

    <h1 class="font-display text-3xl sm:text-4xl leading-tight">
      {{ news.title }}
    </h1>

    <p class="byline mt-3">
      <span v-if="news.author">{{ news.author }} · </span>{{ publishedLabel }}
    </p>

    <img
      v-if="news.imageUrl"
      :src="news.imageUrl"
      :alt="news.title"
      class="w-full aspect-[16/9] object-cover my-6 rounded-sm"
    >

    <UAlert
      v-if="news.summary"
      icon="i-lucide-sparkles"
      color="primary"
      variant="soft"
      title="Resumen generado con IA"
      :description="news.summary.content"
      class="my-6"
    />

    <div class="flex items-center gap-2 mb-6">
      <UButton
        icon="i-lucide-refresh-cw"
        size="xs"
        color="neutral"
        variant="outline"
        :loading="regenerating"
        @click="handleRegenerate"
      >
        Regenerar resumen y categoría
      </UButton>
      <UButton
        :to="news.url"
        target="_blank"
        icon="i-lucide-external-link"
        size="xs"
        color="neutral"
        variant="ghost"
      >
        Ver original
      </UButton>
    </div>

    <div class="prose-article">
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
      >
        {{ p }}
      </p>
    </div>
  </article>

  <UAlert
    v-else
    icon="i-lucide-alert-triangle"
    color="error"
    variant="soft"
    title="No encontrado"
    description="Esta noticia no existe o fue eliminada."
  />
</template>
