export default defineAppConfig({
    ui: {
        colors: {
            primary: 'primary',
            secondary: 'slate',
            neutral: 'neutral',
        },
        navigationMenu: {
            slots: {
                // Augmenter la taille du texte principal du menu
                link: 'group relative w-full flex items-center gap-1.5 font-medium text-base before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
                // Augmenter la taille du texte des sous-menus
                childLink:
                    'group relative size-full flex items-start text-start text-base before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
                // Ajuster la taille des labels
                label: 'w-full flex items-center gap-1.5 font-semibold text-sm/5 text-highlighted px-2.5 py-1.5',
                childLabel: 'text-sm text-highlighted',
            },
        },
    }
});
