import React from 'react';
import ErrorBoundary from './ErrorBoundry';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Dashboard } from './pages/Dashboard';
import { LandingPage } from './pages/Landing';

const App: React.FC = () => {


  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;