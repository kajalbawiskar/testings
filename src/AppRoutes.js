import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { Ecommerce, StrategyIdeas, Forecasting, Login } from './pages';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <ProtectedRoute path="/ecommerce" element={<Ecommerce />} />
      <ProtectedRoute path="/strategy-ideas" element={<StrategyIdeas />} />
      <ProtectedRoute path="/forecasting" element={<Forecasting />} />
    </Routes>
  );
};

export default AppRoutes;
