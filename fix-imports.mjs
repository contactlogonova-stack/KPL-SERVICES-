import fs from 'fs/promises';
import path from 'path';

async function replaceInFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    // Replace '../../lib/' with '../lib/'
    content = content.replace(/\.\.\/\.\.\/lib\//g, '../lib/');
    // Replace '../../hooks/' with '../hooks/'
    content = content.replace(/\.\.\/\.\.\/hooks\//g, '../hooks/');
    // Replace '../../utils/' with '../utils/'
    content = content.replace(/\.\.\/\.\.\/utils\//g, '../utils/');
    // Also DashboardLayout might have imported components?
    
    await fs.writeFile(filePath, content, 'utf8');
  } catch (e) {
    console.error(`Error replacing in ${filePath}:`, e);
  }
}

async function walk(dir, callback) {
  const files = await fs.readdir(dir, { withFileTypes: true });
  for (const file of files) {
    const res = path.join(dir, file.name);
    if (file.isDirectory()) {
      await walk(res, callback);
    } else {
      await callback(res);
    }
  }
}

async function fixImports() {
  await walk('admin/src/pages', replaceInFile);
  await walk('admin/src/components', replaceInFile);
  console.log('Fixed imports in admin!');
}

fixImports().catch(console.error);
