import React from 'react';
import ReactDOM from 'react-dom/client';
import Tracking from './components/Tracking/Tracking';

// Store root instances to avoid recreating them
const rootInstances: Record<string, ReactDOM.Root> = {};

// Function to initialize the Tracking component in a specified element
export function initTracking(elementId: string) {
  const trackingContainer = document.getElementById(elementId);
  if (!trackingContainer) {
    return false;
  }
  
  // If we already have a root for this container, use it
  if (!rootInstances[elementId]) {
    // Otherwise create a new root
    rootInstances[elementId] = ReactDOM.createRoot(trackingContainer);
  }
  
  // Render the component to the root
  rootInstances[elementId].render(
    <React.StrictMode>
      <Tracking />
    </React.StrictMode>
  );
  
  return true;
}

// Expose the initialization function to the window object
declare global {
  interface Window {
    initTracking: (elementId: string) => boolean;
  }
}

window.initTracking = initTracking;