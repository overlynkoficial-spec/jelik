
import React from 'react';
import { LandingPage } from './components/LandingPage';
import { AdminPanel } from './components/AdminPanel';

function App() {
  const [route, setRoute] = React.useState(window.location.hash || '#/');

  React.useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash || '#/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Simple Router
  if (route === '#admin' || route.startsWith('#/admin')) {
    return <AdminPanel />;
  }

  return <LandingPage />;
}

export default App;
