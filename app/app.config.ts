export default defineAppConfig({
  ui: {
    card: {
      slots: {
        root: '!bg-card',
        header: 'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
        body: 'px-6 py-6 sm:px-8 sm:py-8',
        footer: 'px-6 py-4 border-t border-gray-200 dark:border-gray-700',
      },
    },
    input: {
      slots: {
        root: 'w-full',
      },
    },
  },
});
