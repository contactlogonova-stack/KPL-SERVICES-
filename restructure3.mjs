import fs from 'fs/promises';
import path from 'path';

async function replaceInFile(filePath, searchRegex, replacement) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    content = content.replace(searchRegex, replacement);
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

async function finalize() {
  // --- WEB APP ---
  const webAppTsx = `import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar, Footer } from './components/layout';
import { WhatsAppButton } from './components/ui';

import Accueil from './pages/Accueil';
import APropos from './pages/APropos';
import Services from './pages/Services';
import Tarifs from './pages/Tarifs';
import Realisations from './pages/Realisations';
import Galerie from './pages/Galerie';
import Equipe from './pages/Equipe';
import Contact from './pages/Contact';
import Reservation from './pages/Reservation';
import NotFound from './pages/NotFound';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Accueil';

    switch (path) {
      case '/': title = 'Accueil'; break;
      case '/a-propos': title = 'À propos'; break;
      case '/services': title = 'Services'; break;
      case '/tarifs': title = 'Tarifs'; break;
      case '/realisations': title = 'Réalisations'; break;
      case '/galerie': title = 'Galerie'; break;
      case '/equipe': title = 'Équipe'; break;
      case '/contact': title = 'Contact'; break;
      case '/reservation': title = 'Réservation'; break;
      case '/404': title = 'Page introuvable'; break;
      default: title = 'Accueil';
    }

    document.title = \`KPL SERVICES | \${title}\`;
  }, [location]);

  return null;
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function App() {
  return (
    <Router>
      <TitleUpdater />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/services" element={<Services />} />
          <Route path="/tarifs" element={<Tarifs />} />
          <Route path="/realisations" element={<Realisations />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/equipe" element={<Equipe />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
`;
  await fs.writeFile('web/src/App.tsx', webAppTsx);

  // --- ADMIN APP ---
  const adminAppTsx = `import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UpdatePassword from './pages/UpdatePassword';
import Reservations from './pages/Reservations';
import Messages from './pages/Messages';
import AdminRealisations from './pages/Realisations';
import AdminGalerie from './pages/Galerie';
import Temoignages from './pages/Temoignages';
import Parametres from './pages/Parametres';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Admin';

    switch (path) {
      case '/': title = 'Login'; break;
      case '/dashboard': title = 'Dashboard'; break;
      case '/reservations': title = 'Réservations'; break;
      case '/messages': title = 'Messages'; break;
      case '/realisations': title = 'Réalisations'; break;
      case '/galerie': title = 'Galerie'; break;
      case '/temoignages': title = 'Témoignages'; break;
      case '/parametres': title = 'Paramètres'; break;
      default: title = 'Admin';
    }

    document.title = \`KPL Admin | \${title}\`;
  }, [location]);

  return null;
}

function AdminLayoutWrapper() {
  return (
    <>
      <Helmet>
        <link rel="manifest" href="/manifest-admin.json" />
        <meta name="theme-color" content="#E91E8C" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="KPL Admin" />
      </Helmet>
      <Outlet />
    </>
  );
}

function App() {
  return (
    <Router>
      <TitleUpdater />
      <Routes>
        <Route element={<AdminLayoutWrapper />}>
          <Route path="/" element={<Login />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          
          <Route 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/realisations" element={<AdminRealisations />} />
            <Route path="/galerie" element={<AdminGalerie />} />
            <Route path="/temoignages" element={<Temoignages />} />
            <Route path="/parametres" element={<Parametres />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
`;
  await fs.writeFile('admin/src/App.tsx', adminAppTsx);

  // Replace '/admin' with '/' in all admin tsx files
  await walk('admin/src', async (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = await fs.readFile(filePath, 'utf8');
      
      // Update routes: '/admin/something' -> '/something', '/admin' -> '/'
      content = content.replace(/['"]\/admin\/([^'"]+)['"]/g, "'/$1'");
      content = content.replace(/['"]\/admin['"]/g, "'/'");
      
      await fs.writeFile(filePath, content, 'utf8');
    }
  });

  // --- SUPABASE CLIENT ---
  const supabaseContent = `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
  auth: { 
    storageKey: 'kpl-auth', 
    storage: localStorage, 
    cookieDomain: '.kpl-services.com', 
    persistSession: true, 
    autoRefreshToken: true 
  } 
});
`;
  await fs.writeFile('web/src/lib/supabase.ts', supabaseContent);
  await fs.writeFile('admin/src/lib/supabase.ts', supabaseContent);

  // --- CONFIG FILES ---
  await fs.writeFile('web/public/robots.txt', 'User-agent: *\nAllow: /\nSitemap: https://kpl-services.com/sitemap.xml\n');
  
  await fs.writeFile('web/public/_redirects', '/* /index.html 200\n');
  await fs.writeFile('admin/public/_redirects', '/* /index.html 200\n');

  const envEx = 'VITE_SUPABASE_URL=\nVITE_SUPABASE_ANON_KEY=\nVITE_CLOUDINARY_CLOUD_NAME=\nVITE_CLOUDINARY_UPLOAD_PRESET=\n';
  await fs.writeFile('web/.env.example', envEx);
  await fs.writeFile('admin/.env.example', envEx);

  console.log('Restructure part 2 done.');
}

finalize().catch(console.error);
