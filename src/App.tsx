import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Import des composants de layout
import { Navbar, Footer } from './components/layout';
import { WhatsAppButton } from './components/ui';

// Import des pages publiques
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

// Import des pages admin
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Reservations from './admin/pages/Reservations';
import Messages from './admin/pages/Messages';
import AdminRealisations from './admin/pages/Realisations';
import AdminGalerie from './admin/pages/Galerie';
import Temoignages from './admin/pages/Temoignages';
import Parametres from './admin/pages/Parametres';
import ProtectedRoute from './admin/components/ProtectedRoute';
import DashboardLayout from './admin/components/DashboardLayout';

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = 'Accueil';

    switch (path) {
      case '/':
        title = 'Accueil';
        break;
      case '/a-propos':
        title = 'À propos';
        break;
      case '/services':
        title = 'Services';
        break;
      case '/tarifs':
        title = 'Tarifs';
        break;
      case '/realisations':
        title = 'Réalisations';
        break;
      case '/galerie':
        title = 'Galerie';
        break;
      case '/equipe':
        title = 'Équipe';
        break;
      case '/contact':
        title = 'Contact';
        break;
      case '/reservation':
        title = 'Réservation';
        break;
      case '/404':
        title = 'Page introuvable';
        break;
      case '/admin':
        title = 'Admin Login';
        break;
      case '/admin/dashboard':
        title = 'Admin Dashboard';
        break;
      case '/admin/reservations':
        title = 'Admin Réservations';
        break;
      case '/admin/messages':
        title = 'Admin Messages';
        break;
      case '/admin/realisations':
        title = 'Admin Réalisations';
        break;
      case '/admin/galerie':
        title = 'Admin Galerie';
        break;
      case '/admin/temoignages':
        title = 'Admin Témoignages';
        break;
      case '/admin/parametres':
        title = 'Admin Paramètres';
        break;
      default:
        title = 'Accueil';
    }

    document.title = `KPL SERVICES | ${title}`;
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
        {/* Routes Publiques avec Layout */}
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

        {/* Routes Admin (sans Layout public) */}
        <Route path="/admin" element={<Login />} />
        
        <Route 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/reservations" element={<Reservations />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/realisations" element={<AdminRealisations />} />
          <Route path="/admin/galerie" element={<AdminGalerie />} />
          <Route path="/admin/temoignages" element={<Temoignages />} />
          <Route path="/admin/parametres" element={<Parametres />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
