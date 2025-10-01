import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import HomePage from './composants/Accueil/HomePage';
import FichePrestataire from './composants/FichePrestataire/FichePrestataire';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import CalendrierRendezVous from './composants/FichePrestataire/CalendrierRendezVous'
import TestCalendrie from './composants/FichePrestataire/TestCalendrie';
import Login from './composants/Login';
import MotDePasseOublie from './composants/Password/MotDePasseOublie';
import VerificationCode from './composants/Password/VerificationCode';
import ResetPassword from './composants/Password/ResetPassword';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Registre from './composants/Inscription/Registre';
import PrivateRoute from './composants/auth/PrivateRoute';
import ListeRendezVous from './composants/ListeDesRendezVous/ListeDesRendezVous';
import ListDesAvis from './composants/ListDesAvis/ListDesAvis';
import Historique from './composants/Historique/Historiques';
import MapPres from './composants/MapPres';
import ListePrestataires from './composants/ListePrestataires/ListePrestataires';
import RequireAdminRoute from './composants/auth/RequireAdminRoute';
import AdminDashboard from './composants/Admin/AccueilAdmin/DashboardAdmin';
import ListeUtilisateursAdmin from './composants/Admin/ListeUtilisateursAdmin';
import ListeServicesAdmin from './composants/Admin/ListeServices';
import ListeSignalesAdmin from './composants/Admin/ListSignalementsAdmin';
import ListeSignalesPrestataire from './composants/ListePrestataires/ListSignalsPrestataires';
import ListeFavorisPrestataire from './composants/ListePrestataires/ListFavorisPrestataires';
import ListeNonFavorisPrestataire from './composants/ListePrestataires/ListNonFavorisPrestataires';
import ResultatRecherchClient from './composants/Admin/ResultatRecherchClient';
import ClientsContactPrestataire from './composants/ContactPrestataire/ClientsContactPrestataire';
import PageContact from './composants/PageContact';
import Profil from './composants/ProfilUtilisateur/Profil';
import About from './composants/About';
// import { fetchUserFromToken } from './features/AuthSlice'; // chemin vers ton thunk
function App() {

  const [count, setCount] = useState(0);
  const user = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/ficheintervenant/:id" element={
          <PrivateRoute>
            <FichePrestataire />
          </PrivateRoute>
        } />
        <Route path='/registre' element={<Registre />} />
        <Route path='/login' element={<Login />} />
        <Route path="/accueil" element={<HomePage />} />
        <Route
          path="/calendrier/:id"
          element={
            <PrivateRoute>
              <CalendrierRendezVous />
            </PrivateRoute>
          }
        />
        <Route
          path="/calendrier"
          element={
            <PrivateRoute>
              <CalendrierRendezVous />
            </PrivateRoute>
          }
        />
        {/* <Route path="/calendrier/:id" element={<PrivateRoute><CalendrierRendezVous /> </PrivateRoute>} /> */}
        {/* {user?.utilisateur?.role === 'CLIENT' && (
          <Route
            path="/calendrier/:id"
            element={
              <PrivateRoute>
                <CalendrierRendezVous />
              </PrivateRoute>
            }
          />
        )}
        {(user?.utilisateur?.role === 'PRESTATAIRE' || user?.utilisateur?.role === 'ENTREPRISE') && (
          <Route
            path="/calendrier"
            element={
              <PrivateRoute>
                <CalendrierRendezVous />
              </PrivateRoute>
            }
          />
        )} */}
        <Route path="/mes-rendez-vous" element={<PrivateRoute><ListeRendezVous /> </PrivateRoute>} />
        <Route path="/mes-avis" element={<PrivateRoute><ListDesAvis /> </PrivateRoute>} />
        <Route path="/carnet-de-contacts" element={<PrivateRoute><ListeFavorisPrestataire /> </PrivateRoute>} />
        <Route path="/intervenants-signales" element={<PrivateRoute><ListeSignalesPrestataire /> </PrivateRoute>} />
        <Route path="/intervenants-bloques" element={<PrivateRoute><ListeNonFavorisPrestataire /> </PrivateRoute>} />
        <Route path="/historique" element={<PrivateRoute><Historique /> </PrivateRoute>} />
        <Route path="/MapAdresse" element={<PrivateRoute><MapPres /></PrivateRoute>} />
        <Route path="/prestataires" element={<ListePrestataires />} />
        <Route path="/prestataires/contact/:prestataireId" element={<PrivateRoute><ClientsContactPrestataire /></PrivateRoute>} />
        <Route path="/Contact" element={<PageContact />} />
        <Route path="/Profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
        <Route path="/about" element={<About />} />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminRoute>
              <AdminDashboard />
            </RequireAdminRoute>
          }
        />
        <Route
          path="/admin/utilisateurs"
          element={
            <RequireAdminRoute>
              <ListeUtilisateursAdmin />
            </RequireAdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <RequireAdminRoute>
              <ListeServicesAdmin />
            </RequireAdminRoute>
          }
        />
        <Route
          path="/admin/signales"
          element={
            <RequireAdminRoute>
              <ListeSignalesAdmin />
            </RequireAdminRoute>
          }
        />
        <Route
          path="/admin/searchC"
          element={
            <RequireAdminRoute>
              <ResultatRecherchClient />
            </RequireAdminRoute>
          }
        />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/verification-code" element={<VerificationCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
    </Router>
  )
}

export default App
