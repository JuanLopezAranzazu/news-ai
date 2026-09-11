<script setup lang="ts">
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  htmlAttrs: {
    lang: 'es'
  }
})

const title = 'News AI — resúmenes de noticias generados con IA'
const description = 'News AI es una aplicación web que utiliza inteligencia artificial para generar resúmenes de noticias de manera automática, permitiendo a los usuarios mantenerse informados de manera rápida y eficiente.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
      <NuxtPage />
    </main>
    <footer class="border-t border-zinc-200 dark:border-zinc-800 py-6">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 byline flex items-center justify-between">
        <span>News AI — resúmenes generados con IA</span>
        <span>{{ new Date().getFullYear() }}</span>
      </div>
    </footer>
  </div>
</template>
