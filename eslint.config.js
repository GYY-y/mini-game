import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        Audio: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        FileReader: 'readonly'
      }
    },
    rules: {
      'no-console': 'warn',
      'vue/multi-word-component-names': 'off'
    }
  },
  prettier
]
