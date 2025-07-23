import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
// import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import HomePage from './composants/HomePage';
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
import PrivateRoute from './composants/PrivateRoute';
import ListeRendezVous from'./composants/ListeDesRendezVous/ListeDesRendezVousCL';
import Historique from './composants/Historique/Historiques';
// import { fetchUserFromToken } from './features/AuthSlice'; // chemin vers ton thunk
function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <Routes>
        <Route path="/ficheintervenant/:id" element={
          <PrivateRoute>
            <FichePrestataire />
          </PrivateRoute>
        } />
        <Route path="/accueil" element={<HomePage />} />
        <Route path="/calendrier/:id" element={<PrivateRoute><CalendrierRendezVous /> </PrivateRoute>} />
        <Route path="/mes-rendez-vous" element={<PrivateRoute><ListeRendezVous /> </PrivateRoute>} />
        <Route path="/historique" element={<PrivateRoute><Historique /> </PrivateRoute>} />
        <Route path="/testCalendrie" element={<TestCalendrie />} />
        <Route path='/login' element={<Login />} />
        <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
        <Route path="/verification-code" element={<VerificationCode />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/registre' element={<Registre />} />
      </Routes>
    </Router>
  )
}

export default App
