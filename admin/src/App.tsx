import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import UpdatePassword from './admin/pages/UpdatePassword';
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

    document.title = `KPL Admin | ${title}`;
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
