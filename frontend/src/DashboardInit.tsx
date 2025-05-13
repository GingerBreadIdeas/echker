import React from 'react';
import ReactDOM from 'react-dom/client';
import Dashboard from './components/Dashboard/Dashboard';

// Store root instances to avoid recreating them
const rootInstances: Record<string, ReactDOM.Root> = {};

// Function to initialize the Dashboard component in a specified element
export function initDashboard(elementId: string) {
  const dashboardContainer = document.getElementById(elementId);
  if (!dashboardContainer) {
    return false;
  }
  
  // If we already have a root for this container, use it
  if (!rootInstances[elementId]) {
    // Otherwise create a new root
    rootInstances[elementId] = ReactDOM.createRoot(dashboardContainer);
  }
  
  // Render the component to the root
  rootInstances[elementId].render(
    <React.StrictMode>
      <Dashboard />
    </React.StrictMode>
  );
  
  return true;
}

// Expose the initialization function to the window object
declare global {
  interface Window {
    initDashboard: (elementId: string) => boolean;
  }
}

window.initDashboard = initDashboard;