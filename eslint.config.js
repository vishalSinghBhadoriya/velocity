import js from '@eslint/js'
import ts from 'typescript-eslint'
export default ts.config({ignores:['dist/**','.qa/**']}, {files:['**/*.{ts,tsx}'],extends:[js.configs.recommended,...ts.configs.recommended]})
