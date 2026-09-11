<script setup lang="ts">
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: v => (colorMode.preference = v ? 'dark' : 'light')
})

const today = new Date().toLocaleDateString('es-ES', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
</script>

<template>
  <header class="border-b border-zinc-200 dark:border-zinc-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs byline">
      <span class="capitalize">{{ today }}</span>
      <div class="flex items-center gap-3">
        <UButton
          :icon="isDark ? 'i-lucide-sun' : 'i-lucide-moon'"
          color="neutral"
          variant="ghost"
          size="xs"
          square
          @click="isDark = !isDark"
        />
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-5 pt-1 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-baseline gap-2"
      >
        <span class="font-display text-4xl sm:text-5xl tracking-tight">News AI</span>
        <span class="text-wire font-display text-4xl sm:text-5xl">.</span>
      </NuxtLink>

      <p class="hidden sm:block text-sm byline max-w-[22ch] text-right">
        Titulares recopilados y resumidos automáticamente
      </p>
    </div>
  </header>
</template>
