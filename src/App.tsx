import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundry';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { AuthPage } from './pages/Auth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAppDataStore } from './zustand/store';
import { Craft3D } from './pages/Craft3D';
import Landing from './pages/Landing';
import Craft2D from './pages/Craft2D';
import { Craft } from './pages/Craft';
import { Showcase } from './pages/Showcase';
import { Layout } from './pages/Layout';

const App: React.FC = () => {
  const { checkAuth } = useAppDataStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/craft"
              element={
                <ProtectedRoute>
                  <Craft />
                </ProtectedRoute>
              }
            />
            <Route
              path="/craft3d"
              element={
                <ProtectedRoute>
                  <Craft3D />
                </ProtectedRoute>
              }
            />
            <Route
              path="/craft2d"
              element={
                <ProtectedRoute>
                  <Craft2D />
                </ProtectedRoute>
              }
            />
            <Route path="/showcase" element={<Showcase />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
