export default defineAppConfig({
  modules: ['@nuxt/ui'],
  css: ['~/assets/css/main.css'],
  ui: {
    primary: 'amber',
    gray: 'zinc',
    font: 'sans',
    card: {
      base: 'overflow-hidden transition-colors',
      rounded: 'rounded-sm',
      shadow: 'shadow-none',
      ring: 'ring-1 ring-zinc-200 dark:ring-zinc-800'
    },
    button: {
      rounded: 'rounded-sm',
      font: 'font-medium'
    },
    badge: {
      rounded: 'rounded-sm'
    }
  }
})
