import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // If not logged in, show login page. If logged in, show dashboard.
  return user ? <Dashboard /> : <LoginPage />;
}

export default App;
