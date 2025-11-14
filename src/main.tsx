import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Error handling for root render
try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error("Root element not found");
  }
  createRoot(rootElement).render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui; text-align: center; padding: 20px;">
      <div>
        <h1 style="color: #A0332B; margin-bottom: 20px;">Error Loading Website</h1>
        <p style="color: #666; margin-bottom: 10px;">Something went wrong while loading the website.</p>
        <p style="color: #999; font-size: 14px;">Please refresh the page or contact support if the problem persists.</p>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #A0332B; color: white; border: none; border-radius: 5px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    </div>
  `;
}
