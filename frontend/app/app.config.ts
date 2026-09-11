export default defineAppConfig({
  ui: {
    primary: 'amber',
    gray: 'zinc',
    font: 'sans',

    card: {
      slots: {
        root: 'overflow-hidden transition-colors rounded-sm shadow-none ring-1 ring-zinc-200 dark:ring-zinc-800'
      }
    },

    button: {
      slots: {
        base: 'rounded-sm font-medium'
      }
    },

    badge: {
      slots: {
        base: 'rounded-sm'
      }
    }
  }
})
