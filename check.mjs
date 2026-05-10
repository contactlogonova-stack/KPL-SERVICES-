import { execSync } from 'child_process';

try {
  console.log("Building web...");
  execSync('npm install', { cwd: 'web', stdio: 'inherit' });
  execSync('npx vite build', { cwd: 'web', stdio: 'inherit' });

  console.log("Building admin...");
  execSync('npm install', { cwd: 'admin', stdio: 'inherit' });
  execSync('npx vite build', { cwd: 'admin', stdio: 'inherit' });
} catch (e) {
  console.error("Build failed!", e);
  process.exit(1);
}
