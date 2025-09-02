import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import * as Sentry from '@sentry/react';
import { Dashboard } from '@/pages/Dashboard';
import { NuevaEvaluacion } from '@/pages/NuevaEvaluacion';
import { Catalogos } from '@/pages/Catalogos';
import { Shield, Plus, Database } from 'lucide-react';

// Add this button component to your app to test Sentry's error tracking
function ErrorButton() {
  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }

  return (
    <button
      onClick={() => {
        // Send a log before throwing the error
        Sentry.logger.info('User triggered test error', {
          action: 'test_error_button_click',
          environment: import.meta.env.MODE,
        });
        throw new Error('This is your first error!');
      }}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-4 text-xs"
      title="Test Sentry Error (Dev Only)"
    >
      🚨 Test Error
    </button>
  );
}

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield },
    { path: '/nueva-evaluacion', label: 'Nueva Evaluación', icon: Plus },
    { path: '/catalogos', label: 'Catálogos', icon: Database },
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Calculadora de Riesgos</h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <ErrorButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

const MobileNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield },
    { path: '/nueva-evaluacion', label: 'Nueva Evaluación', icon: Plus },
    { path: '/catalogos', label: 'Catálogos', icon: Database },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 text-xs ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/nueva-evaluacion" element={<NuevaEvaluacion />} />
            <Route path="/catalogos" element={<Catalogos />} />
          </Routes>
        </main>

        <MobileNavigation />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
