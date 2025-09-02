import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from "@sentry/react";
import App from './App';
import './index.css';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://65acf69b6ff5e2130d632de5d175385d@o4509947514191872.ingest.us.sentry.io/4509947515633664",
  environment: import.meta.env.MODE || 'production',
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration()
  ],
  // Tracing - reduce sample rate in production
  tracesSampleRate: import.meta.env.MODE === 'development' ? 1.0 : 0.1,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost", 
    /^https:\/\/risc0\.onrender\.com\/api/,
    /^https:\/\/risc0-three\.vercel\.app/
  ],
  // Session Replay - different rates for dev/prod
  replaysSessionSampleRate: import.meta.env.MODE === 'development' ? 1.0 : 0.1,
  replaysOnErrorSampleRate: 1.0, // Always capture replays when errors occur
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Release tracking
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
