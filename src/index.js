import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Dashboard from './Dashboard';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);