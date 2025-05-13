import React from 'react';
import ReactDOM from 'react-dom/client';
import Anomaly from './components/Anomaly/Anomaly';

// Store root instances to avoid recreating them
const rootInstances: Record<string, ReactDOM.Root> = {};

// Function to initialize the Anomaly component in a specified element
export function initAnomaly(elementId: string) {
  const anomalyContainer = document.getElementById(elementId);
  if (!anomalyContainer) {
    return false;
  }
  
  // If we already have a root for this container, use it
  if (!rootInstances[elementId]) {
    // Otherwise create a new root
    rootInstances[elementId] = ReactDOM.createRoot(anomalyContainer);
  }
  
  // Render the component to the root
  rootInstances[elementId].render(
    <React.StrictMode>
      <Anomaly />
    </React.StrictMode>
  );
  
  return true;
}

// Expose the initialization function to the window object
declare global {
  interface Window {
    initAnomaly: (elementId: string) => boolean;
  }
}

window.initAnomaly = initAnomaly;