import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'

function resolveSourceCommit(env) {
  if (env.VITE_SOURCE_COMMIT) return env.VITE_SOURCE_COMMIT
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA

  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], { encoding: 'utf8' }).trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) =>{

  const env = loadEnv(mode,process.cwd())
  const sourceCommit = resolveSourceCommit(env)

  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [react()],
    define: {
      'import.meta.env.VITE_SOURCE_COMMIT': JSON.stringify(sourceCommit),
    },
    server: {
      proxy: {
        '/api': 'http://localhost:3010'
      },
    },
  }  
})
