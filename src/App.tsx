import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

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
