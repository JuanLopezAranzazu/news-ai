<script setup lang="ts">
const emit = defineEmits<{
  'update:modelCategoryId': [value: string | undefined]
  'update:modelSearch': [value: string]
}>()

function selectCategory(id: string | undefined) {
  emit('update:modelCategoryId', id)
}
</script>

<template>
  <div class="space-y-4">
    <UInput
      :model-value="modelSearch"
      icon="i-lucide-search"
      placeholder="Buscar noticias…"
      size="lg"
      class="w-full sm:max-w-sm"
      @update:model-value="(v) => emit('update:modelSearch', v)"
    />

    <div class="flex flex-wrap gap-2 -mx-1 overflow-x-auto pb-1">
      <UButton
        :variant="!modelCategoryId ? 'solid' : 'soft'"
        :color="!modelCategoryId ? 'amber' : 'gray'"
        size="xs"
        class="rounded-full"
        @click="selectCategory(undefined)"
      >
        Todas
      </UButton>

      <UButton
        v-for="cat in categories"
        :key="cat.id"
        :variant="modelCategoryId === cat.id ? 'solid' : 'soft'"
        :color="modelCategoryId === cat.id ? 'amber' : 'gray'"
        size="xs"
        class="rounded-full"
        @click="selectCategory(cat.id)"
      >
        {{ cat.name }}
        <template
          v-if="cat._count"
          #trailing
        >
          <span class="opacity-60">{{ cat._count.news }}</span>
        </template>
      </UButton>
    </div>
  </div>
</template>
