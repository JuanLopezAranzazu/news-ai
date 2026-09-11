<script setup lang="ts">
import type { News } from '~/types/news'

const props = defineProps<{ news: News }>()

const publishedLabel = computed(() => {
  const date = props.news.publishedAt || props.news.createdAt
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short'
  })
})
</script>

<template>
  <NuxtLink
    :to="`/news/${news.id}`"
    class="group block"
  >
    <UCard :ui="{ body: 'p-0 sm:p-0' }">
      <div class="aspect-[16/9] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          v-if="news.imageUrl"
          :src="news.imageUrl"
          :alt="news.title"
          class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          loading="lazy"
        >
        <div
          v-else
          class="w-full h-full flex items-center justify-center"
        >
          <UIcon
            name="i-lucide-newspaper"
            class="text-3xl text-zinc-300 dark:text-zinc-600"
          />
        </div>
      </div>

      <div class="p-4 space-y-2">
        <div class="flex items-center justify-between gap-2">
          <UBadge
            v-if="news.category"
            color="primary"
            variant="solid"
            size="xs"
          >
            {{ news.category.name }}
          </UBadge>
          <span
            v-else
            class="byline"
          >Sin clasificar</span>
          <span class="byline">{{ publishedLabel }}</span>
        </div>

        <h3 class="font-display text-lg leading-snug group-hover:text-wire transition-colors">
          {{ news.title }}
        </h3>

        <p
          v-if="news.summary"
          class="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3"
        >
          {{ news.summary.content }}
        </p>

        <p class="byline pt-1">{{ news.source.name }}</p>
      </div>
    </UCard>
  </NuxtLink>
</template>
