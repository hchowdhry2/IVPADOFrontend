import React from 'react';
import { Route, Routes } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';
import { NotFound } from '../components/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* Route element must be a ReactNode, which <NotFound /> satisfies */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;