import fs from 'fs/promises';
import path from 'path';

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  let entries = await fs.readdir(src, { withFileTypes: true });
  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  // Create directories
  await fs.mkdir('web', { recursive: true });
  await fs.mkdir('admin', { recursive: true });

  // Copy root config files to both
  const configFiles = ['tsconfig.json', 'vite.config.ts', '.env.example', 'index.html', 'package.json'];
  for (const file of configFiles) {
    try {
      await fs.copyFile(file, `web/${file}`);
      await fs.copyFile(file, `admin/${file}`);
    } catch(e) {
      console.log(`Failed to copy ${file}`);
    }
  }

  // Copy public
  await copyDir('public', 'web/public');
  await copyDir('public', 'admin/public');

  // Copy src to web
  await copyDir('src', 'web/src');
  // Copy src to admin
  await copyDir('src', 'admin/src');

  console.log("Copied files to web and admin.");
}

main().catch(console.error);
