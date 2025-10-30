import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt(
    {
        features: {
            typescript: true,
            stylistic: false,
        },
    },
    {
        rules: {
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            'vue/no-v-html': 'warn',
            'vue/multi-word-component-names': 'off',
            'vue/html-self-closing': 'off',
        },
    },
)
