import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard';

// Function to initialize the Dashboard component in a specified element
export function initDashboard(elementId: string) {
  const dashboardContainer = document.getElementById(elementId);
  if (dashboardContainer) {
    const root = ReactDOM.createRoot(dashboardContainer);
    root.render(
      <React.StrictMode>
        <Dashboard />
      </React.StrictMode>
    );
    return true;
  }
  return false;
}

// Expose the initialization function to the window object
declare global {
  interface Window {
    initDashboard: (elementId: string) => boolean;
  }
}

window.initDashboard = initDashboard;