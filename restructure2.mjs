import fs from 'fs/promises';
import path from 'path';

async function restructure() {
  // --- WEB DIRECTORY ---
  // 1. Remove admin
  await fs.rm('web/src/admin', { recursive: true, force: true });
  
  // 2. Clear pages except those specified
  const webPages = ['Accueil', 'APropos', 'Services', 'Tarifs', 'Realisations', 'Galerie', 'Equipe', 'Contact', 'Reservation'];
  const webPagesDir = 'web/src/pages';
  const webPageEntries = await fs.readdir(webPagesDir);
  for (const entry of webPageEntries) {
    if (!webPages.includes(entry) && entry !== 'NotFound') {
      await fs.rm(path.join(webPagesDir, entry), { recursive: true, force: true });
    }
  }

  // 3. Update web/package.json name
  let webPkg = JSON.parse(await fs.readFile('web/package.json', 'utf8'));
  webPkg.name = 'kpl-services-web';
  await fs.writeFile('web/package.json', JSON.stringify(webPkg, null, 2));

  // --- ADMIN DIRECTORY ---
  // 1. Empty src/components, move src/admin/components/* to src/components/
  await fs.rm('admin/src/components', { recursive: true, force: true });
  await fs.mkdir('admin/src/components', { recursive: true });
  const adminComps = await fs.readdir('admin/src/admin/components');
  for (const comp of adminComps) {
    await fs.rename(`admin/src/admin/components/${comp}`, `admin/src/components/${comp}`);
  }

  // 2. Empty src/pages, move src/admin/pages/* to src/pages/
  await fs.rm('admin/src/pages', { recursive: true, force: true });
  await fs.mkdir('admin/src/pages', { recursive: true });
  const adminPages = await fs.readdir('admin/src/admin/pages');
  for (const page of adminPages) {
    await fs.rename(`admin/src/admin/pages/${page}`, `admin/src/pages/${page}`);
  }

  // 3. Remove src/admin
  await fs.rm('admin/src/admin', { recursive: true, force: true });

  // 4. Update admin/package.json name
  let adminPkg = JSON.parse(await fs.readFile('admin/package.json', 'utf8'));
  adminPkg.name = 'kpl-services-admin';
  await fs.writeFile('admin/package.json', JSON.stringify(adminPkg, null, 2));

  console.log('Restructure part 1 done.');
}

restructure().catch(console.error);
