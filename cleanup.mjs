import { rm } from 'fs/promises';

async function cleanup() {
  const dirsToRemove = ['src', 'public', '.env.example', 'vite.config.ts', 'tsconfig.json', 'package.json', 'index.html', 'package-lock.json', 'netlify.toml'];
  for (const d of dirsToRemove) {
    await rm(d, { recursive: true, force: true });
  }
  console.log("Cleanup complete");
}

cleanup().catch(console.error);
