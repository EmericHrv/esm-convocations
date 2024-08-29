import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Utilisation de l'importation nommée
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ConvocationsPage from './pages/ConvocationsPage';
import NotFoundPage from './pages/NotFoundPage';
import TeamsPage from './pages/TeamsPage';
import PlayerPage from './pages/PlayerPage';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decodedToken = jwtDecode(token); // Utilisation correcte de jwtDecode
    const currentTime = Date.now() / 1000;

    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('token'); // Supprimer le token expiré
      return <Navigate to="/login" />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/convocations" /> : children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />
      <Route path="/convocations" element={
        <PrivateRoute>
          <ConvocationsPage />
        </PrivateRoute>
      } />
      <Route path="/licencies" element={
        <PrivateRoute>
          <PlayerPage />
        </PrivateRoute>
      } />
      <Route path="/equipes" element={
        <PrivateRoute>
          <TeamsPage />
        </PrivateRoute>
      } />
      <Route path="*" element={<NotFoundPage />} /> {/* Route pour la page 404 */}
    </Routes>
  );
};

export default App;
